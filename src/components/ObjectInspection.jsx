import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function ObjectInspection() {
  const panelRef = useRef(null);

  const {
    inspectedObject,
    closeInspection,
    inventory,
  } = useGame();

  const { playSound } = useSound();

  useEffect(() => {
    if (!inspectedObject || !panelRef.current) {
      return;
    }

    gsap.fromTo(
      panelRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
      }
    );
  }, [inspectedObject]);

  if (!inspectedObject) {
    return null;
  }

  const clueCollected =
    inspectedObject.clue &&
    inventory.some(
      (item) =>
        item.id === inspectedObject.clue.id
    );

  const handleContinue = () => {
    playSound("click", 0.25);
    closeInspection();
  };

  return (
    <div className="inspection-overlay">
      <div
        ref={panelRef}
        className="inspection-panel"
      >
        <p className="inspection-label">
          INVESTIGATION
        </p>

        <h2>
          {inspectedObject.name}
        </h2>

        <div className="inspection-line" />

        <p className="inspection-description">
          {inspectedObject.description}
        </p>

        {inspectedObject.clue && (
          <div className="clue-discovered">
            <span>
              {clueCollected
                ? "CLUE DISCOVERED"
                : "STRANGE OBJECT"}
            </span>

            <h3>
              {inspectedObject.clue.name}
            </h3>

            <p>
              {inspectedObject.clue.description}
            </p>
          </div>
        )}

        <button
          onClick={handleContinue}
        >
          CONTINUE INVESTIGATION
        </button>
      </div>
    </div>
  );
}