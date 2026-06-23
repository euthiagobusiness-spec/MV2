import { MessageCircle } from "lucide-react";

import { cn, whatsappUrl } from "@/lib/utils";

type WhatsAppButtonProps = {
  phone: string;
  message?: string;
  label?: string;
  className?: string;
};

export function WhatsAppButton({
  phone,
  message,
  label = "WhatsApp",
  className,
}: WhatsAppButtonProps) {
  return (
    <a
      className={cn("btn btn-primary", className)}
      href={whatsappUrl(phone, message)}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle size={18} />
      {label}
    </a>
  );
}
