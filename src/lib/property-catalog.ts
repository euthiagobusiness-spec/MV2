import type { Property, Reservation } from "@/lib/types";

export const mv2Logo = "/uploads/brand/logo-moderno-mv2-em-fundo-azul.png";

export const condominiumImages = [
  "/uploads/condominium/084657bf-ecb2-4fd3-971b-4e7ff02a14fe.jpg",
  "/uploads/condominium/1b37ff3a-bc35-4c78-a5df-8c596bf8b380.jpg",
  "/uploads/condominium/6fb74b79-f0a9-4845-bdf9-c5deb91f01da.jpg",
  "/uploads/condominium/72c1d4e8-b072-496e-a141-500932479ee8.jpg",
  "/uploads/condominium/a2eeeb8b-a1f3-4b9b-a23f-26926784c959.jpg",
  "/uploads/condominium/b0a031a2-03d9-41a3-8a11-aee26706dd12.jpg",
  "/uploads/condominium/cb3601ef-48f5-4d4e-a094-f9e23b0883ff.jpg",
  "/uploads/condominium/img_8680.jpeg",
  "/uploads/condominium/img_8823.jpeg",
  "/uploads/condominium/img_8832.jpeg",
  "/uploads/condominium/img_9247.jpeg",
  "/uploads/condominium/img_9248.jpeg",
];

const apartmentImages: Record<string, string[]> = {
  g2: [
    "/uploads/apartments/g2/img_9635.jpeg",
    "/uploads/apartments/g2/img_9636.jpeg",
    "/uploads/apartments/g2/img_9638.jpeg",
    "/uploads/apartments/g2/img_9644.jpeg",
    "/uploads/apartments/g2/img_9646.jpeg",
    "/uploads/apartments/g2/img_9647.jpeg",
    "/uploads/apartments/g2/img_9648.jpeg",
    "/uploads/apartments/g2/img_9650.jpeg",
  ],
  g3: [
    "/uploads/apartments/g3/img_9571.jpeg",
    "/uploads/apartments/g3/img_9592.jpeg",
    "/uploads/apartments/g3/img_9595.jpeg",
    "/uploads/apartments/g3/img_9596.jpeg",
    "/uploads/apartments/g3/img_9597.jpeg",
    "/uploads/apartments/g3/img_9598.jpeg",
    "/uploads/apartments/g3/img_9600.jpeg",
    "/uploads/apartments/g3/img_9602.jpeg",
  ],
  g4: [
    "/uploads/apartments/g4/img_9505.jpeg",
    "/uploads/apartments/g4/img_9506-1-.jpeg",
    "/uploads/apartments/g4/img_9508-1-.jpeg",
    "/uploads/apartments/g4/img_9509.jpeg",
    "/uploads/apartments/g4/img_9509-1-.jpeg",
    "/uploads/apartments/g4/img_9510-1-.jpeg",
    "/uploads/apartments/g4/img_9511-1-.jpeg",
    "/uploads/apartments/g4/img_9512-1-.jpeg",
  ],
  h1: [
    "/uploads/apartments/h1/img_0266.jpeg",
    "/uploads/apartments/h1/img_0267.jpeg",
    "/uploads/apartments/h1/img_0268.jpeg",
    "/uploads/apartments/h1/img_0269.jpeg",
    "/uploads/apartments/h1/img_0270.jpeg",
    "/uploads/apartments/h1/img_0271.jpeg",
    "/uploads/apartments/h1/img_0272.jpeg",
    "/uploads/apartments/h1/img_0273.jpeg",
  ],
  h5: [
    "/uploads/apartments/h5/img_0282.jpeg",
    "/uploads/apartments/h5/img_0283.jpeg",
    "/uploads/apartments/h5/img_0284.jpeg",
    "/uploads/apartments/h5/img_0285.jpeg",
    "/uploads/apartments/h5/img_0286.jpeg",
    "/uploads/apartments/h5/img_0287.jpeg",
    "/uploads/apartments/h5/img_0288.jpeg",
    "/uploads/apartments/h5/img_0289.jpeg",
  ],
  h28: [
    "/uploads/apartments/h28/img_9738.jpeg",
    "/uploads/apartments/h28/img_9739.jpeg",
    "/uploads/apartments/h28/img_9740.jpeg",
    "/uploads/apartments/h28/img_9741.jpeg",
    "/uploads/apartments/h28/img_9742.jpeg",
    "/uploads/apartments/h28/img_9743.jpeg",
    "/uploads/apartments/h28/img_9744.jpeg",
    "/uploads/apartments/h28/img_9745.jpeg",
  ],
  i7: [
    "/uploads/apartments/i7/img_9774.jpeg",
    "/uploads/apartments/i7/img_9780.jpeg",
    "/uploads/apartments/i7/img_9781.jpeg",
    "/uploads/apartments/i7/img_9782.jpeg",
    "/uploads/apartments/i7/img_9783.jpeg",
    "/uploads/apartments/i7/img_9784.jpeg",
    "/uploads/apartments/i7/img_9785.jpeg",
    "/uploads/apartments/i7/img_9786.jpeg",
  ],
  i24: [
    "/uploads/apartments/i24/img_9682.jpeg",
    "/uploads/apartments/i24/img_9683.jpeg",
    "/uploads/apartments/i24/img_9684.jpeg",
    "/uploads/apartments/i24/img_9685.jpeg",
    "/uploads/apartments/i24/img_9687.jpeg",
    "/uploads/apartments/i24/img_9688.jpeg",
    "/uploads/apartments/i24/img_9689.jpeg",
    "/uploads/apartments/i24/img_9690.jpeg",
  ],
};

