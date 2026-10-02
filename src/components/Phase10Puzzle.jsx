import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase10Puzzle() {
  const roomRef = useRef(null);
  const phoneRef = useRef(null);
  const phoneLightRef = useRef(null);
  const messageRef = useRef(null);
  const darknessRef = useRef(null);

  const timersRef = useRef([]);

  const [ringing, setRinging] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  const { gamePhase, nextPhase, setPuzzleMessage } = useGame();
  const { playSound } = useSound();

  useEffect(() => {
    if (gamePhase !== 10) {
      return;
    }

    setRinging(false);
    setMessageVisible(false);
    setPuzzleMessage("");

    timersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });

    timersRef.current = [];

    // Initial darkness
    if (darknessRef.current) {
      gsap.set(darknessRef.current, {
        opacity: 1,
      });

      gsap.to(darknessRef.current, {
        opacity: 0,
        duration: 2,
        ease: "power2.out",
      });
    }

    // Bedroom entrance
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
          duration: 2,
          ease: "power2.out",
        }
      );
    }

    // Very low room ambience
    const ambientTimer = setTimeout(() => {
      playSound("ambient", 0.18);
    }, 700);

    timersRef.current.push(ambientTimer);

    // First phone event
    const firstRingTimer = setTimeout(() => {
      startPhoneEvent();
    }, 3000);

    timersRef.current.push(firstRingTimer);

    return () => {
      timersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });

      timersRef.current = [];

      gsap.killTweensOf(roomRef.current);
      gsap.killTweensOf(phoneRef.current);
      gsap.killTweensOf(phoneLightRef.current);
      gsap.killTweensOf(messageRef.current);
      gsap.killTweensOf(darknessRef.current);
    };
  }, [gamePhase]);

  const addTimer = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  };

  const startPhoneEvent = () => {
    setRinging(true);

    // Using radio sound as the distorted phone sound
    playSound("radio", 0.55);

    // Slow camera movement
    if (roomRef.current) {
      gsap.to(roomRef.current, {
        scale: 1.025,
        duration: 4,
        ease: "power2.inOut",
      });
    }

    // Phone movement
    if (phoneRef.current) {
      gsap.to(phoneRef.current, {
        rotation: -3,
        duration: 0.08,
        repeat: 11,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.set(phoneRef.current, {
            rotation: 0,
          });
        },
      });
    }

    // Phone light
    if (phoneLightRef.current) {
      gsap.to(phoneLightRef.current, {
        opacity: 0.8,
        duration: 0.25,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    // Stop first ring
    addTimer(() => {
      setRinging(false);

      if (phoneRef.current) {
        gsap.to(phoneRef.current, {
          rotation: 0,
          duration: 0.3,
        });
      }

      if (phoneLightRef.current) {
        gsap.to(phoneLightRef.current, {
          opacity: 0,
          duration: 0.8,
        });
      }
    }, 1400);

    // Show message
    addTimer(() => {
      setMessageVisible(true);

      playSound("clue", 0.4);

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
            duration: 1.5,
            ease: "power2.out",
          }
        );
      }
    }, 3000);

    // Hide message
    addTimer(() => {
      setMessageVisible(false);

      if (messageRef.current) {
        gsap.to(messageRef.current, {
          opacity: 0,
          duration: 0.8,
        });
      }
    }, 5200);

    // Second phone event
    addTimer(() => {
      setRinging(true);

      playSound("radio", 0.6);

      if (phoneRef.current) {
        gsap.to(phoneRef.current, {
          rotation: -3,
          duration: 0.08,
          repeat: 9,
          yoyo: true,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.set(phoneRef.current, {
              rotation: 0,
            });
          },
        });
      }

      if (phoneLightRef.current) {
        gsap.to(phoneLightRef.current, {
          opacity: 0.85,
          duration: 0.2,
          repeat: 4,
          yoyo: true,
          ease: "power1.inOut",
        });
      }
    }, 6500);

    // Stop second phone event
    addTimer(() => {
      setRinging(false);

      if (phoneLightRef.current) {
        gsap.to(phoneLightRef.current, {
          opacity: 0,
          duration: 0.8,
        });
      }
    }, 7600);

    // Final footstep before transition
    addTimer(() => {
      playSound("footstep", 0.45);
    }, 7900);

    // Move to Phase 11
    addTimer(() => {
      if (darknessRef.current) {
        gsap.to(darknessRef.current, {
          opacity: 1,
          duration: 2,
          ease: "power2.inOut",
          onComplete: () => {
            nextPhase();
          },
        });
      } else {
        nextPhase();
      }
    }, 8500);
  };

  if (gamePhase !== 10) {
    return null;
  }

  return (
    <div className="phase10-screen">
      <div ref={roomRef} className="phase10-room">
        <img
          src="/images/bedroom.jpg"
          alt=""
          className="phase10-bedroom"
        />

        <div ref={phoneRef} className="phase10-phone">
          <div
            ref={phoneLightRef}
            className="phase10-phone-light"
          ></div>

          {messageVisible && (
            <div
              ref={messageRef}
              className="phase10-phone-message"
            >
              <span>UNKNOWN CALLER</span>
              <strong>DON'T ANSWER.</strong>
            </div>
          )}
        </div>

        {ringing && (
          <div className="phase10-ring-effect"></div>
        )}
      </div>

      <div className="phase10-vignette"></div>

      <div className="phase10-grain"></div>

      <div
        ref={darknessRef}
        className="phase10-darkness"
      ></div>
    </div>
  );
}