export default function UserForm({ data, setData, errors, roles, educationLevels, departments, isEdit = false }) {
    return (
        <>
            <div>
                <label htmlFor="name" className="label">
                    Nama Lengkap
                </label>
                <input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required className="input" />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
                <label htmlFor="email" className="label">
                    Email
                </label>
                <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className="input" />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
                <label htmlFor="password" className="label">
                    {isEdit ? 'Kata Sandi Baru (opsional)' : 'Kata Sandi'}
                </label>
                <input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required={!isEdit}
                    className="input"
                    placeholder={isEdit ? 'Kosongkan jika tidak diubah' : ''}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div>
                <label htmlFor="role" className="label">
                    Role
                </label>
                <select id="role" value={data.role} onChange={(e) => setData('role', e.target.value)} required className="input">
                    {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
            </div>
            {isEdit && (
                <div className="flex items-end pb-2.5">
                    <label className="flex items-center gap-2 text-sm text-primary-700">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="rounded border-primary-300 text-accent-500 focus:ring-accent-400"
                        />
                        Akun aktif
                    </label>
                </div>
            )}
            <div>
                <label htmlFor="education_level_id" className="label">
                    Jenjang
                </label>
                <select
                    id="education_level_id"
                    value={data.education_level_id}
                    onChange={(e) => setData('education_level_id', e.target.value)}
                    className="input"
                >
                    <option value="">-</option>
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
                <select id="department_id" value={data.department_id} onChange={(e) => setData('department_id', e.target.value)} className="input">
                    <option value="">-</option>
                    {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="institution" className="label">
                    Sekolah / Universitas
                </label>
                <input id="institution" type="text" value={data.institution} onChange={(e) => setData('institution', e.target.value)} className="input" />
            </div>
            <div>
                <label htmlFor="grade_or_semester" className="label">
                    Kelas / Semester
                </label>
                <input
                    id="grade_or_semester"
                    type="text"
                    value={data.grade_or_semester}
                    onChange={(e) => setData('grade_or_semester', e.target.value)}
                    className="input"
                />
            </div>
        </>
    );
}
