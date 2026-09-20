import { Head, Link, router } from '@inertiajs/react';
import Pagination from '../../../Components/Pagination';
import { roleLabel } from '../../../lib/enums';

export default function Index({ users, roles, filters }) {
    function updateFilter(key, value) {
        router.get(route('admin.users.index'), { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    }

    function resetPassword(user) {
        if (confirm(`Reset kata sandi ${user.name}?`)) {
            router.post(route('admin.users.reset-password', user.id), {}, { preserveScroll: true });
        }
    }

    function destroy(user) {
        if (confirm(`Hapus akun ${user.name}?`)) {
            router.delete(route('admin.users.destroy', user.id), { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Kelola Akun" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary-950">Kelola Akun</h1>
                <Link href={route('admin.users.create')} className="btn-primary">
                    + Buat Akun
                </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <input
                    type="search"
                    defaultValue={filters.q ?? ''}
                    onKeyDown={(e) => e.key === 'Enter' && updateFilter('q', e.target.value)}
                    onBlur={(e) => updateFilter('q', e.target.value)}
                    placeholder="Cari nama atau email..."
                    className="input max-w-xs"
                />
                <select value={filters.role ?? ''} onChange={(e) => updateFilter('role', e.target.value)} className="input max-w-xs">
                    <option value="">Semua Role</option>
                    {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-primary-100">
                <table className="w-full text-left text-sm">
                    <thead className="bg-primary-50 text-xs uppercase tracking-wide text-primary-400">
                        <tr>
                            <th className="px-5 py-3">Nama</th>
                            <th className="px-5 py-3">Role</th>
                            <th className="px-5 py-3">Jenjang / Jurusan</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100">
                        {users.data.map((user) => (
                            <tr key={user.id} className="hover:bg-primary-50/60">
                                <td className="px-5 py-3">
                                    <p className="font-medium text-primary-900">{user.name}</p>
                                    <p className="text-xs text-primary-400">{user.email}</p>
                                </td>
                                <td className="px-5 py-3 text-primary-600">{roleLabel(user.role)}</td>
                                <td className="px-5 py-3 text-primary-500">{user.department?.name ?? '-'}</td>
                                <td className="px-5 py-3">
                                    <span className={`badge ${user.is_active ? 'border-emerald-300 text-emerald-700' : 'border-red-300 text-red-600'}`}>
                                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <div className="flex justify-end gap-3 text-xs">
                                        <Link href={route('admin.users.edit', user.id)} className="text-accent-600 hover:underline">
                                            Edit
                                        </Link>
                                        <button type="button" onClick={() => resetPassword(user)} className="text-amber-600 hover:underline">
                                            Reset Password
                                        </button>
                                        <button type="button" onClick={() => destroy(user)} className="text-red-500 hover:underline">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8">
                <Pagination meta={users} />
            </div>
        </>
    );
}
