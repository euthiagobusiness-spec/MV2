import { notFound } from "next/navigation";

import { PropertyForm } from "@/components/admin/PropertyForm";
import { QRCodeDownloadCard } from "@/components/guest/QRCodeDownloadCard";
import { getAdminDataset, getPropertyById } from "@/lib/data/admin";
import { publicUrl } from "@/lib/utils";

type EditPropertyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const [{ company }, property] = await Promise.all([
    getAdminDataset(),
    getPropertyById(id),
  ]);

  if (!property) notFound();

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
          Editar imovel
        </p>
        <h2 className="text-3xl font-black text-teal-950">{property.name}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <QRCodeDownloadCard
          title="QR Code geral da empresa"
          value={publicUrl("/guest-access")}
        />
        <QRCodeDownloadCard
          title="QR Code do apartamento"
          value={publicUrl(`/property-preview/${property.slug}`)}
        />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-black text-slate-950">Previa da pagina do hospede</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Link publico para o hospede conhecer fotos, regras gerais e o tour
            do condominio sem exibir senhas ou dados privados.
          </p>
          <a
            className="btn btn-primary mt-5 w-full"
            href={publicUrl(`/property-preview/${property.slug}`)}
            rel="noreferrer"
            target="_blank"
          >
            Abrir previa
          </a>
        </div>
      </div>
      <PropertyForm company={company} property={property} />
    </div>
  );
}
