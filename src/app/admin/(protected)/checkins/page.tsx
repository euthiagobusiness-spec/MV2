import Link from "next/link";

import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAdminDataset } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/utils";

export default async function CheckinsPage() {
  const { checkins, reservations } = await getAdminDataset();
  const checkinReservationIds = new Set(checkins.map((item) => item.reservation_id));
  const pendingReservations = reservations.filter(
    (reservation) => !checkinReservationIds.has(reservation.id),
  );

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
          Check-ins
        </p>
        <h2 className="text-3xl font-black text-teal-950">Check-ins recebidos</h2>
      </div>

      <DataTable columns={["Responsavel", "Reserva", "Chegada", "Hospedes", "Status", "Acoes"]}>
        {checkins.map((checkin) => (
          <tr key={checkin.id}>
            <td className="px-4 py-3 font-bold text-teal-950">
              {checkin.responsible_guest_name}
            </td>
            <td className="px-4 py-3">{checkin.reservation?.guest_name}</td>
            <td className="px-4 py-3">{formatDateTime(checkin.created_at)}</td>
            <td className="px-4 py-3">{checkin.number_of_guests}</td>
            <td className="px-4 py-3">
              <StatusBadge status="done" />
            </td>
            <td className="px-4 py-3">
              <Link className="btn btn-outline text-xs" href={`/admin/checkins/${checkin.id}`}>
                Ver detalhes
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>

      <div className="card p-5">
        <h3 className="text-lg font-black text-teal-950">Pendentes</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {pendingReservations.map((reservation) => (
            <div className="rounded-lg border border-slate-100 p-3" key={reservation.id}>
              <p className="font-bold text-teal-950">{reservation.guest_name}</p>
              <p className="text-sm text-slate-500">{reservation.property?.name}</p>
              <StatusBadge status="pending" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
