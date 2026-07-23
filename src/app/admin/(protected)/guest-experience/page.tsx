import Image from "next/image";
import Link from "next/link";

import { QRCodeDownloadCard } from "@/components/guest/QRCodeDownloadCard";
import { getAdminDataset } from "@/lib/data/admin";
import { publicUrl } from "@/lib/utils";

export default async function GuestExperienceAdminPage() {
  const { properties, reservations } = await getAdminDataset();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-sky-700">
          Experiencia do hospede
        </p>
        <h2 className="text-3xl font-black text-slate-950">
          Links, QR Codes e previas publicas
        </h2>
        <p className="mt-2 max-w-3xl text-slate-600">
          Use o QR geral para recepcao, o QR do apartamento para placas na
          unidade e o QR da reserva para o portal personalizado.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <QRCodeDownloadCard title="QR Code geral da empresa" value={publicUrl("/guest-access")} />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2">
          <p className="font-black text-slate-950">Fluxo recomendado</p>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600 md:grid-cols-3">
            <span className="rounded-xl bg-slate-50 p-3">1. Hospede abre /guest-access</span>
            <span className="rounded-xl bg-slate-50 p-3">2. Identifica reserva ou escolhe apartamento</span>
            <span className="rounded-xl bg-slate-50 p-3">3. Portal por token libera dados sensiveis</span>
          </div>
        </div>
      </div>

      <section className="grid gap-4">
        <h3 className="text-xl font-black text-slate-950">QR Codes dos apartamentos</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {properties.map((property) => (
            <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm" key={property.id}>
              {property.cover_image_url ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    alt={property.name}
                    className="object-cover"
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
                    src={property.cover_image_url}
                  />
                </div>
              ) : null}
              <QRCodeDownloadCard
                title={property.name}
                value={publicUrl(`/property-preview/${property.slug}`)}
              />
              <Link className="btn btn-outline" href={`/admin/properties/${property.id}`}>
                Editar experiencia
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h3 className="text-xl font-black text-slate-950">QR Codes das reservas</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reservations.map((reservation) => (
            <QRCodeDownloadCard
              key={reservation.id}
              title={`${reservation.property?.name ?? "Reserva"} - ${reservation.guest_name}`}
              value={publicUrl(`/portal/${reservation.guest_portal_token}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
