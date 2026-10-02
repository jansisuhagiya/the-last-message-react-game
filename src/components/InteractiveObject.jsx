import { useState } from "react";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function InteractiveObject({ object }) {
  const [hovered, setHovered] = useState(false);

  const {
    inspectObject,
    collectClue,
    nextPhase,
    gamePhase,
    inventory,
  } = useGame();

  const { playSound } = useSound();

  const alreadyCollected = object.clue
    ? inventory.some(
        (item) => item.id === object.clue.id
      )
    : false;

  const handleClick = () => {
    playSound("click", 0.4);

    inspectObject(object);

    if (
      object.clue &&
      !alreadyCollected
    ) {
      collectClue(object.clue);
    }
  };

  const handleMouseEnter = () => {
    setHovered(true);
    playSound("hover", 0.2);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <button
      className={`interactive-object ${
        hovered ? "is-hovered" : ""
      } ${
        alreadyCollected ? "is-collected" : ""
      }`}
      style={{
        left: `${object.x}%`,
        top: `${object.y}%`,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Inspect ${object.name}`}
    >
      <span className="object-pulse" />

      <span className="object-marker">
        {alreadyCollected ? "✓" : "+"}
      </span>

      {hovered && (
        <span className="object-label">
          {alreadyCollected
            ? "CLUE COLLECTED"
            : object.name}
        </span>
      )}
    </button>
  );
}