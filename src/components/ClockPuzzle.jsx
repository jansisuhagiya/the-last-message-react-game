import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from(
  { length: 60 },
  (_, index) => index
);

const ITEM_HEIGHT = 54;

function Roller({
  values,
  value,
  onChange,
  label,
  formatValue,
}) {
  const rollerRef = useRef(null);
  const startYRef = useRef(0);
  const lastYRef = useRef(0);
  const draggingRef = useRef(false);

  const currentIndex = values.indexOf(value);

  const changeValue = (direction) => {
    const current = values.indexOf(value);

    let next = current + direction;

    if (next < 0) {
      next = values.length - 1;
    }

    if (next >= values.length) {
      next = 0;
    }

    onChange(values[next]);
  };

  const handleWheel = (event) => {
    event.preventDefault();

    if (event.deltaY > 0) {
      changeValue(1);
    } else {
      changeValue(-1);
    }
  };

  const handlePointerDown = (event) => {
    draggingRef.current = true;

    startYRef.current = event.clientY;
    lastYRef.current = event.clientY;

    rollerRef.current?.setPointerCapture(
      event.pointerId
    );
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;

    const difference =
      event.clientY - lastYRef.current;

    if (Math.abs(difference) < 18) {
      return;
    }

    if (difference < 0) {
      changeValue(1);
    } else {
      changeValue(-1);
    }

    lastYRef.current = event.clientY;
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div className="roller-wrapper">
      <p className="roller-label">
        {label}
      </p>

      <div className="roller-window">
        <div
          className="roller"
          ref={rollerRef}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div
            className="roller-list"
            style={{
              transform: `translateY(${
                2 * ITEM_HEIGHT -
                currentIndex * ITEM_HEIGHT
              }px)`,
            }}
          >
            {values.map((item, index) => {
              let distance =
                Math.abs(index - currentIndex);

              if (
                distance >
                values.length / 2
              ) {
                distance =
                  values.length - distance;
              }

              const opacity =
                distance === 0
                  ? 1
                  : distance === 1
                    ? 0.45
                    : distance === 2
                      ? 0.2
                      : 0.08;

              const scale =
                distance === 0
                  ? 1
                  : distance === 1
                    ? 0.82
                    : 0.68;

              return (
                <div
                  key={item}
                  className={`roller-item ${
                    index === currentIndex
                      ? "selected"
                      : ""
                  }`}
                  style={{
                    opacity,
                    transform: `scale(${scale})`,
                  }}
                >
                  {formatValue
                    ? formatValue(item)
                    : item}
                </div>
              );
            })}
          </div>

          <div className="roller-selection" />
        </div>
      </div>

      <div className="roller-arrows">
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => changeValue(1)}
        >
          ▲
        </button>

        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => changeValue(-1)}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

export default function Phase3Clock() {
  const sceneRef = useRef(null);
  const puzzleRef = useRef(null);
  const darknessRef = useRef(null);

  const { gamePhase, nextPhase, setCurrentScene } =
    useGame();

  const { playSound } = useSound();

  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);

  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    if (gamePhase !== 3) {
      return;
    }

    const scene = sceneRef.current;
    const puzzle = puzzleRef.current;
    const darkness = darknessRef.current;

    if (!scene || !puzzle || !darkness) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set(scene, {
        opacity: 0,
      });

      gsap.set(puzzle, {
        opacity: 0,
        y: 30,
      });

      gsap.set(darkness, {
        opacity: 1,
      });

      const timeline = gsap.timeline();

      timeline
        .to(darkness, {
          opacity: 0,
          duration: 1.8,
          ease: "power2.inOut",
        })
        .to(
          scene,
          {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=1.2"
        )
        .to(
          puzzle,
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "power3.out",
          },
          "-=0.5"
        );
    }, sceneRef);

    return () => {
      context.revert();
    };
  }, [gamePhase]);

  if (gamePhase !== 3) {
    return null;
  }

  const checkClock = () => {
    if (solved) {
      return;
    }

    if (hour === 11 && minute === 47) {
      setSolved(true);
      setMessage("THE CLOCK STOPS.");

      playSound("unlock", 0.6);

      const puzzle = puzzleRef.current;
      const darkness = darknessRef.current;

      gsap
        .timeline({
          onComplete: () => {
            setCurrentScene("radio");
            nextPhase();
          },
        })
        .to(puzzle, {
          scale: 1.03,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(puzzle, {
          scale: 1,
          duration: 0.4,
          ease: "power2.inOut",
        })
        .to(darkness, {
          opacity: 1,
          duration: 1.8,
          ease: "power2.inOut",
        });
    } else {
      setMessage("THE HANDS FEEL WRONG...");

      playSound("click", 0.25);

      gsap.fromTo(
        puzzleRef.current,
        {
          x: -5,
        },
        {
          x: 5,
          duration: 0.07,
          repeat: 5,
          yoyo: true,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.set(puzzleRef.current, {
              x: 0,
            });
          },
        }
      );

      setTimeout(() => {
        setMessage("");
      }, 1200);
    }
  };

  return (
    <main
      ref={sceneRef}
      className="clock-puzzle-screen"
    >
      <div className="clock-background" />

      <div className="clock-vignette" />

      <div className="clock-grain" />

      <div
        ref={darknessRef}
        className="clock-darkness"
      />

      <section
        ref={puzzleRef}
        className="clock-puzzle"
      >
        <p className="clock-label">
          CHAPTER I
        </p>

        <h1>
          THE CLOCK
        </h1>

        <div className="clock-line" />

        <p className="clock-description">
          The clock has stopped.
          <br />
          The time feels strangely familiar.
        </p>

        <div className="clock-rollers">
          <Roller
            values={HOURS}
            value={hour}
            onChange={(newValue) => {
              setHour(newValue);
              setMessage("");
              playSound("click", 0.18);
            }}
            label="HOUR"
          />

          <div className="clock-colon">
            :
          </div>

          <Roller
            values={MINUTES}
            value={minute}
            onChange={(newValue) => {
              setMinute(newValue);
              setMessage("");
              playSound("click", 0.18);
            }}
            label="MINUTE"
            formatValue={(value) =>
              String(value).padStart(2, "0")
            }
          />
        </div>

        <button
          type="button"
          className="clock-confirm"
          onClick={checkClock}
          disabled={solved}
        >
          SET THE TIME
        </button>

        <p
          className={`clock-message ${
            message ? "visible" : ""
          }`}
        >
          {message}
        </p>
      </section>
    </main>
  );
}