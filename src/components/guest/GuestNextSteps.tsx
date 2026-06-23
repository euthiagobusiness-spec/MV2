import Link from "next/link";
import { CalendarCheck, Car, Clock, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

import type { Property } from "@/lib/types";
import { whatsappUrl } from "@/lib/utils";

export function GuestNextSteps({ property }: { property: Property }) {
  const whatsapp = whatsappUrl(
    "5512999990000",
    `Ola, preciso de suporte sobre o ${property.name}.`,
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">
            Antes da chegada
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">
            Informacoes importantes
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Info icon={Clock} title="Check-in" value={`A partir das ${property.checkin_time}`} />
            <Info icon={CalendarCheck} title="Check-out" value={`Ate ${property.checkout_time}`} />
            <Info icon={Car} title="Estacionamento" value={property.parking_info} />
            <Info
              icon={ShieldCheck}
              title="Privacidade"
              value="Senhas, documentos e instrucoes completas ficam protegidos no portal da reserva."
            />
          </div>
        </div>
        <div className="rounded-xl bg-sky-700 p-6 text-white shadow-sm">
          <h3 className="text-2xl font-black">Pronto para fazer check-in?</h3>
          <p className="mt-3 leading-7 text-white/82">
            Use o link da sua reserva para concluir o pre-check-in, ver dados
            completos de entrada e acessar Wi-Fi quando autorizado.
          </p>
          <div className="mt-6 grid gap-3">
            <Link className="btn bg-white text-sky-950" href="/guest-access">
              Fazer check-in digital
            </Link>
            <a className="btn border border-white/35 text-white" href={whatsapp}>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({
  icon: Icon,
  title,
  value,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <Icon className="text-sky-700" size={22} />
      <p className="mt-3 font-black text-slate-950">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}
