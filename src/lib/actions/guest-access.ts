"use server";

import { identifyGuestReservation, type ReservationMatch } from "@/lib/data/guest";

export type GuestReservationLookupState = {
  status: "idle" | "matched" | "multiple" | "not_found" | "error";
  message: string;
  matches: ReservationMatch[];
};

export async function lookupReservationAction(
  _previousState: GuestReservationLookupState,
  formData: FormData,
): Promise<GuestReservationLookupState> {
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const reservationCode = String(formData.get("reservationCode") ?? "");
  const channel = String(formData.get("channel") ?? "");

  if (!email.trim() && !phone.trim() && !reservationCode.trim()) {
    return {
      status: "error",
      message: "Informe e-mail, telefone ou codigo da reserva.",
      matches: [],
    };
  }

  const matches = await identifyGuestReservation({
    email,
    phone,
    reservationCode,
    channel: channel || undefined,
  });

  if (matches.length === 1) {
    return {
      status: "matched",
      message: "Encontramos sua reserva. Acesse sua estadia abaixo.",
      matches,
    };
  }

  if (matches.length > 1) {
    return {
      status: "multiple",
      message: "Encontramos mais de uma reserva compativel.",
      matches,
    };
  }

  return {
    status: "not_found",
    message: "Nao encontramos uma reserva com esses dados. Voce ainda pode selecionar o apartamento manualmente.",
    matches: [],
  };
}
