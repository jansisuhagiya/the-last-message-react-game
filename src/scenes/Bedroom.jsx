import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Bedroom() {
  const sceneRef = useRef(null);
  const roomRef = useRef(null);
  const darknessRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const [investigating, setInvestigating] = useState(false);
  const [cluesFound, setCluesFound] = useState([]);

  const {
    gamePhase,
    nextPhase,
    setCurrentScene,
    collectClue,
  } = useGame();

  const { playSound } = useSound();

  const isPhase3 = gamePhase === 3;

  useEffect(() => {
    const scene = sceneRef.current;
    const room = roomRef.current;
    const darkness = darknessRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    if (!scene || !room || !darkness) return;

    const ctx = gsap.context(() => {
      gsap.set(scene, {
        opacity: 1,
      });

      gsap.set(room, {
        scale: isPhase3 ? 1 : 1.06,
        x: 0,
        y: 0,
      });

      gsap.set(darkness, {
        opacity: 0,
      });

      gsap.set(title, {
        opacity: 0,
        y: 20,
      });

      gsap.set(subtitle, {
        opacity: 0,
        y: 12,
      });

      const timeline = gsap.timeline();

      if (!isPhase3) {
        gsap.set(darkness, {
          opacity: 1,
        });

        timeline
          .to(darkness, {
            opacity: 0,
            duration: 2,
            ease: "power2.inOut",
          })
          .to(
            room,
            {
              scale: 1,
              duration: 2.5,
              ease: "power2.out",
            },
            "-=1.6"
          );
      } else {
        timeline
          .to(room, {
            scale: 1.02,
            duration: 2,
            ease: "power2.out",
          });
      }

      timeline
        .to(
          title,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .to(
          subtitle,
          {
            opacity: 0.7,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        );

      const handleMouseMove = (event) => {
        const x =
          event.clientX / window.innerWidth - 0.5;

        const y =
          event.clientY / window.innerHeight - 0.5;

        gsap.to(room, {
          x: x * -12,
          y: y * -7,
          duration: 1.2,
          ease: "power2.out",
          overwrite: true,
        });
      };

      window.addEventListener(
        "mousemove",
        handleMouseMove
      );

      return () => {
        window.removeEventListener(
          "mousemove",
          handleMouseMove
        );
      };
    }, sceneRef);

    return () => {
      ctx.revert();
    };
  }, [isPhase3]);

  const enterPhase3 = () => {
    if (investigating) return;

    setInvestigating(true);

    playSound("click", 0.4);

    const room = roomRef.current;
    const darkness = darknessRef.current;

    gsap
      .timeline({
        onComplete: () => {
          setCurrentScene("strange-clues");
          nextPhase();
        },
      })
      .to(room, {
        scale: 1.1,
        duration: 1.5,
        ease: "power3.inOut",
      })
      .to(darkness, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
      });
  };

  const investigateClue = (clue) => {
    if (cluesFound.includes(clue.id)) {
      return;
    }

    playSound("clue", 0.5);

    setCluesFound((previous) => [
      ...previous,
      clue.id,
    ]);

    collectClue(clue);

    const room = roomRef.current;

    gsap.fromTo(
      room,
      {
        x: -4,
      },
      {
        x: 4,
        duration: 0.12,
        repeat: 3,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.to(room, {
            x: 0,
            duration: 0.4,
            ease: "power2.out",
          });
        },
      }
    );
  };

  useEffect(() => {
    if (!isPhase3) return;

    if (cluesFound.length !== 3) return;

    const timer = setTimeout(() => {
      const room = roomRef.current;
      const darkness = darknessRef.current;

      playSound("click", 0.45);

      gsap
        .timeline({
          onComplete: () => {
            setCurrentScene("clock");
            nextPhase();
          },
        })
        .to(room, {
          scale: 1.08,
          duration: 1.8,
          ease: "power3.inOut",
        })
        .to(
          darkness,
          {
            opacity: 1,
            duration: 1.5,
            ease: "power2.inOut",
          },
          "-=0.8"
        );
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    cluesFound,
    isPhase3,
    nextPhase,
    playSound,
    setCurrentScene,
  ]);

  return (
    <main
      ref={sceneRef}
      className={`bedroom-screen ${
        isPhase3 ? "phase-three" : "phase-two"
      }`}
    >
      <div
        ref={roomRef}
        className="bedroom-room"
      />

      <div className="bedroom-vignette" />

      <div className="bedroom-grain" />

      <div
        ref={darknessRef}
        className="bedroom-darkness"
      />

      <section className="bedroom-title">
        <p
          ref={titleRef}
          className="bedroom-chapter"
        >
          {isPhase3 ? "SOMETHING IS WRONG" : "CHAPTER I"}
        </p>

        <h1 className="bedroom-heading">
          {isPhase3
            ? "STRANGE CLUES"
            : "THE BEDROOM"}
        </h1>

        <p
          ref={subtitleRef}
          className="bedroom-subtitle"
        >
          {isPhase3
            ? "Three things should not be here."
            : "Nothing here feels untouched."}
        </p>
      </section>

      {!isPhase3 && (
        <button
          type="button"
          className="bedroom-hotspot bedroom-desk-hotspot"
          aria-label="Investigate the desk"
          onClick={enterPhase3}
          disabled={investigating}
        />
      )}

      {isPhase3 && (
        <>
          <button
            type="button"
            className={`bedroom-hotspot clue-hotspot clue-photo ${
              cluesFound.includes("photograph")
                ? "clue-found"
                : ""
            }`}
            aria-label="Investigate the photograph"
            onClick={() =>
              investigateClue({
                id: "photograph",
                name: "Old Photograph",
                description:
                  "A photograph of the house. Someone has been scratched out.",
              })
            }
          />

          <button
            type="button"
            className={`bedroom-hotspot clue-hotspot clue-radio ${
              cluesFound.includes("radio")
                ? "clue-found"
                : ""
            }`}
            aria-label="Investigate the radio"
            onClick={() =>
              investigateClue({
                id: "radio",
                name: "Old Radio",
                description:
                  "The radio is unplugged, but something inside it is still warm.",
              })
            }
          />

          <button
            type="button"
            className={`bedroom-hotspot clue-hotspot clue-note ${
              cluesFound.includes("desk-note")
                ? "clue-found"
                : ""
            }`}
            aria-label="Investigate the strange mark on the desk"
            onClick={() =>
              investigateClue({
                id: "desk-note",
                name: "Strange Mark",
                description:
                  "A message has been carved into the desk. The words are almost impossible to read.",
              })
            }
          />
        </>
      )}
    </main>
  );
}