"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { upsertPropertyAction } from "@/lib/actions/admin";
import { propertySchema, type PropertyInput } from "@/lib/schemas";
import type { Company, Property } from "@/lib/types";
import { toJsonText, toTextareaValue } from "@/lib/utils";

type PropertyFormProps = {
  company: Company;
  property?: Property | null;
};

export function PropertyForm({ company, property }: PropertyFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      id: property?.id,
      company_id: company.id,
      name: property?.name ?? "",
      slug: property?.slug ?? "",
      cover_image_url: property?.cover_image_url ?? "",
      gallery_images: toTextareaValue(property?.gallery_images),
      short_description: property?.short_description ?? "",
      virtual_tour_url: property?.virtual_tour_url ?? "",
      apartment_video_url: property?.apartment_video_url ?? "",
      condominium_video_url: property?.condominium_video_url ?? "",
      youtube_embed_url: property?.youtube_embed_url ?? "",
      map_embed_url: property?.map_embed_url ?? "",
      guest_preview_enabled: property?.guest_preview_enabled ?? true,
      show_wifi_on_preview: property?.show_wifi_on_preview ?? false,
      condominium_description: property?.condominium_description ?? "",
      condominium_gallery_images: toTextareaValue(property?.condominium_gallery_images),
      condominium_amenities: toTextareaValue(property?.condominium_amenities),
      address: property?.address ?? "",
      condominium_name: property?.condominium_name ?? "",
      max_guests: property?.max_guests ?? 4,
      checkin_time: property?.checkin_time ?? "15:00",
      checkout_time: property?.checkout_time ?? "11:00",
      wifi_name: property?.wifi_name ?? "",
      wifi_password: property?.wifi_password ?? "",
      parking_info: property?.parking_info ?? "",
      access_instructions: property?.access_instructions ?? "",
      house_rules: toTextareaValue(property?.house_rules),
      condominium_rules: toTextareaValue(property?.condominium_rules),
      appliance_manual: toJsonText(property?.appliance_manual),
      amenities: toTextareaValue(property?.amenities),
      emergency_contacts: toJsonText(property?.emergency_contacts),
      qr_code_url: property?.qr_code_url ?? "",
      is_active: property?.is_active ?? true,
    },
  });
  const [coverPreview, setCoverPreview] = useState(property?.cover_image_url ?? "");

  function onSubmit(values: PropertyInput) {
    setMessage(null);
    startTransition(async () => {
      const result = await upsertPropertyAction(values);
      setMessage(result.message);
    });
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />
      <input type="hidden" {...register("company_id")} />

      <div className="card grid gap-4 p-5 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 md:grid-cols-2">
          <Field error={errors.name?.message} label="Nome do apartamento">
            <input className="input" {...register("name")} />
          </Field>
          <Field error={errors.slug?.message} label="Slug">
            <input className="input" placeholder="apto-maranduba-01" {...register("slug")} />
          </Field>
          <Field error={errors.address?.message} label="Endereco">
            <input className="input" {...register("address")} />
          </Field>
          <Field error={errors.condominium_name?.message} label="Condominio">
            <input className="input" {...register("condominium_name")} />
          </Field>
          <Field error={errors.max_guests?.message} label="Maximo de hospedes">
            <input className="input" min={1} type="number" {...register("max_guests")} />
          </Field>
          <Field error={errors.checkin_time?.message} label="Horario de check-in">
            <input className="input" {...register("checkin_time")} />
          </Field>
          <Field error={errors.checkout_time?.message} label="Horario de check-out">
            <input className="input" {...register("checkout_time")} />
          </Field>
          <Field error={errors.wifi_name?.message} label="Nome do Wi-Fi">
            <input className="input" {...register("wifi_name")} />
          </Field>
          <Field error={errors.wifi_password?.message} label="Senha do Wi-Fi">
            <input className="input" {...register("wifi_password")} />
          </Field>
          <label className="flex items-center gap-3 pt-8 text-sm font-bold text-slate-700">
            <input className="h-4 w-4 accent-teal-700" type="checkbox" {...register("is_active")} />
            Imovel ativo
          </label>
        </div>
        <div className="grid gap-4">
          <ImageUploadField
            onChange={(url) => {
              setValue("cover_image_url", url);
              setCoverPreview(url);
            }}
            value={coverPreview}
          />
          <Field error={errors.cover_image_url?.message} label="URL da imagem principal">
            <input className="input" {...register("cover_image_url")} />
          </Field>
        </div>
      </div>

      <div className="card grid gap-4 p-5 md:grid-cols-2">
        <Field error={errors.access_instructions?.message} label="Instrucoes de entrada">
          <textarea className="textarea" {...register("access_instructions")} />
        </Field>
        <Field error={errors.parking_info?.message} label="Informacoes de estacionamento">
          <textarea className="textarea" {...register("parking_info")} />
        </Field>
        <Field error={errors.house_rules?.message} label="Regras da casa">
          <textarea className="textarea" placeholder="Uma regra por linha" {...register("house_rules")} />
        </Field>
        <Field error={errors.condominium_rules?.message} label="Regras do condominio">
          <textarea className="textarea" placeholder="Uma regra por linha" {...register("condominium_rules")} />
        </Field>
        <Field error={errors.amenities?.message} label="Amenidades">
          <textarea className="textarea" placeholder="Um item por linha" {...register("amenities")} />
        </Field>
        <Field error={errors.gallery_images?.message} label="Galeria de imagens">
          <textarea className="textarea" placeholder="Uma URL por linha" {...register("gallery_images")} />
        </Field>
        <Field error={errors.appliance_manual?.message} label="Manual dos equipamentos (JSON)">
          <textarea className="textarea font-mono text-xs" {...register("appliance_manual")} />
        </Field>
        <Field error={errors.emergency_contacts?.message} label="Contatos de emergencia (JSON)">
          <textarea className="textarea font-mono text-xs" {...register("emergency_contacts")} />
        </Field>
      </div>

      <div className="card grid gap-4 p-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-sky-700">
            Experiencia do hospede
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-950">
            Previa publica, QR Code e tour visual
          </h3>
        </div>
        <Field error={errors.short_description?.message} label="Descricao curta do apartamento">
          <textarea className="textarea" {...register("short_description")} />
        </Field>
        <Field error={errors.condominium_description?.message} label="Descricao do condominio">
          <textarea className="textarea" {...register("condominium_description")} />
        </Field>
        <Field error={errors.condominium_gallery_images?.message} label="Galeria da area externa/condominio">
          <textarea
            className="textarea"
            placeholder="Uma URL por linha"
            {...register("condominium_gallery_images")}
          />
        </Field>
        <Field error={errors.condominium_amenities?.message} label="Comodidades do condominio">
          <textarea
            className="textarea"
            placeholder="Uma comodidade por linha"
            {...register("condominium_amenities")}
          />
        </Field>
        <Field error={errors.virtual_tour_url?.message} label="Link de tour virtual 360">
          <input className="input" {...register("virtual_tour_url")} />
        </Field>
        <Field error={errors.apartment_video_url?.message} label="Video do apartamento">
          <input className="input" {...register("apartment_video_url")} />
        </Field>
        <Field error={errors.condominium_video_url?.message} label="Video do condominio">
          <input className="input" {...register("condominium_video_url")} />
        </Field>
        <Field error={errors.youtube_embed_url?.message} label="Embed YouTube, Vimeo ou Matterport">
          <input className="input" {...register("youtube_embed_url")} />
        </Field>
        <Field error={errors.map_embed_url?.message} label="Mapa incorporado">
          <input className="input" {...register("map_embed_url")} />
        </Field>
        <div className="grid content-end gap-3">
          <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <input
              className="h-4 w-4 accent-sky-700"
              type="checkbox"
              {...register("guest_preview_enabled")}
            />
            Ativar pre-visualizacao publica
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <input
              className="h-4 w-4 accent-sky-700"
              type="checkbox"
              {...register("show_wifi_on_preview")}
            />
            Exibir Wi-Fi na pre-visualizacao
          </label>
        </div>
      </div>

      {message ? <p className="card p-4 font-semibold text-teal-900">{message}</p> : null}

      <button className="btn btn-primary w-full sm:w-fit" disabled={isPending} type="submit">
        {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        Salvar imovel
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error ? <small className="text-sm font-semibold text-rose-700">{error}</small> : null}
    </label>
  );
}
