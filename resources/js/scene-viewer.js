import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * GLB-only Three.js viewer. Renders the model referenced in a Material's
 * `scene_config` column (a single object with a `model` URL), auto-rotates
 * it gently, and supports drag-to-orbit. Zoom is opt-in via `options.zoomable`
 * — the small inline preview stays fixed-distance, while the login-gated
 * "expand" modal enables scroll/pinch zoom for closer inspection.
 *
 * Scene config shape:
 * { "objects": [{ "key": "body", "label": "...", "model": "/path/to.glb", "position": [x,y,z],
 *   "components": { "<node name in the glb>": { "label": "...", "info": "..." } } }] }
 * `components` is optional and keys must match actual node names inside the
 * GLB file — when present and `options.zoomable` is on:
 *  - hovering that part of the model calls `options.onHover` with its label/info.
 *  - clicking it "pins" it, calling `options.onSelect` every frame with its
 *    current screen position (so a caller can draw a leader line that tracks
 *    the part as the model rotates) until it's clicked again, another part
 *    is clicked, empty space is clicked, or `clearSelection()` is called.
 *
 * @param {HTMLElement} container
 * @param {{objects: Array<object>}} sceneConfig
 * @param {{
 *   zoomable?: boolean,
 *   autoRotate?: boolean,
 *   onHover?: (info: {name: string, label: string, info?: string, x: number, y: number} | null) => void,
 *   onSelect?: (info: {name: string, label: string, info?: string, x: number, y: number} | null) => void,
 * }} [options]
 * @returns {{ destroy: () => void, setAutoRotate: (enabled: boolean) => void, clearSelection: () => void }}
 */
