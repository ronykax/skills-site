import type { Metadata } from "next";
import { CopyCommand } from "./copy-command";
import { Icon } from "./inline-icon";
import { Logo } from "./logo";
import { StyleCards } from "./style-cards";

export const metadata: Metadata = {
  title: "draw-icons",
  description:
    "A skill that lets your agent draw icons that match the look of your product.",
};

const COMMAND = "npx skills add ronykax/skills --skill draw-icons";

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

function BrandLink({ className = "" }: { className?: string }) {
  return (
    <a
      className={`font-display flex items-center gap-2 text-xl font-bold tracking-tight ${className}`}
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
  );
}

export default function DrawIconsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pt-10 pb-10 sm:px-8 sm:pt-16 sm:pb-12">
      <header className="flex items-center justify-between gap-4">
        <BrandLink />
        <a
          className="bg-foreground/6 hover:bg-foreground/10 flex items-center gap-1.5 rounded-full py-2 pr-4 pl-3 text-sm font-medium transition-colors"
          href="https://github.com/ronykax/skills"
          rel="noopener noreferrer"
          target="_blank"
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

      <section className="pt-20 sm:pt-28">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          One skill, any style
        </h2>
        <p className="text-foreground/65 mt-4 max-w-xl text-lg leading-relaxed text-pretty">
          Every icon here was drawn by draw-icons. Tap to copy the prompt.
        </p>
        <div className="mt-8">
          <StyleCards />
        </div>
      </section>

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
        <BrandLink className="text-foreground" />
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <a
              className="hover:text-foreground transition-colors"
              href={link.href}
              key={link.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
