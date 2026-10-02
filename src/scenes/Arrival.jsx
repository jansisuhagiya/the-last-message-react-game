import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Arrival() {
  const sceneRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const messageRef = useRef(null);
  const hintRef = useRef(null);

  const { setCurrentScene, setGamePhase } = useGame();
  const { playSound } = useSound();

  useEffect(() => {
    const scene = sceneRef.current;
    const content = contentRef.current;
    const title = titleRef.current;
    const message = messageRef.current;
    const hint = hintRef.current;

    if (!scene) return;

    const ctx = gsap.context(() => {
      gsap.set(scene, {
        opacity: 1,
        scale: 1,
      });

      gsap.set(content, {
        opacity: 0,
        y: 25,
      });

      gsap.set(title, {
        opacity: 0,
        y: 20,
      });

      gsap.set(message, {
        opacity: 0,
        y: 15,
      });

      gsap.set(hint, {
        opacity: 0,
      });

      const timeline = gsap.timeline();

      timeline
        .to(content, {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
        })
        .to(
          title,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .to(
          message,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          hint,
          {
            opacity: 0.65,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }, sceneRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const enterBedroom = () => {
    playSound("click", 0.4);

    gsap.to(sceneRef.current, {
      opacity: 0,
      scale: 1.04,
      duration: 1.5,
      ease: "power3.inOut",

      onComplete: () => {
        setGamePhase(2);
        setCurrentScene("bedroom");
      },
    });
  };

  return (
    <main
      ref={sceneRef}
      className="arrival-screen chapter1-scene"
    >
      <div className="arrival-background" />

      <div className="arrival-vignette" />

      <div className="arrival-grain" />

      <section
        ref={contentRef}
        className="arrival-content"
      >
        <p className="arrival-label">
          A CINEMATIC MYSTERY
        </p>

        <h1 ref={titleRef}>
          THE LAST MESSAGE
        </h1>

        <p
          ref={messageRef}
          className="arrival-message"
        >
          Welcome.
          <br />
          Some messages are never meant to be found.
        </p>

        <p
          ref={hintRef}
          className="arrival-hint"
        >
          ENTER THE STORY
        </p>
      </section>

      <button
        type="button"
        className="cinematic-hotspot arrival-hotspot"
        aria-label="Enter the story"
        onClick={enterBedroom}
      />
    </main>
  );
}