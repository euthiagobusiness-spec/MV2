"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import {
  lookupReservationAction,
  type GuestReservationLookupState,
} from "@/lib/actions/guest-access";

import { ReservationMatchCard } from "./ReservationMatchCard";

const initialState: GuestReservationLookupState = {
  status: "idle",
  message: "",
  matches: [],
};

export function GuestReservationLoginForm() {
  const [state, formAction, pending] = useActionState(
    lookupReservationAction,
    initialState,
  );

  return (
    <div id="reservation-login" className="rounded-2xl bg-white p-5 shadow-lg">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">
          Minha reserva
        </p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">
          Entrar com meus dados
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Informe dados usados na reserva. Nao exibimos senhas, documentos ou
          instrucoes completas nesta tela publica.
        </p>
      </div>

      <form action={formAction} className="mt-5 grid gap-3">
        <label className="field">
          <span>E-mail usado na reserva</span>
          <input className="input" name="email" placeholder="voce@email.com" type="email" />
        </label>
        <label className="field">
          <span>Telefone usado na reserva</span>
          <input className="input" name="phone" placeholder="(12) 99999-0000" />
        </label>
        <label className="field">
          <span>Codigo da reserva</span>
          <input className="input" name="reservationCode" placeholder="MV2-001" />
        </label>
        <label className="field">
          <span>Canal da reserva</span>
          <select className="select" name="channel">
            <option value="">Nao sei / opcional</option>
            <option value="airbnb">Airbnb</option>
            <option value="booking">Booking</option>
            <option value="expedia">Expedia</option>
            <option value="decolar">Decolar</option>
            <option value="direct">Site proprio</option>
            <option value="stays">Stays</option>
            <option value="other">Outro</option>
          </select>
        </label>
        <button className="btn btn-primary mt-2" disabled={pending} type="submit">
          <Search size={18} />
          {pending ? "Buscando..." : "Entrar com meus dados da reserva"}
        </button>
        <Link className="btn btn-outline" href="/select-property">
          Selecionar meu apartamento
        </Link>
      </form>

      {state.message ? (
        <div className="mt-5 grid gap-3">
          <p className="rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">
            {state.message}
          </p>
          {state.matches.map((match) => (
            <ReservationMatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
