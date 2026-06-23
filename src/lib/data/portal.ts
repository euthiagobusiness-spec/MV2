import { demoPortalPayload } from "@/lib/mock-data";
import { hasSupabaseAdminKey, isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PortalPayload } from "@/lib/types";

export async function getPortalPayload(token: string): Promise<PortalPayload | null> {
  if (!isSupabaseConfigured()) {
    return token === demoPortalPayload.reservation.guest_portal_token
      ? demoPortalPayload
      : null;
  }

  if (!hasSupabaseAdminKey()) {
    console.error("SUPABASE_SECRET_KEY is required to load portal data securely.");
    return null;
  }

  const supabase = createAdminClient();
  const { data: reservation, error } = await supabase
    .from("reservations")
    .select("*, property:properties(*, company:companies(*))")
    .eq("guest_portal_token", token)
    .maybeSingle();

  if (error || !reservation?.property) {
    if (error) console.error("Failed to load reservation by token", error);
    return null;
  }

  const property = reservation.property;
  const company = property.company;

  const [checkinResult, guideResult, extrasResult] = await Promise.all([
    supabase
      .from("guest_checkins")
      .select("*")
      .eq("reservation_id", reservation.id)
      .maybeSingle(),
    supabase
      .from("local_guide_items")
      .select("*")
      .eq("company_id", company.id)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true }),
    supabase
      .from("extra_services")
      .select("*")
      .eq("company_id", company.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  if (checkinResult.error) console.error(checkinResult.error);
  if (guideResult.error) console.error(guideResult.error);
  if (extrasResult.error) console.error(extrasResult.error);

  return {
    company,
    property,
    reservation,
    checkin: checkinResult.data ?? null,
    localGuideItems: guideResult.data ?? [],
    extraServices: extrasResult.data ?? [],
  } as PortalPayload;
}
