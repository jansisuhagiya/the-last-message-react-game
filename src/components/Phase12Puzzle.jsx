import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase12Puzzle() {
  const sceneRef = useRef(null);
  const darknessRef = useRef(null);
  const titleRef = useRef(null);
  const questionRef = useRef(null);
  const choicesRef = useRef(null);
  const messageRef = useRef(null);

  const timersRef = useRef([]);

  const [choice, setChoice] = useState(null);

  const {
    gamePhase,
    nextPhase,
    setPuzzleMessage,
    setFinalChoice,
  } = useGame();

  const { playSound } = useSound();

  useEffect(() => {
    if (gamePhase !== 12) {
      return;
    }

    setChoice(null);
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
        delay: 0.4,
        ease: "power2.out",
      });
    }

    const ambientTimer = setTimeout(() => {
      playSound("ambient", 0.18);
    }, 700);

    timersRef.current.push(ambientTimer);

    const titleTimer = setTimeout(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
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
    }, 1800);

    timersRef.current.push(titleTimer);

    const questionTimer = setTimeout(() => {
      if (questionRef.current) {
        gsap.fromTo(
          questionRef.current,
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
    }, 3200);

    timersRef.current.push(questionTimer);

    const choicesTimer = setTimeout(() => {
      if (choicesRef.current) {
        gsap.fromTo(
          choicesRef.current,
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
    }, 4700);

    timersRef.current.push(choicesTimer);

    return () => {
      timersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });

      timersRef.current = [];

      gsap.killTweensOf(sceneRef.current);
      gsap.killTweensOf(darknessRef.current);
      gsap.killTweensOf(titleRef.current);
      gsap.killTweensOf(questionRef.current);
      gsap.killTweensOf(choicesRef.current);
      gsap.killTweensOf(messageRef.current);
    };
  }, [gamePhase]);

  const makeChoice = (selectedChoice) => {
    if (choice) {
      return;
    }

    setChoice(selectedChoice);
    setFinalChoice(selectedChoice);

    playSound("click", 0.45);

    if (selectedChoice === "stay") {
      playSound("footstep", 0.3);
    } else {
      playSound("doorclose", 0.45);
    }

    if (choicesRef.current) {
      gsap.to(choicesRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.8,
        ease: "power2.out",
      });
    }

    setTimeout(() => {
      if (messageRef.current) {
        gsap.fromTo(
          messageRef.current,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.8,
            ease: "power2.out",
          }
        );
      }
    }, 500);

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
    }, 3500);

    timersRef.current.push(transitionTimer);
  };

  if (gamePhase !== 12) {
    return null;
  }

  return (
    <div className="phase12-screen">
      <div ref={sceneRef} className="phase12-scene">
        <div className="phase12-room"></div>

        <div ref={titleRef} className="phase12-title">
          THE FINAL CHOICE
        </div>

        <div ref={questionRef} className="phase12-question">
          <p>THE TRUTH IS FINALLY CLEAR.</p>
          <p>ONE DECISION REMAINS.</p>
        </div>

        {!choice && (
          <div ref={choicesRef} className="phase12-choices">
            <button
              type="button"
              onClick={() => makeChoice("stay")}
              className="phase12-choice"
            >
              <span>STAY</span>
              <small>FACE WHAT IS WAITING</small>
            </button>

            <button
              type="button"
              onClick={() => makeChoice("leave")}
              className="phase12-choice"
            >
              <span>LEAVE</span>
              <small>WALK AWAY FROM THE HOUSE</small>
            </button>
          </div>
        )}

        {choice === "stay" && (
          <div ref={messageRef} className="phase12-message">
            <span>YOUR DECISION</span>
            <p>YOU CHOOSE TO STAY.</p>
            <small>THE ROOM REMEMBERS YOU.</small>
          </div>
        )}

        {choice === "leave" && (
          <div ref={messageRef} className="phase12-message">
            <span>YOUR DECISION</span>
            <p>YOU CHOOSE TO LEAVE.</p>
            <small>BUT SOMETHING IS COMING WITH YOU.</small>
          </div>
        )}
      </div>

      <div className="phase12-vignette"></div>

      <div className="phase12-grain"></div>

      <div
        ref={darknessRef}
        className="phase12-darkness"
      ></div>
    </div>
  );
}