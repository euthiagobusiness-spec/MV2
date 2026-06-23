"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/data/admin";
import { isSupabaseConfigured } from "@/lib/env";
import {
  companySchema,
  extraServiceSchema,
  guideItemSchema,
  propertySchema,
  reservationSchema,
} from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";
import {
  createPortalToken,
  parseJsonArray,
  parseLines,
  portalUrl,
} from "@/lib/utils";

const success = (message: string): ActionState => ({ ok: true, message });
const failure = (
  message: string,
  fieldErrors?: Record<string, string[] | undefined>,
): ActionState => ({ ok: false, message, fieldErrors });

export async function upsertPropertyAction(input: unknown): Promise<ActionState> {
  await requireAdmin();
  const parsed = propertySchema.safeParse(input);

  if (!parsed.success) {
    return failure("Revise os dados do imovel.", parsed.error.flatten().fieldErrors);
  }

  const property = {
    ...parsed.data,
    cover_image_url: parsed.data.cover_image_url || null,
    qr_code_url: parsed.data.qr_code_url || null,
    gallery_images: parseLines(parsed.data.gallery_images),
    house_rules: parseLines(parsed.data.house_rules),
    condominium_rules: parseLines(parsed.data.condominium_rules),
    appliance_manual: parseJsonArray(parsed.data.appliance_manual ?? "[]"),
    amenities: parseLines(parsed.data.amenities),
    emergency_contacts: parseJsonArray(parsed.data.emergency_contacts ?? "[]"),
  };

  if (!isSupabaseConfigured()) {
    return success("Imovel validado no modo demonstracao.");
  }

  const supabase = await createClient();
  const { id, ...values } = property;
  const result = id
    ? await supabase.from("properties").update(values).eq("id", id)
    : await supabase.from("properties").insert(values);

  if (result.error) {
    return failure(result.error.message);
  }

  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function upsertReservationAction(
  input: unknown,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = reservationSchema.safeParse(input);

  if (!parsed.success) {
    return failure(
      "Revise os dados da reserva.",
      parsed.error.flatten().fieldErrors,
    );
  }

  const reservation = {
    ...parsed.data,
    external_reservation_code: parsed.data.external_reservation_code || null,
    guest_portal_token:
      parsed.data.guest_portal_token?.trim() || createPortalToken(),
  };

  if (!isSupabaseConfigured()) {
    return success(`Reserva validada. Link: ${portalUrl(reservation.guest_portal_token)}`);
  }

  const supabase = await createClient();
  const { id, ...values } = reservation;
  const result = id
    ? await supabase.from("reservations").update(values).eq("id", id)
    : await supabase.from("reservations").insert(values);

  if (result.error) {
    return failure(result.error.message);
  }

  revalidatePath("/admin/reservations");
  redirect("/admin/reservations");
}

export async function togglePropertyAction(id: string, isActive: boolean) {
  await requireAdmin();

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.from("properties").update({ is_active: isActive }).eq("id", id);
  }

  revalidatePath("/admin/properties");
}

export async function deletePropertyAction(id: string) {
  await requireAdmin();

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.from("properties").delete().eq("id", id);
  }

  revalidatePath("/admin/properties");
}

export async function deleteReservationAction(id: string) {
  await requireAdmin();

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.from("reservations").delete().eq("id", id);
  }

  revalidatePath("/admin/reservations");
}

export async function deleteGuideItemAction(id: string) {
  await requireAdmin();

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.from("local_guide_items").delete().eq("id", id);
  }

  revalidatePath("/admin/local-guide");
}

export async function deleteExtraServiceAction(id: string) {
  await requireAdmin();

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.from("extra_services").delete().eq("id", id);
  }

  revalidatePath("/admin/extras");
}

export async function upsertGuideItemFromForm(formData: FormData) {
  await requireAdmin();

  const parsed = guideItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const values = {
    ...parsed.data,
    address: parsed.data.address || null,
    google_maps_url: parsed.data.google_maps_url || null,
    whatsapp_url: parsed.data.whatsapp_url || null,
    instagram_url: parsed.data.instagram_url || null,
    image_url: parsed.data.image_url || null,
  };

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { id, ...payload } = values;
    if (id) {
      await supabase.from("local_guide_items").update(payload).eq("id", id);
    } else {
      await supabase.from("local_guide_items").insert(payload);
    }
  }

  revalidatePath("/admin/local-guide");
}

export async function upsertExtraServiceFromForm(formData: FormData) {
  await requireAdmin();

  const parsed = extraServiceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const values = {
    ...parsed.data,
    image_url: parsed.data.image_url || null,
  };

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { id, ...payload } = values;
    if (id) {
      await supabase.from("extra_services").update(payload).eq("id", id);
    } else {
      await supabase.from("extra_services").insert(payload);
    }
  }

  revalidatePath("/admin/extras");
}

export async function updateCompanyFromForm(formData: FormData) {
  await requireAdmin();

  const parsed = companySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const values = {
    ...parsed.data,
    logo_url: parsed.data.logo_url || null,
    instagram_url: parsed.data.instagram_url || null,
  };

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.from("companies").update(values).eq("id", values.id);
  }

  revalidatePath("/admin/settings");
}
