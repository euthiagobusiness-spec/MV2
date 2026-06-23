import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const checkinSchema = z.object({
  responsible_guest_name: z
    .string()
    .min(3, "Informe o nome completo do responsavel."),
  document_type: z.string().min(2, "Escolha o tipo de documento."),
  document_number: z.string().min(5, "Informe o numero do documento."),
  phone: z.string().min(8, "Informe um telefone valido."),
  email: z.string().email("Informe um e-mail valido."),
  arrival_time: z.string().min(2, "Informe o horario previsto de chegada."),
  car_plate: z.string().optional(),
  number_of_guests: z.coerce
    .number()
    .min(1, "Informe ao menos 1 hospede.")
    .max(20, "Revise a quantidade de hospedes."),
  companion_names: z.string().optional(),
  accepted_house_rules: z
    .boolean()
    .refine((value) => value, "Aceite as regras da casa para continuar."),
  accepted_condominium_rules: z
    .boolean()
    .refine((value) => value, "Aceite as regras do condominio para continuar."),
  accepted_privacy_policy: z
    .boolean()
    .refine((value) => value, "Aceite a politica de privacidade para continuar."),
  observations: z.string().optional(),
});

export const propertySchema = z.object({
  id: z.string().optional(),
  company_id: z.string().min(1),
  name: z.string().min(2, "Informe o nome do imovel."),
  slug: z
    .string()
    .min(2, "Informe um slug.")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minusculas, numeros e hifens."),
  cover_image_url: z.string().url().or(z.literal("")).nullable().optional(),
  gallery_images: z.string().optional(),
  short_description: z.string().optional(),
  virtual_tour_url: z.string().url().or(z.literal("")).nullable().optional(),
  apartment_video_url: z.string().url().or(z.literal("")).nullable().optional(),
  condominium_video_url: z.string().url().or(z.literal("")).nullable().optional(),
  youtube_embed_url: z.string().url().or(z.literal("")).nullable().optional(),
  map_embed_url: z.string().url().or(z.literal("")).nullable().optional(),
  guest_preview_enabled: z.coerce.boolean().default(true),
  show_wifi_on_preview: z.coerce.boolean().default(false),
  condominium_description: z.string().optional(),
  condominium_gallery_images: z.string().optional(),
  condominium_amenities: z.string().optional(),
  address: z.string().min(5, "Informe o endereco."),
  condominium_name: z.string().min(2, "Informe o condominio."),
  max_guests: z.coerce.number().min(1).max(30),
  checkin_time: z.string().min(2),
  checkout_time: z.string().min(2),
  wifi_name: z.string().min(1),
  wifi_password: z.string().min(1),
  parking_info: z.string().min(2),
  access_instructions: z.string().min(5),
  house_rules: z.string().min(5),
  condominium_rules: z.string().min(5),
  appliance_manual: z.string().optional(),
  amenities: z.string().optional(),
  emergency_contacts: z.string().optional(),
  qr_code_url: z.string().url().or(z.literal("")).nullable().optional(),
  is_active: z.coerce.boolean().default(true),
});

export const reservationSchema = z.object({
  id: z.string().optional(),
  property_id: z.string().min(1, "Vincule um imovel."),
  guest_name: z.string().min(3, "Informe o nome do hospede."),
  guest_email: z.string().email("Informe um e-mail valido."),
  guest_phone: z.string().min(8, "Informe um telefone valido."),
  checkin_date: z.string().min(8, "Informe a data de check-in."),
  checkout_date: z.string().min(8, "Informe a data de check-out."),
  channel: z.string().min(2, "Informe o canal."),
  external_reservation_code: z.string().optional(),
  status: z.enum(["draft", "confirmed", "checked_in", "completed", "cancelled"]),
  guest_portal_token: z.string().optional(),
});

export const guideItemSchema = z.object({
  id: z.string().optional(),
  company_id: z.string().min(1),
  category: z.string().min(2),
  title: z.string().min(2, "Informe o titulo."),
  description: z.string().min(5, "Informe a descricao."),
  address: z.string().optional(),
  google_maps_url: z.string().url().or(z.literal("")).optional(),
  whatsapp_url: z.string().url().or(z.literal("")).optional(),
  instagram_url: z.string().url().or(z.literal("")).optional(),
  image_url: z.string().url().or(z.literal("")).optional(),
  recommended: z.coerce.boolean().default(false),
  sort_order: z.coerce.number().default(0),
});

export const extraServiceSchema = z.object({
  id: z.string().optional(),
  company_id: z.string().min(1),
  title: z.string().min(2, "Informe o nome do servico."),
  description: z.string().min(5, "Informe a descricao."),
  price: z.coerce.number().min(0),
  image_url: z.string().url().or(z.literal("")).optional(),
  whatsapp_message: z.string().min(5),
  is_active: z.coerce.boolean().default(true),
});

export const companySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  logo_url: z.string().url().or(z.literal("")).optional(),
  primary_color: z.string().min(4),
  secondary_color: z.string().min(4),
  instagram_url: z.string().url().or(z.literal("")).optional(),
  whatsapp: z.string().min(8),
  email: z.string().email(),
  address: z.string().min(5),
  privacy_policy_text: z.string().min(20),
  terms_text: z.string().min(20),
});

export type CheckinInput = z.input<typeof checkinSchema>;
export type PropertyInput = z.input<typeof propertySchema>;
export type ReservationInput = z.input<typeof reservationSchema>;
