import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Chapter2() {
    const sceneRef = useRef(null);
    const contentRef = useRef(null);

    const {
        gamePhase,
        nextPhase,
        setPuzzleMessage,
    } = useGame();

    const { playSound } = useSound();

    useEffect(() => {
        if (gamePhase !== 14) return;

        setPuzzleMessage("");

        const scene = sceneRef.current;
        const content = contentRef.current;

        if (!scene || !content) return;

        gsap.set(scene, {
            opacity: 0,
        });

        gsap.set(content, {
            opacity: 0,
            y: 25,
        });

        const timeline = gsap.timeline();

        timeline
            .to(scene, {
                opacity: 1,
                duration: 1.5,
                ease: "power2.out",
            })
            .to(
                content,
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                },
                "-=0.5"
            );

        return () => {
            timeline.kill();
        };
    }, [gamePhase, setPuzzleMessage]);

    // CHAPTER II - COLD AIR SOUND
    useEffect(() => {
        if (gamePhase !== 14) return;

        const timer = setTimeout(() => {
            playSound("cold-air", 0.35);
        }, 800);

        return () => clearTimeout(timer);
    }, [gamePhase, playSound]);

    const handleContinue = () => {
        playSound("click", 0.6);

        gsap.to(sceneRef.current, {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",

            onComplete: () => {
                nextPhase();
            },
        });
    };

    if (gamePhase !== 14) {
        return null;
    }

    return (
        <main
            ref={sceneRef}
            className="chapter2-scene"
        >
            <div className="chapter2-background">
                <img
                    src="/images/chapter2-house.jpg"
                    alt="The house"
                    className="chapter2-image"
                />
            </div>

            <div className="chapter2-vignette" />

            <div className="chapter2-grain" />

            <section
                ref={contentRef}
                className="chapter2-content"
            >
                <p className="chapter2-label">
                    CHAPTER II
                </p>

                <h1>
                    THE HOUSE
                </h1>

                <div className="chapter2-line" />

                <p className="chapter2-story">
                    The cold air touches your face.
                </p>

                <button
                    type="button"
                    className="chapter2-button"
                    onClick={handleContinue}
                >
                    CONTINUE
                </button>
            </section>
        </main>
    );
}