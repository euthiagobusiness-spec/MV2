import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";

import { WhatsAppButton } from "@/components/portal/WhatsAppButton";
import type { Company, Property, Reservation } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type PortalHeroProps = {
  company: Company;
  property: Property;
  reservation: Reservation;
};

export function PortalHero({ company, property, reservation }: PortalHeroProps) {
  return (
    <header
      className="relative overflow-hidden bg-teal-950 text-white"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(8, 47, 43, 0.24), rgba(8, 47, 43, 0.88)), url(${property.cover_image_url ?? ""})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="mx-auto flex min-h-[620px] max-w-6xl flex-col justify-between px-5 py-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {company.logo_url ? (
              <Image
                alt={company.name}
                className="h-11 w-11 rounded-full object-cover"
                height={44}
                src={company.logo_url}
                width={44}
              />
            ) : (
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-black text-teal-950">
                MV2
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-white/70">{company.name}</p>
              <p className="font-black">{property.name}</p>
            </div>
          </div>
          <WhatsAppButton
            className="hidden sm:inline-flex"
            label="Suporte"
            message={`Ola, preciso de ajuda com a reserva ${reservation.external_reservation_code ?? reservation.id}.`}
            phone={company.whatsapp}
          />
        </nav>

        <div className="pb-8">
          <p className="inline-flex rounded-full bg-white/14 px-3 py-1 text-sm font-bold backdrop-blur">
            Portal da reserva
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            Boas-vindas a Maranduba
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/82">
            Aqui estao check-in digital, chegada, Wi-Fi, regras, guia local,
            servicos extras e informacoes para uma estadia tranquila.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
            <div className="rounded-lg bg-white/12 p-4 backdrop-blur">
              <CalendarDays size={20} />
              <p className="mt-2 text-sm text-white/70">Periodo</p>
              <p className="font-bold">
                {formatDate(reservation.checkin_date)} a{" "}
                {formatDate(reservation.checkout_date)}
              </p>
            </div>
            <div className="rounded-lg bg-white/12 p-4 backdrop-blur">
              <MapPin size={20} />
              <p className="mt-2 text-sm text-white/70">Endereco</p>
              <p className="font-bold">{property.address}</p>
            </div>
          </div>

          <WhatsAppButton
            className="mt-5 w-full sm:hidden"
            label="Falar com suporte"
            phone={company.whatsapp}
          />
        </div>
      </div>
    </header>
  );
}
