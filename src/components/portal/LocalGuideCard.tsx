import { Camera, MapPinned, MessageCircle, Star } from "lucide-react";
import Image from "next/image";

import type { LocalGuideItem } from "@/lib/types";

type LocalGuideCardProps = {
  item: LocalGuideItem;
};

export function LocalGuideCard({ item }: LocalGuideCardProps) {
  return (
    <article className="card overflow-hidden">
      {item.image_url ? (
        <Image
          alt={item.title}
          className="h-44 w-full object-cover"
          height={360}
          src={item.image_url}
          width={640}
        />
      ) : null}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-teal-700">
              {item.category}
            </p>
            <h3 className="mt-1 text-lg font-black text-teal-950">{item.title}</h3>
          </div>
          {item.recommended ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-900">
              <Star size={13} /> Recomendado
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
        {item.address ? (
          <p className="mt-3 text-sm font-semibold text-slate-700">{item.address}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {item.google_maps_url ? (
            <a
              className="btn btn-secondary text-sm"
              href={item.google_maps_url}
              rel="noreferrer"
              target="_blank"
            >
              <MapPinned size={16} /> Maps
            </a>
          ) : null}
          {item.whatsapp_url ? (
            <a
              className="btn btn-outline text-sm"
              href={item.whatsapp_url}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          ) : null}
          {item.instagram_url ? (
            <a
              className="btn btn-outline text-sm"
              href={item.instagram_url}
              rel="noreferrer"
              target="_blank"
            >
              <Camera size={16} /> Instagram
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
