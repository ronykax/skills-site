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
  const copy = useCallback(() => {
    // biome-ignore lint/suspicious/noAlert: placeholder until real copy-to-clipboard UI lands
    alert(command);
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
