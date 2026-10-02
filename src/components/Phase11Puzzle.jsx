import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase11Puzzle() {
  const sceneRef = useRef(null);
  const darknessRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const memoryRef = useRef(null);

  const timersRef = useRef([]);

  const [memoryVisible, setMemoryVisible] = useState(false);

  const { gamePhase, nextPhase, setPuzzleMessage } = useGame();
  const { playSound } = useSound();

  useEffect(() => {
    if (gamePhase !== 11) {
      return;
    }

    setMemoryVisible(false);
    setPuzzleMessage("");

    timersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });

    timersRef.current = [];

    if (darknessRef.current) {
      gsap.set(darknessRef.current, {
        opacity: 1,
      });

      gsap.to(darknessRef.current, {
        opacity: 0,
        duration: 2.5,
        ease: "power2.inOut",
      });
    }

    if (sceneRef.current) {
      gsap.set(sceneRef.current, {
        opacity: 0,
        scale: 1.04,
      });

      gsap.to(sceneRef.current, {
        opacity: 1,
        scale: 1,
        duration: 3,
        delay: 0.5,
        ease: "power2.out",
      });
    }

    const ambientTimer = setTimeout(() => {
      playSound("ambient", 0.2);
    }, 800);

    timersRef.current.push(ambientTimer);

    const titleTimer = setTimeout(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 2,
            ease: "power2.out",
          }
        );
      }
    }, 1800);

    timersRef.current.push(titleTimer);

    const footstepTimer = setTimeout(() => {
      playSound("footstep", 0.35);
    }, 3500);

    timersRef.current.push(footstepTimer);

    const textTimer = setTimeout(() => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 2,
            ease: "power2.out",
          }
        );
      }
    }, 4200);

    timersRef.current.push(textTimer);

    const memoryTimer = setTimeout(() => {
      setMemoryVisible(true);

      playSound("clue", 0.45);

      if (memoryRef.current) {
        gsap.fromTo(
          memoryRef.current,
          {
            opacity: 0,
            scale: 0.96,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 2,
            ease: "power2.out",
          }
        );
      }
    }, 7000);

    timersRef.current.push(memoryTimer);

    const endingSoundTimer = setTimeout(() => {
      playSound("complete", 0.35);
    }, 10000);

    timersRef.current.push(endingSoundTimer);

    const transitionTimer = setTimeout(() => {
      if (darknessRef.current) {
        gsap.to(darknessRef.current, {
          opacity: 1,
          duration: 2.5,
          ease: "power2.inOut",
          onComplete: () => {
            nextPhase();
          },
        });
      } else {
        nextPhase();
      }
    }, 11500);

    timersRef.current.push(transitionTimer);

    return () => {
      timersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });

      timersRef.current = [];

      gsap.killTweensOf(sceneRef.current);
      gsap.killTweensOf(darknessRef.current);
      gsap.killTweensOf(titleRef.current);
      gsap.killTweensOf(textRef.current);
      gsap.killTweensOf(memoryRef.current);
    };
  }, [gamePhase]);

  if (gamePhase !== 11) {
    return null;
  }

  return (
    <div className="phase11-screen">
      <div ref={sceneRef} className="phase11-scene">
        <div className="phase11-room"></div>

        <div ref={titleRef} className="phase11-title">
          THE TRUTH
        </div>

        <div ref={textRef} className="phase11-story">
          <p>YOU REMEMBER NOW.</p>
          <p>THE ROOM WAS NEVER EMPTY.</p>
        </div>

        {memoryVisible && (
          <div ref={memoryRef} className="phase11-memory">
            <p>YOU DID NOT COME HERE BY ACCIDENT.</p>
            <strong>YOU CAME BACK.</strong>
          </div>
        )}
      </div>

      <div className="phase11-vignette"></div>

      <div className="phase11-grain"></div>

      <div
        ref={darknessRef}
        className="phase11-darkness"
      ></div>
    </div>
  );
}