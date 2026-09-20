import { Head } from '@inertiajs/react';
import Header from './Show/Header';
import SceneSection from './Show/SceneSection';
import ActivitiesList from './Show/ActivitiesList';
import ContentArticle from './Show/ContentArticle';
import CommentsSection from './Show/CommentsSection';
import ProgressCard from './Show/ProgressCard';
import RelatedMaterials from './Show/RelatedMaterials';

export default function Show({ material, progress, related }) {
    const is3d = material.content_type === '3d' && material.scene_config?.objects?.length > 0;

    return (
        <>
            <Head title={material.title} />

            <Header material={material} />

            <section className="px-4 pb-16 pt-4 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_280px]">
                    <div className="min-w-0 space-y-10">
                        {is3d ? <SceneSection material={material} /> : <ActivitiesList activities={material.activities} />}

                        <ContentArticle content={material.content} />

                        <CommentsSection materialSlug={material.slug} comments={material.comments} />
                    </div>

                    <aside className="space-y-6">
                        <ProgressCard materialSlug={material.slug} progress={progress} />
                        <RelatedMaterials materials={related} />
                    </aside>
                </div>
            </section>
        </>
    );
}
