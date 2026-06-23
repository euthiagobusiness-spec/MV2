export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabasePublishableKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

export function hasSupabaseAdminKey() {
  return Boolean(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseAdminKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function getDemoAdminEmail() {
  return process.env.ADMIN_DEMO_EMAIL || "admin@mv2temporada.com.br";
}

export function getDemoAdminPassword() {
  return process.env.ADMIN_DEMO_PASSWORD || "MV2-demo-2026!";
}

export function getAllowedAdminEmails() {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmailAllowed(email: string | null | undefined) {
  const allowedEmails = getAllowedAdminEmails();

  if (!email) return false;
  if (!allowedEmails.length) return process.env.NODE_ENV !== "production";

  return allowedEmails.includes(email.toLowerCase());
}

export function getDemoModeLabel() {
  return isSupabaseConfigured()
    ? "Conectado ao Supabase"
    : "Modo demonstracao local";
}
