import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase16Upstairs() {
    const sceneRef = useRef(null);
    const imageRef = useRef(null);
    const contentRef = useRef(null);
    const buttonRef = useRef(null);

    const [ready, setReady] = useState(false);

    const {
        gamePhase,
        nextPhase,
        setPuzzleMessage,
    } = useGame();

    const { playSound } = useSound();

    useEffect(() => {
        if (gamePhase !== 16) return;

        setReady(false);
        setPuzzleMessage("");

        const timeline = gsap.timeline({
            onComplete: () => {
                setReady(true);
            },
        });

        timeline
            .set(sceneRef.current, {
                opacity: 0,
            })
            .set(contentRef.current, {
                opacity: 0,
                y: 25,
            })
            .fromTo(
                sceneRef.current,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 1.5,
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

    // Upstairs footsteps
    useEffect(() => {
        if (gamePhase !== 16) return;

        const timer = setTimeout(() => {
            playSound("footstep-upstairs", 0.75);
        }, 2500);

        return () => {
            clearTimeout(timer);
        };
    }, [gamePhase, playSound]);

    const handleInvestigate = () => {
        if (!ready) return;

        setReady(false);

        playSound("click", 0.7);

        setPuzzleMessage(
            "SOMEONE IS UP HERE."
        );

        gsap.to(contentRef.current, {
            opacity: 0,
            y: -15,
            duration: 0.7,
            ease: "power2.in",
        });

        gsap.to(imageRef.current, {
            scale: 1.05,
            duration: 2,
            ease: "power2.inOut",
        });

        gsap.to(sceneRef.current, {
            opacity: 0,
            duration: 1.5,
            delay: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                setPuzzleMessage("");
                nextPhase();
            },
        });
    };

    if (gamePhase !== 16) {
        return null;
    }

    return (
        <main
            ref={sceneRef}
            className="phase16-scene"
        >
            <img
                ref={imageRef}
                className="phase16-image"
                src="/images/chapter2-inside.jpg"
                alt="Dark interior of the abandoned house"
                draggable="false"
            />

            <div className="phase16-darkness" />
            <div className="phase16-vignette" />
            <div className="phase16-grain" />

            <section
                ref={contentRef}
                className="phase16-content"
            >
                <p className="phase16-label">
                    CHAPTER II
                </p>

                <h1>UPSTAIRS</h1>

                <div className="phase16-line" />

                <p>
                    You slowly climb the stairs.
                </p>

                <p>
                    The house creaks around you.
                </p>

                <p>
                    Another footstep comes from the hallway.
                </p>

                <p className="phase16-final-line">
                    SOMEONE IS UP HERE.
                </p>

                <button
                    ref={buttonRef}
                    type="button"
                    onClick={handleInvestigate}
                    disabled={!ready}
                >
                    INVESTIGATE
                </button>
            </section>
        </main>
    );
}