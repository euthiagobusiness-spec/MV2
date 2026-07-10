import {
  BedDouble,
  Car,
  CookingPot,
  Waves,
  Zap,
} from "lucide-react";

import { stayEssentials } from "@/lib/guest-information";
import type { Property } from "@/lib/types";

const icons = [Zap, Waves, BedDouble, CookingPot];

export function StayEssentials({ property }: { property: Property }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stayEssentials.map((item, index) => {
        const Icon = icons[index];

        return (
          <div className="card p-4" key={item.title}>
            <Icon className="text-teal-700" size={22} />
            <p className="mt-3 text-sm font-bold text-slate-500">{item.title}</p>
            <p className="mt-1 font-black text-teal-950">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </div>
        );
      })}

      <div className="card p-4">
        <Car className="text-teal-700" size={22} />
        <p className="mt-3 text-sm font-bold text-slate-500">Estacionamento</p>
        <p className="mt-1 font-black text-teal-950">1 vaga inclusa</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {property.parking_info}
        </p>
      </div>
    </div>
  );
}
