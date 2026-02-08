/**
 * Shared emoji configuration for both frontend UI and backend API
 */
export const REACTION_EMOJIS = [
  { char: "❤️", label: "love" },
  { char: "🔥", label: "hot" },
  { char: "🚀", label: "rocket" },
  { char: "👍", label: "like" },
  { char: "🥳", label: "party" }
];

export const EMOJI_CHARS = REACTION_EMOJIS.map(e => e.char);
