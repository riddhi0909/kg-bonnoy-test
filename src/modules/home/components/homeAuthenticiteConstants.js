const HP = "/figma/hp";

/** Default cream fill (Figma-style). Override via `backgroundColor`. */
export const DEFAULT_VALUES_SECTION_BG = "#fffaf5";

export const INK = "#0D1B2A";

export const BODY_DEFAULT =
  "Massa dictum pulvinar pellentesque iaculis nullam id. Sed eu varius non adipiscing posuere amet id pharetra eu lorem ipsum magna. Massa dictum pulvinar pellentesque iaculis nullam id.";

export const DROP =
  "drop-shadow(0 14px 28px rgba(13, 27, 42, 0.12)) drop-shadow(0 4px 10px rgba(13, 27, 42, 0.08))";

/** Parallax intensity multipliers for each ring slot (depth layering) */
export const PARALLAX_INTENSITIES = [0.03, 0.025, 0.04, 0.035, 0.02, 0.03];

/**
 * Figma BONNOT "valeurs" frame (~1440×860): orbital ring anchors (transform center).
 * Index order must match {@link AUTH_VALUES_ORBIT_RING_SRCS}:
 * 0 top-left · 1 top-right · 2 mid-left (≈180×180) · 3 mid-right · 4 bottom-left · 5 bottom-right.
 * `auth_center.png` is not orbital — use as `excellenceRingSrc`.
 *
 * Ref layout (Figma hero): TL above AUTHENTICITÉ left · TR above ITÉ · ML left of EXCELLENCE · MR right of EXCELLENCE · BL under SINGULARITÉ left · BR under TÉ. Center ring: over mid "EXCELLENCE" (LL), 50% / 50% on word box.
 */
export const DEFAULT_VALUES_RING_SLOTS = [
  { top: "10%", left: "20%", width: "min(20vw, 200px)"},
  { top: "10%", left: "80%", width: "min(27vw, 255px)"},
  { top: "46%", left: "7%", width: "min(12.5vw, 180px)"},
  { top: "45%", left: "93%", width: "min(25vw, 235px)"},
  { top: "77%", left: "18%", width: "min(24vw, 245px)"},
  { top: "77%", left: "80%", width: "min(26vw, 250px)"},
];

export const MOBILE_VALUES_RING_SLOTS = [
  { top: "20%", left: "20%", width: "min(30vw, 200px)"},
  { top: "20%", left: "80%", width: "min(30vw, 255px)"},
  { top: "5%", left: "50%", width: "min(50vw, 180px)"},
  { top: "75%", left: "50%", width: "min(50vw, 235px)"},
  { top: "60%", left: "18%", width: "min(40vw, 245px)"},
  { top: "60%", left: "80%", width: "min(30vw, 250px)"},
];

/** Orbital rings only (6). Center word ring = {@link AUTH_VALUES_CENTER_RING_SRC}. */
export const AUTH_VALUES_ORBIT_RING_SRCS = [
  `${HP}/auth_left_top.png`,
  `${HP}/auth_right_top.png`,
  `${HP}/auth_left_middle.png`,
  `${HP}/auth_right_middle.png`,
  `${HP}/auth_left_bottom.png`,
  `${HP}/auth_right_bottom.png`,
];

export const AUTH_VALUES_CENTER_RING_SRC = `${HP}/auth_center.png`;

/**
 * @returns {Array<{ src: string; alt: string }>}
 */
export function defaultFigmaValuesRings() {
  return AUTH_VALUES_ORBIT_RING_SRCS.map((src) => ({ src, alt: "" }));
}
