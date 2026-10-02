import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function EndingScreen() {
    const endingRef = useRef(null);
    const buttonRef = useRef(null);

    const {
        gamePhase,
        finalChoice,
        goToPhase,
        setPuzzleMessage,
        startGame,
    } = useGame();

    const { playSound, unlockAudio } = useSound();

    useEffect(() => {
        if (gamePhase !== 13) {
            return;
        }

        const stayed = finalChoice === "stay";

        if (stayed) {
            setPuzzleMessage("THE ROOM KEEPS YOU.");
        } else {
            setPuzzleMessage("YOU ESCAPED.");
        }

        playSound("complete", 0.5);

        if (endingRef.current) {
            gsap.fromTo(
                endingRef.current,
                {
                    opacity: 0,
                    scale: 1.03,
                    filter: "blur(8px)",
                },
                {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 2.5,
                    ease: "power2.out",
                }
            );
        }

        if (!stayed && buttonRef.current) {
            gsap.fromTo(
                buttonRef.current,
                {
                    opacity: 0,
                    y: 20,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    delay: 2,
                    ease: "power3.out",
                }
            );
        }

        if (stayed) {
            const timer = setTimeout(() => {
                setPuzzleMessage("");
                goToPhase(14);
            }, 7000);

            return () => {
                clearTimeout(timer);
            };
        }

        return undefined;
    }, [
        gamePhase,
        finalChoice,
        goToPhase,
        setPuzzleMessage,
        playSound,
    ]);

    const handleRestart = () => {
        unlockAudio();
        playSound("click", 0.5);

        if (endingRef.current) {
            gsap.to(endingRef.current, {
                opacity: 0,
                scale: 1.05,
                filter: "blur(12px)",
                duration: 1.2,
                ease: "power3.inOut",
                onComplete: () => {
                    setPuzzleMessage("");
                    startGame();
                },
            });
        } else {
            setPuzzleMessage("");
            startGame();
        }
    };

    if (gamePhase !== 13) {
        return null;
    }

    const stayed = finalChoice === "stay";

    return (
        <div
            className={
                stayed
                    ? "ending-screen ending-stay"
                    : "ending-screen ending-leave"
            }
        >
            <div className="ending-background" />

            <div className="ending-vignette" />

            <div
                ref={endingRef}
                className="ending-content"
            >
                <p className="ending-label">
                    CHAPTER I
                </p>

                {stayed ? (
                    <>
                        <h1>
                            YOU STAYED.
                        </h1>

                        <div className="ending-line" />

                        <p className="ending-main">
                            THE ROOM WAS WAITING FOR YOU.
                        </p>

                        <p className="ending-sub">
                            NOW IT DOES NOT HAVE TO WAIT ANYMORE.
                        </p>

                        <div className="ending-divider" />

                        <p className="ending-final">
                            YOU ARE HOME.
                        </p>
                    </>
                ) : (
                    <>
                        <h1>
                            YOU LEFT.
                        </h1>

                        <div className="ending-line" />

                        <p className="ending-sub">
                            BUT THE FOOTSTEPS DID NOT STOP.
                        </p>

                        <div className="ending-divider" />

                        <p className="ending-final">
                            YOU ESCAPED.
                        </p>

                        <p className="ending-next">
                            SOMETHING ESCAPED WITH YOU.
                        </p>

                        <button
                            ref={buttonRef}
                            className="ending-restart"
                            onClick={handleRestart}
                        >
                            <span>
                                RESTART THE INVESTIGATION
                            </span>

                            <span className="ending-restart-arrow">
                                →
                            </span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}