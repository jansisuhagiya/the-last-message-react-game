const express = require("express");

const GameProgress = require("../models/GameProgress");
const User = require("../models/User");

const router = express.Router();


// Get game progress
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const progress = await GameProgress.findOne({
      user: userId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Game progress not found.",
      });
    }

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error(
      "Get progress error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});


// Create or update game progress
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      currentPhase,
      currentScene,
      collectedClues,
      solvedPuzzles,
      unlockedScenes,
      dialogueChoices,
      finalChoice,
      gameCompleted,
    } = req.body;


    // Check user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }


    // Validate phase
    if (
      currentPhase !== undefined &&
      (!Number.isInteger(currentPhase) ||
        currentPhase < 1 ||
        currentPhase > 22)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid game phase. Phase must be between 1 and 22.",
      });
    }


    let progress = await GameProgress.findOne({
      user: userId,
    });


    if (!progress) {
      progress = new GameProgress({
        user: userId,
      });
    }


    if (currentPhase !== undefined) {
      progress.currentPhase = currentPhase;
    }

    if (currentScene !== undefined) {
      progress.currentScene = currentScene;
    }

    if (collectedClues !== undefined) {
      progress.collectedClues = collectedClues;
    }

    if (solvedPuzzles !== undefined) {
      progress.solvedPuzzles = solvedPuzzles;
    }

    if (unlockedScenes !== undefined) {
      progress.unlockedScenes = unlockedScenes;
    }

    if (dialogueChoices !== undefined) {
      progress.dialogueChoices = dialogueChoices;
    }

    if (finalChoice !== undefined) {
      progress.finalChoice = finalChoice;
    }


    // Phase 22 is the final phase
    if (currentPhase === 22) {
      progress.currentPhase = 22;
      progress.gameCompleted = true;
    } else if (gameCompleted !== undefined) {
      progress.gameCompleted = gameCompleted;
    }


    progress.lastPlayedAt = new Date();

    await progress.save();


    res.json({
      success: true,
      message: "Game progress saved successfully.",
      progress,
    });
  } catch (error) {
    console.error(
      "Save progress error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});


// Reset game progress
router.post("/:userId/reset", async (req, res) => {
  try {
    const { userId } = req.params;

    const progress = await GameProgress.findOneAndUpdate(
      {
        user: userId,
      },
      {
        currentPhase: 1,
        currentScene: "arrival",
        collectedClues: [],
        solvedPuzzles: [],
        unlockedScenes: [],
        dialogueChoices: [],
        finalChoice: null,
        gameCompleted: false,
        lastPlayedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    );


    res.json({
      success: true,
      message: "Game progress reset successfully.",
      progress,
    });
  } catch (error) {
    console.error(
      "Reset progress error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to reset game progress.",
    });
  }
});


module.exports = router;