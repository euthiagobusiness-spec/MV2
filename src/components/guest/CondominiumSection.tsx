import { CheckCircle2 } from "lucide-react";

import type { Property } from "@/lib/types";

export function CondominiumSection({ property }: { property: Property }) {
  const images = property.condominium_gallery_images ?? [];
  const amenities = property.condominium_amenities ?? [];

  return (
    <section className="bg-slate-950 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-300">
            Tour pelo condominio
          </p>
          <h2 className="mt-2 text-3xl font-black">Conheca o condominio</h2>
          <p className="mt-4 leading-7 text-white/72">
            {property.condominium_description}
          </p>
          <div className="mt-6 grid gap-2">
            {amenities.map((amenity) => (
              <span className="flex items-center gap-2 text-sm font-bold text-white/86" key={amenity}>
                <CheckCircle2 className="text-sky-300" size={18} />
                {amenity}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {images.slice(0, 6).map((image, index) => (
            <img
              alt={`Area externa ${index + 1}`}
              className="aspect-[4/3] w-full rounded-xl object-cover"
              key={image}
              src={image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
