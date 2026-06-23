import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { demoAdminDataset } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type {
  AdminDataset,
  AdminUser,
  ExtraService,
  GuestCheckin,
  LocalGuideItem,
  Property,
  Reservation,
} from "@/lib/types";

export const requireAdmin = cache(async (): Promise<AdminUser> => {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const demoSession = cookieStore.get("mv2-demo-admin")?.value;

    if (demoSession !== "active") {
      redirect("/admin/login");
    }

    return {
      id: "demo-admin",
      email: "admin@mv2temporada.com.br",
      isDemo: true,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/admin/login");
  }

  return {
    id: data.claims.sub,
    email: String(data.claims.email ?? "admin"),
    isDemo: false,
  };
});

export async function getAdminDataset(): Promise<AdminDataset> {
  await requireAdmin();

  if (!isSupabaseConfigured()) {
    return demoAdminDataset;
  }

  const supabase = await createClient();
  const [
    companyResult,
    propertiesResult,
    reservationsResult,
    checkinsResult,
    guideResult,
    extrasResult,
  ] = await Promise.all([
    supabase.from("companies").select("*").limit(1).single(),
    supabase.from("properties").select("*").order("created_at", { ascending: false }),
    supabase
      .from("reservations")
      .select("*, property:properties(id,name,slug,address)")
      .order("checkin_date", { ascending: true }),
    supabase
      .from("guest_checkins")
      .select("*, reservation:reservations(*, property:properties(id,name,slug,address))")
      .order("created_at", { ascending: false }),
    supabase
      .from("local_guide_items")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true }),
    supabase.from("extra_services").select("*").order("created_at", { ascending: false }),
  ]);

  if (companyResult.error) throw companyResult.error;
  if (propertiesResult.error) throw propertiesResult.error;
  if (reservationsResult.error) throw reservationsResult.error;
  if (checkinsResult.error) throw checkinsResult.error;
  if (guideResult.error) throw guideResult.error;
  if (extrasResult.error) throw extrasResult.error;

  return {
    company: companyResult.data,
    properties: (propertiesResult.data ?? []) as Property[],
    reservations: (reservationsResult.data ?? []) as Reservation[],
    checkins: (checkinsResult.data ?? []) as GuestCheckin[],
    localGuideItems: (guideResult.data ?? []) as LocalGuideItem[],
    extraServices: (extrasResult.data ?? []) as ExtraService[],
  };
}

export async function getPropertyById(id: string) {
  const dataset = await getAdminDataset();
  return dataset.properties.find((property) => property.id === id) ?? null;
}

export async function getReservationById(id: string) {
  const dataset = await getAdminDataset();
  return dataset.reservations.find((reservation) => reservation.id === id) ?? null;
}

export async function getCheckinById(id: string) {
  const dataset = await getAdminDataset();
  return dataset.checkins.find((checkin) => checkin.id === id) ?? null;
}
