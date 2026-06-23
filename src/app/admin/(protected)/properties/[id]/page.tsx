import { notFound } from "next/navigation";

import { PropertyForm } from "@/components/admin/PropertyForm";
import { getAdminDataset, getPropertyById } from "@/lib/data/admin";

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
      <PropertyForm company={company} property={property} />
    </div>
  );
}