const descriptions: Record<string, string> = {
  g2: "Apartamento pratico para casal ou familia, com facil acesso a piscina e praia.",
  g3: "Ambiente confortavel, equipado e pensado para estadias tranquilas em Maranduba.",
  g4: "Espaco amplo para familias maiores, com quartos bem distribuídos e boa circulacao.",
  h1: "Unidade aconchegante, ideal para quem busca uma chegada simples e funcional.",
  h5: "Apartamento compacto e completo para curtir praia, piscina e descanso.",
  h28: "Opcao familiar com layout generoso, varanda e estrutura para estadias longas.",
  i7: "Loft leve e funcional, perfeito para casal ou familia pequena.",
  i24: "Apartamento equipado, claro e bem localizado dentro do condominio.",
};

const baseProperty = {
  company_id: "00000000-0000-4000-8000-000000000001",
  address: "Condominio Maranduba Ville II, Praia do Sape, Ubatuba/SP",
  condominium_name: "Condominio Maranduba Ville II",
  checkin_time: "15:00",
  checkout_time: "11:00",
  wifi_name: "MV2-Maranduba",
  wifi_password: "Disponivel apenas no portal da reserva",
  parking_info:
    "Uma vaga por apartamento. Informe a placa no pre-check-in e respeite a vaga indicada.",
  access_instructions:
    "As instrucoes completas de entrada ficam protegidas no portal da reserva e sao liberadas proximo ao check-in.",
  house_rules: [
    "Nao fumar dentro do apartamento.",
    "Respeite o limite de hospedes informado na reserva.",
    "Mantenha silencio das 22h as 8h.",
    "Cuide dos itens do apartamento como se fossem seus.",
  ],
  condominium_rules: [
    "Piscina conforme horario e regras do condominio.",
    "Visitantes somente com autorizacao previa.",
    "Nao use vidro na area da piscina.",
    "Descarte o lixo nos pontos indicados.",
  ],
  appliance_manual: [
    {
      title: "Cozinha",
      description: "Use os utensilios com cuidado e mantenha os equipamentos desligados ao sair.",
    },
    {
      title: "TV e internet",
      description: "Aplicativos de streaming devem usar a propria conta do hospede.",
    },
  ],
  amenities: ["Piscina", "Vaga de garagem", "Cozinha equipada", "Wi-Fi", "TV", "Utensilios basicos"],
  emergency_contacts: [
    { label: "Suporte MV2", value: "+55 12 99999-0000", href: "https://wa.me/5512999990000" },
    { label: "Emergencia", value: "192" },
  ],
  qr_code_url: null,
  is_active: true,
  guest_preview_enabled: true,
  show_wifi_on_preview: false,
  condominium_description:
    "O Maranduba Ville II fica na regiao da Praia do Sape, com estrutura para familias, piscina, areas comuns e acesso pratico a mercados, praia e servicos locais.",
  condominium_gallery_images: condominiumImages,
  condominium_amenities: ["Piscina", "Garagem", "Areas comuns", "Portaria", "Ambiente familiar"],
  virtual_tour_url: null,
  apartment_video_url: null,
  condominium_video_url: null,
  youtube_embed_url: null,
  map_embed_url: null,
};

const specs: Array<{ code: string; guests: number; rooms: string }> = [
  { code: "G2", guests: 6, rooms: "1 quarto" },
  { code: "G3", guests: 8, rooms: "1 quarto" },
  { code: "G4", guests: 10, rooms: "3 quartos" },
  { code: "H1", guests: 6, rooms: "1 quarto" },
  { code: "H5", guests: 6, rooms: "1 quarto" },
  { code: "H28", guests: 8, rooms: "2 quartos" },
  { code: "i7", guests: 4, rooms: "loft" },
  { code: "i24", guests: 6, rooms: "1 quarto" },
];

export const mv2Properties: Property[] = specs.map((spec, index) => {
  const slug = spec.code.toLowerCase();
  const gallery = apartmentImages[slug] ?? [];

  return {
    ...baseProperty,
    id: `00000000-0000-4000-8000-${String(100 + index).padStart(12, "0")}`,
    name: `Apartamento ${spec.code}`,
    slug,
    short_description: `${descriptions[slug]} ${spec.rooms}, ate ${spec.guests} hospedes.`,
    cover_image_url: gallery[0] ?? null,
    gallery_images: gallery,
    max_guests: spec.guests,
  };
});

export const mv2Reservations: Reservation[] = mv2Properties.slice(0, 3).map((property, index) => ({
  id: `00000000-0000-4000-8000-${String(300 + index).padStart(12, "0")}`,
  property_id: property.id,
  guest_name: ["Ana Souza", "Carlos Mendes", "Juliana Rocha"][index],
  guest_email: ["ana.souza@example.com", "carlos@example.com", "juliana@example.com"][index],
  guest_phone: ["5512988887777", "5512977776666", "5512966665555"][index],
  checkin_date: ["2026-07-10", "2026-07-15", "2026-07-20"][index],
  checkout_date: ["2026-07-14", "2026-07-18", "2026-07-24"][index],
  channel: ["direct", "airbnb", "stays"][index],
  external_reservation_code: `MV2-${String(index + 1).padStart(3, "0")}`,
  status: "confirmed",
  guest_portal_token: `demo-${property.slug}-2026`,
  checkin_completed: false,
  created_at: "2026-06-23T00:00:00.000Z",
  property: {
    id: property.id,
    name: property.name,
    slug: property.slug,
    address: property.address,
  },
}));

export function getActivePreviewProperties(properties: Property[] = mv2Properties) {
  return properties.filter(
    (property) => property.is_active && property.guest_preview_enabled !== false,
  );
}

export function getPreviewPropertyBySlug(slug: string) {
  return getActivePreviewProperties().find((property) => property.slug === slug) ?? null;
}
