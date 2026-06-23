"use client";

import { QRCodeSVG } from "qrcode.react";

import { CopyButton } from "@/components/ui/CopyButton";

type QRCodeCardProps = {
  value: string;
  title?: string;
};

export function QRCodeCard({ value, title = "QR Code do portal" }: QRCodeCardProps) {
  return (
    <div className="card grid gap-4 p-4">
      <div>
        <p className="text-sm font-bold text-teal-950">{title}</p>
        <p className="mt-1 break-all text-xs text-slate-500">{value}</p>
      </div>
      <div className="mx-auto rounded-lg bg-white p-3">
        <QRCodeSVG value={value} size={156} />
      </div>
      <CopyButton value={value} label="Copiar link" />
    </div>
  );
}
