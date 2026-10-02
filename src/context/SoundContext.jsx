import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(false);

  const mutedRef = useRef(false);
  const unlockedRef = useRef(false);

  const audioCacheRef = useRef({});

  // =========================
  // AUDIO FILES
  // =========================

  const soundFiles = {
    ambient: "/sounds/ambient.mp3",
    click: "/sounds/click.mp3",
    clue: "/sounds/clue.mp3",
    complete: "/sounds/complete.mp3",
    doorclose: "/sounds/doorclose.mp3",
    footstep: "/sounds/footstep.mp3",
    hover: "/sounds/hover.mp3",
    radio: "/sounds/radio.mp3",
    tape: "/sounds/tape.mp3",
    tick: "/sounds/tick.mp3",
    unlock: "/sounds/unlock.mp3",
  };

  // =========================
  // UNLOCK AUDIO
  // =========================

  const unlockAudio = useCallback(() => {
    if (unlockedRef.current) return;

    unlockedRef.current = true;

    try {
      const audio = new Audio();
      audio.volume = 0;

      audio.src = soundFiles.click;

      const promise = audio.play();

      if (promise) {
        promise
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.remove();
          })
          .catch(() => {
            // Browser may still block it.
          });
      }
    } catch (error) {
      console.warn("Audio unlock error:", error);
    }
  }, []);

  // =========================
  // PLAY SOUND
  // =========================

  const playSound = useCallback((name, volume = 0.5) => {
    if (mutedRef.current) return;

    const soundPath = soundFiles[name];

    if (!soundPath) {
      console.warn(`Sound "${name}" does not exist.`);
      return;
    }

    try {
      let audio = audioCacheRef.current[name];

      if (!audio) {
        audio = new Audio(soundPath);
        audio.preload = "auto";

        audioCacheRef.current[name] = audio;
      }

      audio.pause();
      audio.currentTime = 0;

      audio.volume = Math.max(0, Math.min(1, volume));

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn(
            `Could not play ${name}.mp3:`,
            error.message
          );
        });
      }
    } catch (error) {
      console.warn("Audio error:", error);
    }
  }, []);

  // =========================
  // TOGGLE MUTE
  // =========================

  const toggleMute = useCallback(() => {
    setMuted((previous) => {
      const newValue = !previous;

      mutedRef.current = newValue;

      return newValue;
    });
  }, []);

  // =========================
  // PROVIDER
  // =========================

  return (
    <SoundContext.Provider
      value={{
        muted,
        playSound,
        toggleMute,
        unlockAudio,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

// =========================
// USE SOUND HOOK
// =========================

export function useSound() {
  const context = useContext(SoundContext);

  if (!context) {
    throw new Error(
      "useSound must be used inside SoundProvider"
    );
  }

  return context;
}