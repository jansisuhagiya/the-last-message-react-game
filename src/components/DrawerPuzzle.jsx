import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

const CORRECT_CODE = "1987";

export default function DrawerPuzzle({
  onClose,
}) {
  const panelRef = useRef(null);
  const letterRef = useRef(null);

  const {
    unlockDrawer,
  } = useGame();

  const {
    playSound,
  } = useSound();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] =
    useState(false);

  /* ========================================
     PUZZLE ENTRANCE
  ======================================== */

  useEffect(() => {
    if (!panelRef.current) return;

    gsap.fromTo(
      panelRef.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.92,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
      }
    );
  }, []);

  /* ========================================
     LETTER ENTRANCE
  ======================================== */

  useEffect(() => {
    if (!unlocked || !letterRef.current) {
      return;
    }

    gsap.fromTo(
      letterRef.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.94,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.8,
        delay: 0.3,
        ease: "power3.out",
      }
    );
  }, [unlocked]);

  /* ========================================
     NUMBER INPUT
  ======================================== */

  const enterNumber = (number) => {
    if (code.length >= 4) return;

    setError("");

    playSound("click", 0.3);

    setCode(
      (previous) =>
        previous + number
    );
  };

  /* ========================================
     DELETE NUMBER
  ======================================== */

  const deleteNumber = () => {
    playSound("click", 0.25);

    setCode(
      (previous) =>
        previous.slice(0, -1)
    );

    setError("");
  };

  /* ========================================
     CAMERA SHAKE
  ======================================== */

  const cameraShake = () => {
    const scene =
      document.querySelector(
        ".cinematic-room"
      );

    if (!scene) return;

    gsap.timeline()
      .to(scene, {
        x: -5,
        duration: 0.06,
      })
      .to(scene, {
        x: 5,
        duration: 0.06,
      })
      .to(scene, {
        x: -3,
        duration: 0.05,
      })
      .to(scene, {
        x: 3,
        duration: 0.05,
      })
      .to(scene, {
        x: 0,
        duration: 0.15,
      });
  };

  /* ========================================
     CHECK PASSWORD
  ======================================== */

  const submitCode = () => {
    if (code.length !== 4) {
      setError("ENTER FOUR NUMBERS");
      return;
    }

    if (code !== CORRECT_CODE) {
      setError("INCORRECT CODE");

      setCode("");

      playSound("click", 0.45);

      gsap.fromTo(
        panelRef.current,
        {
          x: -8,
        },
        {
          x: 8,
          duration: 0.08,
          repeat: 5,
          yoyo: true,
          ease: "power1.inOut",
        }
      );

      return;
    }

    /* ======================================
       SUCCESS
    ====================================== */

    setError("");

    playSound("unlock", 0.75);

    cameraShake();

    // Tell game state drawer is unlocked
    unlockDrawer();

    // Give player time to feel the unlock
    gsap.to(panelRef.current, {
      scale: 1.03,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        setTimeout(() => {
          setUnlocked(true);
        }, 900);
      },
    });
  };

  /* ========================================
     UNLOCKED LETTER
  ======================================== */

  if (unlocked) {
    return (
      <div className="puzzle-overlay">
        <div
          ref={letterRef}
          className="letter-card"
        >
          <p className="letter-label">
            OBJECT UNLOCKED
          </p>

          <h2>
            THE DRAWER
          </h2>

          <div className="mystery-letter">
            <span>
              FOUND INSIDE
            </span>

            <h3>
              A MYSTERIOUS LETTER
            </h3>

            <p>
              Someone knew you were
              coming.
            </p>

            <p>
              The final line reads:
            </p>

            <blockquote>
              "You should have stayed
              away."
            </blockquote>
          </div>

          <button
            onClick={() => {
              playSound("click", 0.3);
              onClose();
            }}
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  /* ========================================
     PUZZLE
  ======================================== */

  return (
    <div className="puzzle-overlay">
      <div
        ref={panelRef}
        className="drawer-puzzle"
      >
        <p className="puzzle-eyebrow">
          SECURITY LOCK
        </p>

        <h2>
          THE LOCKED DRAWER
        </h2>

        <p className="puzzle-description">
          Four numbers.
          <br />
          There must be a reason
          for them.
        </p>

        {/* CODE DISPLAY */}

        <div className="code-display">
          {[0, 1, 2, 3].map(
            (index) => (
              <span
                key={index}
                className={
                  index < code.length
                    ? "filled"
                    : ""
                }
              >
                {index < code.length
                  ? "•"
                  : "—"}
              </span>
            )
          )}
        </div>

        {/* ERROR */}

        {error && (
          <p className="puzzle-error">
            {error}
          </p>
        )}

        {/* NUMBER PAD */}

        <div className="number-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
            (number) => (
              <button
                key={number}
                onClick={() =>
                  enterNumber(
                    String(number)
                  )
                }
              >
                {number}
              </button>
            )
          )}

          <button
            onClick={deleteNumber}
          >
            ←
          </button>

          <button
            onClick={() =>
              enterNumber("0")
            }
          >
            0
          </button>

          <button
            onClick={submitCode}
          >
            ✓
          </button>
        </div>

        <p className="puzzle-hint">
          The room may contain
          the answer.
        </p>
      </div>
    </div>
  );
}