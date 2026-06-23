import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CalendarClock,
  ClipboardCheck,
} from "lucide-react";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAdminDataset } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const data = await getAdminDataset();
  const pending = data.reservations.filter((item) => !item.checkin_completed);
  const done = data.reservations.filter((item) => item.checkin_completed);
  const now = new Date().toISOString().slice(0, 10);
  const nextCheckins = data.reservations
    .filter((item) => item.checkin_date >= now)
    .slice(0, 5);
  const nextCheckouts = data.reservations
    .filter((item) => item.checkout_date >= now)
    .slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
            Dashboard
          </p>
          <h2 className="mt-1 text-3xl font-black text-teal-950">
            Operacao da temporada
          </h2>
        </div>
        <Link className="btn btn-primary" href="/admin/reservations/new">
          Nova reserva <ArrowRight size={17} />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Building2 size={22} />} label="Imoveis" value={data.properties.length} />
        <StatCard icon={<CalendarCheck size={22} />} label="Reservas" value={data.reservations.length} />
        <StatCard icon={<CalendarClock size={22} />} label="Check-in pendente" value={pending.length} />
        <StatCard icon={<ClipboardCheck size={22} />} label="Check-in concluido" value={done.length} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-lg font-black text-teal-950">Proximos check-ins</h3>
          <div className="mt-4 grid gap-3">
            {nextCheckins.map((reservation) => (
              <Link
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3 hover:bg-teal-50"
                href={`/admin/reservations/${reservation.id}`}
                key={reservation.id}
              >
                <div>
                  <p className="font-bold text-teal-950">{reservation.guest_name}</p>
                  <p className="text-sm text-slate-500">{reservation.property?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatDate(reservation.checkin_date)}</p>
                  <StatusBadge status={reservation.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-lg font-black text-teal-950">Proximos check-outs</h3>
          <div className="mt-4 grid gap-3">
            {nextCheckouts.map((reservation) => (
              <div
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"
                key={reservation.id}
              >
                <div>
                  <p className="font-bold text-teal-950">{reservation.guest_name}</p>
                  <p className="text-sm text-slate-500">{reservation.property?.name}</p>
                </div>
                <p className="font-bold">{formatDate(reservation.checkout_date)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="text-teal-700">{icon}</div>
      <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-teal-950">{value}</p>
    </div>
  );
}
