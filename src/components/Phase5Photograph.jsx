import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase5Photograph() {
  const { gamePhase, nextPhase, setCurrentScene } = useGame();
  const { playSound } = useSound();

  const sceneRef = useRef(null);
  const bedroomRef = useRef(null);
  const photographRef = useRef(null);
  const photographImageRef = useRef(null);
  const darknessRef = useRef(null);
  const disturbanceRef = useRef(null);

  const [opened, setOpened] = useState(false);

  const transitionRef = useRef(false);

  useEffect(() => {
    if (gamePhase !== 5) {
      return;
    }

    setOpened(false);
    transitionRef.current = false;

    const bedroom = bedroomRef.current;
    const photograph = photographRef.current;
    const photographImage = photographImageRef.current;
    const darkness = darknessRef.current;

    if (!bedroom || !photograph || !photographImage || !darkness) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set(bedroom, {
        scale: 1,
        x: 0,
        y: 0,
      });

      gsap.set(photograph, {
        scale: 1,
        x: 0,
        y: 0,
        opacity: 1,
      });

      gsap.set(photographImage, {
        scale: 1,
      });

      gsap.set(darkness, {
        opacity: 1,
      });

      gsap.to(darkness, {
        opacity: 0,
        duration: 1.8,
        ease: "power2.inOut",
      });
    }, sceneRef);

    return () => {
      context.revert();
    };
  }, [gamePhase]);

  const openPhotograph = () => {
    if (transitionRef.current || opened) {
      return;
    }

    transitionRef.current = true;
    setOpened(true);

    playSound("click", 0.45);

    const bedroom = bedroomRef.current;
    const photograph = photographRef.current;
    const photographImage = photographImageRef.current;
    const disturbance = disturbanceRef.current;
    const darkness = darknessRef.current;

    if (
      !bedroom ||
      !photograph ||
      !photographImage ||
      !disturbance ||
      !darkness
    ) {
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        setCurrentScene("recording");
        nextPhase();
      },
    });

    timeline
      .to(
        bedroom,
        {
          scale: 1.08,
          duration: 3.2,
          ease: "power3.inOut",
        }
      )
      .to(
        photograph,
        {
          scale: 7,
          duration: 3.8,
          ease: "power3.inOut",
        },
        "<0.2"
      )
      .to(
        photographImage,
        {
          scale: 1.05,
          duration: 3.8,
          ease: "power3.inOut",
        },
        "<"
      )
      .to(
        disturbance,
        {
          opacity: 0.65,
          duration: 0.08,
          ease: "none",
        }
      )
      .to(
        disturbance,
        {
          opacity: 0,
          duration: 0.12,
          ease: "none",
        }
      )
      .to(
        disturbance,
        {
          opacity: 0.35,
          duration: 0.08,
          ease: "none",
        }
      )
      .to(
        disturbance,
        {
          opacity: 0,
          duration: 0.2,
          ease: "none",
        }
      )
      .call(() => {
        playSound("unlock", 0.35);
      })
      .to(
        darkness,
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
        }
      );
  };

  if (gamePhase !== 5) {
    return null;
  }

  return (
    <main
      ref={sceneRef}
      className="phase5-photograph-screen"
    >
      <div
        ref={bedroomRef}
        className="phase5-bedroom"
      >
        <img
          className="phase5-bedroom-image"
          src="/images/bedroom.jpg"
          alt="The old bedroom"
          draggable="false"
        />

        <div
          ref={photographRef}
          className="phase5-photograph"
        >
          <img
            ref={photographImageRef}
            src="/images/phase5-photograph.jpg"
            alt="Old family photograph"
            draggable="false"
          />

          <button
            type="button"
            className="phase5-photograph-hotspot"
            aria-label="Investigate the photograph"
            onClick={openPhotograph}
            disabled={opened}
          />
        </div>
      </div>

      <div className="phase5-vignette" />

      <div className="phase5-grain" />

      <div
        ref={disturbanceRef}
        className="phase5-disturbance"
      />

      <div
        ref={darknessRef}
        className="phase5-darkness"
      />
    </main>
  );
}