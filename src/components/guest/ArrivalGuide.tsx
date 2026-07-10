import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  KeyRound,
  MapPinned,
} from "lucide-react";

import {
  arrivalChecklist,
  departureChecklist,
  directionsInformation,
} from "@/lib/guest-information";
import type { Property } from "@/lib/types";
import { CopyButton } from "@/components/ui/CopyButton";

export function ArrivalGuide({ property }: { property: Property }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="card p-5">
        <MapPinned className="text-teal-700" size={24} />
        <h3 className="mt-3 text-xl font-black text-teal-950">
          Rota recomendada
        </h3>
        <p className="mt-3 leading-7 text-slate-700">
          {directionsInformation.introduction}
        </p>
        <p className="mt-2 leading-7 text-slate-700">
          {directionsInformation.navigation}
        </p>

        <div className="mt-4 rounded-lg bg-teal-50 p-4">
          <p className="font-black text-teal-950">Ponto de referencia</p>
          <p className="mt-1 leading-7 text-slate-700">
            {directionsInformation.landmark}
          </p>
        </div>

        <div className="mt-4 flex gap-3 rounded-lg border border-slate-200 p-4">
          <KeyRound className="mt-0.5 shrink-0 text-teal-700" size={20} />
          <div>
            <p className="font-black text-teal-950">Orientacoes de entrada</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {property.access_instructions}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <AlertTriangle className="mt-0.5 shrink-0" size={20} />
          <p className="text-sm font-bold leading-6">
            {directionsInformation.warning}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            className="btn btn-secondary"
            href={`https://maps.google.com/?q=${encodeURIComponent(property.address)}`}
            rel="noreferrer"
            target="_blank"
          >
            Abrir no Google Maps
          </a>
          <CopyButton label="Copiar endereco" value={property.address} />
        </div>
      </div>

      <div className="grid gap-4">
        <ChecklistCard
          icon={<CheckCircle2 size={22} />}
          items={arrivalChecklist}
          title="Antes do check-in"
        />
        <ChecklistCard
          icon={<Flag size={22} />}
          items={departureChecklist}
          title="Antes do check-out"
        />
      </div>
    </div>
  );
}

function ChecklistCard({
  icon,
  items,
  title,
}: {
  icon: React.ReactNode;
  items: string[];
  title: string;
}) {
  return (
    <div className="card p-5">
      <div className="text-teal-700">{icon}</div>
      <h3 className="mt-3 text-lg font-black text-teal-950">{title}</h3>
      <ul className="mt-3 grid gap-3">
        {items.map((item) => (
          <li className="flex gap-3 text-sm leading-6 text-slate-700" key={item}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
