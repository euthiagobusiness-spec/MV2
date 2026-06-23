export type StaysReservationPayload = {
  externalReservationCode: string;
  propertyExternalId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkinDate: string;
  checkoutDate: string;
  channel: string;
  status: string;
};

export type StaysSyncResult = {
  imported: number;
  skipped: number;
  errors: string[];
};

export async function syncReservationsFromStays(): Promise<StaysSyncResult> {
  // Future integration point:
  // 1. Read the Stays API key from a server-only env var, e.g. STAYS_API_KEY.
  // 2. Configure the base URL/endpoints supplied by Stays for reservations.
  // 3. Map Stays property IDs to public.properties.id.
  // 4. Upsert reservations and generate guest_portal_token when missing.
  // 5. Store sync logs and retry failures.
  return {
    imported: 0,
    skipped: 0,
    errors: [
      "Integracao Stays ainda nao implementada. Use cadastro manual de reservas.",
    ],
  };
}
