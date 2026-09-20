import MaterialCard from '../../Components/MaterialCard';
import Pagination from '../../Components/Pagination';

export default function ResultsGrid({ materials }) {
    if (materials.data.length === 0) {
        return (
            <div className="card mt-6 flex flex-col items-center gap-3 p-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.2-5.2m0 0a7.2 7.2 0 1 0-10.184-10.184 7.2 7.2 0 0 0 10.185 10.185Z" />
                    </svg>
                </div>
                <p className="text-lg font-bold text-primary-950">Materi tidak ditemukan</p>
                <p className="text-sm text-primary-500">Coba ubah kata kunci atau filter pencarianmu.</p>
            </div>
        );
    }

    return (
        <>
            <p className="mt-8 text-sm font-semibold text-primary-500">
                <span className="text-primary-950">{materials.total}</span> materi ditemukan
            </p>

            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {materials.data.map((material) => (
                    <MaterialCard key={material.id} material={material} />
                ))}
            </div>

            <div className="mt-10">
                <Pagination meta={materials} />
            </div>
        </>
    );
}
