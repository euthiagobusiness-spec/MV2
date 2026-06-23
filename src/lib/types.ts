export type ReservationStatus =
  | "draft"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled";

export type GuideCategory =
  | "Praias"
  | "Restaurantes"
  | "Delivery"
  | "Mercados"
  | "Farmacias"
  | "Passeios"
  | "Dia de chuva"
  | "Criancas"
  | "Emergencia"
  | "Compras"
  | "Entretenimento";

export type ContactItem = {
  label: string;
  value: string;
  href?: string;
};

export type ManualItem = {
  title: string;
  description: string;
};

export type Company = {
  id: string;
  name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  instagram_url: string | null;
  whatsapp: string;
  email: string;
  address: string;
  privacy_policy_text: string;
  terms_text: string;
  created_at?: string;
  updated_at?: string;
};

export type Property = {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  cover_image_url: string | null;
  gallery_images: string[];
  short_description?: string | null;
  virtual_tour_url?: string | null;
  apartment_video_url?: string | null;
  condominium_video_url?: string | null;
  youtube_embed_url?: string | null;
  map_embed_url?: string | null;
  guest_preview_enabled?: boolean;
  show_wifi_on_preview?: boolean;
  condominium_description?: string | null;
  condominium_gallery_images?: string[];
  condominium_amenities?: string[];
  address: string;
  condominium_name: string;
  max_guests: number;
  checkin_time: string;
  checkout_time: string;
  wifi_name: string;
  wifi_password: string;
  parking_info: string;
  access_instructions: string;
  house_rules: string[];
  condominium_rules: string[];
  appliance_manual: ManualItem[];
  amenities: string[];
  emergency_contacts: ContactItem[];
  qr_code_url: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Reservation = {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  checkin_date: string;
  checkout_date: string;
  channel: string;
  external_reservation_code: string | null;
  status: ReservationStatus;
  guest_portal_token: string;
  checkin_completed: boolean;
  created_at: string;
  updated_at?: string;
  property?: Pick<Property, "id" | "name" | "slug" | "address">;
};

export type GuestCheckin = {
  id: string;
  reservation_id: string;
  responsible_guest_name: string;
  document_type: string;
  document_number: string;
  phone: string;
  email: string;
  arrival_time: string;
  car_plate: string | null;
  number_of_guests: number;
  companion_names: string[];
  accepted_house_rules: boolean;
  accepted_condominium_rules: boolean;
  accepted_privacy_policy: boolean;
  observations: string | null;
  created_at: string;
  reservation?: Reservation;
};

export type LocalGuideItem = {
  id: string;
  company_id: string;
  category: GuideCategory;
  title: string;
  description: string;
  address: string | null;
  google_maps_url: string | null;
  whatsapp_url: string | null;
  instagram_url: string | null;
  image_url: string | null;
  recommended: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ExtraService = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
  whatsapp_message: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PortalPayload = {
  company: Company;
  property: Property;
  reservation: Reservation;
  checkin: GuestCheckin | null;
  localGuideItems: LocalGuideItem[];
  extraServices: ExtraService[];
};

export type AdminDataset = {
  company: Company;
  properties: Property[];
  reservations: Reservation[];
  checkins: GuestCheckin[];
  localGuideItems: LocalGuideItem[];
  extraServices: ExtraService[];
};

export type AdminUser = {
  id: string;
  email: string;
  isDemo: boolean;
};

export type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};
