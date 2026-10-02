import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";


export default function Phase21() {
  const { nextPhase } = useGame();
  const { playSound } = useSound();

  const [step, setStep] = useState(0);
  const [camera, setCamera] = useState(false);
  const [darkness, setDarkness] = useState(false);
  const [frameMoving, setFrameMoving] = useState(false);

  // Subtle mouse-controlled camera movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      document.documentElement.style.setProperty(
        "--mouse-x",
        `${x * -18}px`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${y * -12}px`
      );
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const investigate = (number) => {
    if (number !== step + 1) return;

    playSound("click", 0.55);

    if (number === 1) {
      setStep(1);
      setCamera(true);
      setFrameMoving(true);

      setTimeout(() => {
        playSound("tick", 0.35);
      }, 850);

      return;
    }

    if (number === 2) {
      setStep(2);

      playSound("ambient", 0.25);

      setTimeout(() => {
        playSound("tick", 0.45);
      }, 900);

      setTimeout(() => {
        setDarkness(true);
      }, 1400);

      setTimeout(() => {
        nextPhase();
      }, 3000);
    }
  };

  return (
    <main className={`phase21 ${camera ? "camera-pushed" : ""}`}>
      <div className="phase21-scene">
        <img
          className="phase21-background"
          src="/images/phase21-room.jpg"
          alt=""
          draggable="false"
        />

        <div className="phase21-mouse-layer" />

        <div className="phase21-vignette" />

        <img
          className="phase21-noise"
          src="/images/noise.png"
          alt=""
          draggable="false"
        />

        {/* STEP 1
            Click the large empty frame */}
        {step === 0 && (
          <button
            className="phase21-hotspot phase21-frame-hotspot"
            aria-label="Investigate the empty frame"
            onClick={() => investigate(1)}
          />
        )}

        {/* STEP 2
            After the frame moves, investigate the dark opening */}
        {step === 1 && (
          <button
            className="phase21-hotspot phase21-opening-hotspot"
            aria-label="Investigate the opening"
            onClick={() => investigate(2)}
          />
        )}

        {/* Visual frame movement */}
        <div
          className={`phase21-frame-effect ${
            frameMoving ? "frame-open" : ""
          }`}
        />

        {/* Final darkness */}
        <div
          className={`phase21-darkness ${
            darkness ? "darkness-active" : ""
          }`}
        />
      </div>
    </main>
  );
}