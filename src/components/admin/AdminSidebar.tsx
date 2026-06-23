import Link from "next/link";
import {
  Building2,
  CalendarDays,
  ClipboardCheck,
  ConciergeBell,
  QrCode,
  LayoutDashboard,
  Map,
  Settings,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Imoveis", icon: Building2 },
  { href: "/admin/reservations", label: "Reservas", icon: CalendarDays },
  { href: "/admin/checkins", label: "Check-ins", icon: ClipboardCheck },
  { href: "/admin/local-guide", label: "Guia local", icon: Map },
  { href: "/admin/extras", label: "Extras", icon: ConciergeBell },
  { href: "/admin/guest-experience", label: "Experiencia do hospede", icon: QrCode },
  { href: "/admin/settings", label: "Configuracoes", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-teal-900/10 bg-white/86 p-5 lg:block">
      <Link className="flex items-center gap-3" href="/admin">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-700 font-black text-white">
          MV2
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500">Portal Digital</p>
          <p className="font-black text-teal-950">Admin</p>
        </div>
      </Link>

      <nav className="mt-8 grid gap-1">
        {links.map((link) => (
          <Link
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-950"
            href={link.href}
            key={link.href}
          >
            <link.icon size={18} />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
