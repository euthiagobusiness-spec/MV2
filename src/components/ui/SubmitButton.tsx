"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function SubmitButton({ children, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className={className ?? "btn btn-primary"} disabled={pending} type="submit">
      {pending ? <Loader2 className="animate-spin" size={18} /> : null}
      {children}
    </button>
  );
}
