import { readFileSync } from "node:fs";
import { join } from "node:path";

const ICONS_DIR = join(process.cwd(), "src/app/draw-icons/icons");
const SIZE_ATTRS = / width="\d+" height="\d+"/u;

interface IconProps {
  className?: string;
  name: string;
  set: string;
}

/** Inlines a built SVG from `icons/<set>/<name>.svg` so it draws in `currentColor`. */
export function Icon({ set, name, className = "" }: IconProps) {
  const svg = readFileSync(join(ICONS_DIR, set, `${name}.svg`), "utf8").replace(
    SIZE_ATTRS,
    ' width="100%" height="100%"'
  );

  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 [&>svg]:block ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted SVGs built from this repo's icon sources
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
