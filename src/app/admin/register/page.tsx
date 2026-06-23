"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, LockKeyhole, Mail, UserRound } from "lucide-react";

import { registerAction } from "@/lib/actions/auth";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {
  ok: false,
  message: "",
};

export default function AdminRegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-teal-700 font-black text-white">
            MV2
          </div>
          <h1 className="mt-4 text-3xl font-black text-teal-950">
            Criar novo login
          </h1>
          <p className="mt-2 text-slate-600">
            Solicite acesso ao painel. A conta so entra no admin depois de
            confirmada e liberada pela operacao.
          </p>
        </div>

        <form action={formAction} className="card grid gap-4 p-5">
          <label className="field">
            <span>Nome completo</span>
            <div className="relative">
              <UserRound className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                autoComplete="name"
                className="input pl-10"
                name="name"
                type="text"
              />
            </div>
            {state.fieldErrors?.name ? (
              <small className="text-rose-700">{state.fieldErrors.name[0]}</small>
            ) : null}
          </label>

          <label className="field">
            <span>E-mail</span>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                autoComplete="email"
                className="input pl-10"
                name="email"
                type="email"
              />
            </div>
            {state.fieldErrors?.email ? (
              <small className="text-rose-700">{state.fieldErrors.email[0]}</small>
            ) : null}
          </label>

          <label className="field">
            <span>Senha forte</span>
            <div className="relative">
              <LockKeyhole
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
              <input
                autoComplete="new-password"
                className="input pl-10"
                name="password"
                type="password"
              />
            </div>
            {state.fieldErrors?.password ? (
              <small className="text-rose-700">{state.fieldErrors.password[0]}</small>
            ) : (
              <small className="text-slate-500">
                Minimo de 10 caracteres, com maiuscula, minuscula, numero e simbolo.
              </small>
            )}
          </label>

          <label className="field">
            <span>Confirmar senha</span>
            <input
              autoComplete="new-password"
              className="input"
              name="confirm_password"
              type="password"
            />
            {state.fieldErrors?.confirm_password ? (
              <small className="text-rose-700">
                {state.fieldErrors.confirm_password[0]}
              </small>
            ) : null}
          </label>

          <label className="flex items-start gap-3 text-sm font-semibold text-slate-700">
            <input className="mt-1" name="accepted_terms" type="checkbox" value="true" />
            <span>
              Li e aceito os{" "}
              <Link className="text-teal-800 underline" href="/terms">
                Termos de Uso
              </Link>
              .
            </span>
          </label>
          {state.fieldErrors?.accepted_terms ? (
            <small className="-mt-3 text-rose-700">
              {state.fieldErrors.accepted_terms[0]}
            </small>
          ) : null}

          <label className="flex items-start gap-3 text-sm font-semibold text-slate-700">
            <input
              className="mt-1"
              name="accepted_privacy_policy"
              type="checkbox"
              value="true"
            />
            <span>
              Li e aceito a{" "}
              <Link className="text-teal-800 underline" href="/privacy">
                Politica de Privacidade
              </Link>
              .
            </span>
          </label>
          {state.fieldErrors?.accepted_privacy_policy ? (
            <small className="-mt-3 text-rose-700">
              {state.fieldErrors.accepted_privacy_policy[0]}
            </small>
          ) : null}

          {state.message ? (
            <p
              className={`rounded-lg p-3 text-sm font-semibold ${
                state.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
              }`}
            >
              {state.ok ? <CheckCircle2 className="mr-2 inline" size={17} /> : null}
              {state.message}
            </p>
          ) : null}

          <button className="btn btn-primary" disabled={pending} type="submit">
            {pending ? "Criando..." : "Solicitar acesso"}
          </button>

          <Link
            className="text-center text-sm font-bold text-teal-800 hover:text-teal-950"
            href="/admin/login"
          >
            Ja tenho login
          </Link>
        </form>
      </div>
    </main>
  );
}
