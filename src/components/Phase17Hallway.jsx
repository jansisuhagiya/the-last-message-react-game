import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";


export default function Phase17() {
  const { gamePhase, nextPhase } = useGame();
  const { playSound } = useSound();

  const sceneRef = useRef(null);
  const reflectionRef = useRef(null);
  const whisperRef = useRef(null);
  const doorGlowRef = useRef(null);

  const [mirrorSeen, setMirrorSeen] = useState(false);
  const [doorUnlocked, setDoorUnlocked] = useState(false);

  useEffect(() => {
    if (gamePhase !== 17) return;

    gsap.set(sceneRef.current, {
      opacity: 0,
    });

    gsap.to(sceneRef.current, {
      opacity: 1,
      duration: 1.8,
      ease: "power2.out",
    });
  }, [gamePhase]);

  /*
   * PLAYER CLICKS THE REAL MIRROR
   */
  const inspectMirror = () => {
    if (mirrorSeen) return;

    setMirrorSeen(true);

    playSound("clue", 0.5);

    /*
     * Reflection appears INSIDE the existing mirror.
     * We are not creating another mirror.
     */
    gsap.fromTo(
      reflectionRef.current,
      {
        opacity: 0,
        scale: 0.96,
      },
      {
        opacity: 0.85,
        scale: 1,
        duration: 2,
        ease: "power2.out",
      }
    );

    /*
     * Small visual disturbance.
     */
    gsap.to(sceneRef.current, {
      x: 2,
      duration: 0.08,
      repeat: 5,
      yoyo: true,
      ease: "none",
      onComplete: () => {
        gsap.set(sceneRef.current, {
          x: 0,
        });
      },
    });

    /*
     * Whisper/message appears naturally in the scene.
     */
    gsap.fromTo(
      whisperRef.current,
      {
        opacity: 0,
        y: 8,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
      }
    );
  };

  /*
   * PLAYER CLICKS THE FAR DOOR
   */
  const inspectDoor = () => {
    if (!mirrorSeen || doorUnlocked) return;

    setDoorUnlocked(true);

    playSound("unlock", 0.5);

    gsap.fromTo(
      doorGlowRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
        yoyo: true,
        repeat: 2,
        ease: "power2.inOut",
      }
    );

    /*
     * Small pause before entering next phase.
     */
    setTimeout(() => {
      gsap.to(sceneRef.current, {
        opacity: 0,
        duration: 1.3,
        ease: "power2.in",
        onComplete: () => {
          nextPhase();
        },
      });
    }, 1800);
  };

  if (gamePhase !== 17) return null;

  return (
    <div
      ref={sceneRef}
      className="phase17"
    >

      {/* ==================================================
          REAL BACKGROUND
          ================================================== */}

      <img
        className="phase17-background"
        src="/images/chapter2-hallway.jpg"
        alt=""
      />

      {/* Dark cinematic grading */}
      <div className="phase17-color-grade" />

      {/* Vignette */}
      <div className="phase17-vignette" />


      {/* ==================================================
          MIRROR REFLECTION
          IMPORTANT:
          This is ONLY the reflection.
          The mirror itself is already in the background.
          ================================================== */}

      <div
        ref={reflectionRef}
        className={`phase17-reflection ${
          mirrorSeen ? "reflection-visible" : ""
        }`}
      >
        <div className="reflection-head" />
        <div className="reflection-body" />
        <div className="reflection-shoulder-left" />
        <div className="reflection-shoulder-right" />
      </div>


      {/* ==================================================
          REAL MIRROR CLICK AREA
          
          Position corresponds to the large mirror
          on the LEFT side of the generated image.
          ================================================== */}

      <button
        className="mirror-hotspot"
        onClick={inspectMirror}
        aria-label="Look at the mirror"
      />


      {/* ==================================================
          MIRROR MESSAGE
          
          Not a popup.
          Very subtle text inside the environment.
          ================================================== */}

      <div
        ref={whisperRef}
        className="phase17-whisper"
      >
        <span>YOU ARE NOT ALONE.</span>
      </div>


      {/* ==================================================
          FAR DOOR LIGHT
          ================================================== */}

      <div
        ref={doorGlowRef}
        className="far-door-glow"
      />


      {/* ==================================================
          FAR DOOR CLICK AREA
          
          This corresponds to the door at the end
          of the hallway.
          ================================================== */}

      <button
        className={`door-hotspot ${
          mirrorSeen ? "door-enabled" : ""
        }`}
        onClick={inspectDoor}
        aria-label="Walk toward the door"
      />


      {/* ==================================================
          SMALL ENVIRONMENTAL HINT
          ================================================== */}

      {!mirrorSeen && (
        <div className="phase17-hint">
          <span>Something catches your eye.</span>
        </div>
      )}

      {mirrorSeen && !doorUnlocked && (
        <div className="phase17-hint phase17-hint-door">
          <span>The door at the end of the hall is open.</span>
        </div>
      )}


      {/* ==================================================
          CHAPTER LABEL
          ================================================== */}

      <div className="phase17-chapter">
        CHAPTER II
      </div>

    </div>
  );
}