import { Trash2 } from "lucide-react";

import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  deleteExtraServiceAction,
  upsertExtraServiceFromForm,
} from "@/lib/actions/admin";
import { getAdminDataset } from "@/lib/data/admin";
import { formatCurrency } from "@/lib/utils";

export default async function ExtrasPage() {
  const { company, extraServices } = await getAdminDataset();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
          Servicos extras
        </p>
        <h2 className="text-3xl font-black text-teal-950">Extras e mimos</h2>
      </div>

      <ExtraForm companyId={company.id} title="Novo servico" />

      <div className="grid gap-4 xl:grid-cols-2">
        {extraServices.map((service) => (
          <ExtraForm companyId={company.id} item={service} key={service.id} />
        ))}
      </div>
    </div>
  );
}

function ExtraForm({
  companyId,
  title,
  item,
}: {
  companyId: string;
  title?: string;
  item?: {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string | null;
    whatsapp_message: string;
    is_active: boolean;
  };
}) {
  return (
    <form action={upsertExtraServiceFromForm} className="card grid gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-teal-950">
            {title ?? item?.title}
          </h3>
          {item ? (
            <p className="mt-1 text-sm font-bold text-teal-700">
              {formatCurrency(item.price)}
            </p>
          ) : null}
        </div>
        {item ? (
          <button
            className="btn btn-outline text-rose-700"
            formAction={deleteExtraServiceAction.bind(null, item.id)}
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
          <span>Nome</span>
          <input className="input" defaultValue={item?.title ?? ""} name="title" />
        </label>
        <label className="field">
          <span>Preco</span>
          <input
            className="input"
            defaultValue={item?.price ?? 0}
            min={0}
            name="price"
            step="0.01"
            type="number"
          />
        </label>
      </div>
      <label className="field">
        <span>Descricao</span>
        <textarea className="textarea" defaultValue={item?.description ?? ""} name="description" />
      </label>
      <label className="field">
        <span>Imagem</span>
        <input className="input" defaultValue={item?.image_url ?? ""} name="image_url" />
      </label>
      <label className="field">
        <span>Mensagem de WhatsApp</span>
        <textarea
          className="textarea"
          defaultValue={item?.whatsapp_message ?? ""}
          name="whatsapp_message"
        />
      </label>
      <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
        <input
          className="h-4 w-4 accent-teal-700"
          defaultChecked={item?.is_active ?? true}
          name="is_active"
          type="checkbox"
          value="true"
        />
        Servico ativo
      </label>
      <SubmitButton className="btn btn-primary w-full sm:w-fit">Salvar servico</SubmitButton>
    </form>
  );
}
