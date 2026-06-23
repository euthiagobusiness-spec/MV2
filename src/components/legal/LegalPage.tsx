import Link from "next/link";

import type { LegalSection } from "@/lib/legal";

type LegalPageProps = {
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: LegalSection[];
};

export function LegalPage({ title, subtitle, updatedAt, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <article className="mx-auto max-w-4xl">
        <Link className="text-sm font-bold text-teal-800" href="/guest-access">
          Voltar ao portal
        </Link>
        <header className="mt-6 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            MV2 Temporada
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-slate-600">{subtitle}</p>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Ultima atualizacao: {updatedAt}
          </p>
        </header>

        <div className="mt-6 grid gap-4">
          {sections.map((section) => (
            <section
              className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
              key={section.title}
            >
              <h2 className="text-xl font-black text-slate-950">{section.title}</h2>
              <div className="mt-3 grid gap-3 text-slate-600">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
