import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Chapter2() {
    const sceneRef = useRef(null);
    const imageRef = useRef(null);
    const titleRef = useRef(null);
    const storyRef = useRef(null);
    const doorRef = useRef(null);
    const fogRef = useRef(null);

    const [started, setStarted] = useState(false);
    const [doorOpened, setDoorOpened] = useState(false);

    const {
        gamePhase,
        nextPhase,
        setPuzzleMessage,
    } = useGame();

    const { playSound } = useSound();

    useEffect(() => {
        if (gamePhase !== 14) return;

        setStarted(false);
        setDoorOpened(false);
        setPuzzleMessage("");

        // Play Chapter 2 atmosphere
        playSound("cold-air", 0.5);

        // Make sure everything starts hidden
        gsap.set(sceneRef.current, {
            opacity: 1,
        });

        gsap.set(titleRef.current, {
            opacity: 0,
            y: 25,
        });

        gsap.set(storyRef.current, {
            opacity: 0,
            y: 20,
        });

        const timeline = gsap.timeline({
            onComplete: () => {
                setStarted(true);
            },
        });

        timeline
            // Scene
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

            // Background
            .fromTo(
                imageRef.current,
                {
                    scale: 1.08,
                },
                {
                    scale: 1,
                    duration: 7,
                    ease: "power2.out",
                },
                "-=1"
            )

            // Title
            .to(
                titleRef.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.8,
                    ease: "power3.out",
                },
                "-=4.5"
            )

            // Story
            .to(
                storyRef.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.8,
                    ease: "power2.out",
                },
                "-=1"
            );

        // Fog animation
        if (fogRef.current) {
            gsap.to(fogRef.current, {
                x: 120,
                duration: 12,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }

        return () => {
            timeline.kill();

            if (fogRef.current) {
                gsap.killTweensOf(fogRef.current);
            }
        };
    }, [gamePhase, playSound, setPuzzleMessage]);

    // Door click
    const handleDoorClick = () => {
        if (!started || doorOpened) return;

        setDoorOpened(true);

        playSound("click", 0.7);

        setPuzzleMessage(
            "THE DOOR WAS ALREADY UNLOCKED."
        );

        gsap.to(doorRef.current, {
            rotationY: -70,
            transformOrigin: "left center",
            duration: 1.8,
            ease: "power3.inOut",
        });

        gsap.to(imageRef.current, {
            scale: 1.06,
            duration: 3,
            ease: "power2.inOut",
        });

        gsap.to(sceneRef.current, {
            opacity: 0,
            duration: 1.5,
            delay: 2.2,
            ease: "power2.inOut",
            onComplete: () => {
                setPuzzleMessage("");
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
            {/* Background */}
            <div
                ref={imageRef}
                className="chapter2-image"
            />

            {/* Fog */}
            <div
                ref={fogRef}
                className="chapter2-fog"
            />

            {/* Darkness */}
            <div className="chapter2-vignette" />

            <div className="chapter2-color" />

            {/* Film grain */}
            <div className="chapter2-grain" />

            {/* TITLE */}
            <section
                ref={titleRef}
                className="chapter2-title"
            >
                <p>CHAPTER II</p>

                <h1>THE HOUSE</h1>

                <div className="chapter2-line" />
            </section>

            {/* STORY */}
            <section
                ref={storyRef}
                className="chapter2-story"
            >
                <p>You step outside.</p>

                <p>
                    The night is colder than before.
                </p>

                <p>
                    Across the road, the house waits in silence.
                </p>

                <p className="chapter2-final-line">
                    THE PLACE YOU WERE NEVER MEANT TO FIND.
                </p>
            </section>

            {/* DOOR */}
            <button
                ref={doorRef}
                className={`chapter2-door ${
                    doorOpened ? "door-opened" : ""
                }`}
                onClick={handleDoorClick}
                disabled={!started || doorOpened}
                aria-label="Open the house door"
            >
                <span>
                    {doorOpened ? "OPENING" : "ENTER"}
                </span>
            </button>
        </main>
    );
}