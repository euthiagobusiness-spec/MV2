import { SubmitButton } from "@/components/ui/SubmitButton";
import { updateCompanyFromForm } from "@/lib/actions/admin";
import { getAdminDataset } from "@/lib/data/admin";

export default async function SettingsPage() {
  const { company } = await getAdminDataset();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
          Configuracoes
        </p>
        <h2 className="text-3xl font-black text-teal-950">Empresa e marca</h2>
      </div>

      <form action={updateCompanyFromForm} className="card grid gap-5 p-5">
        <input name="id" type="hidden" value={company.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field">
            <span>Nome da empresa</span>
            <input className="input" defaultValue={company.name} name="name" />
          </label>
          <label className="field">
            <span>Logo URL</span>
            <input className="input" defaultValue={company.logo_url ?? ""} name="logo_url" />
          </label>
          <label className="field">
            <span>Cor principal</span>
            <input className="input" defaultValue={company.primary_color} name="primary_color" type="color" />
          </label>
          <label className="field">
            <span>Cor secundaria</span>
            <input className="input" defaultValue={company.secondary_color} name="secondary_color" type="color" />
          </label>
          <label className="field">
            <span>Instagram</span>
            <input className="input" defaultValue={company.instagram_url ?? ""} name="instagram_url" />
          </label>
          <label className="field">
            <span>WhatsApp</span>
            <input className="input" defaultValue={company.whatsapp} name="whatsapp" />
          </label>
          <label className="field">
            <span>E-mail</span>
            <input className="input" defaultValue={company.email} name="email" type="email" />
          </label>
          <label className="field">
            <span>Endereco</span>
            <input className="input" defaultValue={company.address} name="address" />
          </label>
        </div>
        <label className="field">
          <span>Politica de privacidade</span>
          <textarea
            className="textarea min-h-52"
            defaultValue={company.privacy_policy_text}
            name="privacy_policy_text"
          />
        </label>
        <label className="field">
          <span>Termos e regras gerais</span>
          <textarea className="textarea min-h-52" defaultValue={company.terms_text} name="terms_text" />
        </label>
        <SubmitButton className="btn btn-primary w-full sm:w-fit">Salvar configuracoes</SubmitButton>
      </form>
    </div>
  );
}
