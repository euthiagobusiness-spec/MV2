import Image from "next/image";
import Link from "next/link";
import { ArrowRight, QrCode, Search, ShieldCheck } from "lucide-react";

import { BrandHeader } from "@/components/guest/BrandHeader";
import { GuestReservationLoginForm } from "@/components/guest/GuestReservationLoginForm";
import { PropertySelectionGrid } from "@/components/guest/PropertySelectionGrid";
import type { Property } from "@/lib/types";

export function GuestAccessPage({ properties }: { properties: Property[] }) {
  const featured = properties.slice(0, 4);
  const heroImage = featured[0]?.cover_image_url ?? "/uploads/condominium/img_8680.jpeg";

  return (
    <main className="min-h-screen bg-white">
      <BrandHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 pt-3 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="grid content-center">
          <p className="w-fit rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-sky-900">
            QR Code geral da MV2
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
            Acesse as informacoes da sua estadia
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Encontre sua reserva, escolha seu apartamento ou conheca o
            condominio antes da chegada. Tudo organizado para reduzir duvidas e
            proteger informacoes sensiveis.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="btn btn-primary" href="#reservation-login">
              <Search size={18} /> Entrar com meus dados da reserva
            </a>
            <Link className="btn btn-outline" href="/select-property">
              Selecionar meu apartamento <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["QR geral", "Entrada publica para hospedes."],
              ["QR do ap", "Preview especifico da unidade."],
              ["QR da reserva", "Portal seguro por token."],
            ].map(([title, text]) => (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" key={title}>
                <QrCode className="text-sky-700" size={22} />
                <p className="mt-2 font-black text-slate-950">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-slate-200 shadow-lg">
            <Image
              alt="MV2 Maranduba"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              src={heroImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/12 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <ShieldCheck size={34} />
              <h2 className="mt-3 text-3xl font-black">
                Check-in e informacoes sem confusao.
              </h2>
              <p className="mt-2 text-white/82">
                Visual Stays-inspired, fotos reais e fluxo simples para o hospede.
              </p>
            </div>
          </div>
          <GuestReservationLoginForm />
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">
                Apartamentos
              </p>
              <h2 className="mt-1 text-3xl font-black text-slate-950">
                Selecione visualmente sua unidade
              </h2>
            </div>
            <Link className="btn btn-outline hidden sm:inline-flex" href="/select-property">
              Ver todos
            </Link>
          </div>
          <PropertySelectionGrid properties={featured} />
        </div>
      </section>
    </main>
  );
}
