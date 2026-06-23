import { Trash2 } from "lucide-react";

import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  deleteGuideItemAction,
  upsertGuideItemFromForm,
} from "@/lib/actions/admin";
import { getAdminDataset } from "@/lib/data/admin";
import type { GuideCategory } from "@/lib/types";

const categories: GuideCategory[] = [
  "Praias",
  "Restaurantes",
  "Delivery",
  "Mercados",
  "Farmacias",
  "Passeios",
  "Dia de chuva",
  "Criancas",
  "Emergencia",
  "Compras",
  "Entretenimento",
];

export default async function LocalGuidePage() {
  const { company, localGuideItems } = await getAdminDataset();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
          Guia local
        </p>
        <h2 className="text-3xl font-black text-teal-950">Maranduba e Ubatuba</h2>
      </div>

      <GuideForm companyId={company.id} title="Novo item do guia" />

      <div className="grid gap-4 xl:grid-cols-2">
        {localGuideItems.map((item) => (
          <GuideForm companyId={company.id} item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

function GuideForm({
  companyId,
  title,
  item,
}: {
  companyId: string;
  title?: string;
  item?: {
    id: string;
    category: string;
    title: string;
    description: string;
    address: string | null;
    google_maps_url: string | null;
    whatsapp_url: string | null;
    instagram_url: string | null;
    image_url: string | null;
    recommended: boolean;
    sort_order: number;
  };
}) {
  return (
    <form action={upsertGuideItemFromForm} className="card grid gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-teal-950">
          {title ?? item?.title}
        </h3>
        {item ? (
          <button
            className="btn btn-outline text-rose-700"
            formAction={deleteGuideItemAction.bind(null, item.id)}
            type="submit"
          >
            <Trash2 size={15} />
            Excluir
          </button>
        ) : null}
      </div>
      <input name="company_id" type="hidden" value={companyId} />
      {item ? <input name="id" type="hidden" value={item.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field">
          <span>Categoria</span>
          <select className="select" defaultValue={item?.category ?? "Praias"} name="category">
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Ordem</span>
          <input
            className="input"
            defaultValue={item?.sort_order ?? 0}
            name="sort_order"
            type="number"
          />
        </label>
      </div>

      <label className="field">
        <span>Titulo</span>
        <input className="input" defaultValue={item?.title ?? ""} name="title" />
      </label>
      <label className="field">
        <span>Descricao</span>
        <textarea
          className="textarea"
          defaultValue={item?.description ?? ""}
          name="description"
        />
      </label>
      <label className="field">
        <span>Endereco</span>
        <input className="input" defaultValue={item?.address ?? ""} name="address" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field">
          <span>Google Maps</span>
          <input className="input" defaultValue={item?.google_maps_url ?? ""} name="google_maps_url" />
        </label>
        <label className="field">
          <span>WhatsApp</span>
          <input className="input" defaultValue={item?.whatsapp_url ?? ""} name="whatsapp_url" />
        </label>
        <label className="field">
          <span>Instagram</span>
          <input className="input" defaultValue={item?.instagram_url ?? ""} name="instagram_url" />
        </label>
        <label className="field">
          <span>Imagem</span>
          <input className="input" defaultValue={item?.image_url ?? ""} name="image_url" />
        </label>
      </div>
      <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
        <input
          className="h-4 w-4 accent-teal-700"
          defaultChecked={item?.recommended ?? false}
          name="recommended"
          type="checkbox"
          value="true"
        />
        Recomendado
      </label>
      <SubmitButton className="btn btn-primary w-full sm:w-fit">Salvar item</SubmitButton>
    </form>
  );
}
