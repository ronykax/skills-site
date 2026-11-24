// Same mark as src/app/icon.svg (the favicon): a rounded square split along its diagonals.
const TRIANGLES = [
  ["fill-bubblegum", "M0 0H32L16 16Z"],
  ["fill-lemon", "M32 0V32L16 16Z"],
  ["fill-mint", "M32 32H0L16 16Z"],
  ["fill-cobalt", "M0 32V0L16 16Z"],
] as const;

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 overflow-hidden rounded-[25%] ${className}`}
    >
      <svg aria-hidden="true" className="block size-full" viewBox="0 0 32 32">
        {TRIANGLES.map(([fill, d]) => (
          <path className={fill} d={d} key={fill} />
        ))}
      </svg>
    </span>
  );
}
