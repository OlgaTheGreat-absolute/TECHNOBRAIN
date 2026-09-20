import { useEffect, useState } from 'react';
import DropZone from '../../../Components/DropZone';

export default function MaterialForm({ data, setData, errors, educationLevels, departments, subjects, contentTypes, difficulties }) {
    const filteredSubjects = subjects.filter((subject) => !data.department_id || String(subject.department_id) === String(data.department_id));

    const [thumbnailFilePreview, setThumbnailFilePreview] = useState('');

    useEffect(() => {
        if (!data.thumbnail_file) {
            setThumbnailFilePreview('');
            return undefined;
        }

        const url = URL.createObjectURL(data.thumbnail_file);
        setThumbnailFilePreview(url);

        return () => URL.revokeObjectURL(url);
    }, [data.thumbnail_file]);

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <label htmlFor="title" className="label">
                    Judul
                </label>
                <input id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required className="input" />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="sm:col-span-2">
                <label htmlFor="description" className="label">
                    Deskripsi Singkat
                </label>
                <textarea id="description" rows={2} value={data.description} onChange={(e) => setData('description', e.target.value)} className="input" />
            </div>

            <div>
                <label htmlFor="education_level_id" className="label">
                    Jenjang
                </label>
                <select
                    id="education_level_id"
                    value={data.education_level_id}
                    onChange={(e) => setData('education_level_id', e.target.value)}
                    required
                    className="input"
                >
                    <option value="">Pilih jenjang</option>
                    {educationLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                            {level.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="department_id" className="label">
                    Jurusan
                </label>
                <select
                    id="department_id"
                    value={data.department_id}
                    onChange={(e) => setData({ ...data, department_id: e.target.value, subject_id: '' })}
                    required
                    className="input"
                >
                    <option value="">Pilih jurusan</option>
                    {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="subject_id" className="label">
                    Mata Pelajaran
                </label>
                <select id="subject_id" value={data.subject_id} onChange={(e) => setData('subject_id', e.target.value)} className="input">
                    <option value="">Tidak ada</option>
                    {filteredSubjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="category" className="label">
                    Kategori
                </label>
                <input
                    id="category"
                    type="text"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    placeholder="Jaringan, Pemrograman, Desain..."
                    className="input"
                />
            </div>

            <div>
                <label htmlFor="content_type" className="label">
                    Tipe Konten
                </label>
                <select id="content_type" value={data.content_type} onChange={(e) => setData('content_type', e.target.value)} required className="input">
                    {contentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="difficulty" className="label">
                    Tingkat Kesulitan
                </label>
                <select id="difficulty" value={data.difficulty} onChange={(e) => setData('difficulty', e.target.value)} required className="input">
                    {difficulties.map((difficulty) => (
                        <option key={difficulty.value} value={difficulty.value}>
                            {difficulty.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="sm:col-span-2">
                <label htmlFor="content" className="label">
                    Isi Materi
                </label>
                <textarea id="content" rows={6} value={data.content} onChange={(e) => setData('content', e.target.value)} className="input" />
            </div>

            {data.content_type === '3d' ? (
                <div className="sm:col-span-2">
                    <DropZone
                        label="Model 3D (.glb)"
                        hint="Siswa dapat memutar dan memperbesar model ini di halaman materi."
                        accept=".glb"
                        previewKind="file"
                        previewUrl={data.model_file?.name || data.model_url || ''}
                        onFileChange={(file) => setData((current) => ({ ...current, model_file: file }))}
                        urlValue={data.model_url}
                        onUrlChange={(url) => setData((current) => ({ ...current, model_url: url, model_file: null }))}
                        error={errors.model_file || errors.model_url}
                    />
                </div>
            ) : (
                <div className="sm:col-span-2">
                    <DropZone
                        label="Gambar (dijadikan cover materi)"
                        hint="Gambar ini akan tampil sebagai cover materi di halaman jelajah."
                        accept="image/*"
                        previewKind="image"
                        previewUrl={thumbnailFilePreview || data.thumbnail_url || ''}
                        onFileChange={(file) => setData((current) => ({ ...current, thumbnail_file: file }))}
                        urlValue={data.thumbnail_url}
                        onUrlChange={(url) => setData((current) => ({ ...current, thumbnail_url: url, thumbnail_file: null }))}
                        error={errors.thumbnail_file || errors.thumbnail_url}
                    />
                </div>
            )}

            <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm text-primary-700">
                    <input
                        type="checkbox"
                        checked={data.publish}
                        onChange={(e) => setData('publish', e.target.checked)}
                        className="rounded border-primary-300 text-accent-500 focus:ring-accent-400"
                    />
                    Terbitkan materi ini
                </label>
            </div>
        </div>
    );
}
