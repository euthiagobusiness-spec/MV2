import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminKey, getSupabaseUrl } from "@/lib/env";

export function createAdminClient() {
  const supabaseUrl = getSupabaseUrl();
  const adminKey = getSupabaseAdminKey();

  if (!supabaseUrl || !adminKey) {
    throw new Error("Chave server-only do Supabase nao configurada.");
  }

  return createSupabaseClient(supabaseUrl, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
