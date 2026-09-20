import { useRef, useState } from 'react';

/**
 * A drag-and-drop zone that accepts either a local file (dropped or picked)
 * or a pasted/dropped URL, backing a "file XOR url" pair of form fields.
 * `previewKind="image"` renders an image preview; anything else just shows
 * the resolved value as text (e.g. a .glb filename or URL).
 */
export default function DropZone({ label, hint, accept, onFileChange, urlValue, onUrlChange, previewUrl, previewKind = 'image', error }) {
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    function handleFiles(files) {
        const file = files?.[0];
        if (file) {
            onFileChange(file);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragOver(false);

        if (e.dataTransfer.files?.length) {
            handleFiles(e.dataTransfer.files);
            return;
        }

        const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
        if (url) {
            onUrlChange(url.trim());
        }
    }

    return (
        <div>
            <label className="label">{label}</label>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition ${
                    dragOver ? 'border-accent-400 bg-accent-50' : 'border-primary-200 hover:border-primary-400'
                }`}
            >
                {previewUrl ? (
                    previewKind === 'image' ? (
                        <img src={previewUrl} alt="" className="h-20 w-20 rounded-lg object-cover" />
                    ) : (
                        <p className="max-w-full truncate text-xs font-semibold text-primary-700">{previewUrl}</p>
                    )
                ) : (
                    <>
                        <UploadIcon className="h-7 w-7 text-primary-300" />
                        <p className="text-sm font-semibold text-primary-700">Tarik file ke sini atau klik untuk pilih</p>
                    </>
                )}
                <p className="text-xs text-primary-400">{hint}</p>
                <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </div>

            <input
                type="text"
                value={urlValue}
                onChange={(e) => onUrlChange(e.target.value)}
                onDrop={(e) => {
                    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
                    if (url) {
                        e.preventDefault();
                        onUrlChange(url.trim());
                    }
                }}
                placeholder="atau tempel / tarik link di sini"
                className="input mt-2 text-xs"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

function UploadIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 8.25 12 3.75m0 0L7.5 8.25M12 3.75v13.5"
            />
        </svg>
    );
}
