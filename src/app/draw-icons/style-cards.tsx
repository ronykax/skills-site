import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PromptButton } from "./prompt-button";

const DIR = join(process.cwd(), "src/app/draw-icons");

// The same twelve things in every style, so the only difference is the style.
const CONCEPTS = [
  "heart",
  "bell",
  "lock",
  "bookmark",
  "star",
  "house",
  "gear",
  "magnifier",
  "envelope",
  "cloud",
  "flame",
  "chat",
];

const BRANDS = [
  "spotify",
  "youtube",
  "x",
  "twitch",
  "instagram",
  "dribbble",
  "medium",
  "linkedin",
  "vercel",
  "framer",
  "pinterest",
  "patreon",
];

type Layout = "grid" | "brick" | "scatter";

interface CardStyle {
  /** Card background, also used for the fade behind the caption. */
  bg: string;
  /** One short line under the name. */
  blurb: string;
  /** Tailwind classes for the card: background and icon color. */
  card: string;
  /** Caption title color. */
  heading: string;
  icons: string[];
  /** Caption blurb color. */
  ink: string;
  label: string;
  layout: Layout;
  /** The /draw-icons prompt behind this style, copied when the card is tapped. */
  prompt: string;
  /** Icon set folder in ./icons. */
  set: string;
}

const STYLES: CardStyle[] = [
  {
    set: "pixel",
    bg: "#c6ef4f",
    blurb: "Blocky and retro",
    heading: "text-[#1b3a08]",
    ink: "text-[#1b3a08]/70",
    label: "Pixel",
    icons: [...CONCEPTS, "face"],
    layout: "grid",
    card: "bg-[#c6ef4f] text-[#5f8f14]",
    prompt: "retro pixel art on a 12px grid",
  },
  {
    set: "slab",
    bg: "#ff5b4f",
    blurb: "Thick, chunky solids",
    heading: "text-white",
    ink: "text-white/80",
    label: "Slab",
    icons: CONCEPTS,
    layout: "grid",
    card: "bg-[#ff5b4f] text-white/90",
    prompt: "chunky solid shapes, thick and blocky",
  },
  {
    set: "whiteboard",
    bg: "#dcebff",
    blurb: "Drawn by hand in marker",
    heading: "text-[#1f45c4]",
    ink: "text-[#1f45c4]/75",
    label: "Whiteboard",
    icons: CONCEPTS,
    layout: "scatter",
    card: "bg-[#dcebff] text-[#1f45c4]/55",
    prompt: "hand-drawn, like marker on a whiteboard",
  },
  {
    set: "duotone",
    bg: "#8a5cf6",
    blurb: "Soft lines, tinted fill",
    heading: "text-white",
    ink: "text-white/80",
    label: "Duotone",
    icons: CONCEPTS,
    layout: "brick",
    card: "bg-[#8a5cf6] text-white",
    prompt: "soft outlines with a tinted fill",
  },
  {
    set: "brand",
    bg: "#10a99c",
    blurb: "Real logos, redrawn to match",
    heading: "text-white",
    ink: "text-white/80",
    label: "Brands",
    icons: BRANDS,
    layout: "grid",
    card: "bg-[#10a99c] text-white",
    prompt: "our partner logos, redrawn to match",
  },
  {
    set: "jelly",
    bg: "#ff7bc0",
    blurb: "Gummy, with a little shine",
    heading: "text-white",
    ink: "text-white/85",
    label: "Jelly",
    icons: CONCEPTS,
    layout: "brick",
    card: "bg-[#ff7bc0] text-white",
    prompt: "gummy, rounded solids with a little shine",
  },
];

// The pattern is drawn on a fixed canvas centred in the card, so icons keep their exact px size at any card width.
const CANVAS = { w: 560, h: 320 };
/** Icon size in px. It's in every set's `sizes` (and a whole multiple of the pixel set's 12 grid). */
const SIZE = 36;
/** Space between neighbouring icons, the same on every card. */
const GAP = 22;
const PITCH = SIZE + GAP;
const PAINT =
  /(?:fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|shape-rendering)="[^"]*"/gu;

