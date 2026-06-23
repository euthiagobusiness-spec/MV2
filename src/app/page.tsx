import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ConciergeBell,
  QrCode,
  ShieldCheck,
} from "lucide-react";

import { getDemoModeLabel } from "@/lib/env";
import { demoPortalPayload } from "@/lib/mock-data";

const features = [
  {
    title: "Check-in digital",
    description: "Coleta dados essenciais, aceita regras e sinaliza pendencias.",
    icon: BadgeCheck,
  },
  {
    title: "Portal por QR Code",
    description: "Cada reserva recebe um link unico para acessar informacoes.",
    icon: QrCode,
  },
  {
    title: "Manual e regras",
    description: "Wi-Fi, entrada, garagem, equipamentos e condominio em um lugar.",
    icon: Building2,
  },
  {
    title: "Extras e guia local",
    description: "Venda servicos e recomende praias, restaurantes e passeios.",
    icon: ConciergeBell,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-900">
            {getDemoModeLabel()}
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-teal-950 sm:text-6xl">
            Portal Digital do Hospede
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Uma central profissional para reservas por temporada: check-in,
            regras, Wi-Fi, instrucoes, guia de Maranduba/Ubatuba, extras e
            pos-estadia.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn btn-primary" href="/admin/login">
              Acessar painel <ArrowRight size={18} />
            </Link>
            <Link
              className="btn btn-outline"
              href={`/portal/${demoPortalPayload.reservation.guest_portal_token}`}
            >
              Ver portal demo
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div className="card p-4" key={feature.title}>
                <feature.icon className="text-teal-700" size={22} />
                <h2 className="mt-3 font-bold text-teal-950">{feature.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden p-3">
          <div
            className="min-h-[560px] rounded-lg bg-cover bg-center p-5 text-white"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(15, 76, 70, 0.08), rgba(15, 76, 70, 0.82)), url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80)",
            }}
          >
            <div className="flex h-full min-h-[520px] flex-col justify-between">
              <div className="w-fit rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-teal-900">
                MV2 Temporada
              </div>
              <div>
                <ShieldCheck size={36} />
                <h2 className="mt-4 text-3xl font-black">
                  Menos duvidas antes, durante e depois da estadia.
                </h2>
                <p className="mt-3 max-w-md text-white/86">
                  Painel administrativo para manter imoveis, reservas, guia e
                  extras sempre atualizados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
