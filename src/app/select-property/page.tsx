import Link from "next/link";

import { BrandHeader } from "@/components/guest/BrandHeader";
import { PropertySelectionGrid } from "@/components/guest/PropertySelectionGrid";
import { getPublicProperties } from "@/lib/data/guest";

export default async function SelectPropertyPage() {
  const properties = await getPublicProperties();

  return (
    <main className="min-h-screen bg-slate-50">
      <BrandHeader />
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">
              Selecao visual
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Qual e o seu apartamento?
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Escolha a unidade reservada para ver fotos, comodidades, regras
              gerais e um tour do condominio antes da chegada.
            </p>
          </div>
          <Link className="btn btn-outline w-fit" href="/guest-access">
            Voltar ao acesso
          </Link>
        </div>
        <PropertySelectionGrid properties={properties} />
      </section>
    </main>
  );
}
