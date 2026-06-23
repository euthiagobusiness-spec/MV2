"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";

import { submitGuestCheckinAction } from "@/lib/actions/checkin";
import { checkinSchema, type CheckinInput } from "@/lib/schemas";
import type { GuestCheckin, Reservation } from "@/lib/types";

type CheckinFormProps = {
  token: string;
  reservation: Reservation;
  existingCheckin: GuestCheckin | null;
};

export function CheckinForm({
  token,
  reservation,
  existingCheckin,
}: CheckinFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckinInput>({
    resolver: zodResolver(checkinSchema),
    defaultValues: {
      responsible_guest_name:
        existingCheckin?.responsible_guest_name ?? reservation.guest_name,
      document_type: existingCheckin?.document_type ?? "CPF",
      document_number: existingCheckin?.document_number ?? "",
      phone: existingCheckin?.phone ?? reservation.guest_phone,
      email: existingCheckin?.email ?? reservation.guest_email,
      arrival_time: existingCheckin?.arrival_time ?? "",
      car_plate: existingCheckin?.car_plate ?? "",
      number_of_guests: existingCheckin?.number_of_guests ?? 1,
      companion_names: existingCheckin?.companion_names?.join("\n") ?? "",
      accepted_house_rules: existingCheckin?.accepted_house_rules ?? false,
      accepted_condominium_rules:
        existingCheckin?.accepted_condominium_rules ?? false,
      accepted_privacy_policy: existingCheckin?.accepted_privacy_policy ?? false,
      observations: existingCheckin?.observations ?? "",
    },
  });

  const completed = Boolean(existingCheckin || reservation.checkin_completed);

  function onSubmit(values: CheckinInput) {
    setMessage(null);
    startTransition(async () => {
      const result = await submitGuestCheckinAction(token, values);
      setMessage(result.message);
    });
  }

  if (completed && existingCheckin) {
    return (
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-teal-700" size={28} />
          <div>
            <h3 className="text-xl font-black text-teal-950">
              Check-in digital recebido
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Recebemos os dados do responsavel {existingCheckin.responsible_guest_name}.
              Caso precise corrigir alguma informacao, fale com a equipe pelo WhatsApp.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="card grid gap-4 p-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field error={errors.responsible_guest_name?.message} label="Nome completo do responsavel">
          <input className="input" {...register("responsible_guest_name")} />
        </Field>
        <Field error={errors.document_type?.message} label="Tipo de documento">
          <select className="select" {...register("document_type")}>
            <option value="CPF">CPF</option>
            <option value="RG">RG</option>
            <option value="Passaporte">Passaporte</option>
            <option value="CNH">CNH</option>
          </select>
        </Field>
        <Field error={errors.document_number?.message} label="Numero do documento">
          <input className="input" {...register("document_number")} />
        </Field>
        <Field error={errors.phone?.message} label="Telefone">
          <input className="input" {...register("phone")} inputMode="tel" />
        </Field>
        <Field error={errors.email?.message} label="E-mail">
          <input className="input" {...register("email")} type="email" />
        </Field>
        <Field error={errors.arrival_time?.message} label="Horario previsto de chegada">
          <input className="input" {...register("arrival_time")} placeholder="Ex.: 16:30" />
        </Field>
        <Field error={errors.car_plate?.message} label="Placa do veiculo">
          <input className="input uppercase" {...register("car_plate")} placeholder="ABC1D23" />
        </Field>
        <Field error={errors.number_of_guests?.message} label="Quantidade de hospedes">
          <input className="input" min={1} type="number" {...register("number_of_guests")} />
        </Field>
      </div>

      <Field error={errors.companion_names?.message} label="Nome dos acompanhantes">
        <textarea
          className="textarea"
          placeholder="Um nome por linha"
          {...register("companion_names")}
        />
      </Field>

      <Field error={errors.observations?.message} label="Observacoes">
        <textarea className="textarea" {...register("observations")} />
      </Field>

      <div className="grid gap-3 rounded-lg bg-teal-50 p-4">
        <Checkbox
          error={errors.accepted_house_rules?.message}
          label="Li e aceito as regras da casa."
          registration={register("accepted_house_rules")}
        />
        <Checkbox
          error={errors.accepted_condominium_rules?.message}
          label="Li e aceito as regras do condominio."
          registration={register("accepted_condominium_rules")}
        />
        <Checkbox
          error={errors.accepted_privacy_policy?.message}
          label="Li e aceito a politica de privacidade."
          registration={register("accepted_privacy_policy")}
        />
      </div>

      {message ? (
        <p className="rounded-lg bg-white p-3 text-sm font-semibold text-teal-900">
          {message}
        </p>
      ) : null}

      <button className="btn btn-primary w-full" disabled={isPending} type="submit">
        {isPending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        Enviar check-in digital
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

function Checkbox({
  label,
  error,
  registration,
}: {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <label className="flex items-start gap-3 text-sm font-semibold text-slate-700">
      <input className="mt-1 h-4 w-4 accent-teal-700" type="checkbox" {...registration} />
      <span>
        {label}
        {error ? <small className="block text-rose-700">{error}</small> : null}
      </span>
    </label>
  );
}
