import type {
  AdminDataset,
  Company,
  ExtraService,
  GuestCheckin,
  LocalGuideItem,
  PortalPayload,
  Property,
  Reservation,
} from "@/lib/types";
import { mv2Logo, mv2Properties, mv2Reservations } from "@/lib/property-catalog";

export const demoCompany: Company = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "MV2 Temporada",
  logo_url: mv2Logo,
  primary_color: "#0b3b5a",
  secondary_color: "#22a6d5",
  instagram_url: "https://instagram.com/mv2temporada",
  whatsapp: "5512999990000",
  email: "contato@mv2temporada.com.br",
  address: "Maranduba, Ubatuba/SP",
  privacy_policy_text:
    "A MV2 Temporada coleta apenas os dados necessarios para identificacao do responsavel pela reserva, comunicacao operacional e cumprimento de regras de hospedagem. Os dados nao sao vendidos e podem ser corrigidos ou excluidos mediante solicitacao, observadas obrigacoes legais.",
  terms_text:
    "Ao concluir o check-in, o hospede declara ciencia das regras da casa, regras do condominio, horarios de entrada e saida, uso responsavel das areas comuns e eventuais multas por descumprimento.",
};

export const demoProperty: Property = mv2Properties[0];

export const demoReservation: Reservation = mv2Reservations[0];

export const demoLocalGuideItems: LocalGuideItem[] = [
  {
    id: "00000000-0000-4000-8000-000000000030",
    company_id: demoCompany.id,
    category: "Praias",
    title: "Praia da Maranduba",
    description:
      "Praia ampla, com mar mais tranquilo, quiosques e bom acesso para familias.",
    address: "Praia da Maranduba, Ubatuba/SP",
    google_maps_url: "https://maps.google.com/?q=Praia+da+Maranduba",
    whatsapp_url: null,
    instagram_url: null,
    image_url:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
    recommended: true,
    sort_order: 1,
  },
  {
    id: "00000000-0000-4000-8000-000000000031",
    company_id: demoCompany.id,
    category: "Restaurantes",
    title: "Restaurante Peixe com Banana",
    description:
      "Boa opcao para almoco com frutos do mar, pratos brasileiros e ambiente familiar.",
    address: "Ubatuba/SP",
    google_maps_url: "https://maps.google.com/?q=restaurante+ubatuba",
    whatsapp_url: null,
    instagram_url: "https://instagram.com",
    image_url:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
    recommended: true,
    sort_order: 2,
  },
  {
    id: "00000000-0000-4000-8000-000000000032",
    company_id: demoCompany.id,
    category: "Mercados",
    title: "Mercado Maranduba",
    description:
      "Mercado de apoio para compras rapidas, bebidas, itens de praia e cafe da manha.",
    address: "Av. Marginal, Maranduba",
    google_maps_url: "https://maps.google.com/?q=mercado+maranduba",
    whatsapp_url: null,
    instagram_url: null,
    image_url:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=80",
    recommended: false,
    sort_order: 3,
  },
  {
    id: "00000000-0000-4000-8000-000000000033",
    company_id: demoCompany.id,
    category: "Passeios",
    title: "Passeio de escuna em Ubatuba",
    description:
      "Roteiros para ilhas e praias com saidas em dias de mar adequado. Reserve com antecedencia.",
    address: "Centro de Ubatuba",
    google_maps_url: "https://maps.google.com/?q=passeio+escuna+ubatuba",
    whatsapp_url: "https://wa.me/5512999990000",
    instagram_url: null,
    image_url:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
    recommended: true,
    sort_order: 4,
  },
  {
    id: "00000000-0000-4000-8000-000000000034",
    company_id: demoCompany.id,
    category: "Emergencia",
    title: "Pronto atendimento",
    description:
      "Contato de emergencia para atendimento medico. Em risco imediato, ligue 192.",
    address: "Ubatuba/SP",
    google_maps_url: "https://maps.google.com/?q=pronto+atendimento+ubatuba",
    whatsapp_url: null,
    instagram_url: null,
    image_url:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
    recommended: false,
    sort_order: 5,
  },
];

export const demoExtraServices: ExtraService[] = [
  {
    id: "00000000-0000-4000-8000-000000000040",
    company_id: demoCompany.id,
    title: "Late check-out",
    description:
      "Saida estendida mediante disponibilidade para aproveitar melhor o ultimo dia.",
    price: 120,
    image_url:
      "https://images.unsplash.com/photo-1496412705862-e0088f16f791?auto=format&fit=crop&w=900&q=80",
    whatsapp_message: "Ola, gostaria de solicitar late check-out para minha reserva.",
    is_active: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000041",
    company_id: demoCompany.id,
    title: "Kit praia",
    description:
      "Cadeira, guarda-sol e cooler para deixar o dia de praia mais simples.",
    price: 85,
    image_url:
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=900&q=80",
    whatsapp_message: "Ola, gostaria de solicitar o kit praia para minha reserva.",
    is_active: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000042",
    company_id: demoCompany.id,
    title: "Decoracao romantica",
    description:
      "Preparacao especial para aniversarios, lua de mel ou surpresa de casal.",
    price: 180,
    image_url:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    whatsapp_message:
      "Ola, gostaria de solicitar decoracao romantica para minha reserva.",
    is_active: true,
  },
];

export const demoCheckins: GuestCheckin[] = [];

export const demoAdminDataset: AdminDataset = {
  company: demoCompany,
  properties: mv2Properties,
  reservations: mv2Reservations,
  checkins: demoCheckins,
  localGuideItems: demoLocalGuideItems,
  extraServices: demoExtraServices,
};

export const demoPortalPayload: PortalPayload = {
  company: demoCompany,
  property: demoProperty,
  reservation: demoReservation,
  checkin: null,
  localGuideItems: demoLocalGuideItems,
  extraServices: demoExtraServices,
};
