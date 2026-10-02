import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const GameContext = createContext(null);

const API_URL = "http://localhost:5000/api";

export function GameProvider({ children }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const [gamePhase, setGamePhase] = useState(1);
  const [currentScene, setCurrentScene] = useState("arrival");

  const [inventory, setInventory] = useState([]);
  const [inspectedObject, setInspectedObject] = useState(null);

  const [drawerUnlocked, setDrawerUnlocked] = useState(false);
  const [puzzleMessage, setPuzzleMessage] = useState("");

  const [finalChoice, setFinalChoice] = useState(null);

  const [progressLoaded, setProgressLoaded] = useState(false);

  const saveTimeoutRef = useRef(null);
  const isLoadingProgressRef = useRef(true);
  const restartingRef = useRef(false);

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "Failed to read stored user:",
        error
      );

      return null;
    }
  };

  const getUserId = () => {
    const user = getStoredUser();

    if (!user) {
      return null;
    }

    return user.id || user._id || null;
  };

  const saveProgress = async (customData = {}) => {
    const userId = getUserId();

    if (!userId) {
      return;
    }

    try {
      const clueIds = inventory
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.id;
        })
        .filter(Boolean);

      const progressData = {
        currentPhase:
          customData.currentPhase !== undefined
            ? customData.currentPhase
            : gamePhase,

        currentScene:
          customData.currentScene !== undefined
            ? customData.currentScene
            : currentScene,

        collectedClues:
          customData.collectedClues !== undefined
            ? customData.collectedClues
            : clueIds,

        solvedPuzzles:
          customData.solvedPuzzles !== undefined
            ? customData.solvedPuzzles
            : [],

        unlockedScenes:
          customData.unlockedScenes !== undefined
            ? customData.unlockedScenes
            : [],

        dialogueChoices:
          customData.dialogueChoices !== undefined
            ? customData.dialogueChoices
            : [],

        finalChoice:
          customData.finalChoice !== undefined
            ? customData.finalChoice
            : finalChoice,

        gameCompleted:
          customData.gameCompleted !== undefined
            ? customData.gameCompleted
            : gameEnded,
      };

      const response = await fetch(
        `${API_URL}/progress/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(progressData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Failed to save progress:",
          data.message
        );

        return;
      }

      console.log(
        "GAME PROGRESS SAVED:",
        data.progress
      );
    } catch (error) {
      console.error(
        "Save progress error:",
        error.message
      );
    }
  };

  const loadProgress = async () => {
    const userId = getUserId();

    if (!userId) {
      setGameStarted(false);
      setGameEnded(false);
      setGamePhase(1);
      setCurrentScene("arrival");

      isLoadingProgressRef.current = false;
      setProgressLoaded(true);

      return;
    }

    if (restartingRef.current) {
      return;
    }

    isLoadingProgressRef.current = true;

    try {
      const response = await fetch(
        `${API_URL}/progress/${userId}`
      );

      const data = await response.json();

      if (response.status === 404) {
        console.log(
          "No saved game progress found."
        );

        setGameStarted(false);
        setGameEnded(false);

        setGamePhase(1);
        setCurrentScene("arrival");

        setInventory([]);
        setInspectedObject(null);

        setDrawerUnlocked(false);
        setPuzzleMessage("");

        setFinalChoice(null);

        isLoadingProgressRef.current = false;
        setProgressLoaded(true);

        return;
      }

      if (!response.ok) {
        console.error(
          "Failed to load progress:",
          data.message
        );

        setGameStarted(false);
        setGameEnded(false);

        setGamePhase(1);
        setCurrentScene("arrival");

        isLoadingProgressRef.current = false;
        setProgressLoaded(true);

        return;
      }

      const progress = data.progress;

      console.log(
        "GAME PROGRESS LOADED:",
        progress
      );

      const savedPhase =
        progress.currentPhase ?? 1;

      console.log(
        "SAVED PHASE:",
        savedPhase
      );

      console.log(
        "SAVED SCENE:",
        progress.currentScene
      );

      /*
        PHASE 1

        Always show the Arrival
        welcome screen.
      */

      if (savedPhase === 1) {
        console.log(
          "STARTING FROM ARRIVAL → PHASE 1"
        );

        setGameStarted(false);
        setGameEnded(false);

        setGamePhase(1);
        setCurrentScene("arrival");

        setInventory([]);
        setInspectedObject(null);

        setDrawerUnlocked(false);
        setPuzzleMessage("");

        setFinalChoice(null);
      } else {
        /*
          PHASE 2+

          Resume saved game.
        */

        console.log(
          "RESUMING GAME → PHASE",
          savedPhase
        );

        setGameStarted(true);

        setGameEnded(
          progress.gameCompleted === true
        );

        setGamePhase(savedPhase);

        setCurrentScene(
          progress.currentScene || "bedroom"
        );

        /*
          Restore inventory
        */

        if (
          Array.isArray(
            progress.collectedClues
          )
        ) {
          const restoredInventory =
            progress.collectedClues.map(
              (clueId) => {
                if (
                  clueId ===
                  "mysterious-letter"
                ) {
                  return {
                    id: "mysterious-letter",
                    name: "Mysterious Letter",
                    description:
                      "Someone knew you were coming. The final line reads: 'You should have stayed away.'",
                  };
                }

                return {
                  id: clueId,
                  name: clueId,
                  description: "",
                };
              }
            );

          setInventory(
            restoredInventory
          );

          setDrawerUnlocked(
            progress.collectedClues.includes(
              "mysterious-letter"
            )
          );
        } else {
          setInventory([]);
          setDrawerUnlocked(false);
        }

        /*
          Restore final choice
        */

        setFinalChoice(
          progress.finalChoice || null
        );
      }
    } catch (error) {
      console.error(
        "Load progress error:",
        error.message
      );

      /*
        If the backend cannot be reached,
        show Arrival safely.
      */

      setGameStarted(false);
      setGameEnded(false);

      setGamePhase(1);
      setCurrentScene("arrival");

      setInventory([]);
      setInspectedObject(null);

      setDrawerUnlocked(false);
      setPuzzleMessage("");

      setFinalChoice(null);
    }

    isLoadingProgressRef.current = false;
    setProgressLoaded(true);
  };

  /*
    Load progress when the game starts.
  */

  useEffect(() => {
    loadProgress();
  }, []);

  /*
    Automatic progress saving.
  */

  useEffect(() => {
    if (!progressLoaded) {
      return;
    }

    if (isLoadingProgressRef.current) {
      return;
    }

    if (restartingRef.current) {
      return;
    }

    const userId = getUserId();

    if (!userId) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(
        saveTimeoutRef.current
      );
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveProgress();
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(
          saveTimeoutRef.current
        );

        saveTimeoutRef.current = null;
      }
    };
  }, [
    gamePhase,
    currentScene,
    inventory,
    finalChoice,
    gameEnded,
    progressLoaded,
  ]);

  /*
    Start a completely new game.
  */

  const startGame = async () => {
    setGameStarted(false);
    setGameEnded(false);

    setGamePhase(1);
    setCurrentScene("arrival");

    setInventory([]);
    setInspectedObject(null);

    setDrawerUnlocked(false);
    setPuzzleMessage("");

    setFinalChoice(null);

    await saveProgress({
      currentPhase: 1,
      currentScene: "arrival",
      collectedClues: [],
      solvedPuzzles: [],
      unlockedScenes: [],
      dialogueChoices: [],
      finalChoice: null,
      gameCompleted: false,
    });
  };

  /*
    Restart the entire game.
  */

  const restartGame = async () => {
    const userId = getUserId();

    if (!userId) {
      console.error(
        "Cannot restart game. User is not logged in."
      );

      return;
    }

    if (restartingRef.current) {
      return;
    }

    restartingRef.current = true;
    isLoadingProgressRef.current = true;

    console.log(
      "RESETTING GAME PROGRESS..."
    );

    if (saveTimeoutRef.current) {
      clearTimeout(
        saveTimeoutRef.current
      );

      saveTimeoutRef.current = null;
    }

    try {
      const response = await fetch(
        `${API_URL}/progress/${userId}/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Failed to reset progress:",
          data.message
        );

        restartingRef.current = false;
        isLoadingProgressRef.current = false;

        return;
      }

      console.log(
        "GAME PROGRESS RESET:",
        data.progress
      );

      setGameStarted(false);
      setGameEnded(false);

      setGamePhase(1);
      setCurrentScene("arrival");

      setInventory([]);
      setInspectedObject(null);

      setDrawerUnlocked(false);
      setPuzzleMessage("");

      setFinalChoice(null);

      setTimeout(() => {
        restartingRef.current = false;
        isLoadingProgressRef.current = false;

        console.log(
          "RESTART COMPLETE → PHASE 1 → ARRIVAL"
        );
      }, 500);
    } catch (error) {
      console.error(
        "Restart game error:",
        error.message
      );

      restartingRef.current = false;
      isLoadingProgressRef.current = false;
    }
  };

  /*
    Phase 22 is the actual final ending.
  */

  const endGame = async () => {
    setGameEnded(true);

    await saveProgress({
      currentPhase: 22,
      currentScene: "final",
      gameCompleted: true,
    });
  };

  /*
    Move to the next phase.
  */

  const nextPhase = () => {
    setGamePhase((previous) => {
      const next = previous + 1;

      console.log(
        "PHASE CHANGED:",
        previous,
        "→",
        next
      );

      if (next >= 2) {
        setGameStarted(true);
        setGameEnded(false);
      }

      return next;
    });
  };

  /*
    Go directly to a specific phase.
  */

  const goToPhase = (phase) => {
    console.log(
      "GOING TO PHASE:",
      phase
    );

    setGamePhase(phase);

    if (phase === 1) {
      setGameStarted(false);
      setGameEnded(false);
      setCurrentScene("arrival");
    } else {
      setGameStarted(true);
      setGameEnded(false);
    }
  };

  /*
    Collect a clue.
  */

  const collectClue = (clue) => {
    if (!clue) {
      return;
    }

    setInventory((previous) => {
      const alreadyCollected =
        previous.some(
          (item) =>
            item.id === clue.id
        );

      if (alreadyCollected) {
        return previous;
      }

      return [
        ...previous,
        clue,
      ];
    });
  };

  /*
    Inspect an object.
  */

  const inspectObject = (object) => {
    setInspectedObject(object);
  };

  /*
    Close object inspection.
  */

  const closeInspection = () => {
    setInspectedObject(null);
  };

  /*
    Unlock the drawer.
  */

  const unlockDrawer = () => {
    setDrawerUnlocked(true);

    const mysteriousLetter = {
      id: "mysterious-letter",
      name: "Mysterious Letter",
      description:
        "Someone knew you were coming. The final line reads: 'You should have stayed away.'",
    };

    collectClue(
      mysteriousLetter
    );
  };

  return (
    <GameContext.Provider
      value={{
        gameStarted,
        gameEnded,

        gamePhase,
        currentScene,

        inventory,
        inspectedObject,

        drawerUnlocked,
        puzzleMessage,

        finalChoice,

        progressLoaded,

        saveProgress,
        loadProgress,

        startGame,
        restartGame,

        endGame,

        nextPhase,
        goToPhase,

        setGamePhase,
        setCurrentScene,

        setPuzzleMessage,
        setFinalChoice,

        collectClue,

        inspectObject,
        closeInspection,

        unlockDrawer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(
    GameContext
  );

  if (!context) {
    throw new Error(
      "useGame must be used inside GameProvider"
    );
  }

  return context;
}