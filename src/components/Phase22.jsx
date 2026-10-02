import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase22() {
  const { endGame, restartGame } = useGame();
  const { playSound } = useSound();

  const [stage, setStage] = useState(0);
  const [blackout, setBlackout] = useState(false);
  const [showRestart, setShowRestart] = useState(false);

  const gameEndedRef = useRef(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage(1);
      playSound("ambient", 0.25);
    }, 1200);

    const timer2 = setTimeout(() => {
      setStage(2);
      playSound("tick", 0.4);
    }, 4300);

    const timer3 = setTimeout(() => {
      setStage(3);
      playSound("click", 0.3);
    }, 7000);

    const timer4 = setTimeout(() => {
      setBlackout(true);
    }, 10500);

    const timer5 = setTimeout(() => {
      if (!gameEndedRef.current) {
        gameEndedRef.current = true;
        endGame();
      }
    }, 12500);

    const timer6 = setTimeout(() => {
      setShowRestart(true);
    }, 14000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [playSound, endGame]);

  const handleRestart = async () => {
    await restartGame();
  };

  return (
    <main className="phase22">
      <div className="phase22-scene">

        <img
          className={`phase22-image ${
            stage >= 1 ? "phase22-image-visible" : ""
          }`}
          src="/images/phase22-ending.jpg"
          alt=""
          draggable="false"
        />

        <div className="phase22-darkness" />

        <div className="phase22-vignette" />

        <img
          className="phase22-noise"
          src="/images/noise.png"
          alt=""
          draggable="false"
        />

        <div
          className={`phase22-message ${
            stage >= 2 ? "phase22-message-visible" : ""
          }`}
        >
          <span>
            YOU WERE NEVER THE ONE BEING FOLLOWED.
          </span>
        </div>

        <div
          className={`phase22-last-message ${
            stage >= 3
              ? "phase22-last-message-visible"
              : ""
          }`}
        >
          <span>
            THE HOUSE WAS FOLLOWING YOU.
          </span>
        </div>

        <div
          className={`phase22-end ${
            blackout
              ? "phase22-end-visible"
              : ""
          }`}
        >
          <span>THE END</span>
        </div>

        <div
          className={`phase22-blackout ${
            blackout
              ? "phase22-blackout-active"
              : ""
          }`}
        />

        {showRestart && (
          <button
            className="phase22-restart"
            onClick={handleRestart}
          >
            RESTART
          </button>
        )}

      </div>
    </main>
  );
}