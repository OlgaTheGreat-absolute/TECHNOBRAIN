import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { initSceneViewer } from '../scene-viewer';

/**
 * React wrapper around the GLB-only Three.js viewer. `zoomable` enables
 * scroll/pinch zoom — used for the larger, login-gated expanded view, kept
 * off for the small inline preview. `onHover`/`onSelect` (only used when
 * `zoomable`) fire with `{ name, label, info, x, y }` or `null` as the
 * pointer moves over / clicks a named part of the model. A ref exposes
 * `setAutoRotate(enabled)` and `clearSelection()` for external controls.
 */
const SceneViewer = forwardRef(function SceneViewer({ sceneConfig, zoomable = false, autoRotate = true, onHover, onSelect, className = '' }, ref) {
    const containerRef = useRef(null);
    const controlsRef = useRef(null);
    const onHoverRef = useRef(onHover);
    const onSelectRef = useRef(onSelect);
    onHoverRef.current = onHover;
    onSelectRef.current = onSelect;

    useImperativeHandle(ref, () => ({
        setAutoRotate: (enabled) => controlsRef.current?.setAutoRotate(enabled),
        clearSelection: () => controlsRef.current?.clearSelection(),
    }));

    useEffect(() => {
        if (!containerRef.current || !sceneConfig?.objects?.length) {
            return undefined;
        }

        const controls = initSceneViewer(containerRef.current, sceneConfig, {
            zoomable,
            autoRotate,
            onHover: (info) => onHoverRef.current?.(info),
            onSelect: (info) => onSelectRef.current?.(info),
        });
        controlsRef.current = controls;

        return () => {
            controlsRef.current = null;
            controls.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sceneConfig, zoomable]);

    return <div ref={containerRef} className={className} role="img" aria-label="Model 3D interaktif" />;
});

export default SceneViewer;
