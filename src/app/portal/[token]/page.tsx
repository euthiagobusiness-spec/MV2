import { notFound } from "next/navigation";
import {
  Car,
  Clock,
  ExternalLink,
  Home,
  KeyRound,
  Mail,
  MapPinned,
  Phone,
  Sparkles,
} from "lucide-react";

import { CheckinForm } from "@/components/portal/CheckinForm";
import { ExtraServiceCard } from "@/components/portal/ExtraServiceCard";
import { LocalGuideCard } from "@/components/portal/LocalGuideCard";
import { PortalHero } from "@/components/portal/PortalHero";
import { PortalSection } from "@/components/portal/PortalSection";
import { RulesCard } from "@/components/portal/RulesCard";
import { WhatsAppButton } from "@/components/portal/WhatsAppButton";
import { WifiCard } from "@/components/portal/WifiCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { getPortalPayload } from "@/lib/data/portal";
import { formatDate, whatsappUrl } from "@/lib/utils";

type PortalPageProps = {
  params: Promise<{ token: string }>;
};

export default async function PortalPage({ params }: PortalPageProps) {
  const { token } = await params;
  const payload = await getPortalPayload(token);

  if (!payload) {
    notFound();
  }

  const { company, property, reservation, checkin, localGuideItems, extraServices } =
    payload;
  const guideByCategory = localGuideItems.reduce(
    (groups, item) => {
      groups[item.category] = [...(groups[item.category] ?? []), item];
      return groups;
    },
    {} as Record<string, typeof localGuideItems>,
  );

  return (
    <main className="bg-[#f7fbfb]">
      <PortalHero company={company} property={property} reservation={reservation} />

      <div className="sticky top-0 z-20 border-b border-teal-900/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-3 text-sm font-bold text-slate-600 lg:px-8">
          {[
            ["#checkin", "Check-in"],
            ["#chegada", "Como chegar"],
            ["#wifi", "Wi-Fi"],
            ["#manual", "Manual"],
            ["#regras", "Regras"],
            ["#guia", "Guia local"],
            ["#extras", "Extras"],
          ].map(([href, label]) => (
            <a className="shrink-0 rounded-full bg-teal-50 px-3 py-2" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <PortalSection
          eyebrow="Boas-vindas"
          title={`Sua estadia em ${property.name}`}
          description="Este portal foi criado para reduzir esperas e duvidas. Salve este link: ele reune dados de entrada, Wi-Fi, regras, manual do apartamento, guia local, extras e contatos uteis."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              icon={<Home size={22} />}
              label="Apartamento"
              value={property.name}
            />
            <InfoCard
              icon={<Clock size={22} />}
              label="Periodo"
              value={`${formatDate(reservation.checkin_date)} a ${formatDate(
                reservation.checkout_date,
              )}`}
            />
            <InfoCard
              icon={<Sparkles size={22} />}
              label="Reserva"
              value={reservation.external_reservation_code ?? reservation.channel}
            />
          </div>
        </PortalSection>

        <PortalSection
          description="Preencha antes da chegada para agilizar a liberacao com a equipe e o condominio."
          eyebrow="Obrigatorio"
          id="checkin"
          title="Check-in digital"
        >
          <CheckinForm
            existingCheckin={checkin}
            reservation={reservation}
            token={token}
          />
        </PortalSection>

        <PortalSection id="chegada" title="Como chegar">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="card p-5">
              <MapPinned className="text-teal-700" size={24} />
              <h3 className="mt-3 text-xl font-black text-teal-950">Endereco</h3>
              <p className="mt-2 leading-7 text-slate-700">{property.address}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  className="btn btn-secondary"
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    property.address,
                  )}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink size={17} />
                  Abrir Google Maps
                </a>
                <CopyButton label="Copiar endereco" value={property.address} />
              </div>
            </div>

            <div className="card grid gap-4 p-5">
              <div className="flex gap-3">
                <KeyRound className="mt-1 shrink-0 text-teal-700" size={22} />
                <div>
                  <h3 className="font-black text-teal-950">Entrada</h3>
                  <p className="mt-1 leading-7 text-slate-700">
                    {property.access_instructions}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Car className="mt-1 shrink-0 text-teal-700" size={22} />
                <div>
                  <h3 className="font-black text-teal-950">Estacionamento</h3>
                  <p className="mt-1 leading-7 text-slate-700">
                    {property.parking_info}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PortalSection>

        <PortalSection id="horarios" title="Check-in e check-out">
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard icon={<Clock size={22} />} label="Entrada" value={property.checkin_time} />
            <InfoCard icon={<Clock size={22} />} label="Saida" value={property.checkout_time} />
            <InfoCard
              icon={<Sparkles size={22} />}
              label="Antes de sair"
              value="Retire o lixo, desligue luzes/ar, confira pertences e devolva chaves/controles."
            />
          </div>
        </PortalSection>

        <PortalSection id="wifi" title="Wi-Fi">
          <WifiCard name={property.wifi_name} password={property.wifi_password} />
        </PortalSection>

        <PortalSection
          description="Instrucoes rapidas para os principais itens do apartamento."
          id="manual"
          title="Manual do apartamento"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {property.appliance_manual.map((item) => (
              <div className="card p-4" key={item.title}>
                <h3 className="font-black text-teal-950">{item.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 card p-5">
            <h3 className="font-black text-teal-950">Incluso na estadia</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <span
                  className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-900"
                  key={amenity}
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </PortalSection>

        <PortalSection id="regras" title="Regras da casa">
          <RulesCard items={property.house_rules} />
        </PortalSection>

        <PortalSection title="Regras do condominio">
          <RulesCard items={property.condominium_rules} />
        </PortalSection>

        <PortalSection
          description="Sugestoes selecionadas para aproveitar Maranduba e Ubatuba com mais praticidade."
          id="guia"
          title="Guia de Maranduba e Ubatuba"
        >
          <div className="grid gap-8">
            {Object.entries(guideByCategory).map(([category, items]) => (
              <div key={category}>
                <h3 className="mb-3 text-lg font-black text-teal-950">{category}</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <LocalGuideCard item={item} key={item.id} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PortalSection>

        <PortalSection
          description="Servicos opcionais sujeitos a disponibilidade. Solicite pelo WhatsApp."
          id="extras"
          title="Extras e mimos"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {extraServices
              .filter((service) => service.is_active)
              .map((service) => (
                <ExtraServiceCard
                  company={company}
                  key={service.id}
                  property={property}
                  service={service}
                />
              ))}
          </div>
        </PortalSection>

        <PortalSection id="contatos" title="Contatos uteis">
          <div className="grid gap-4 md:grid-cols-2">
            <a className="card flex gap-3 p-4" href={whatsappUrl(company.whatsapp)}>
              <Phone className="text-teal-700" size={22} />
              <div>
                <p className="font-black text-teal-950">WhatsApp MV2</p>
                <p className="text-slate-600">{company.whatsapp}</p>
              </div>
            </a>
            <a className="card flex gap-3 p-4" href={`mailto:${company.email}`}>
              <Mail className="text-teal-700" size={22} />
              <div>
                <p className="font-black text-teal-950">E-mail</p>
                <p className="text-slate-600">{company.email}</p>
              </div>
            </a>
            {property.emergency_contacts.map((contact) => (
              <div className="card p-4" key={contact.label}>
                <p className="font-black text-teal-950">{contact.label}</p>
                <p className="mt-1 text-slate-600">{contact.value}</p>
              </div>
            ))}
          </div>
        </PortalSection>

        <PortalSection id="pos-estadia" title="Pos-estadia">
          <div className="card grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-xl font-black text-teal-950">
                Gostou da estadia?
              </h3>
              <p className="mt-2 leading-7 text-slate-600">
                Sua avaliacao ajuda outros hospedes e fortalece reservas diretas.
                Siga a MV2 no Instagram e fale conosco para sua proxima viagem.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {company.instagram_url ? (
                <a
                  className="btn btn-outline"
                  href={company.instagram_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Instagram
                </a>
              ) : null}
              <WhatsAppButton
                label="Quero reservar novamente"
                message={`Ola, gostaria de reservar novamente com a MV2. Minha ultima estadia foi no ${property.name}.`}
                phone={company.whatsapp}
              />
            </div>
          </div>
        </PortalSection>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4">
      <div className="text-teal-700">{icon}</div>
      <p className="mt-2 text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 font-black text-teal-950">{value}</p>
    </div>
  );
}
