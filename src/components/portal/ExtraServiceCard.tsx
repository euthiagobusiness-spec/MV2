import { Gift } from "lucide-react";
import Image from "next/image";

import { WhatsAppButton } from "@/components/portal/WhatsAppButton";
import type { Company, ExtraService, Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type ExtraServiceCardProps = {
  service: ExtraService;
  company: Company;
  property: Property;
};

export function ExtraServiceCard({
  service,
  company,
  property,
}: ExtraServiceCardProps) {
  const message =
    service.whatsapp_message ||
    `Ola, gostaria de solicitar o servico: ${service.title} para minha reserva no apartamento ${property.name}.`;

  return (
    <article className="card overflow-hidden">
      {service.image_url ? (
        <Image
          alt={service.title}
          className="h-44 w-full object-cover"
          height={360}
          src={service.image_url}
          width={640}
        />
      ) : null}
      <div className="p-4">
        <Gift className="text-teal-700" size={22} />
        <h3 className="mt-2 text-lg font-black text-teal-950">{service.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
        <p className="mt-3 text-xl font-black text-teal-900">
          {formatCurrency(service.price)}
        </p>
        <WhatsAppButton
          className="mt-4 w-full"
          label="Solicitar pelo WhatsApp"
          message={message}
          phone={company.whatsapp}
        />
      </div>
    </article>
  );
}
