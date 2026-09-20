function Pill({ active, ...props }) {
    return (
        <button
            type="button"
            className={`inline-flex shrink-0 items-center rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                active ? 'bg-primary-950 text-accent-400' : 'border border-primary-200 text-primary-600 hover:border-primary-950 hover:text-primary-950'
            }`}
            {...props}
        />
    );
}

function SelectPill({ value, onChange, placeholder, options }) {
    const active = value !== '' && value != null;

    return (
        <select
            value={value ?? ''}
            onChange={onChange}
            className={`w-full appearance-none rounded-full border px-4 py-2 text-xs font-bold transition sm:w-auto ${
                active ? 'border-primary-950 bg-primary-950 text-accent-400' : 'border-primary-200 bg-paper text-primary-600 hover:border-primary-950'
            }`}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value} className="bg-paper text-primary-950">
                    {option.label}
                </option>
            ))}
        </select>
    );
}

export default function FilterPanel({ filters, educationLevels, departments, subjects, difficulties, contentTypes, onUpdate, onSearch }) {
    const activeCount = ['department', 'subject', 'difficulty', 'content_type', 'level'].filter((key) => filters[key]).length;

    function resetAll() {
        ['level', 'department', 'subject', 'difficulty', 'content_type'].forEach((key) => onUpdate(key, ''));
    }

    return (
        <form onSubmit={onSearch} className="card mt-8 space-y-5 p-5 sm:p-6">
            <div className="relative">
                <input
                    type="search"
                    name="q"
                    defaultValue={filters.q ?? ''}
                    placeholder="Cari MikroTik, React, Routing, Akuntansi..."
                    className="input h-12 rounded-2xl pr-11 text-base"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-primary-950 text-accent-400 transition hover:bg-primary-800"
                    aria-label="Cari"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Pill active={!filters.level} onClick={() => onUpdate('level', '')}>
                    Semua Jenjang
                </Pill>
                {educationLevels.map((level) => (
                    <Pill key={level.id} active={filters.level === level.slug} onClick={() => onUpdate('level', level.slug)}>
                        {level.name}
                    </Pill>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-primary-100 pt-4">
                <SelectPill
                    value={filters.department}
                    onChange={(e) => onUpdate('department', e.target.value)}
                    placeholder="Semua Jurusan"
                    options={departments.map((d) => ({ value: d.slug, label: d.name }))}
                />
                <SelectPill
                    value={filters.subject}
                    onChange={(e) => onUpdate('subject', e.target.value)}
                    placeholder="Semua Mata Pelajaran"
                    options={subjects.map((s) => ({ value: s.id, label: s.name }))}
                />
                <SelectPill
                    value={filters.difficulty}
                    onChange={(e) => onUpdate('difficulty', e.target.value)}
                    placeholder="Semua Level"
                    options={difficulties.map((d) => ({ value: d.value, label: d.label }))}
                />
                <SelectPill
                    value={filters.content_type}
                    onChange={(e) => onUpdate('content_type', e.target.value)}
                    placeholder="Semua Tipe Konten"
                    options={contentTypes.map((c) => ({ value: c.value, label: c.label }))}
                />

                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={resetAll}
                        className="ml-auto text-xs font-bold text-accent-600 transition hover:text-accent-700 hover:underline"
                    >
                        Reset filter ({activeCount})
                    </button>
                )}
            </div>
        </form>
    );
}
