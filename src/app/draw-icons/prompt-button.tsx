"use client";

import type { ReactNode } from "react";
import { useCallback } from "react";

interface PromptButtonProps {
  children: ReactNode;
  label: string;
  prompt: string;
}

export function PromptButton({ children, label, prompt }: PromptButtonProps) {
  const command = `/draw-icons ${prompt}`;
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
    // biome-ignore lint/suspicious/noAlert: placeholder until a real "copied" UI lands
    alert("Copied to your clipboard!");
  }, [command]);

  return (
    <button
      aria-label={`Copy the ${label} prompt: ${command}`}
      className="group absolute inset-0 cursor-pointer text-left"
      onClick={copy}
      type="button"
    >
      {children}
    </button>
  );
}
