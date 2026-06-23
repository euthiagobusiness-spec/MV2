import { notFound } from "next/navigation";

import { getCheckinById } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/utils";

type CheckinDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckinDetailsPage({ params }: CheckinDetailsPageProps) {
  const { id } = await params;
  const checkin = await getCheckinById(id);

  if (!checkin) notFound();

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
          Check-in recebido
        </p>
        <h2 className="text-3xl font-black text-teal-950">
          {checkin.responsible_guest_name}
        </h2>
      </div>

      <div className="card grid gap-4 p-5 md:grid-cols-2">
        <Detail label="Reserva" value={checkin.reservation?.guest_name ?? checkin.reservation_id} />
        <Detail label="Recebido em" value={formatDateTime(checkin.created_at)} />
        <Detail label="Documento" value={`${checkin.document_type} ${checkin.document_number}`} />
        <Detail label="Telefone" value={checkin.phone} />
        <Detail label="E-mail" value={checkin.email} />
        <Detail label="Chegada prevista" value={checkin.arrival_time} />
        <Detail label="Placa" value={checkin.car_plate ?? "Nao informada"} />
        <Detail label="Hospedes" value={String(checkin.number_of_guests)} />
        <Detail label="Acompanhantes" value={checkin.companion_names.join(", ") || "Nao informado"} />
        <Detail label="Observacoes" value={checkin.observations ?? "Sem observacoes"} />
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-teal-950">{value}</p>
    </div>
  );
}
