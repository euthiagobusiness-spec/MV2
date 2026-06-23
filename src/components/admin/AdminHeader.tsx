import { LogOut } from "lucide-react";

import { logoutAction } from "@/lib/actions/auth";
import type { AdminUser } from "@/lib/types";

type AdminHeaderProps = {
  user: AdminUser;
};

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-900/10 bg-white/72 px-5 py-4 backdrop-blur lg:px-8">
      <div>
        <p className="text-sm font-bold text-slate-500">
          {user.isDemo ? "Modo demonstracao" : "Sessao autenticada"}
        </p>
        <h1 className="text-xl font-black text-teal-950">Painel administrativo</h1>
      </div>
      <form action={logoutAction}>
        <button className="btn btn-outline" type="submit">
          <LogOut size={17} />
          Sair
        </button>
      </form>
    </header>
  );
}
