import { notFound } from "next/navigation";

import { BrandHeader } from "@/components/guest/BrandHeader";
import { CondominiumSection } from "@/components/guest/CondominiumSection";
import { GuestNextSteps } from "@/components/guest/GuestNextSteps";
import { NeighborhoodGuide } from "@/components/guest/NeighborhoodGuide";
import { PropertyGallery } from "@/components/guest/PropertyGallery";
import { PropertyPreviewHero } from "@/components/guest/PropertyPreviewHero";
import { StayEssentials } from "@/components/guest/StayEssentials";
import { VirtualTourEmbed } from "@/components/guest/VirtualTourEmbed";
import { getPublicProperties, getPublicPropertyBySlug } from "@/lib/data/guest";

type PropertyPreviewPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const properties = await getPublicProperties();

  return properties.map((property) => ({
    slug: property.slug,
  }));
}

export default async function PropertyPreviewPage({
  params,
}: PropertyPreviewPageProps) {
  const { slug } = await params;
  const property = await getPublicPropertyBySlug(slug);

  if (!property) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <BrandHeader />
      <PropertyPreviewHero property={property} />
      <div id="galeria">
        <PropertyGallery images={property.gallery_images ?? []} title={property.name} />
      </div>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">
          Antes da viagem
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Informacoes essenciais da estadia
        </h2>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Um resumo pratico para organizar a chegada. Dados pessoais, senhas e
          instrucoes completas permanecem no portal protegido da reserva.
        </p>
        <div className="mt-6">
          <StayEssentials property={property} />
        </div>
      </section>
      <CondominiumSection property={property} />
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">
          Maranduba e Ubatuba
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Praia, natureza e praticidade por perto
        </h2>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Uma regiao acolhedora para descansar, explorar praias e aproveitar a
          estrutura local com familia ou amigos.
        </p>
        <div className="mt-6">
          <NeighborhoodGuide />
        </div>
      </section>
      <VirtualTourEmbed property={property} />
      <GuestNextSteps property={property} />
    </main>
  );
}
