import { notFound } from "next/navigation";

import { ReservationForm } from "@/components/admin/ReservationForm";
import { QRCodeCard } from "@/components/ui/QRCodeCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAdminDataset, getReservationById } from "@/lib/data/admin";
import { portalUrl } from "@/lib/utils";

type ReservationDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReservationDetailsPage({
  params,
}: ReservationDetailsPageProps) {
  const { id } = await params;
  const [dataset, reservation] = await Promise.all([
    getAdminDataset(),
    getReservationById(id),
  ]);

  if (!reservation) notFound();

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
            Reserva
          </p>
          <h2 className="text-3xl font-black text-teal-950">
            {reservation.guest_name}
          </h2>
          <div className="mt-2 flex gap-2">
            <StatusBadge status={reservation.status} />
            <StatusBadge status={reservation.checkin_completed ? "done" : "pending"} />
          </div>
        </div>
        <div className="w-full max-w-sm">
          <QRCodeCard value={portalUrl(reservation.guest_portal_token)} />
        </div>
      </div>
      <ReservationForm
        properties={dataset.properties}
        reservation={reservation}
      />
    </div>
  );
}
