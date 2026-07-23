import Link from "next/link";
import { LogOut } from "lucide-react";

import { adminLinks } from "@/components/admin/admin-navigation";
import { logoutAction } from "@/lib/actions/auth";
import type { AdminUser } from "@/lib/types";

type AdminHeaderProps = {
  user: AdminUser;
};

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="border-b border-teal-900/10 bg-white/90 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 lg:px-8">
        <div>
          <p className="text-xs font-bold text-slate-500 sm:text-sm">
            {user.isDemo ? "Modo demonstracao" : "Sessao autenticada"}
          </p>
          <h1 className="text-lg font-black text-teal-950 sm:text-xl">
            Painel administrativo
          </h1>
        </div>
        <form action={logoutAction}>
          <button className="btn btn-outline min-h-10 px-3" type="submit">
            <LogOut size={17} />
            Sair
          </button>
        </form>
      </div>

      <nav
        aria-label="Navegacao do painel"
        className="flex gap-2 overflow-x-auto px-4 pb-3 sm:px-5 lg:hidden"
      >
        {adminLinks.map((link) => (
          <Link
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-sm"
            href={link.href}
            key={link.href}
          >
            <link.icon className="text-teal-700" size={17} />
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
