import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { CopyButton } from "@/components/ui/CopyButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { deleteReservationAction } from "@/lib/actions/admin";
import { getAdminDataset } from "@/lib/data/admin";
import { formatDate, portalUrl } from "@/lib/utils";

export default async function ReservationsPage() {
  const { reservations } = await getAdminDataset();

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
            Reservas
          </p>
          <h2 className="text-3xl font-black text-teal-950">Reservas cadastradas</h2>
        </div>
        <Link className="btn btn-primary" href="/admin/reservations/new">
          <Plus size={18} /> Nova reserva
        </Link>
      </div>

      <DataTable columns={["Hospede", "Periodo", "Imovel", "Check-in", "Acoes"]}>
        {reservations.map((reservation) => (
          <tr key={reservation.id}>
            <td className="px-4 py-3">
              <p className="font-bold text-teal-950">{reservation.guest_name}</p>
              <p className="text-xs text-slate-500">{reservation.guest_email}</p>
            </td>
            <td className="px-4 py-3">
              {formatDate(reservation.checkin_date)} a {formatDate(reservation.checkout_date)}
            </td>
            <td className="px-4 py-3">{reservation.property?.name}</td>
            <td className="px-4 py-3">
              <StatusBadge status={reservation.checkin_completed ? "done" : "pending"} />
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <Link className="btn btn-outline text-xs" href={`/admin/reservations/${reservation.id}`}>
                  Detalhes
                </Link>
                <CopyButton
                  className="text-xs"
                  label="Copiar link"
                  value={portalUrl(reservation.guest_portal_token)}
                />
                <form action={deleteReservationAction.bind(null, reservation.id)}>
                  <button className="btn btn-outline text-xs text-rose-700" type="submit">
                    <Trash2 size={14} /> Excluir
                  </button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
