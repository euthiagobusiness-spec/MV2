"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LockKeyhole, Mail } from "lucide-react";

import { loginAction } from "@/lib/actions/auth";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {
  ok: false,
  message: "",
};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-teal-700 font-black text-white">
            MV2
          </div>
          <h1 className="mt-4 text-3xl font-black text-teal-950">
            Painel administrativo
          </h1>
          <p className="mt-2 text-slate-600">
            Entre com uma conta autorizada. Cadastros novos precisam de liberacao
            administrativa antes de acessar dados sensiveis.
          </p>
        </div>

        <form action={formAction} className="card grid gap-4 p-5">
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
            <span>Senha</span>
            <div className="relative">
              <LockKeyhole
                className="absolute left-3 top-3.5 text-slate-400"
                size={18}
              />
              <input
                autoComplete="current-password"
                className="input pl-10"
                name="password"
                type="password"
              />
            </div>
            {state.fieldErrors?.password ? (
              <small className="text-rose-700">{state.fieldErrors.password[0]}</small>
            ) : null}
          </label>

          {state.message ? (
            <p className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-800">
              {state.message}
            </p>
          ) : null}

          <button className="btn btn-primary" disabled={pending} type="submit">
            Entrar
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
            <Link className="text-teal-800 hover:text-teal-950" href="/admin/register">
              Criar novo login
            </Link>
            <div className="flex gap-3 text-slate-500">
              <Link href="/privacy">Privacidade</Link>
              <Link href="/terms">Termos</Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
