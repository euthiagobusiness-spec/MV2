import Link from "next/link";

import { mv2Logo } from "@/lib/property-catalog";

export function BrandHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
      <Link className="flex items-center gap-3" href="/guest-access">
        <img
          alt="MV2 Temporada"
          className="h-12 w-12 rounded-xl object-cover"
          src={mv2Logo}
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
            Portal do Hospede
          </p>
          <p className="font-black text-slate-950">MV2 Temporada</p>
        </div>
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-bold text-slate-600 md:flex">
        <Link href="/select-property">Apartamentos</Link>
        <Link href="/guest-access#reservation-login">Minha reserva</Link>
        <Link href="/admin/login">Painel</Link>
      </nav>
    </header>
  );
}
