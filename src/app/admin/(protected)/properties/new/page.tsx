import { PropertyForm } from "@/components/admin/PropertyForm";
import { getAdminDataset } from "@/lib/data/admin";

export default async function NewPropertyPage() {
  const { company } = await getAdminDataset();

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
          Novo imovel
        </p>
        <h2 className="text-3xl font-black text-teal-950">Cadastrar apartamento</h2>
      </div>
      <PropertyForm company={company} />
    </div>
  );
}
