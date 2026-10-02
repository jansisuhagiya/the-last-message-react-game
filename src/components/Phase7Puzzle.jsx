import { useEffect, useState } from "react";
import gsap from "gsap";

import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase7Puzzle() {
  const { gamePhase, nextPhase, unlockDrawer } = useGame();
  const { playSound } = useSound();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (gamePhase !== 7) return;

    setDrawerOpen(false);
    setTransitioning(false);
  }, [gamePhase]);

  const handleDrawerClick = () => {
    if (drawerOpen) return;

    setDrawerOpen(true);

    playSound("unlock");

    gsap.to(".phase7-room", {
      scale: 1.03,
      duration: 1,
      ease: "power2.out",
    });
  };

  const handleKeyClick = () => {
    if (transitioning) return;

    setTransitioning(true);

    playSound("clue");

    unlockDrawer();

    gsap.to(".phase7-darkness", {
      opacity: 1,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        nextPhase();
      },
    });
  };

  if (gamePhase !== 7) {
    return null;
  }

  return (
    <div className="phase7-screen">

      <div className="phase7-room">

        <img
          src="/images/bedroom.jpg"
          alt=""
          className="phase7-bedroom"
        />

        {!drawerOpen && (
          <button
            className="phase7-drawer-hotspot"
            onClick={handleDrawerClick}
            aria-label="Open drawer"
          />
        )}

        {drawerOpen && (
          <button
            className="phase7-key-hotspot"
            onClick={handleKeyClick}
            aria-label="Take the key"
          >
            <span className="phase7-key">🔑</span>
          </button>
        )}

      </div>

      <div className="phase7-vignette"></div>

      <div className="phase7-grain"></div>

      <div className="phase7-darkness"></div>

    </div>
  );
}