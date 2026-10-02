import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase9Puzzle() {
  const roomRef = useRef(null);
  const mirrorRef = useRef(null);
  const reflectionRef = useRef(null);
  const messageRef = useRef(null);
  const darknessRef = useRef(null);
  const nextTimerRef = useRef(null);

  const [examined, setExamined] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  const { gamePhase, nextPhase, setPuzzleMessage } = useGame();
  const { playSound } = useSound();

  useEffect(() => {
    if (gamePhase !== 9) {
      return;
    }

    setExamined(false);
    setMessageVisible(false);
    setPuzzleMessage("");

    if (darknessRef.current) {
      gsap.set(darknessRef.current, {
        opacity: 1,
      });

      gsap.to(darknessRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
      });
    }

    if (roomRef.current) {
      gsap.fromTo(
        roomRef.current,
        {
          opacity: 0,
          scale: 1.03,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          delay: 0.4,
          ease: "power2.out",
        }
      );
    }

    return () => {
      if (nextTimerRef.current) {
        clearTimeout(nextTimerRef.current);
      }
    };
  }, [gamePhase, setPuzzleMessage]);

  const examineMirror = () => {
    if (examined) {
      return;
    }

    setExamined(true);

    playSound("click", 0.4);

    setPuzzleMessage("");

    if (mirrorRef.current) {
      gsap.to(mirrorRef.current, {
        x: 3,
        duration: 0.05,
        repeat: 9,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.set(mirrorRef.current, {
            x: 0,
          });
        },
      });
    }

    if (reflectionRef.current) {
      gsap.to(reflectionRef.current, {
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
        onComplete: () => {
          gsap.to(reflectionRef.current, {
            opacity: 1,
            duration: 0.8,
          });
        },
      });
    }

    setTimeout(() => {
      setMessageVisible(true);

      playSound("clue", 0.5);

      if (messageRef.current) {
        gsap.fromTo(
          messageRef.current,
          {
            opacity: 0,
            scale: 0.95,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          }
        );
      }
    }, 1200);

    nextTimerRef.current = setTimeout(() => {
      if (darknessRef.current) {
        gsap.to(darknessRef.current, {
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            nextPhase();
          },
        });
      } else {
        nextPhase();
      }
    }, 4500);
  };

  if (gamePhase !== 9) {
    return null;
  }

  return (
    <div className="phase9-screen">

      <div
        ref={roomRef}
        className="phase9-room"
      >

        <img
          src="/images/bedroom.jpg"
          alt=""
          className="phase9-bedroom"
        />

        <div
          ref={mirrorRef}
          className="phase9-mirror"
        >

          <div
            ref={reflectionRef}
            className="phase9-reflection"
          >
            {examined ? "..." : ""}
          </div>

          {messageVisible && (
            <div
              ref={messageRef}
              className="phase9-mirror-message"
            >
              YOU HAVE SEEN THIS BEFORE.
            </div>
          )}

        </div>

        {!examined && (
          <button
            type="button"
            className="phase9-mirror-hotspot"
            onClick={examineMirror}
            aria-label="Examine the mirror"
          />
        )}

      </div>

      <div className="phase9-vignette"></div>

      <div className="phase9-grain"></div>

      <div
        ref={darknessRef}
        className="phase9-darkness"
      ></div>

    </div>
  );
}