export const bedroomObjects = [
  {
    id: "broken-clock",
    name: "BROKEN CLOCK",
    type: "clue",

    // Clock on the upper-left wall
    x: 22,
    y: 24,

    description:
      "The clock stopped at 11:47. But every few seconds, you hear it tick.",

    clue: {
      id: "clock-clue",
      name: "THE STOPPED TIME",
      description:
        "The hands are frozen at 11:47. Somehow, that time feels familiar.",
    },
  },

  {
    id: "old-radio",
    name: "OLD RADIO",
    type: "clue",

    // Radio on the desk
    x: 60,
    y: 47,

    description:
      "An old radio sits silently on the desk. There are no visible wires connected to it.",

    clue: {
      id: "radio-clue",
      name: "THE DEAD FREQUENCY",
      description:
        "For a moment, static breaks through the silence. A voice whispers: 'You came back.'",
    },
  },

  {
    id: "old-photo",
    name: "OLD PHOTOGRAPH",
    type: "clue",

    // Photograph on the right dresser
    x: 91,
    y: 58,

    description:
      "A dusty photograph rests beside the mirror. Someone's face has been violently scratched away.",

    clue: {
      id: "photo-clue",
      name: "THE MISSING FACE",
      description:
        "The photograph shows this exact bedroom. But there is someone standing beside the bed.",
    },
  },
];