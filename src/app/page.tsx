import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  CalendarDays,
  MapPin,
  MessageCircle,
  Search,
} from "lucide-react";

import { BrandHeader } from "@/components/guest/BrandHeader";
import { PropertySelectionGrid } from "@/components/guest/PropertySelectionGrid";
import { getPublicProperties } from "@/lib/data/guest";
import { condominiumImages } from "@/lib/property-catalog";

export default async function Home() {
  const properties = await getPublicProperties();
  const hero = properties[0]?.cover_image_url ?? condominiumImages[0];

  return (
    <main className="min-h-screen bg-white">
      <BrandHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-14 pt-3 lg:grid-cols-[1.06fr_0.94fr] lg:px-8">
        <div className="grid content-center">
          <p className="w-fit rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-sky-900">
            Condominio Maranduba Ville II
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
            Hospede-se com conforto, praticidade e localizacao perfeita
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Portal digital da MV2 para acessar reserva, conhecer o apartamento,
            fazer pre-check-in, ver regras, guia local, extras e suporte antes
            da chegada.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Minha reserva
                </p>
                <p className="mt-1 font-bold text-slate-950">
                  E-mail, telefone ou codigo
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Apartamentos
                </p>
                <p className="mt-1 font-bold text-slate-950">
                  G2, G3, G4, H1, H5, H28, i7 e i24
                </p>
              </div>
              <Link className="btn btn-primary h-full" href="/guest-access">
                Procurar <Search size={18} />
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-slate-600">
            <span className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
              <MapPin size={16} /> Praia do Sape
            </span>
            <span className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
              <CalendarDays size={16} /> Check-in facilitado
            </span>
            <span className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
              <MessageCircle size={16} /> Suporte WhatsApp
            </span>
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden rounded-2xl bg-slate-200 shadow-xl">
          <Image
            alt="Apartamento MV2"
            className="object-cover"
            fill
            preload
            sizes="(min-width: 1024px) 48vw, 100vw"
            src={hero}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/76 via-slate-950/16 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="w-fit rounded-full bg-white/90 px-3 py-1 text-sm font-black text-slate-950">
              Portal por QR Code e link
            </p>
            <h2 className="mt-4 text-3xl font-black">
              Tudo que o hospede precisa em um so lugar.
            </h2>
            <p className="mt-2 max-w-lg text-white/82">
              Previa publica protegida, portal por token para dados sensiveis e
              painel administrativo para a operacao.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">
                Acomodacoes
              </p>
              <h2 className="mt-1 text-3xl font-black text-slate-950">
                Escolha seu apartamento
              </h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                Cards clicaveis com fotos reais das unidades, no estilo de
                vitrine de reservas.
              </p>
            </div>
            <Link className="btn btn-outline w-fit" href="/select-property">
              Ver todos <ArrowRight size={18} />
            </Link>
          </div>
          <PropertySelectionGrid properties={properties} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="grid content-center">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">
              Tour pelo condominio
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Conheca a area externa antes de chegar
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Veja piscina, areas comuns, garagem e estrutura do Maranduba Ville
              II. A previa publica mostra apenas informacoes gerais; senhas e
              detalhes de entrada ficam protegidos no portal da reserva.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn btn-primary" href="/guest-access">
                Acessar minha estadia
              </Link>
              <Link className="btn btn-outline" href="/select-property">
                Ver apartamentos
              </Link>
            </div>
          </div>
          <Link
            className="group grid overflow-hidden rounded-2xl bg-slate-950 shadow-lg sm:grid-cols-3"
            href="/tour-condominio"
          >
            {condominiumImages.slice(0, 6).map((image, index) => (
              <div className="relative aspect-[4/3] overflow-hidden" key={image}>
                <Image
                  alt={`Area externa ${index + 1}`}
                  className="object-cover transition duration-300 group-hover:scale-105"
                  fill
                  sizes="(max-width: 639px) 100vw, 33vw"
                  src={image}
                />
                {index === 0 ? (
                  <div className="absolute inset-0 grid place-items-center bg-slate-950/40 text-center text-white">
                    <div>
                      <Box className="mx-auto" size={28} />
                      <p className="mt-2 font-black">Tour 3D interativo</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </Link>
        </div>
      </section>
    </main>
  );
}
