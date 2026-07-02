export type Accent = { id: string; label: string; hsl: string };

/** Accent palettes for the theme-colour picker. `hsl` is an "H S% L%" triple.
 * All are chosen to read well with white foreground text in light and dark. */
export const ACCENTS: Accent[] = [
  { id: "violet", label: "Violet", hsl: "255 85% 62%" },
  { id: "crimson", label: "Crimson", hsl: "348 83% 55%" },
  { id: "blue", label: "Blue", hsl: "217 91% 58%" },
  { id: "emerald", label: "Emerald", hsl: "152 58% 42%" },
  { id: "amber", label: "Amber", hsl: "28 92% 50%" },
  { id: "purple", label: "Purple", hsl: "271 76% 60%" },
  { id: "rose", label: "Rose", hsl: "336 80% 58%" },
  { id: "teal", label: "Teal", hsl: "182 65% 40%" },
];

export const DEFAULT_ACCENT = ACCENTS[0];

/** Apply an accent (H S% L% string) by overriding the CSS variables. */
export function applyAccent(hsl: string) {
  const s = document.documentElement.style;
  s.setProperty("--accent", hsl);
  s.setProperty("--ring", hsl);
  s.setProperty("--accent-fg", "0 0% 100%");
}
