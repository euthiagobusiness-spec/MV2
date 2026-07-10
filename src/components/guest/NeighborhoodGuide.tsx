import { Map, Music2, ShoppingBasket, Waves } from "lucide-react";

import { neighborhoodHighlights } from "@/lib/guest-information";

const icons = [Waves, ShoppingBasket, Music2, Map];

export function NeighborhoodGuide() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {neighborhoodHighlights.map((item, index) => {
        const Icon = icons[index];

        return (
          <div className="card p-5" key={item.title}>
            <Icon className="text-teal-700" size={23} />
            <h3 className="mt-3 font-black text-teal-950">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
