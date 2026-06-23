import { MapPin, MessageCircle, Users } from "lucide-react";
import type { ComponentType } from "react";

import type { Property } from "@/lib/types";
import { whatsappUrl } from "@/lib/utils";

export function PropertyPreviewHero({ property }: { property: Property }) {
  const whatsapp = whatsappUrl(
    "5512999990000",
    `Ola, estou vendo a previa do ${property.name} e preciso de ajuda.`,
  );

  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 pt-4 lg:px-8">
      <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[380px] bg-slate-100">
          {property.cover_image_url ? (
            <img
              alt={property.name}
              className="absolute inset-0 h-full w-full object-cover"
              src={property.cover_image_url}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
          <div className="absolute bottom-5 left-5 rounded-full bg-white/92 px-4 py-2 text-sm font-black text-slate-950">
            Praia do Sape - Maranduba
          </div>
        </div>
        <div className="grid content-center gap-6 p-6 lg:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">
              Previa publica do apartamento
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950 lg:text-5xl">
              {property.name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {property.short_description}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Badge icon={MapPin} label={property.condominium_name} />
            <Badge icon={Users} label={`Ate ${property.max_guests} hospedes`} />
            <Badge label="5 min da praia" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a className="btn btn-primary" href={whatsapp}>
              <MessageCircle size={18} /> Suporte WhatsApp
            </a>
            <a className="btn btn-outline" href="#galeria">
              Ver fotos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({
  icon: Icon,
  label,
}: {
  icon?: ComponentType<{ size?: number }>;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">
      {Icon ? <Icon size={18} /> : null}
      {label}
    </span>
  );
}
