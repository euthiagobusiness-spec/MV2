"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  getDemoAdminEmail,
  getDemoAdminPassword,
  isAdminEmailAllowed,
  isSupabaseConfigured,
} from "@/lib/env";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";
import { publicUrl } from "@/lib/utils";

const attemptWindowMs = 15 * 60 * 1000;
const maxAttempts = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function loginAttemptKey(email: string) {
  return email.trim().toLowerCase();
}

function registerFailedAttempt(email: string) {
  const key = loginAttemptKey(email);
  const now = Date.now();
  const current = loginAttempts.get(key);

  if (!current || current.resetAt < now) {
    loginAttempts.set(key, { count: 1, resetAt: now + attemptWindowMs });
    return;
  }

  loginAttempts.set(key, { count: current.count + 1, resetAt: current.resetAt });
}

function isRateLimited(email: string) {
  const current = loginAttempts.get(loginAttemptKey(email));
  return Boolean(current && current.resetAt > Date.now() && current.count >= maxAttempts);
}

function clearAttempts(email: string) {
  loginAttempts.delete(loginAttemptKey(email));
}

function secureCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: true,
    path: "/admin",
    maxAge: 60 * 60 * 4,
  };
}

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os dados de acesso.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (isRateLimited(parsed.data.email)) {
    return {
      ok: false,
      message: "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.",
    };
  }

  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        message: "Supabase Auth precisa estar configurado para login em producao.",
      };
    }

    const matchesDemoCredentials =
      parsed.data.email.toLowerCase() === getDemoAdminEmail().toLowerCase() &&
      parsed.data.password === getDemoAdminPassword();

    if (!matchesDemoCredentials) {
      registerFailedAttempt(parsed.data.email);
      return {
        ok: false,
        message: "E-mail ou senha invalidos.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("mv2-demo-admin", "active", secureCookieOptions());
    clearAttempts(parsed.data.email);
    redirect("/admin");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    registerFailedAttempt(parsed.data.email);
    return {
      ok: false,
      message: "E-mail ou senha invalidos.",
    };
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !isAdminEmailAllowed(userData.user?.email)) {
    await supabase.auth.signOut({ scope: "global" });
    registerFailedAttempt(parsed.data.email);
    return {
      ok: false,
      message: "Conta autenticada, mas ainda nao autorizada para acessar o painel.",
    };
  }

  clearAttempts(parsed.data.email);
  redirect("/admin");
}

export async function registerAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    accepted_terms: formData.get("accepted_terms"),
    accepted_privacy_policy: formData.get("accepted_privacy_policy"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revise os dados do cadastro.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message:
        "Cadastro validado, mas a criacao real de contas exige Supabase Auth configurado.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.name,
        accepted_terms: true,
        accepted_privacy_policy: true,
        terms_accepted_at: new Date().toISOString(),
      },
      emailRedirectTo: publicUrl("/admin/login?registered=1"),
    },
  });

  if (error) {
    return {
      ok: false,
      message: "Nao foi possivel criar a conta. Verifique os dados e tente novamente.",
    };
  }

  return {
    ok: true,
    message:
      "Cadastro criado. Confirme seu e-mail e aguarde liberacao administrativa para acessar o painel.",
  };
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "global" });
  }

  const cookieStore = await cookies();
  cookieStore.delete("mv2-demo-admin");
  cookieStore.set("mv2-demo-admin", "", {
    ...secureCookieOptions(),
    maxAge: 0,
  });
  redirect("/admin/login");
}
