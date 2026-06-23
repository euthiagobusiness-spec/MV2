import { identifyGuestReservation as identifyLocalGuestReservation } from "@/lib/data/guest";

export type BookingChannel =
  | "airbnb"
  | "booking"
  | "expedia"
  | "decolar"
  | "direct"
  | "stays"
  | "other";

export interface ExternalReservationPayload {
  externalReservationCode: string;
  channel: BookingChannel;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  propertyExternalId?: string;
  propertyId?: string;
  checkinDate: string;
  checkoutDate: string;
  numberOfGuests?: number;
}

export async function identifyGuestReservation(input: {
  email?: string;
  phone?: string;
  reservationCode?: string;
  channel?: BookingChannel;
}) {
  // Busca reserva local no Supabase. Futuramente, consultar APIs externas
  // ou sincronizacao via Stays e demais canais.
  return identifyLocalGuestReservation(input);
}
