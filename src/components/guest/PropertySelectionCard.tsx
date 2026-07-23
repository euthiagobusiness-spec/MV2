import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Users } from "lucide-react";

import type { Property } from "@/lib/types";

export function PropertySelectionCard({ property }: { property: Property }) {
  const href = `/property-preview/${property.slug}`;

  return (
    <Link
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
      href={href}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {property.cover_image_url ? (
          <Image
            alt={property.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
            src={property.cover_image_url}
          />
        ) : null}
        <div className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-sm font-black text-slate-950">
          {property.name.replace("Apartamento ", "")}
        </div>
      </div>
      <div className="grid gap-4 p-4">
        <div>
          <h3 className="text-lg font-black text-slate-950">{property.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-600">
            <MapPin size={15} /> {property.condominium_name}
          </p>
          <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
            {property.short_description}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 p-2">
            <Users size={15} /> {property.max_guests}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 p-2">
            <BedDouble size={15} /> Quarto
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 p-2">
            <Bath size={15} /> Banho
          </span>
        </div>
        <span className="btn btn-primary w-full">Este e o meu apartamento</span>
      </div>
    </Link>
  );
}
