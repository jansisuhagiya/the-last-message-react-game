import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

const FREQUENCIES = Array.from({ length: 100 }, (_, index) =>
  (88 + index * 0.1).toFixed(1)
);

const TARGET_FREQUENCY = "94.7";
const ITEM_HEIGHT = 54;

function FrequencyRoller({ value, onChange }) {
  const rollerRef = useRef(null);
  const lastYRef = useRef(0);
  const draggingRef = useRef(false);

  const currentIndex = FREQUENCIES.indexOf(value);

  const changeFrequency = (direction) => {
    const currentIndex = FREQUENCIES.indexOf(value);

    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      nextIndex = FREQUENCIES.length - 1;
    }

    if (nextIndex >= FREQUENCIES.length) {
      nextIndex = 0;
    }

    onChange(FREQUENCIES[nextIndex]);
  };

  const handleWheel = (event) => {
    event.preventDefault();

    if (event.deltaY > 0) {
      changeFrequency(1);
    } else {
      changeFrequency(-1);
    }
  };

  const handlePointerDown = (event) => {
    draggingRef.current = true;
    lastYRef.current = event.clientY;

    rollerRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) {
      return;
    }

    const difference = event.clientY - lastYRef.current;

    if (Math.abs(difference) < 14) {
      return;
    }

    if (difference < 0) {
      changeFrequency(1);
    } else {
      changeFrequency(-1);
    }

    lastYRef.current = event.clientY;
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div className="radio-roller-wrapper">
      <p className="radio-roller-label">FREQUENCY</p>

      <div className="radio-roller-window">
        <div
          ref={rollerRef}
          className="radio-roller"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className="radio-roller-list"
            style={{
              transform: `translateY(${
                2 * ITEM_HEIGHT - currentIndex * ITEM_HEIGHT
              }px)`,
            }}
          >
            {FREQUENCIES.map((frequency, index) => {
              let distance = Math.abs(index - currentIndex);

              if (distance > FREQUENCIES.length / 2) {
                distance = FREQUENCIES.length - distance;
              }

              const opacity =
                distance === 0
                  ? 1
                  : distance === 1
                    ? 0.45
                    : distance === 2
                      ? 0.2
                      : 0.07;

              const scale =
                distance === 0
                  ? 1
                  : distance === 1
                    ? 0.82
                    : 0.68;

              return (
                <div
                  key={frequency}
                  className={`radio-frequency-item ${
                    index === currentIndex ? "selected" : ""
                  }`}
                  style={{
                    opacity,
                    transform: `scale(${scale})`,
                  }}
                >
                  {frequency}
                </div>
              );
            })}
          </div>

          <div className="radio-selection-line" />
        </div>
      </div>

      <div className="radio-roller-arrows">
        <button
          type="button"
          aria-label="Increase frequency"
          onClick={() => changeFrequency(1)}
        >
          ▲
        </button>

        <button
          type="button"
          aria-label="Decrease frequency"
          onClick={() => changeFrequency(-1)}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

export default function Phase4Radio() {
  const sceneRef = useRef(null);
  const radioRef = useRef(null);
  const darknessRef = useRef(null);
  const staticRef = useRef(null);
  const messageRef = useRef(null);

  const { gamePhase, nextPhase, setCurrentScene } = useGame();
  const { playSound } = useSound();

  const [frequency, setFrequency] = useState("94.0");
  const [message, setMessage] = useState("");
  const [foundSignal, setFoundSignal] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (gamePhase !== 4) {
      return;
    }

    const scene = sceneRef.current;
    const radio = radioRef.current;
    const darkness = darknessRef.current;

    if (!scene || !radio || !darkness) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set(scene, {
        opacity: 0,
      });

      gsap.set(radio, {
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
          radio,
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

  useEffect(() => {
    if (!foundSignal) {
      return;
    }

    const messageElement = messageRef.current;
    const staticElement = staticRef.current;

    if (!messageElement || !staticElement) {
      return;
    }

    gsap.fromTo(
      messageElement,
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
      }
    );

    gsap.to(staticElement, {
      opacity: 0.08,
      duration: 1,
      ease: "power2.out",
    });
  }, [foundSignal]);

  if (gamePhase !== 4) {
    return null;
  }

  const handleFrequencyChange = (newFrequency) => {
    if (foundSignal || transitioning) {
      return;
    }

    setFrequency(newFrequency);
    setMessage("");

    playSound("click", 0.16);

    if (newFrequency === TARGET_FREQUENCY) {
      setFoundSignal(true);
      setMessage("A VOICE BREAKS THROUGH THE STATIC.");

      playSound("unlock", 0.55);

      setTimeout(() => {
        if (transitioning) {
          return;
        }

        setTransitioning(true);

        const radio = radioRef.current;
        const darkness = darknessRef.current;

        if (!radio || !darkness) {
          return;
        }

        gsap
          .timeline({
            onComplete: () => {
              setCurrentScene("photograph");
              nextPhase();
            },
          })
          .to(radio, {
            scale: 1.03,
            duration: 0.6,
            ease: "power2.out",
          })
          .to(radio, {
            scale: 1,
            duration: 0.4,
            ease: "power2.inOut",
          })
          .to(
            staticRef.current,
            {
              opacity: 0.02,
              duration: 1,
              ease: "power2.out",
            },
            "-=0.3"
          )
          .to(darkness, {
            opacity: 1,
            duration: 2,
            ease: "power2.inOut",
          });
      }, 2600);
    }
  };

  return (
    <main
      ref={sceneRef}
      className={`radio-puzzle-screen ${
        foundSignal ? "signal-found" : ""
      }`}
    >
      <div className="radio-background" />

      <div className="radio-room-glow" />

      <div
        ref={staticRef}
        className="radio-static"
      />

      <div className="radio-vignette" />

      <div className="radio-grain" />

      <div
        ref={darknessRef}
        className="radio-darkness"
      />

      <section
        ref={radioRef}
        className="radio-puzzle"
      >
        <p className="radio-label">
          CHAPTER I
        </p>

        <h1>THE RADIO</h1>

        <div className="radio-line" />

        <p className="radio-description">
          The radio is still receiving something.
          <br />
          Beneath the static, a voice is waiting.
        </p>

        <div className="radio-device">
          <div className="radio-device-top">
            <span className="radio-light" />
            <span className="radio-device-name">
              PHILCO
            </span>
          </div>

          <div className="radio-speaker">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="radio-frequency-display">
            <span>{frequency}</span>
            <small>FM</small>
          </div>
        </div>

        <FrequencyRoller
          value={frequency}
          onChange={handleFrequencyChange}
        />

        <p
          ref={messageRef}
          className={`radio-message ${
            message ? "visible" : ""
          }`}
        >
          {message}
        </p>

        <div className="radio-status">
          {foundSignal
            ? "SIGNAL LOCKED"
            : "SEARCHING FOR SIGNAL"}
        </div>
      </section>
    </main>
  );
}