import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/env";
import {
  getActivePreviewProperties,
  getPreviewPropertyBySlug,
  mv2Properties,
  mv2Reservations,
} from "@/lib/property-catalog";
import { createClient } from "@/lib/supabase/server";
import type { Property, Reservation } from "@/lib/types";
import { digitsOnly } from "@/lib/utils";

export type ReservationMatch = {
  id: string;
  token: string;
  channel: string;
  checkin_date: string;
  checkout_date: string;
  property: Pick<
    Property,
    "id" | "name" | "slug" | "cover_image_url" | "condominium_name" | "max_guests"
  >;
};

function toMatch(reservation: Reservation, property?: Property): ReservationMatch | null {
  const matchedProperty =
    property ?? mv2Properties.find((item) => item.id === reservation.property_id);

  if (!matchedProperty) return null;

  return {
    id: reservation.id,
    token: reservation.guest_portal_token,
    channel: reservation.channel,
    checkin_date: reservation.checkin_date,
    checkout_date: reservation.checkout_date,
    property: {
      id: matchedProperty.id,
      name: matchedProperty.name,
      slug: matchedProperty.slug,
      cover_image_url: matchedProperty.cover_image_url,
      condominium_name: matchedProperty.condominium_name,
      max_guests: matchedProperty.max_guests,
    },
  };
}

export const getPublicProperties = cache(async (): Promise<Property[]> => {
  if (!isSupabaseConfigured()) {
    return getActivePreviewProperties();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_active", true)
    .eq("guest_preview_enabled", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to load public properties", error);
    return getActivePreviewProperties();
  }

  return (data ?? []) as Property[];
});

export async function getPublicPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured()) {
    return getPreviewPropertyBySlug(slug);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("guest_preview_enabled", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load public property", error);
    return getPreviewPropertyBySlug(slug);
  }

  return (data as Property | null) ?? null;
}

export async function identifyGuestReservation(input: {
  email?: string;
  phone?: string;
  reservationCode?: string;
  channel?: string;
}): Promise<ReservationMatch[]> {
  const email = input.email?.trim().toLowerCase();
  const phone = digitsOnly(input.phone ?? "");
  const reservationCode = input.reservationCode?.trim().toLowerCase();
  const channel = input.channel?.trim().toLowerCase();

  if (!email && !phone && !reservationCode) return [];

  if (!isSupabaseConfigured()) {
    return mv2Reservations
      .filter((reservation) => {
        const emailMatches = email
          ? reservation.guest_email.toLowerCase() === email
          : true;
        const phoneMatches = phone
          ? digitsOnly(reservation.guest_phone).endsWith(phone) ||
            phone.endsWith(digitsOnly(reservation.guest_phone))
          : true;
        const codeMatches = reservationCode
          ? reservation.external_reservation_code?.toLowerCase() === reservationCode
          : true;
        const channelMatches = channel ? reservation.channel.toLowerCase() === channel : true;

        return emailMatches && phoneMatches && codeMatches && channelMatches;
      })
      .map((reservation) => toMatch(reservation))
      .filter((match): match is ReservationMatch => Boolean(match));
  }

  const supabase = await createClient();
  let query = supabase
    .from("reservations")
    .select("*, property:properties(id,name,slug,cover_image_url,condominium_name,max_guests)")
    .limit(5);

  if (email) query = query.eq("guest_email", email);
  if (phone) query = query.eq("guest_phone", phone);
  if (reservationCode) query = query.eq("external_reservation_code", reservationCode);
  if (channel) query = query.eq("channel", channel);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to identify reservation", error);
    return [];
  }

  return ((data ?? []) as Array<Reservation & { property?: Property }>)
    .map((reservation) => toMatch(reservation, reservation.property))
    .filter((match): match is ReservationMatch => Boolean(match));
}
