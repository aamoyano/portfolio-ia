"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./Button";

/** Copia el email al portapapeles y muestra "Copiado" durante 2 s. */
export function CopyEmailButton({
  email,
  label,
  copiedLabel,
}: {
  email: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Sin permiso de portapapeles (p. ej. HTTP sin TLS): no mostramos "Copiado"
      setCopied(false);
    }
  }

  return (
    <Button variant="secondary" size="lg" onClick={handleCopy}>
      {copied ? (
        <Check className="h-4 w-4 text-emerald-400" aria-hidden />
      ) : (
        <Copy className="h-4 w-4" aria-hidden />
      )}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </Button>
  );
}
