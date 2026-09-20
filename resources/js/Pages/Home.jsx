import { Head, usePage } from '@inertiajs/react';
import HeroSection from './Home/HeroSection';
import AboutSection from './Home/AboutSection';
import FeaturesSection from './Home/FeaturesSection';
import LatestMaterialsSection from './Home/LatestMaterialsSection';
import TestimonialsSection from './Home/TestimonialsSection';
import CtaSection from './Home/CtaSection';

export default function Home({ featured, departments, educationLevels, testimonials }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Beranda" />

            <HeroSection educationLevels={educationLevels} departmentsCount={departments.length} showRegister={!auth?.user} />
            <AboutSection />
            <FeaturesSection />
            <LatestMaterialsSection materials={featured} />
            <TestimonialsSection testimonials={testimonials} canComment={!!auth?.user} />
            <CtaSection />
        </>
    );
}
