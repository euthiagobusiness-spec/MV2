"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCcw, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { CopyButton } from "@/components/ui/CopyButton";
import { QRCodeCard } from "@/components/ui/QRCodeCard";
import { upsertReservationAction } from "@/lib/actions/admin";
import { reservationSchema, type ReservationInput } from "@/lib/schemas";
import type { Property, Reservation } from "@/lib/types";
import { createPortalToken, portalUrl } from "@/lib/utils";

type ReservationFormProps = {
  properties: Property[];
  reservation?: Reservation | null;
};

export function ReservationForm({ properties, reservation }: ReservationFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const initialToken = reservation?.guest_portal_token ?? createPortalToken();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      id: reservation?.id,
      property_id: reservation?.property_id ?? properties[0]?.id ?? "",
      guest_name: reservation?.guest_name ?? "",
      guest_email: reservation?.guest_email ?? "",
      guest_phone: reservation?.guest_phone ?? "",
      checkin_date: reservation?.checkin_date ?? "",
      checkout_date: reservation?.checkout_date ?? "",
      channel: reservation?.channel ?? "Reserva direta",
      external_reservation_code: reservation?.external_reservation_code ?? "",
      status: reservation?.status ?? "confirmed",
      guest_portal_token: initialToken,
    },
  });

  const [token, setToken] = useState(initialToken);
  const link = token ? portalUrl(token) : "";

  function onSubmit(values: ReservationInput) {
    setMessage(null);
    startTransition(async () => {
      const result = await upsertReservationAction(values);
      setMessage(result.message);
    });
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("id")} />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="card grid gap-4 p-5 md:grid-cols-2">
          <Field error={errors.property_id?.message} label="Imovel">
            <select className="select" {...register("property_id")}>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </Field>
          <Field error={errors.status?.message} label="Status">
            <select className="select" {...register("status")}>
              <option value="draft">Rascunho</option>
              <option value="confirmed">Confirmada</option>
              <option value="checked_in">Check-in feito</option>
              <option value="completed">Finalizada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </Field>
          <Field error={errors.guest_name?.message} label="Nome do hospede">
            <input className="input" {...register("guest_name")} />
          </Field>
          <Field error={errors.guest_email?.message} label="E-mail do hospede">
            <input className="input" type="email" {...register("guest_email")} />
          </Field>
          <Field error={errors.guest_phone?.message} label="Telefone">
            <input className="input" {...register("guest_phone")} />
          </Field>
          <Field error={errors.channel?.message} label="Canal">
            <input className="input" {...register("channel")} />
          </Field>
          <Field error={errors.checkin_date?.message} label="Data de check-in">
            <input className="input" type="date" {...register("checkin_date")} />
          </Field>
          <Field error={errors.checkout_date?.message} label="Data de check-out">
            <input className="input" type="date" {...register("checkout_date")} />
          </Field>
          <Field error={errors.external_reservation_code?.message} label="Codigo externo">
            <input className="input" {...register("external_reservation_code")} />
          </Field>
          <Field error={errors.guest_portal_token?.message} label="Token do portal">
            <div className="flex gap-2">
              <input
                className="input"
                {...register("guest_portal_token", {
                  onChange: (event) => setToken(event.target.value),
                })}
              />
              <button
                className="btn btn-outline shrink-0"
                onClick={() => {
                  const nextToken = createPortalToken();
                  setValue("guest_portal_token", nextToken);
                  setToken(nextToken);
                }}
                type="button"
              >
                <RefreshCcw size={17} />
              </button>
            </div>
          </Field>
        </div>
        <div className="grid gap-4">
          {link ? <QRCodeCard value={link} /> : null}
          {link ? <CopyButton value={link} label="Copiar link do portal" /> : null}
        </div>
      </div>

      {message ? <p className="card p-4 font-semibold text-teal-900">{message}</p> : null}

      <button className="btn btn-primary w-full sm:w-fit" disabled={isPending} type="submit">
        {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        Salvar reserva
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
