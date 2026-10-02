import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase20() {
  const { nextPhase } = useGame();
  const { playSound } = useSound();

  const [step, setStep] = useState(0);
  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);
  const [flash, setFlash] = useState(false);
  const [finished, setFinished] = useState(false);

  // --------------------------------
  // MOUSE CAMERA MOVEMENT
  // --------------------------------

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      setCameraX(x * -35);
      setCameraY(y * -25);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // --------------------------------
  // SMALL VISUAL FLICKER
  // --------------------------------

  const visualFeedback = () => {
    setFlash(true);

    setTimeout(() => {
      setFlash(false);
    }, 180);
  };

  // --------------------------------
  // INVESTIGATE
  // --------------------------------

  const investigate = (number) => {
    if (number !== step + 1) {
      return;
    }

    playSound("click", 0.55);

    visualFeedback();

    setStep(number);

    // Small boy
    if (number === 1) {
      setCameraX(-55);
      setCameraY(20);
      return;
    }

    // Large boy
    if (number === 2) {
      setCameraX(-25);
      setCameraY(-35);
      return;
    }

    // Girl
    if (number === 3) {
      setCameraX(35);
      setCameraY(-50);
      return;
    }

    // Empty frame
    if (number === 4) {
      setCameraX(65);
      setCameraY(-55);

      setTimeout(() => {
        playSound("tick", 0.6);
        setFinished(true);
      }, 1200);

      setTimeout(() => {
        nextPhase();
      }, 2800);
    }
  };

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* --------------------------------
          HALLWAY
      -------------------------------- */}

      <img
        src="/images/phase20-hallway1.jpg"
        alt=""
        draggable="false"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "calc(100% + 100px)",
          height: "calc(100% + 70px)",
          maxWidth: "none",
          objectFit: "cover",
          transform: `
            translate(-50%, -50%)
            translate(${cameraX}px, ${cameraY}px)
          `,
          transition:
            "transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* --------------------------------
          VIGNETTE
      -------------------------------- */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 5,
          background:
            "radial-gradient(circle, transparent 42%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* --------------------------------
          FILM GRAIN
      -------------------------------- */}

      <img
        src="/images/noise.png"
        alt=""
        draggable="false"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.08,
          pointerEvents: "none",
          zIndex: 6,
        }}
      />

      {/* --------------------------------
          SMALL CLICK FLASH
      -------------------------------- */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          opacity: flash ? 0.12 : 0,
          pointerEvents: "none",
          zIndex: 30,
          transition: "opacity 0.08s ease",
        }}
      />

      {/* --------------------------------
          FINAL DARKNESS
      -------------------------------- */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: finished ? 1 : 0,
          pointerEvents: "none",
          zIndex: 40,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* --------------------------------
          SMALL BOY
      -------------------------------- */}

      {step === 0 && (
        <button
          type="button"
          aria-label="Investigate small boy portrait"
          onClick={() => investigate(1)}
          style={{
            position: "absolute",
            left: "39%",
            top: "28%",
            width: "10%",
            height: "25%",
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            zIndex: 20,
          }}
        />
      )}

      {/* --------------------------------
          LARGE BOY
      -------------------------------- */}

      {step === 1 && (
        <button
          type="button"
          aria-label="Investigate second boy portrait"
          onClick={() => investigate(2)}
          style={{
            position: "absolute",
            left: "43%",
            top: "12%",
            width: "12%",
            height: "30%",
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            zIndex: 20,
          }}
        />
      )}

      {/* --------------------------------
          GIRL
      -------------------------------- */}

      {step === 2 && (
        <button
          type="button"
          aria-label="Investigate girl portrait"
          onClick={() => investigate(3)}
          style={{
            position: "absolute",
            left: "55%",
            top: "2%",
            width: "13%",
            height: "27%",
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            zIndex: 20,
          }}
        />
      )}

      {/* --------------------------------
          EMPTY FRAME
      -------------------------------- */}

      {step === 3 && (
        <button
          type="button"
          aria-label="Investigate empty frame"
          onClick={() => investigate(4)}
          style={{
            position: "absolute",
            left: "71%",
            top: "2%",
            width: "15%",
            height: "28%",
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            zIndex: 20,
          }}
        />
      )}
    </main>
  );
}