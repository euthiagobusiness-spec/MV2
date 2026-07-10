import { HeartHandshake } from "lucide-react";

import { welcomeMessage } from "@/lib/guest-information";

export function WelcomeMessage() {
  return (
    <div className="card grid gap-5 p-5 md:grid-cols-[auto_1fr] md:p-6">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-100 text-teal-800">
        <HeartHandshake size={25} />
      </div>
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
          {welcomeMessage.eyebrow}
        </p>
        <h3 className="mt-1 text-2xl font-black text-teal-950">
          {welcomeMessage.title}
        </h3>
        <p className="mt-3 max-w-3xl leading-7 text-slate-700">
          {welcomeMessage.description}
        </p>
        <p className="mt-2 max-w-3xl leading-7 text-slate-600">
          {welcomeMessage.closing}
        </p>
        <p className="mt-4 text-sm font-black text-teal-900">
          Central de Reservas MV2 Temporada
        </p>
      </div>
    </div>
  );
}
