"use client";

import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface CopyCommandProps {
  checkIcon: ReactNode;
  command: string;
  copyIcon: ReactNode;
}

export function CopyCommand({
  command,
  copyIcon,
  checkIcon,
}: CopyCommandProps) {
  const [copied, setCopied] = useState(false);
  const copyLabel = useRef<HTMLSpanElement>(null);
  const copiedLabel = useRef<HTMLSpanElement>(null);
  const [labelWidths, setLabelWidths] = useState<{
    copy: number;
    copied: number;
  } | null>(null);

  // Measure both labels so the pill can animate between their real widths.
  useLayoutEffect(() => {
    const measure = () => {
      if (copyLabel.current && copiedLabel.current) {
        setLabelWidths({
          copy: copyLabel.current.offsetWidth,
          copied: copiedLabel.current.offsetWidth,
        });
      }
    };
    measure();
    document.fonts?.ready.then(measure);
    // The label is hidden on small screens (width 0), so measure again when that changes.
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      // Clipboard API blocked (permissions, insecure context): fall back to a hidden textarea.
      const textarea = document.createElement("textarea");
      textarea.value = command;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
  }, [command]);

  return (
    <button
      aria-label={`Copy command: ${command}`}
      className="bg-foreground/6 hover:bg-foreground/10 flex w-full max-w-2xl cursor-pointer items-center gap-3 rounded-2xl py-2 pr-2 pl-5 text-left transition-[background-color,scale] active:scale-[0.99]"
      onClick={copy}
      type="button"
    >
      <code className="min-w-0 flex-1 truncate py-2 font-mono text-[13px] leading-relaxed font-semibold tracking-tight sm:text-[15px]">
        <span className="text-foreground/40 mr-2.5 inline-block text-[1.15em] leading-none select-none">
          $
        </span>
        npx skills add ronykax/skills{" "}
        <span className="text-foreground/55">--skill</span> draw-icons
      </code>
      <span
        className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-medium shadow-[0_1px_2px_rgb(0_0_0/0.08)] transition-colors ${
          copied ? "bg-mint text-white" : "text-foreground bg-white"
        }`}
      >
        <span className="grid size-5 *:col-start-1 *:row-start-1 *:transition-all *:duration-200">
          <span className={copied ? "scale-50 opacity-0" : ""}>{copyIcon}</span>
          <span className={copied ? "" : "scale-50 opacity-0"}>
            {checkIcon}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="relative hidden overflow-hidden transition-[width] duration-200 ease-out sm:block"
          style={
            labelWidths
              ? { width: copied ? labelWidths.copied : labelWidths.copy }
              : undefined
          }
        >
          <span
            className={`block whitespace-nowrap transition-all duration-200 ${
              copied ? "-translate-y-2 opacity-0" : ""
            }`}
            ref={copyLabel}
          >
            Copy
          </span>
          <span
            className={`absolute top-0 left-0 whitespace-nowrap transition-all duration-200 ${
              copied ? "" : "translate-y-2 opacity-0"
            }`}
            ref={copiedLabel}
          >
            Copied
          </span>
        </span>
        <span aria-live="polite" className="sr-only">
          {copied ? "Copied" : ""}
        </span>
      </span>
    </button>
  );
}
