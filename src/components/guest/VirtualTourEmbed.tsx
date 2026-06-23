import { PlayCircle } from "lucide-react";

import type { Property } from "@/lib/types";

export function VirtualTourEmbed({ property }: { property: Property }) {
  const links = [
    { label: "Tour virtual 360", href: property.virtual_tour_url },
    { label: "Video do apartamento", href: property.apartment_video_url },
    { label: "Video do condominio", href: property.condominium_video_url },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  if (!links.length && !property.youtube_embed_url && !property.map_embed_url) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="rounded-xl border border-sky-100 bg-sky-50 p-5 text-sky-950">
          <p className="font-black">Tour virtual em preparacao</p>
          <p className="mt-1 text-sm leading-6">
            Este espaco ja esta pronto para receber links 360, videos, YouTube,
            Vimeo ou Matterport quando forem cadastrados.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Tour virtual</h2>
        {property.youtube_embed_url ? (
          <iframe
            allowFullScreen
            className="aspect-video w-full rounded-xl"
            src={property.youtube_embed_url}
            title={`Tour ${property.name}`}
          />
        ) : null}
        <div className="flex flex-wrap gap-3">
          {links.map((link) => (
            <a className="btn btn-outline" href={link.href} key={link.label} rel="noreferrer" target="_blank">
              <PlayCircle size={18} /> {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
