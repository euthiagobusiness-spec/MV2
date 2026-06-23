import { notFound } from "next/navigation";

import { BrandHeader } from "@/components/guest/BrandHeader";
import { CondominiumSection } from "@/components/guest/CondominiumSection";
import { GuestNextSteps } from "@/components/guest/GuestNextSteps";
import { PropertyGallery } from "@/components/guest/PropertyGallery";
import { PropertyPreviewHero } from "@/components/guest/PropertyPreviewHero";
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
      <CondominiumSection property={property} />
      <VirtualTourEmbed property={property} />
      <GuestNextSteps property={property} />
    </main>
  );
}
