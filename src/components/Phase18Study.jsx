import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { useSound } from "../context/SoundContext";

export default function Phase18Study() {
  const { nextPhase } = useGame();
  const { playSound } = useSound();

  const [intro, setIntro] = useState(true);
  const [floorFound, setFloorFound] = useState(false);
  const [floorOpened, setFloorOpened] = useState(false);
  const [drawingVisible, setDrawingVisible] = useState(false);
  const [listening, setListening] = useState(false);
  const [knockCount, setKnockCount] = useState(0);
  const [choiceVisible, setChoiceVisible] = useState(false);
  const [choice, setChoice] = useState("");
  const [ending, setEnding] = useState(false);

  /* ==========================================
     INTRO
  ========================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntro(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  /* ==========================================
     CLICK FLOOR
  ========================================== */

  const inspectFloor = () => {
    if (floorFound || floorOpened || ending) return;

    setFloorFound(true);

    playSound("click", 0.45);
  };

  /* ==========================================
     OPEN FLOORBOARD
  ========================================== */

  const openFloor = () => {
    if (!floorFound || floorOpened || ending) return;

    setFloorOpened(true);

    playSound("unlock", 0.5);

    setTimeout(() => {
      setDrawingVisible(true);
    }, 1000);
  };

  /* ==========================================
     LOOK AT DRAWING
  ========================================== */

  const inspectDrawing = () => {
    if (!drawingVisible || listening || ending) return;

    setListening(true);

    playSound("ambient", 0.3);
  };

  /* ==========================================
     KNOCK SEQUENCE
  ========================================== */

  useEffect(() => {
    if (!listening) return;

    const timers = [];

    timers.push(
      setTimeout(() => {
        setKnockCount(1);
        playSound("click", 0.5);
      }, 1800)
    );

    timers.push(
      setTimeout(() => {
        setKnockCount(2);
        playSound("click", 0.5);
      }, 3300)
    );

    timers.push(
      setTimeout(() => {
        setKnockCount(3);
        playSound("click", 0.5);
      }, 4800)
    );

    timers.push(
      setTimeout(() => {
        setChoiceVisible(true);
      }, 6500)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [listening, playSound]);

  /* ==========================================
     PLAYER CHOICE
  ========================================== */

  const makeChoice = (selectedChoice) => {
    if (choice || ending) return;

    setChoice(selectedChoice);
    setChoiceVisible(false);

    playSound("clue", 0.6);
  };

  /* ==========================================
     ANSWER RESULT
  ========================================== */

  useEffect(() => {
    if (!choice) return;

    const timer = setTimeout(() => {
      setEnding(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, [choice]);

  /* ==========================================
     NEXT PHASE
  ========================================== */

  useEffect(() => {
    if (!ending) return;

    const timer = setTimeout(() => {
      nextPhase();
    }, 4200);

    return () => clearTimeout(timer);
  }, [ending, nextPhase]);

  return (
    <main className="phase18">
      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div className="phase18-background" />

      <div className="phase18-vignette" />

      <div className="phase18-grain" />

      {/* ======================================
          INTRO
      ====================================== */}

      {intro && (
        <div className="phase18-intro">
          <span>CHAPTER II</span>

          <h1>THE HOUSE IS LISTENING</h1>
        </div>
      )}

      {/* ======================================
          MAIN SCENE
      ====================================== */}

      {!intro && !ending && (
        <>
          <div className="phase18-title">
            <span>CHAPTER II</span>
            <strong>UPSTAIRS</strong>
          </div>

          {/* ==================================
              FLOORBOARD - FIRST CLICK
          ================================== */}

          {!floorFound && (
            <button
              className="phase18-hotspot phase18-floor-hotspot"
              onClick={inspectFloor}
              aria-label="Inspect floorboard"
            />
          )}

          {/* ==================================
              FLOORBOARD - SECOND CLICK
          ================================== */}

          {floorFound && !floorOpened && (
            <>
              <button
                className="phase18-hotspot phase18-floor-hotspot-open"
                onClick={openFloor}
                aria-label="Open loose floorboard"
              />

              <div className="phase18-floor-message">
                <span>THE FLOOR SOUNDS HOLLOW.</span>
              </div>
            </>
          )}

          {/* ==================================
              OPEN FLOOR
          ================================== */}

          {floorOpened && (
            <div className="phase18-open-floor">
              <div className="phase18-black-opening" />
            </div>
          )}

          {/* ==================================
              DRAWING
          ================================== */}

          {drawingVisible && !listening && (
            <>
              <button
                className="phase18-hotspot phase18-drawing-hotspot"
                onClick={inspectDrawing}
                aria-label="Inspect hidden drawing"
              />

              <div className="phase18-drawing">
                <div className="phase18-paper">
                  <div className="phase18-child-drawing">
                    <div className="drawing-house" />
                    <div className="drawing-person" />
                    <div className="drawing-line" />
                  </div>

                  <span>DON'T MAKE A SOUND.</span>
                </div>
              </div>

              <div className="phase18-drawing-hint">
                LOOK CLOSER
              </div>
            </>
          )}

          {/* ==================================
              LISTENING
          ================================== */}

          {listening && !choiceVisible && !choice && (
            <div className="phase18-listening">
              <span>LISTEN</span>

              <div className="phase18-knocks">
                {knockCount >= 1 && <i>KNOCK</i>}
                {knockCount >= 2 && <i>KNOCK</i>}
                {knockCount >= 3 && <i>KNOCK</i>}
              </div>
            </div>
          )}

          {/* ==================================
              CHOICE
          ================================== */}

          {choiceVisible && !choice && (
            <div className="phase18-choice">
              <p>Are you still there?</p>

              <div className="phase18-choice-buttons">
                <button onClick={() => makeChoice("answer")}>
                  ANSWER
                </button>

                <button onClick={() => makeChoice("silent")}>
                  STAY SILENT
                </button>
              </div>
            </div>
          )}

          {/* ==================================
              RESULT
          ================================== */}

          {choice && !ending && (
            <div className="phase18-result">
              {choice === "answer" ? (
                <>
                  <span>THE VOICE GOES QUIET.</span>
                  <p>You shouldn't have answered.</p>
                </>
              ) : (
                <>
                  <span>THE HOUSE STAYS SILENT.</span>
                  <p>Good.</p>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* ======================================
          ENDING
      ====================================== */}

      {ending && (
        <div className="phase18-ending">
          <span>CHAPTER II</span>

          <h1>THE HOUSE HEARD YOU.</h1>
        </div>
      )}
    </main>
  );
}