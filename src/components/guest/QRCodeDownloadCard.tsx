"use client";

import { QRCodeSVG } from "qrcode.react";

import { CopyButton } from "@/components/ui/CopyButton";

export function QRCodeDownloadCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-1 break-all text-xs text-slate-500">{value}</p>
      <div className="my-4 grid place-items-center rounded-xl bg-slate-50 p-4">
        <QRCodeSVG value={value} size={148} />
      </div>
      <CopyButton label="Copiar link" value={value} />
    </div>
  );
}
