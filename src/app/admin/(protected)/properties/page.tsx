import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { deletePropertyAction, togglePropertyAction } from "@/lib/actions/admin";
import { getAdminDataset } from "@/lib/data/admin";

export default async function PropertiesPage() {
  const { properties } = await getAdminDataset();

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
            Imoveis
          </p>
          <h2 className="text-3xl font-black text-teal-950">Apartamentos</h2>
        </div>
        <Link className="btn btn-primary" href="/admin/properties/new">
          <Plus size={18} /> Novo imovel
        </Link>
      </div>

      <DataTable columns={["Nome", "Slug", "Hospedes", "Status", "Acoes"]}>
        {properties.map((property) => (
          <tr key={property.id}>
            <td className="px-4 py-3 font-bold text-teal-950">{property.name}</td>
            <td className="px-4 py-3 font-mono text-xs text-slate-600">{property.slug}</td>
            <td className="px-4 py-3">{property.max_guests}</td>
            <td className="px-4 py-3">
              <StatusBadge status={property.is_active ? "active" : "inactive"} />
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <Link className="btn btn-outline text-xs" href={`/admin/properties/${property.id}`}>
                  Editar
                </Link>
                <form action={togglePropertyAction.bind(null, property.id, !property.is_active)}>
                  <button className="btn btn-secondary text-xs" type="submit">
                    {property.is_active ? "Desativar" : "Ativar"}
                  </button>
                </form>
                <form action={deletePropertyAction.bind(null, property.id)}>
                  <button className="btn btn-outline text-xs text-rose-700" type="submit">
                    <Trash2 size={14} /> Excluir
                  </button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
