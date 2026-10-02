import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

const Phase6HiddenNegative = () => {
  const { gamePhase, nextPhase } = useGame();
  const { playSound } = useSound();

  const [investigated, setInvestigated] = useState(false);

  const photographRef = useRef(null);
  const negativeRef = useRef(null);
  const darknessRef = useRef(null);
  const transitionRef = useRef(null);

  const transitioningRef = useRef(false);

  useEffect(() => {
    if (gamePhase !== 6) return;

    setInvestigated(false);
    transitioningRef.current = false;

    if (photographRef.current) {
      photographRef.current.style.opacity = "0";
      photographRef.current.style.transform =
        "translate(-50%, -50%) rotate(-3deg) scale(0.92)";
    }

    if (negativeRef.current) {
      negativeRef.current.style.opacity = "0";
      negativeRef.current.style.transform =
        "translate(-50%, -50%) rotateY(90deg) scale(0.92)";
    }

    if (darknessRef.current) {
      darknessRef.current.style.opacity = "0";
    }

    if (transitionRef.current) {
      transitionRef.current.style.opacity = "0";
    }
  }, [gamePhase]);

  const investigatePhotograph = () => {
    if (investigated || transitioningRef.current) return;

    setInvestigated(true);

    playSound("clue");

    if (photographRef.current) {
      photographRef.current.style.opacity = "1";
      photographRef.current.style.transform =
        "translate(-50%, -50%) rotate(-1deg) scale(1.08)";
    }

    setTimeout(() => {
      if (darknessRef.current) {
        darknessRef.current.style.opacity = "0.45";
      }
    }, 700);

    setTimeout(() => {
      if (photographRef.current) {
        photographRef.current.style.opacity = "0";
        photographRef.current.style.transform =
          "translate(-50%, -50%) rotate(-1deg) scale(1.08)";
      }

      if (negativeRef.current) {
        negativeRef.current.style.opacity = "1";
        negativeRef.current.style.transform =
          "translate(-50%, -50%) rotateY(0deg) scale(1.08)";
      }

      playSound("unlock");
    }, 1400);

    setTimeout(() => {
      if (negativeRef.current) {
        negativeRef.current.style.transform =
          "translate(-50%, -50%) rotateY(0deg) scale(1.18)";
      }
    }, 2400);

    setTimeout(() => {
      if (transitioningRef.current) return;

      transitioningRef.current = true;

      if (transitionRef.current) {
        transitionRef.current.style.opacity = "1";
      }
    }, 3100);

    setTimeout(() => {
      nextPhase();
    }, 4000);
  };

  if (gamePhase !== 6) {
    return null;
  }

  return (
    <div className="phase6-hidden-negative-screen">
      <div className="phase6-room">
        <img
          src="/images/bedroom(2).jpg"
          alt=""
          className="phase6-bedroom-image"
          draggable="false"
        />
      </div>

      <button
        type="button"
        className="phase6-photograph-hotspot"
        onClick={investigatePhotograph}
        aria-label="Investigate hidden photograph"
      />

      <div
        ref={photographRef}
        className="phase6-photograph"
      >
        <div className="phase6-photo-back">
          <div className="phase6-photo-surface">
            <div className="phase6-photo-stain stain-one" />
            <div className="phase6-photo-stain stain-two" />
            <div className="phase6-photo-stain stain-three" />

            <div className="phase6-note-lines">
              <span>YOU WERE HERE.</span>
              <span>YOU JUST DON'T REMEMBER.</span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={negativeRef}
        className="phase6-negative"
      >
        <div className="phase6-negative-paper">
          <div className="phase6-negative-image">
            <div className="phase6-negative-face" />

            <div className="phase6-negative-scratch scratch-one" />
            <div className="phase6-negative-scratch scratch-two" />
            <div className="phase6-negative-scratch scratch-three" />
          </div>

          <div className="phase6-hidden-writing">
            <span>LOOK AGAIN.</span>
            <span>THE ROOM REMEMBERS.</span>
          </div>
        </div>
      </div>

      <div
        ref={darknessRef}
        className="phase6-darkness"
      />

      <div
        ref={transitionRef}
        className="phase6-transition"
      />

      <div className="phase6-vignette" />
      <div className="phase6-grain" />
    </div>
  );
};

export default Phase6HiddenNegative;