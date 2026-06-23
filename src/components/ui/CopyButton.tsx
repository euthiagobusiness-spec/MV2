"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
};

export function CopyButton({
  value,
  label = "Copiar",
  copiedLabel = "Copiado",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className={cn("btn btn-secondary", className)}
      onClick={handleCopy}
      type="button"
    >
      {copied ? <Check size={17} /> : <Copy size={17} />}
      {copied ? copiedLabel : label}
    </button>
  );
}