export function initSceneViewer(container, sceneConfig, options = {}) {
    const modelObject = sceneConfig?.objects?.find((object) => object.model);

    if (!container || !modelObject) {
        return { destroy() {}, setAutoRotate() {}, clearSelection() {} };
    }

    const { zoomable = false, autoRotate: autoRotateOption = true, onHover, onSelect } = options;
    const componentInfo = modelObject.components ?? {};
    const interactionEnabled = zoomable && Object.keys(componentInfo).length > 0;
    const hoverTargets = [];
    let hoveredMesh = null;
    let selectedMesh = null;
    let autoRotateEnabled = autoRotateOption;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);

    const baseDistance = 5.6;
    let distance = baseDistance;
    const minDistance = baseDistance * 0.45;
    const maxDistance = baseDistance * 1.8;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);

    function applyCameraDistance() {
        const direction = new THREE.Vector3(3.2, 2.4, 3.6).normalize();
        camera.position.copy(direction.multiplyScalar(distance));
        camera.lookAt(0, 0, 0);
    }

    applyCameraDistance();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xf6d84a, 0.6);
    rimLight.position.set(-4, 2, -4);
    scene.add(rimLight);

    const group = new THREE.Group();
    scene.add(group);

    const disposables = [];
    let disposed = false;

    const holder = new THREE.Group();
    const [x = 0, y = 0, z = 0] = modelObject.position ?? [];
    holder.position.set(x, y, z);
    group.add(holder);
    loadModel(modelObject, holder, disposables, () => disposed, interactionEnabled ? hoverTargets : null);

    renderer.domElement.style.cursor = 'grab';

    let isDragging = false;
    let dragDistance = 0;
    let previousX = 0;
    let previousY = 0;

    renderer.domElement.addEventListener('pointerdown', (event) => {
        isDragging = true;
        dragDistance = 0;
        previousX = event.clientX;
        previousY = event.clientY;
        renderer.domElement.style.cursor = 'grabbing';
    });

    window.addEventListener('pointerup', () => {
        isDragging = false;
        renderer.domElement.style.cursor = hoveredMesh ? 'pointer' : 'grab';
    });

    window.addEventListener('pointermove', (event) => {
        if (!isDragging) {
            return;
        }

        const deltaX = event.clientX - previousX;
        const deltaY = event.clientY - previousY;
        dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
        previousX = event.clientX;
        previousY = event.clientY;

        group.rotation.y += deltaX * 0.008;
        group.rotation.x = Math.max(-0.6, Math.min(0.6, group.rotation.x + deltaY * 0.008));
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function applyHighlights() {
        for (const mesh of hoverTargets) {
            if (!mesh.material?.emissive) {
                continue;
            }

            if (mesh === selectedMesh) {
                mesh.material.emissive.setHex(0xf6d84a);
                mesh.material.emissiveIntensity = 0.9;
            } else if (mesh === hoveredMesh) {
                mesh.material.emissive.setHex(0x6b5a12);
                mesh.material.emissiveIntensity = 0.6;
            } else {
                mesh.material.emissive.setHex(mesh.userData._baseEmissive ?? 0x000000);
                mesh.material.emissiveIntensity = mesh.userData._baseEmissiveIntensity ?? 0.55;
            }
        }
    }

    function setHover(mesh) {
        if (hoveredMesh === mesh) {
            return;
        }

        hoveredMesh = mesh;
        applyHighlights();
        renderer.domElement.style.cursor = hoveredMesh || selectedMesh ? 'pointer' : isDragging ? 'grabbing' : 'grab';
    }

    function setSelected(mesh) {
        selectedMesh = mesh;
        applyHighlights();

        if (!selectedMesh) {
            onSelect?.(null);
        }
    }

    function handleHoverMove(event) {
        if (isDragging) {
            return;
        }

        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(hoverTargets, false);

        if (hits.length) {
            const mesh = hits[0].object;
            setHover(mesh);
            const meta = componentInfo[mesh.name] ?? {};
            onHover?.({ name: mesh.name, label: meta.label ?? mesh.name, info: meta.info, x: event.clientX, y: event.clientY });
        } else {
            setHover(null);
            onHover?.(null);
        }
    }

    function handleHoverLeave() {
        setHover(null);
        onHover?.(null);
    }

    function handleClick(event) {
        // A drag that ends over an interactive part would otherwise also
        // fire a click — ignore clicks that followed real pointer movement.
        if (dragDistance > 6) {
            return;
        }

        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(hoverTargets, false);

        if (hits.length) {
            const mesh = hits[0].object;
            setSelected(selectedMesh === mesh ? null : mesh);
        } else {
            setSelected(null);
        }
    }

    if (interactionEnabled) {
        renderer.domElement.addEventListener('pointermove', handleHoverMove);
        renderer.domElement.addEventListener('pointerleave', handleHoverLeave);
        renderer.domElement.addEventListener('click', handleClick);
    }

    function handleWheel(event) {
        event.preventDefault();
        distance = Math.max(minDistance, Math.min(maxDistance, distance + event.deltaY * 0.004));
        applyCameraDistance();
    }

    if (zoomable) {
        renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    let frameId;
    const selectedWorldPos = new THREE.Vector3();
    const selectedBox = new THREE.Box3();

    function animate() {
        frameId = requestAnimationFrame(animate);

        if (!isDragging && !prefersReducedMotion && autoRotateEnabled) {
            group.rotation.y += 0.003;
        }

        if (selectedMesh) {
            // The mesh's local origin (what getWorldPosition would return) isn't
            // necessarily where its geometry visually sits — use the world-space
            // bounding box center instead so the leader line anchors on the part
            // itself rather than wherever its pivot happens to be.
            selectedBox.setFromObject(selectedMesh);
            selectedBox.getCenter(selectedWorldPos);
            selectedWorldPos.project(camera);

            const rect = container.getBoundingClientRect();
            const meta = componentInfo[selectedMesh.name] ?? {};

            onSelect?.({
                name: selectedMesh.name,
                label: meta.label ?? selectedMesh.name,
                info: meta.info,
                x: rect.left + (selectedWorldPos.x * 0.5 + 0.5) * rect.width,
                y: rect.top + (-selectedWorldPos.y * 0.5 + 0.5) * rect.height,
            });
        }

        renderer.render(scene, camera);
    }

    animate();

    function handleResize() {
        const { clientWidth, clientHeight } = container;

        if (!clientWidth || !clientHeight) {
            return;
        }

        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(clientWidth, clientHeight);
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return {
        setAutoRotate(enabled) {
            autoRotateEnabled = enabled;
        },
        clearSelection() {
            setSelected(null);
        },
        destroy() {
            disposed = true;
            cancelAnimationFrame(frameId);
            resizeObserver.disconnect();

            if (zoomable) {
                renderer.domElement.removeEventListener('wheel', handleWheel);
            }

            if (interactionEnabled) {
                renderer.domElement.removeEventListener('pointermove', handleHoverMove);
                renderer.domElement.removeEventListener('pointerleave', handleHoverLeave);
                renderer.domElement.removeEventListener('click', handleClick);
            }

            for (const disposable of disposables) {
                disposable.geometry?.dispose();
                if (Array.isArray(disposable.material)) {
                    disposable.material.forEach((m) => m.dispose());
                } else {
                    disposable.material?.dispose();
                }
            }

            renderer.dispose();
            container.removeChild(renderer.domElement);
        },
    };
}

const gltfLoader = new GLTFLoader();

function loadModel(object, holder, disposables, isDisposed, hoverTargets) {
    gltfLoader.load(
        object.model,
        (gltf) => {
            if (isDisposed()) {
                return;
            }

            const modelScene = gltf.scene;
            const componentNames = hoverTargets ? Object.keys(object.components ?? {}) : [];

            modelScene.traverse((node) => {
                if (!node.isMesh) {
                    return;
                }

                disposables.push(node);

                // Hoverable parts get their own material clone so tinting
                // one on hover/select doesn't tint every other mesh sharing
                // the same glTF material.
                if (componentNames.includes(node.name)) {
                    node.material = node.material.clone();
                    node.userData._baseEmissive = node.material.emissive?.getHex() ?? 0x000000;
                    node.userData._baseEmissiveIntensity = node.material.emissiveIntensity ?? 0.55;
                    hoverTargets.push(node);
                }
            });

            const box = new THREE.Box3().setFromObject(modelScene);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            const targetWidth = object.size?.[0] ?? 2.4;
            const largestDimension = Math.max(size.x, size.y, size.z) || 1;
            const scale = (targetWidth / largestDimension) * (object.modelScale ?? 1);

            // Center the model at its own local origin first (unscaled), then
            // scale the holder — scaling modelScene directly here would shrink
            // the mesh without shrinking this translation, leaving it
            // displaced far from the holder's pivot.
            modelScene.position.sub(center);
            holder.scale.setScalar(scale);

            holder.add(modelScene);
        },
        undefined,
        (error) => {
            console.error('Gagal memuat model 3D:', object.model, error);
        }
    );
}