/** Turns a built icon into a <symbol>, scoping its mask ids to this card. */
function symbol(set: string, name: string, prefix: string) {
  const svg = readFileSync(join(DIR, "icons", set, `${name}.svg`), "utf8");
  const open = svg.slice(0, svg.indexOf(">"));
  const body = svg.slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>"));
  const viewBox = open.split('viewBox="')[1]?.split('"')[0] ?? "0 0 24 24";
  const paint = open.match(PAINT)?.join(" ") ?? "";
  const scoped = body
    .replaceAll('id="', `id="${prefix}-`)
    .replaceAll("url(#", `url(#${prefix}-`);
  return `<symbol id="${prefix}-${name}" viewBox="${viewBox}" overflow="visible"><g ${paint}>${scoped}</g></symbol>`;
}

// Small deterministic noise so the scatter layout looks hand-placed but never changes.
function noise(n: number) {
  const x = Math.sin(n * 12.9898) * 43_758.5453;
  return x - Math.floor(x);
}

interface Spot {
  rot: number;
  x: number;
  y: number;
}

/** Where the icon in row r, column c goes, measured from the card's centre. */
function place(layout: Layout, r: number, c: number): Spot {
  const brick = layout === "brick" && r % 2 !== 0 ? PITCH / 2 : 0;
  const x = c * PITCH + brick;
  const y = r * PITCH;
  if (layout === "scatter") {
    const k = (r + 50) * 101 + c + 50;
    const jitter = SIZE / 4;
    return {
      x: x + (noise(k) - 0.5) * jitter,
      y: y + (noise(k + 0.5) - 0.5) * jitter,
      rot: (noise(k + 0.25) - 0.5) * 30,
    };
  }
  return { x, y, rot: 0 };
}

function onCanvas({ x, y }: Spot) {
  return (
    Math.abs(x) <= CANVAS.w / 2 + SIZE && Math.abs(y) <= CANVAS.h / 2 + SIZE
  );
}

function iconAt(prefix: string, name: string, spot: Spot) {
  const x = Math.round(spot.x);
  const y = Math.round(spot.y);
  const rotate = spot.rot
    ? ` transform="rotate(${spot.rot.toFixed(1)} ${x} ${y})"`
    : "";
  return `<use href="#${prefix}-${name}" x="${x - SIZE / 2}" y="${y - SIZE / 2}" width="${SIZE}" height="${SIZE}"${rotate}/>`;
}

function pattern(style: CardStyle, prefix: string) {
  const { layout, icons } = style;
  const cols = Math.ceil(CANVAS.w / PITCH / 2);
  const rows = Math.ceil(CANVAS.h / PITCH / 2) + 1;
  const uses: string[] = [];

  for (let r = -rows; r <= rows; r += 1) {
    for (let c = -cols; c <= cols; c += 1) {
      const spot = place(layout, r, c);
      if (onCanvas(spot)) {
        // Neighbours never repeat: steps of 7 across and 5 down through the list.
        const n = icons.length;
        const name = icons[(((c * 7 + r * 5) % n) + n) % n];
        uses.push(iconAt(prefix, name, spot));
      }
    }
  }

  const defs = [...new Set(icons)]
    .map((name) => symbol(style.set, name, prefix))
    .join("");
  return `<defs>${defs}</defs>${uses.join("")}`;
}

export function StyleCards() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {STYLES.map((style) => (
        // clip-path (not just overflow) so the pattern and caption fade never bleed past the rounded corners
        <li
          className={`relative aspect-[2/1] overflow-hidden rounded-3xl [clip-path:inset(0_round_1.5rem)] ${style.card}`}
          key={style.set}
        >
          <PromptButton label={style.label} prompt={style.prompt}>
            <span className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-108 motion-reduce:transition-none">
              <svg
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-85"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted SVGs built from this repo's icon sources
                dangerouslySetInnerHTML={{
                  __html: pattern(style, `sc-${style.set}`),
                }}
                height={CANVAS.h}
                viewBox={`${-CANVAS.w / 2} ${-CANVAS.h / 2} ${CANVAS.w} ${CANVAS.h}`}
                width={CANVAS.w}
              />
            </span>
            <span className="absolute bottom-5 left-5">
              {/* Fades the icons out behind the caption only, so the rest of the card stays clear. */}
              <span
                className="absolute -inset-6 -bottom-12 -left-12 rounded-3xl blur-md"
                style={{ background: style.bg }}
              />
              <span
                className={`font-display relative block text-4xl leading-tight font-bold tracking-tight text-shadow-md ${style.heading}`}
              >
                {style.label}
              </span>
              <span
                className={`relative block text-sm font-medium ${style.ink}`}
              >
                {style.blurb}
              </span>
            </span>
          </PromptButton>
        </li>
      ))}
    </ul>
  );
}
