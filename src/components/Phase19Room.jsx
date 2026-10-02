import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase19Room() {
  const { nextPhase } = useGame();
  const { playSound } = useSound();

  const [stage, setStage] = useState("room");

  const [deskChecked, setDeskChecked] = useState(false);
  const [wardrobeOpened, setWardrobeOpened] = useState(false);
  const [marksFound, setMarksFound] = useState(false);

  useEffect(() => {
    playSound("ambient", 0.35);
  }, [playSound]);

  const inspectDesk = () => {
    if (deskChecked) return;

    setDeskChecked(true);
    playSound("click", 0.4);
  };

  const inspectWardrobe = () => {
    if (wardrobeOpened) return;

    setWardrobeOpened(true);
    playSound("unlock", 0.5);
  };

  const enterPassage = () => {
    if (!wardrobeOpened) return;

    playSound("click", 0.4);
    setStage("transition");

    setTimeout(() => {
      setStage("passage");
    }, 1500);
  };

  const inspectMarks = () => {
    if (marksFound) return;

    setMarksFound(true);
    playSound("clue", 0.6);
  };

  const continuePhase = () => {
    if (!marksFound) return;

    playSound("click", 0.4);

    setTimeout(() => {
      nextPhase();
    }, 700);
  };

  return (
    <main className="phase19">

      {/* =====================================================
          ROOM
      ====================================================== */}

      {stage === "room" && (
        <section className="phase19-room">

          <img
            src="/images/phase19-room.jpg"
            alt="Dark abandoned room with a desk and wardrobe"
            className="phase19-room-image"
          />

          <div className="phase19-dark-overlay" />

          {/* Chapter title */}

          <div className="phase19-title">
            <span>CHAPTER II</span>
            <h1>THE ROOM THAT WASN'T THERE</h1>
          </div>

          {/* =================================================
              DESK HOTSPOT
          ================================================= */}

          <button
            type="button"
            className={`phase19-hotspot phase19-desk ${
              deskChecked ? "is-checked" : ""
            }`}
            onClick={inspectDesk}
            aria-label="Investigate the desk"
          />

          {/* =================================================
              CENTER WALL HOTSPOT
          ================================================= */}

          <button
            type="button"
            className="phase19-hotspot phase19-wall"
            onClick={() => playSound("click", 0.2)}
            aria-label="Inspect the wall"
          />

          {/* =================================================
              WARDROBE HOTSPOT
          ================================================= */}

          <button
            type="button"
            className={`phase19-hotspot phase19-wardrobe ${
              wardrobeOpened ? "is-open" : ""
            }`}
            onClick={inspectWardrobe}
            aria-label="Investigate the wardrobe"
          />

          {/* =================================================
              STORY TEXT
          ================================================= */}

          <div className="phase19-story">

            {!deskChecked && !wardrobeOpened && (
              <>
                <span>THE ROOM IS EMPTY.</span>
                <span>YET IT DOESN'T FEEL ABANDONED.</span>
              </>
            )}

            {deskChecked && !wardrobeOpened && (
              <>
                <span>OLD PAPERS.</span>
                <span>NOTHING THAT EXPLAINS THIS PLACE.</span>
              </>
            )}

            {wardrobeOpened && (
              <>
                <span>THE WARDROBE WAS NEVER CLOSED.</span>
                <span>THERE'S SOMETHING BEHIND IT.</span>
              </>
            )}

          </div>

          {/* =================================================
              ENTER HIDDEN PASSAGE
          ================================================= */}

          {wardrobeOpened && (
            <button
              type="button"
              className="phase19-action"
              onClick={enterPassage}
            >
              ENTER
            </button>
          )}

          <div className="phase19-vignette" />
          <div className="phase19-noise" />

        </section>
      )}

      {/* =====================================================
          TRANSITION
      ====================================================== */}

      {stage === "transition" && (
        <section className="phase19-transition">

          <div className="phase19-transition-glow" />

          <div className="phase19-transition-text">
            <span>THE SPACE BEHIND THE WARDROBE</span>
            <strong>ISN'T PART OF THE ROOM.</strong>
          </div>

        </section>
      )}

      {/* =====================================================
          HIDDEN PASSAGE
      ====================================================== */}

      {stage === "passage" && (
        <section className="phase19-passage">

          <div className="phase19-passage-wall">

            <div className="phase19-cracks" />

            <div className="phase19-marks">

              <div className="mark mark-2011">
                <span>2011</span>
              </div>

              <div className="mark mark-2014">
                <span>2014</span>
              </div>

              <div className="mark mark-2017">
                <span>2017</span>
              </div>

              <div className="mark mark-2020">
                <span>2020</span>
              </div>

              <div className="mark mark-2023">
                <span>2023</span>
              </div>

              <div className="mark mark-today">
                <span>TODAY</span>
              </div>

            </div>

          </div>

          {/* Passage heading */}

          <div className="phase19-passage-heading">
            BEHIND THE WALL
          </div>

          {/* Initial passage text */}

          {!marksFound && (
            <div className="phase19-story phase19-passage-story">
              <span>THE PASSAGE IS NARROW.</span>
              <span>SOMEONE HAS BEEN HERE.</span>
            </div>
          )}

          {/* Height mark discovery */}

          {marksFound && (
            <div className="phase19-story phase19-passage-story phase19-discovered">
              <span>CHILDREN'S HEIGHT MARKS.</span>
              <span>YEARS OF THEM.</span>
              <strong>ONE SAYS: TODAY.</strong>
            </div>
          )}

          {/* =================================================
              HEIGHT MARK HOTSPOT
          ================================================= */}

          <button
            type="button"
            className={`phase19-hotspot phase19-marks-hotspot ${
              marksFound ? "is-checked" : ""
            }`}
            onClick={inspectMarks}
            aria-label="Investigate the children's height marks"
          />

          {/* =================================================
              CONTINUE
          ================================================= */}

          {marksFound && (
            <button
              type="button"
              className="phase19-action phase19-continue"
              onClick={continuePhase}
            >
              CONTINUE
            </button>
          )}

          <div className="phase19-vignette" />
          <div className="phase19-noise" />

        </section>
      )}

    </main>
  );
}