import { Head, router } from '@inertiajs/react';
import FilterPanel from './Explore/FilterPanel';
import ResultsGrid from './Explore/ResultsGrid';

export default function Explore({ materials, educationLevels, departments, subjects, difficulties, contentTypes, filters }) {
    function updateFilter(key, value) {
        router.get(route('explore'), { ...filters, [key]: value || undefined }, { preserveState: true, preserveScroll: true, replace: true });
    }

    function submitSearch(e) {
        e.preventDefault();
        updateFilter('q', e.target.q.value);
    }

    return (
        <>
            <Head title="Explore" />

            <section className="px-4 pb-8 pt-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <span className="eyebrow">Explore</span>
                    <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight text-primary-950 sm:text-4xl">
                        Jelajahi Semua Materi
                    </h1>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-primary-500">
                        Cari materi lintas jenjang dan jurusan &mdash; dari TJKT hingga bidang lainnya, semua dalam satu tempat.
                    </p>

                    <FilterPanel
                        filters={filters}
                        educationLevels={educationLevels}
                        departments={departments}
                        subjects={subjects}
                        difficulties={difficulties}
                        contentTypes={contentTypes}
                        onUpdate={updateFilter}
                        onSearch={submitSearch}
                    />
                </div>
            </section>

            <section className="px-4 pb-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <ResultsGrid materials={materials} />
                </div>
            </section>
        </>
    );
}
