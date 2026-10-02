import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase15Inside() {
    const sceneRef = useRef(null);
    const imageRef = useRef(null);
    const contentRef = useRef(null);

    const {
        gamePhase,
        nextPhase,
        setPuzzleMessage,
    } = useGame();

    const { playSound } = useSound();

    // Entrance animation
    useEffect(() => {
        if (gamePhase !== 15) return;

        setPuzzleMessage("");

        const timeline = gsap.timeline();

        timeline
            .fromTo(
                sceneRef.current,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 1.8,
                    ease: "power2.inOut",
                }
            )
            .fromTo(
                imageRef.current,
                {
                    scale: 1.08,
                    opacity: 0,
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 6,
                    ease: "power2.out",
                },
                "-=1"
            )
            .fromTo(
                contentRef.current,
                {
                    opacity: 0,
                    y: 25,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.8,
                    ease: "power2.out",
                },
                "-=3"
            );

        return () => {
            timeline.kill();
        };
    }, [gamePhase, setPuzzleMessage]);

    // Door closes after entering
    useEffect(() => {
        if (gamePhase !== 15) return;

        const timer = setTimeout(() => {
            playSound("door-close", 0.8);
        }, 1200);

        return () => {
            clearTimeout(timer);
        };
    }, [gamePhase, playSound]);

    // Continue
    const handleContinue = () => {
        playSound("click", 0.7);

        gsap.to(sceneRef.current, {
            opacity: 0,
            duration: 1.3,
            ease: "power2.inOut",
            onComplete: () => {
                nextPhase();
            },
        });
    };

    if (gamePhase !== 15) {
        return null;
    }

    return (
        <main
            ref={sceneRef}
            className="phase15-scene"
        >
            {/* Background */}
            <img
                ref={imageRef}
                className="phase15-image"
                src="/images/chapter2-inside.jpg"
                alt="Inside the abandoned house"
                draggable="false"
            />

            {/* Darkness */}
            <div className="phase15-vignette" />

            {/* Grain */}
            <div className="phase15-grain" />

            {/* Story */}
            <section
                ref={contentRef}
                className="phase15-content"
            >
                <p className="phase15-label">
                    CHAPTER II
                </p>

                <h1>INSIDE</h1>

                <div className="phase15-line" />

                <p>
                    The house is completely silent.
                </p>

                <p>
                    The door closes behind you.
                </p>

                <p>
                    Then...
                </p>

                <button
                    type="button"
                    onClick={handleContinue}
                >
                    CONTINUE
                </button>
            </section>
        </main>
    );
}