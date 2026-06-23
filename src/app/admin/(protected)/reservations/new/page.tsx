import { ReservationForm } from "@/components/admin/ReservationForm";
import { getAdminDataset } from "@/lib/data/admin";

export default async function NewReservationPage() {
  const { properties } = await getAdminDataset();

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-700">
          Nova reserva
        </p>
        <h2 className="text-3xl font-black text-teal-950">Cadastrar reserva</h2>
      </div>
      <ReservationForm properties={properties} />
    </div>
  );
}
