"use server";

import { revalidatePath } from "next/cache";

import { hasSupabaseAdminKey, isSupabaseConfigured } from "@/lib/env";
import { checkinSchema, type CheckinInput } from "@/lib/schemas";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/types";
import { parseLines } from "@/lib/utils";

export async function submitGuestCheckinAction(
  token: string,
  input: CheckinInput,
): Promise<ActionState> {
  const parsed = checkinSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os campos obrigatorios.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = {
    ...parsed.data,
    car_plate: parsed.data.car_plate?.trim() || null,
    companion_names: parseLines(parsed.data.companion_names),
    observations: parsed.data.observations?.trim() || null,
  };

  if (!isSupabaseConfigured()) {
    revalidatePath(`/portal/${token}`);
    return {
      ok: true,
      message:
        "Check-in recebido no modo demonstracao. Conecte o Supabase para persistir os dados.",
    };
  }

  if (!hasSupabaseAdminKey()) {
    return {
      ok: false,
      message:
        "Configure SUPABASE_SECRET_KEY no servidor para receber check-ins com seguranca.",
    };
  }

  const supabase = createAdminClient();
  const { data: reservation, error: reservationError } = await supabase
    .from("reservations")
    .select("id")
    .eq("guest_portal_token", token)
    .maybeSingle();

  if (reservationError || !reservation) {
    return {
      ok: false,
      message: "Token da reserva invalido ou expirado.",
    };
  }

  const { error: upsertError } = await supabase.from("guest_checkins").upsert(
    {
      reservation_id: reservation.id,
      ...payload,
    },
    { onConflict: "reservation_id" },
  );

  if (upsertError) {
    console.error("Failed to upsert checkin", upsertError);
    return {
      ok: false,
      message: "Nao foi possivel enviar o check-in agora. Tente novamente.",
    };
  }

  await supabase
    .from("reservations")
    .update({ checkin_completed: true, status: "checked_in" })
    .eq("id", reservation.id);

  revalidatePath(`/portal/${token}`);
  revalidatePath("/admin/checkins");

  return {
    ok: true,
    message: "Check-in enviado com sucesso. Boa estadia!",
  };
}
