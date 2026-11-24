import type { Metadata } from "next";
import { CopyCommand } from "./copy-command";
import { Icon } from "./inline-icon";
import { Logo } from "./logo";

export const metadata: Metadata = {
  title: "draw-icons",
  description:
    "A skill that lets your agent draw icons that match the look of your product.",
};

const COMMAND = "npx skills add ronykax/skills --skill draw-icons";

// Same four things in every style, so the only difference is the style.
const CONCEPTS = ["heart", "bell", "lock", "bookmark"];

const SHOWCASE = [
  {
    set: "pixel",
    icons: CONCEPTS,
    label: "Pixel art",
    spec: "Blocky and retro",
    tile: "bg-tint-mint",
  },
  {
    set: "rounded",
    icons: CONCEPTS,
    label: "Rounded",
    spec: "Soft corners, round ends",
    tile: "bg-tint-sky",
  },
  {
    set: "sharp",
    icons: CONCEPTS,
    label: "Sharp",
    spec: "Thin lines, hard corners",
    tile: "bg-tint-rose",
  },
  {
    set: "brand",
    icons: ["spotify", "youtube", "x", "twitch"],
    label: "Brand logos",
    spec: "Real logos, redrawn to match",
    tile: "bg-tint-lilac",
  },
];

const VALUES = [
  {
    title: "A set, not a pile",
    body: "Your icons all have the same corners, stroke and size, so they stop looking like they came from three different packs.",
    dot: "bg-bubblegum",
  },
  {
    title: "Icons that don't exist yet",
    body: "Every icon is drawn for your product, even ones like “streak” or “invoice sent”. You don't need an icon library at all.",
    dot: "bg-lemon",
  },
  {
    title: "Crisp where it counts",
    body: "Each icon gets checked at the sizes your app shows it at, so it still looks sharp at 16px.",
    dot: "bg-lagoon",
  },
  {
    title: "Already in your app",
    body: "You get plain SVGs that use your text color, already added where they're needed. Any language, any framework.",
    dot: "bg-grape",
  },
];

const FOOTER_LINKS = [
  { label: "X (Twitter)", href: "https://x.com/ronykax" },
  { label: "Discord", href: "https://discord.ronykax.com" },
  { label: "Rony Kati", href: "https://ronykax.com" },
];

const copyIcon = <Icon className="size-5" name="copy" set="ui" />;
const checkIcon = <Icon className="size-5" name="check" set="ui" />;
const starIcon = (
  <Icon className="text-lemon size-5" name="star-filled" set="ui" />
);

export default function DrawIconsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pt-10 pb-10 sm:px-8 sm:pt-16 sm:pb-12">
      <header className="flex items-center justify-between gap-4">
        <a
          className="font-display flex items-center gap-2 text-xl font-bold tracking-tight"
          href="/draw-icons"
        >
          <Logo className="size-6" />
          <span>
            <span className="text-foreground/40">
              skills<span className="mx-0.5">/</span>
            </span>
            draw-icons
          </span>
        </a>
        <a
          className="bg-foreground/6 hover:bg-foreground/10 flex items-center gap-1.5 rounded-full py-2 pr-4 pl-3 text-sm font-medium transition-colors"
          href="https://github.com/ronykax/skills"
        >
          {starIcon}
          Star on GitHub
        </a>
      </header>

      <section className="pt-16 sm:pt-24">
        <h1 className="font-display max-w-3xl text-5xl leading-[1] font-extrabold tracking-tight text-balance sm:text-7xl">
          Icons that look like they{" "}
          <span className="text-bubblegum">belong</span>
        </h1>
        <p className="text-foreground/65 mt-10 max-w-xl text-lg leading-relaxed text-pretty">
          Drop the icon library. Your agent draws your app&apos;s whole icon set
          from a few rules made for your product, so every icon matches.
        </p>
        <div className="mt-12">
          <CopyCommand
            checkIcon={checkIcon}
            command={COMMAND}
            copyIcon={copyIcon}
          />
        </div>
      </section>

      <ul className="mt-20 grid gap-3 sm:mt-28 sm:grid-cols-2">
        {SHOWCASE.map((item) => (
          <li
            className={`flex aspect-[4/3] flex-col justify-between rounded-3xl p-5 sm:aspect-[16/10] sm:p-6 ${item.tile}`}
            key={item.set}
          >
            <div className="text-foreground flex flex-1 items-center justify-center gap-6 sm:gap-8">
              {item.icons.map((name) => (
                <Icon
                  className="size-12"
                  key={name}
                  name={name}
                  set={item.set}
                />
              ))}
            </div>
            <div>
              <p className="font-display text-foreground text-lg font-bold tracking-tight">
                {item.label}
              </p>
              <p className="text-foreground/55 text-sm">{item.spec}</p>
            </div>
          </li>
        ))}
      </ul>

      <section className="pt-20 sm:pt-28">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          What you get
        </h2>
        <dl className="divide-foreground/10 border-foreground/10 mt-8 divide-y border-t">
          {VALUES.map((value) => (
            <div
              className="grid gap-2 py-6 sm:grid-cols-[1fr_2fr] sm:items-center sm:gap-12"
              key={value.title}
            >
              <dt className="font-display flex items-center gap-2.5 text-xl font-bold tracking-tight">
                <span
                  className={`size-2.5 shrink-0 rounded-full ${value.dot}`}
                />
                {value.title}
              </dt>
              <dd className="text-foreground/65 leading-relaxed text-pretty">
                {value.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="text-foreground/50 mt-20 flex flex-col-reverse items-center gap-3 text-sm sm:mt-28 sm:flex-row sm:justify-between">
        <p className="border-foreground/10 bg-foreground/[0.03] flex items-center gap-2 rounded-full border py-2 pr-4 pl-3.5 text-[15px]">
          <span aria-hidden="true" className="text-foreground/30">
            ›
          </span>
          <span>
            <span className="text-grape font-medium">/draw-icons</span>{" "}
            <span className="text-foreground/70">
              a matching set for the settings sidebar
            </span>
          </span>
          <span
            aria-hidden="true"
            className="bg-foreground/40 animate-blink -ml-1 h-4 w-px motion-reduce:animate-none"
          />
        </p>
        <nav className="flex gap-5">
          {FOOTER_LINKS.map((link) => (
            <a
              className="hover:text-foreground transition-colors"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
