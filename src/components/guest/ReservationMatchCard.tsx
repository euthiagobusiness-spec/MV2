import Link from "next/link";
import { CalendarDays, Users } from "lucide-react";

import { ChannelBadge } from "@/components/guest/ChannelBadge";
import type { ReservationMatch } from "@/lib/data/guest";
import { formatDate } from "@/lib/utils";

export function ReservationMatchCard({ match }: { match: ReservationMatch }) {
  return (
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[160px_1fr]">
      <div className="overflow-hidden rounded-lg bg-slate-100">
        {match.property.cover_image_url ? (
          <img
            alt={match.property.name}
            className="aspect-[4/3] h-full w-full object-cover"
            src={match.property.cover_image_url}
          />
        ) : null}
      </div>
      <div className="grid gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">{match.property.name}</h3>
            <ChannelBadge channel={match.channel} />
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {match.property.condominium_name}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600">
          <span className="flex items-center gap-1">
            <CalendarDays size={16} />
            {formatDate(match.checkin_date)} a {formatDate(match.checkout_date)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={16} />
            ate {match.property.max_guests} hospedes
          </span>
        </div>
        <Link className="btn btn-primary w-full sm:w-fit" href={`/portal/${match.token}`}>
          Acessar minha estadia
        </Link>
      </div>
    </div>
  );
}
