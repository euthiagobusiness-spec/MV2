import Link from "next/link";
import { Box, PlayCircle } from "lucide-react";

import type { Property } from "@/lib/types";

export function VirtualTourEmbed({ property }: { property: Property }) {
  const links = [
    { label: "Tour virtual 360", href: property.virtual_tour_url },
    { label: "Video do apartamento", href: property.apartment_video_url },
    { label: "Video do condominio", href: property.condominium_video_url },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Tour virtual</h2>
        <div className="flex flex-wrap gap-3">
          <Link className="btn btn-primary" href="/tour-condominio">
            <Box size={18} /> Explorar condominio em 3D
          </Link>
        </div>
        {property.youtube_embed_url ? (
          <iframe
            allowFullScreen
            className="aspect-video w-full rounded-xl"
            src={property.youtube_embed_url}
            title={`Tour ${property.name}`}
          />
        ) : null}
        {links.length ? (
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <a className="btn btn-outline" href={link.href} key={link.label} rel="noreferrer" target="_blank">
                <PlayCircle size={18} /> {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
