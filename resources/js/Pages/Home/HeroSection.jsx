import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function HeroSection({
    educationLevels = [],
    departmentsCount = 0,
    showRegister = true,
}) {
    const heroRef = useRef(null);

    const [introVisible, setIntroVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0,
    });

    /*
    |--------------------------------------------------------------------------
    | Initial animation
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const timer = setTimeout(() => {
            setIntroVisible(true);
        }, 150);

        return () => clearTimeout(timer);
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Scroll animation
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let ticking = false;

        const updateScroll = () => {
            if (!heroRef.current) {
                ticking = false;
                return;
            }

            const rect = heroRef.current.getBoundingClientRect();

            const scrollableDistance =
                rect.height - window.innerHeight;

            if (scrollableDistance <= 0) {
                setScrollProgress(0);
                ticking = false;
                return;
            }

            const currentScroll = Math.max(
                0,
                Math.min(-rect.top, scrollableDistance)
            );

            const progress =
                currentScroll / scrollableDistance;

            setScrollProgress(progress);

            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };

        updateScroll();

        window.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener(
                'scroll',
                handleScroll
            );

            window.removeEventListener(
                'resize',
                handleScroll
            );
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Mouse parallax
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const handleMouseMove = (event) => {
            const x =
                (event.clientX / window.innerWidth - 0.5) * 2;

            const y =
                (event.clientY / window.innerHeight - 0.5) * 2;

            setMousePosition({
                x,
                y,
            });
        };

        window.addEventListener(
            'mousemove',
            handleMouseMove
        );

        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            );
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Hero images
    |--------------------------------------------------------------------------
    |
    | hero-6 sudah dihapus.
    |
    */

    const images = [
        {
            src: '/images/hero/hero-1.png',
            className: 'hero-image-one',
            delay: 0,
            direction: -1,
        },
        {
            src: '/images/hero/hero-2.png',
            className: 'hero-image-two',
            delay: 140,
            direction: 1,
        },
        {
            src: '/images/hero/hero-3.png',
            className: 'hero-image-three',
            delay: 280,
            direction: -1,
        },
        {
            src: '/images/hero/hero-4.png',
            className: 'hero-image-four',
            delay: 420,
            direction: 1,
        },
        {
            src: '/images/hero/hero-5.png',
            className: 'hero-image-five',
            delay: 560,
            direction: -1,
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Image scroll transformation
    |--------------------------------------------------------------------------
    */

    const getImageStyle = (index) => {
        const configurations = [
            {
                x: -230,
                y: -170,
                rotate: -65,
                scale: 0.38,
            },
            {
                x: 250,
                y: -150,
                rotate: 70,
                scale: 0.38,
            },
            {
                x: -210,
                y: 180,
                rotate: -70,
                scale: 0.42,
            },
            {
                x: 230,
                y: 190,
                rotate: 68,
                scale: 0.4,
            },
            {
                x: -280,
                y: 80,
                rotate: -58,
                scale: 0.4,
            },
        ];

        const config =
            configurations[index] ||
            configurations[0];

        /*
        |--------------------------------------------------------------------------
        | Animation starts after a small scroll distance
        |--------------------------------------------------------------------------
        */

        const animationProgress = Math.max(
            0,
            Math.min(
                1,
                (scrollProgress - 0.04) / 0.78
            )
        );

        /*
        |--------------------------------------------------------------------------
        | Smooth easing
        |--------------------------------------------------------------------------
        */

        const eased =
            1 -
            Math.pow(
                1 - animationProgress,
                3
            );

        /*
        |--------------------------------------------------------------------------
        | Mouse parallax
        |--------------------------------------------------------------------------
        */

        const mouseX =
            mousePosition.x *
            (8 + index * 2);

        const mouseY =
            mousePosition.y *
            (6 + index * 2);

        /*
        |--------------------------------------------------------------------------
        | Final transformation
        |--------------------------------------------------------------------------
        */

        const x =
            config.x * eased +
            mouseX;

        const y =
            config.y * eased +
            mouseY;

        const rotate =
            config.rotate * eased;

        const scale =
            1 -
            (1 - config.scale) *
                eased;

        /*
        |--------------------------------------------------------------------------
        | Opacity
        |--------------------------------------------------------------------------
        */

        const opacity =
            1 -
            Math.max(
                0,
                eased - 0.35
            ) *
                1.55;

        return {
            transform: `
                translate3d(
                    ${x}px,
                    ${y}px,
                    0
                )
                rotate(${rotate}deg)
                scale(${scale})
            `,

            opacity: Math.max(
                0,
                opacity
            ),
        };
    };

    /*
    |--------------------------------------------------------------------------
    | Component
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <style>{`

                /*
                |--------------------------------------------------------------------------
                | Font
                |--------------------------------------------------------------------------
                */

                @import url(
                    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
                );

                /*
                |--------------------------------------------------------------------------
                | Main hero
                |--------------------------------------------------------------------------
                */

                .technobrain-hero {
                    position: relative;

                    /* Pulls the hero up behind the sticky glass navbar
                       (which is h-20 / 80px) so its yellow fills all the
                       way to the very top — no page-background seam. */
                    margin-top: -80px;

                    min-height: 116svh;

                    overflow: hidden;

                    background: #f6d84a;

                    color: #050505;

                    font-family:
                        'Plus Jakarta Sans',
                        sans-serif;
                }

                /*
                |--------------------------------------------------------------------------
                | Sticky viewport
                |--------------------------------------------------------------------------
                */

                .hero-sticky {
                    position: sticky;

                    top: 0;

                    height: 100svh;

                    min-height: 560px;

                    max-height: 900px;

                    overflow: hidden;
                }

                /*
                |--------------------------------------------------------------------------
                | Header
                |--------------------------------------------------------------------------
                */

                .hero-header {
                    position: absolute;

                    top: 0;
                    left: 0;
                    right: 0;

                    z-index: 80;

                    display: flex;

                    justify-content: flex-end;

                    padding:
                        28px
                        34px;
                }

                /*
                |--------------------------------------------------------------------------
                | Back button
                |--------------------------------------------------------------------------
                */

                .hero-back {
                    display: flex;

                    align-items: center;
                    justify-content: center;

                    width: 46px;
                    height: 46px;

                    border:
                        1.5px solid
                        rgba(
                            0,
                            0,
                            0,
                            0.85
                        );

                    border-radius: 999px;

                    background:
                        transparent;

                    color: #050505;

                    cursor: pointer;

                    transition:
                        background
                            250ms ease,
                        color
                            250ms ease,
                        transform
                            250ms ease;
                }

                .hero-back:hover {
                    background: #050505;

                    color: #f6d84a;

                    transform:
                        rotate(-8deg);
                }

                .hero-back svg {
                    width: 18px;
                    height: 18px;
                }

                /*
                |--------------------------------------------------------------------------
                | Hero content
                |--------------------------------------------------------------------------
                */

                .hero-content {
                    position: relative;

                    z-index: 30;

                    width: 100%;
                    height: 100%;

                    display: flex;

                    align-items: center;

                    padding:
                        156px
                        7vw
                        64px;
                }

                .hero-inner {
                    position: relative;

                    width: min(
                        100%,
                        650px
                    );

                    margin-left: 2vw;

                    text-align: left;
                }

                /*
                |--------------------------------------------------------------------------
                | Heading
                |--------------------------------------------------------------------------
                */

                .hero-title {
                    margin: 0;

                    max-width: 680px;

                    color: #050505;

                    font-size:
                        clamp(
                            3.25rem,
                            6vw,
                            6.5rem
                        );

                    line-height:
                        0.9;

                    font-weight: 800;

                    letter-spacing:
                        -0.075em;

                    opacity: 0;

                    transform:
                        translateY(50px);

                    transition:
                        opacity
                            900ms ease,
                        transform
                            1000ms
                            cubic-bezier(
                                0.16,
                                1,
                                0.3,
                                1
                            );
                }

                .hero-title.visible {
                    opacity: 1;

                    transform:
                        translateY(0);
                }

                .hero-title-line {
                    display: block;
                }

                /*
                |--------------------------------------------------------------------------
                | Description
                |--------------------------------------------------------------------------
                */

                .hero-description {
                    max-width: 520px;

                    margin-top: 30px;

                    color:
                        rgba(
                            0,
                            0,
                            0,
                            0.72
                        );

                    font-size:
                        clamp(
                            0.9rem,
                            1.15vw,
                            1.05rem
                        );

                    line-height: 1.75;

                    font-weight: 500;

                    opacity: 0;

                    transform:
                        translateY(28px);

                    transition:
                        opacity
                            900ms ease,
                        transform
                            900ms
                            100ms
                            cubic-bezier(
                                0.16,
                                1,
                                0.3,
                                1
                            );
                }

                .hero-description.visible {
                    opacity: 1;

                    transform:
                        translateY(0);
                }

                /*
                |--------------------------------------------------------------------------
                | CTA
                |--------------------------------------------------------------------------
                */

                .hero-actions {
                    display: flex;

                    align-items: center;

                    margin-top: 36px;

                    opacity: 0;

                    transform:
                        translateY(25px);

                    transition:
                        opacity
                            900ms ease,
                        transform
                            900ms
                            180ms
                            cubic-bezier(
                                0.16,
                                1,
                                0.3,
                                1
                            );
                }

                .hero-actions.visible {
                    opacity: 1;

                    transform:
                        translateY(0);
                }

                /*
                |--------------------------------------------------------------------------
                | Register
                |--------------------------------------------------------------------------
                */

                .hero-register {
                    display: inline-flex;

                    align-items: center;
                    justify-content: center;

                    min-height: 52px;

                    padding:
                        0
                        28px;

                    border-radius:
                        999px;

                    background:
                        #050505;

                    color:
                        #f6d84a;

                    font-size: 14px;

                    font-weight: 700;

                    text-decoration: none;

                    transition:
                        transform
                            250ms ease,
                        background
                            250ms ease;
                }

                .hero-register:hover {
                    transform:
                        translateY(-4px);

                    background:
                        #171717;
                }

                /*
                |--------------------------------------------------------------------------
                | Explore button
                |--------------------------------------------------------------------------
                */

                .hero-explore {
                    position: absolute;

                    top: 50%;

                    right: 6vw;

                    z-index: 70;

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    width: 145px;
                    height: 145px;

                    border-radius: 50%;

                    background:
                        #050505;

                    color:
                        #f6d84a;

                    text-decoration: none;

                    transform:
                        translateY(-50%);

                    transition:
                        transform
                            400ms
                            cubic-bezier(
                                0.16,
                                1,
                                0.3,
                                1
                            );
                }

                .hero-explore:hover {
                    transform:
                        translateY(-50%)
                        scale(1.08)
                        rotate(-6deg);
                }

                /*
                |--------------------------------------------------------------------------
                | Explore rotating text
                |--------------------------------------------------------------------------
                */

                .hero-explore-ring {
                    position: absolute;

                    inset: 0;

                    width: 100%;
                    height: 100%;

                    animation:
                        hero-ring-spin
                        16s
                        linear
                        infinite;
                }

                .hero-explore-ring text {
                    fill:
                        #f6d84a;

                    font-family:
                        'Plus Jakarta Sans',
                        sans-serif;

                    font-size: 10px;

                    font-weight: 700;

                    letter-spacing:
                        0.18em;
                }

                .hero-explore-center {
                    position: relative;

                    z-index: 2;

                    font-size: 15px;

                    font-weight: 800;
                }

                @keyframes hero-ring-spin {

                    from {
                        transform:
                            rotate(0deg);
                    }

                    to {
                        transform:
                            rotate(360deg);
                    }

                }

                /*
                |--------------------------------------------------------------------------
                | Images container
                |--------------------------------------------------------------------------
                */

                .hero-images {
                    position: absolute;

                    inset: 0;

                    z-index: 15;

                    pointer-events:
                        none;
                }

                /*
                |--------------------------------------------------------------------------
                | Individual image
                |--------------------------------------------------------------------------
                */

                .hero-image {
                    position: absolute;

                    display: block;

                    will-change:
                        transform,
                        opacity;

                    transform-origin:
                        center center;

                    transition:
                        opacity
                            120ms linear,
                        transform
                            650ms
                            cubic-bezier(
                                0.34,
                                1.56,
                                0.64,
                                1
                            );
                }

                @media (prefers-reduced-motion: reduce) {
                    .hero-image {
                        transition:
                            opacity
                                120ms linear;
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Initial image wrapper
                |--------------------------------------------------------------------------
                */

                .hero-image-enter {
                    width: 100%;
                    height: 100%;

                    opacity: 0;

                    transform:
                        translate3d(
                            0,
                            100px,
                            0
                        )
                        rotate(-45deg)
                        scale(0.35);
                }

                .hero-image-enter.visible {
                    animation:
                        hero-image-intro
                        1300ms
                        cubic-bezier(
                            0.16,
                            1,
                            0.3,
                            1
                        )
                        forwards;
                }

                /*
                |--------------------------------------------------------------------------
                | Image entrance animation
                |--------------------------------------------------------------------------
                */

                @keyframes hero-image-intro {

                    0% {
                        opacity: 0;

                        transform:
                            translate3d(
                                0,
                                100px,
                                0
                            )
                            rotate(-45deg)
                            scale(0.35);
                    }

                    30% {
                        opacity: 0.25;
                    }

                    65% {
                        opacity: 0.9;

                        transform:
                            translate3d(
                                0,
                                -10px,
                                0
                            )
                            rotate(8deg)
                            scale(1.04);
                    }

                    82% {
                        opacity: 1;

                        transform:
                            translate3d(
                                0,
                                4px,
                                0
                            )
                            rotate(-3deg)
                            scale(0.98);
                    }

                    100% {
                        opacity: 1;

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            rotate(0deg)
                            scale(1);
                    }

                }

                /*
                |--------------------------------------------------------------------------
                | Idle float — a gentle, perpetual bob + sway so the cutouts
                | feel alive even at rest, independent of the scroll/mouse
                | parallax already applied to their parent (.hero-image).
                |--------------------------------------------------------------------------
                */

                .hero-image-idle {
                    animation:
                        hero-image-float
                        var(--float-duration, 5s)
                        ease-in-out
                        infinite;

                    animation-delay:
                        var(--float-delay, 0s);
                }

                @keyframes hero-image-float {

                    0%,
                    100% {
                        transform:
                            translateY(0)
                            rotate(0deg);
                    }

                    50% {
                        transform:
                            translateY(-14px)
                            rotate(var(--float-rotate, 2deg));
                    }

                }

                @media (prefers-reduced-motion: reduce) {
                    .hero-image-idle {
                        animation: none;
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Image
                |--------------------------------------------------------------------------
                */

                .hero-image img {
                    display: block;

                    width: 100%;
                    height: auto;

                    object-fit: contain;

                    user-select: none;

                    -webkit-user-drag:
                        none;
                }

                /*
                |--------------------------------------------------------------------------
                | Image positions
                |--------------------------------------------------------------------------
                */

                .hero-image-one {
                    width:
                        clamp(
                            145px,
                            15vw,
                            260px
                        );

                    top: 7%;

                    right: 22%;
                }

                .hero-image-two {
                    width:
                        clamp(
                            135px,
                            14vw,
                            245px
                        );

                    top: 13%;

                    right: 4%;
                }

                .hero-image-three {
                    width:
                        clamp(
                            150px,
                            16vw,
                            275px
                        );

                    top: 40%;

                    right: 12%;
                }

                .hero-image-four {
                    width:
                        clamp(
                            145px,
                            16vw,
                            275px
                        );

                    bottom: 3%;

                    right: 25%;
                }

                .hero-image-five {
                    width:
                        clamp(
                            125px,
                            13vw,
                            225px
                        );

                    top: 62%;

                    right: 3%;
                }

                /*
                |--------------------------------------------------------------------------
                | Tablet
                |--------------------------------------------------------------------------
                */

                @media (max-width: 1100px) {

                    .hero-content {
                        padding-left:
                            5vw;
                    }

                    .hero-inner {
                        margin-left: 0;
                    }

                    .hero-title {
                        font-size:
                            clamp(
                                3.7rem,
                                8vw,
                                6rem
                            );
                    }

                    .hero-explore {
                        right: 25px;

                        width: 120px;
                        height: 120px;
                    }

                    .hero-image-one {
                        right: 24%;
                    }

                    .hero-image-two {
                        right: 1%;
                    }

                    .hero-image-three {
                        right: 9%;
                    }

                    .hero-image-four {
                        right: 22%;
                    }

                    .hero-image-five {
                        right: 1%;
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Mobile
                |--------------------------------------------------------------------------
                */

                @media (max-width: 767px) {

                    .hero-sticky {
                        min-height: 650px;
                    }

                    .hero-header {
                        padding:
                            18px;
                    }

                    .hero-back {
                        width: 40px;
                        height: 40px;
                    }

                    .hero-content {
                        align-items: center;

                        padding:
                            180px
                            20px
                            80px;
                    }

                    .hero-inner {
                        width: 100%;

                        margin-left: 0;

                        text-align: left;
                    }

                    .hero-eyebrow {
                        margin-bottom: 16px;

                        font-size: 9px;
                    }

                    .hero-title {
                        max-width: 92vw;

                        font-size:
                            clamp(
                                3.2rem,
                                15vw,
                                5.2rem
                            );

                        line-height: 0.88;

                        letter-spacing:
                            -0.07em;
                    }

                    .hero-description {
                        max-width:
                            78vw;

                        margin-top: 22px;

                        font-size: 12px;

                        line-height: 1.7;
                    }

                    .hero-actions {
                        margin-top: 26px;
                    }

                    .hero-register {
                        min-height: 46px;

                        padding:
                            0 22px;

                        font-size: 12px;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Explore mobile
                    |--------------------------------------------------------------------------
                    */

                    .hero-explore {
                        top: auto;

                        right: 16px;

                        bottom: 28px;

                        width: 88px;
                        height: 88px;

                        transform: none;
                    }

                    .hero-explore:hover {
                        transform:
                            scale(1.06)
                            rotate(-6deg);
                    }

                    .hero-explore-ring text {
                        font-size: 8px;

                        letter-spacing:
                            0.12em;
                    }

                    .hero-explore-center {
                        font-size: 11px;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Mobile images
                    |--------------------------------------------------------------------------
                    */

                    .hero-image-one {
                        width: 95px;

                        top: 10%;

                        right: 29%;
                    }

                    .hero-image-two {
                        width: 90px;

                        top: 16%;

                        right: 2%;
                    }

                    .hero-image-three {
                        width: 108px;

                        top: 43%;

                        right: 2%;
                    }

                    .hero-image-four {
                        width: 100px;

                        bottom: 5%;

                        right: 29%;
                    }

                    .hero-image-five {
                        width: 82px;

                        top: 63%;

                        right: 0;
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Small mobile
                |--------------------------------------------------------------------------
                */

                @media (max-width: 420px) {

                    .hero-title {
                        font-size:
                            clamp(
                                2.75rem,
                                14.5vw,
                                4.2rem
                            );
                    }

                    .hero-description {
                        max-width: 76vw;

                        font-size: 11px;
                    }

                    .hero-explore {
                        width: 78px;
                        height: 78px;

                        right: 12px;

                        bottom: 22px;
                    }

                    .hero-explore-center {
                        font-size: 10px;
                    }

                    .hero-image-one {
                        width: 82px;

                        right: 31%;
                    }

                    .hero-image-two {
                        width: 78px;
                    }

                    .hero-image-three {
                        width: 94px;
                    }

                    .hero-image-four {
                        width: 88px;
                    }

                    .hero-image-five {
                        width: 72px;
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | Reduced motion
                |--------------------------------------------------------------------------
                */

                @media (prefers-reduced-motion: reduce) {

                    .hero-image-enter.visible {
                        animation: none;

                        opacity: 1;

                        transform:
                            translate3d(
                                0,
                                0,
                                0
                            )
                            rotate(0deg)
                            scale(1);
                    }

                    .hero-explore-ring {
                        animation: none;
                    }

                    .hero-back,
                    .hero-explore,
                    .hero-register {
                        transition: none;
                    }
                }

            `}</style>

            {/* ================================================================
                HERO
            ================================================================= */}

            <section
                id="beranda"
                ref={heroRef}
                className="technobrain-hero"
            >
                <div className="hero-sticky">

                    {/* ========================================================
                        HEADER
                    ========================================================= */}

                    <header className="hero-header">

                        <button
                            type="button"
                            className="hero-back"
                            onClick={() =>
                                window.history.back()
                            }
                            aria-label="Kembali"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 12H5" />

                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                        </button>

                    </header>

                    {/* ========================================================
                        HERO IMAGES
                    ========================================================= */}

                    <div
                        className="hero-images"
                        aria-hidden="true"
                    >
                        {images.map(
                            (
                                image,
                                index
                            ) => (
                                <div
                                    key={
                                        image.src
                                    }
                                    className={`
                                        hero-image
                                        ${image.className}
                                    `}
                                    style={getImageStyle(
                                        index
                                    )}
                                >
                                    <div
                                        className={`
                                            hero-image-enter
                                            ${
                                                introVisible
                                                    ? 'visible'
                                                    : ''
                                            }
                                        `}
                                        style={{
                                            animationDelay:
                                                `${image.delay}ms`,
                                        }}
                                    >
                                        <div
                                            className="hero-image-idle"
                                            style={{
                                                '--float-duration': `${4.5 + index * 0.5}s`,
                                                '--float-delay': `${image.delay + 1300}ms`,
                                                '--float-rotate': `${image.direction * 2.5}deg`,
                                            }}
                                        >
                                            <img
                                                src={
                                                    image.src
                                                }
                                                alt=""
                                                draggable="false"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* ========================================================
                        CONTENT
                    ========================================================= */}

                    <main className="hero-content">

                        <div className="hero-inner">

                            {/* Heading */}

                            <h1
                                className={`
                                    hero-title
                                    ${
                                        introVisible
                                            ? 'visible'
                                            : ''
                                    }
                                `}
                            >
                                <span className="hero-title-line">
                                    BELAJAR
                                </span>

                                <span className="hero-title-line">
                                    TEKNOLOGI.
                                </span>

                                <span className="hero-title-line">
                                    BANGUN
                                </span>

                                <span className="hero-title-line">
                                    MASA DEPAN.
                                </span>
                            </h1>

                            {/* Description */}

                            <p
                                className={`
                                    hero-description
                                    ${
                                        introVisible
                                            ? 'visible'
                                            : ''
                                    }
                                `}
                            >
                                Eksplorasi pembelajaran digital
                                yang interaktif melalui materi,
                                simulasi, visualisasi, dan
                                pengalaman belajar yang dirancang
                                untuk siswa SMK hingga mahasiswa.
                            </p>

                            {/* Register */}

                            {showRegister && (
                                <div
                                    className={`
                                        hero-actions
                                        ${
                                            introVisible
                                                ? 'visible'
                                                : ''
                                        }
                                    `}
                                >
                                    <Link
                                        href={route(
                                            'register'
                                        )}
                                        className="hero-register"
                                    >
                                        Daftar Gratis
                                    </Link>
                                </div>
                            )}

                        </div>

                    </main>

                    {/* ========================================================
                        EXPLORE BUTTON
                    ========================================================= */}

                    <Link
                        href={route('explore')}
                        className="hero-explore"
                        aria-label="Eksplor materi"
                    >
                        <svg
                            className="hero-explore-ring"
                            viewBox="0 0 120 120"
                            aria-hidden="true"
                        >
                            <defs>
                                <path
                                    id="heroCirclePath"
                                    d="
                                        M 60 60
                                        m -45 0
                                        a 45 45 0 1 1 90 0
                                        a 45 45 0 1 1 -90 0
                                    "
                                />
                            </defs>

                            <text>
                                <textPath
                                    href="#heroCirclePath"
                                    startOffset="0%"
                                >
                                    EXPLORE • EXPLORE • EXPLORE •
                                </textPath>
                            </text>
                        </svg>

                        <span className="hero-explore-center">
                            Eksplor
                        </span>
                    </Link>

                </div>
            </section>
        </>
    );
}
