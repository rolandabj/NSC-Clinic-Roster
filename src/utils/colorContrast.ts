/**
 * Readable text on the colours planners choose for shifts and leave (Settings), which the
 * screens show as a light tint with a coloured edge, or as a solid chip. Contrast is worked
 * out as WCAG 2 does, and text is kept at 4.5:1 or more whatever colour was chosen.
 */

/** The app's main and second level text colours (--color-ink and --color-ink-muted). */
export const INK = '#0f172a';
export const INK_MUTED = '#475569';
const WHITE = '#ffffff';
const BLACK = '#000000';
/** Shown instead of a stored colour that is not a colour (--color-sunken). */
const FALLBACK_TINT = '#f1f5f9';

/** [r, g, b] from '#rgb' or '#rrggbb', or null when the text is not such a colour. */
function rgbOf(hex: string | null | undefined): [number, number, number] | null {
  const m = (hex || '').trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const digits = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
  const n = parseInt(digits, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance([r, g, b]: [number, number, number]): number {
  const linear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** WCAG contrast ratio of two colours, from 1 to 21 (1 when either is not a colour). */
export function contrastRatio(a: string, b: string): number {
  const [ca, cb] = [rgbOf(a), rgbOf(b)];
  if (!ca || !cb) return 1;
  const [light, dark] = [luminance(ca), luminance(cb)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/**
 * Text colour for a solid background of the given colour: white or the app's dark text,
 * whichever reads better, or black for the few middle colours (pure red) where neither
 * reaches 4.5:1. A stored colour that is not a colour gets the dark text.
 */
export function readableTextOn(background: string | null | undefined): string {
  if (!rgbOf(background)) return INK;
  const onWhite = contrastRatio(WHITE, background!);
  const onInk = contrastRatio(INK, background!);
  if (Math.max(onWhite, onInk) >= 4.5) return onWhite >= onInk ? WHITE : INK;
  return BLACK;
}

/**
 * A light tint of a colour (amount of it mixed into white, 10 % by default), for cell and
 * badge backgrounds. The app's text colours read at 6:1 or more on any 10 % tint.
 */
export function tint(hex: string | null | undefined, amount = 0.1): string {
  const rgb = rgbOf(hex);
  if (!rgb) return FALLBACK_TINT;
  const mix = (c: number) => Math.round(255 - (255 - c) * amount);
  return `#${rgb.map((c) => mix(c).toString(16).padStart(2, '0')).join('')}`;
}
