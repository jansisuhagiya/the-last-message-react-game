const mongoose = require("mongoose");

const gameProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    currentPhase: {
      type: Number,
      default: 1,
      min: 1,
      max: 22,
    },

    currentScene: {
      type: String,
      default: "arrival",
    },

    collectedClues: {
      type: [String],
      default: [],
    },

    solvedPuzzles: {
      type: [String],
      default: [],
    },

    unlockedScenes: {
      type: [String],
      default: [],
    },

    dialogueChoices: {
      type: [String],
      default: [],
    },

    finalChoice: {
      type: String,
      default: null,
    },

    gameCompleted: {
      type: Boolean,
      default: false,
    },

    lastPlayedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "GameProgress",
  gameProgressSchema
);