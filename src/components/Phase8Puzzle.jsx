import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase8Puzzle() {
  const roomRef = useRef(null);
  const boxRef = useRef(null);
  const noteRef = useRef(null);
  const darknessRef = useRef(null);
  const nextTimerRef = useRef(null);

  const [boxOpened, setBoxOpened] = useState(false);
  const [noteRead, setNoteRead] = useState(false);

  const { gamePhase, nextPhase, setPuzzleMessage } = useGame();
  const { playSound } = useSound();

  useEffect(() => {
    if (gamePhase !== 8) {
      return;
    }

    setBoxOpened(false);
    setNoteRead(false);
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
          scale: 1.04,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          delay: 0.5,
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

  const handleBoxClick = () => {
    if (boxOpened) {
      return;
    }

    setBoxOpened(true);

    playSound("click", 0.4);
    playSound("unlock", 0.6);

    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 15,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }

    if (noteRef.current) {
      gsap.fromTo(
        noteRef.current,
        {
          opacity: 0,
          scale: 0.7,
          y: 10,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "power3.out",
        }
      );
    }
  };

  const handleNoteClick = () => {
    if (noteRead) {
      return;
    }

    setNoteRead(true);

    playSound("click", 0.3);
    playSound("clue", 0.5);

    if (noteRef.current) {
      gsap.to(noteRef.current, {
        scale: 1.08,
        duration: 0.4,
        ease: "power2.out",
      });
    }

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
    }, 3500);
  };

  if (gamePhase !== 8) {
    return null;
  }

  return (
    <div className="phase8-screen">

      <div
        ref={roomRef}
        className="phase8-room"
      >

        <img
          src="/images/bedroom.jpg"
          alt=""
          className="phase8-bedroom"
        />

        {!boxOpened && (
          <button
            type="button"
            className="phase8-box-hotspot"
            onClick={handleBoxClick}
            aria-label="Inspect the locked box"
          />
        )}

        {boxOpened && (
          <div
            ref={boxRef}
            className="phase8-open-box"
          >

            <div className="phase8-box-inside"></div>

            {!noteRead && (
              <button
                ref={noteRef}
                type="button"
                className="phase8-note-hotspot"
                onClick={handleNoteClick}
                aria-label="Read the note"
              >
                <span className="phase8-note"></span>
              </button>
            )}

          </div>
        )}

        {noteRead && (
          <div className="phase8-note-message">

            <div className="phase8-note-title">
              THE NOTE READS
            </div>

            <p>
              "YOU ARE NOT TRYING TO ESCAPE."
            </p>

            <p>
              "YOU ARE TRYING TO REMEMBER."
            </p>

          </div>
        )}

      </div>

      <div className="phase8-vignette"></div>

      <div className="phase8-grain"></div>

      <div
        ref={darknessRef}
        className="phase8-darkness"
      ></div>

    </div>
  );
}