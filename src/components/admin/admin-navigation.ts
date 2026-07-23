import {
  Building2,
  CalendarDays,
  ClipboardCheck,
  ConciergeBell,
  LayoutDashboard,
  Map,
  QrCode,
  Settings,
} from "lucide-react";

export const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Imoveis", icon: Building2 },
  { href: "/admin/reservations", label: "Reservas", icon: CalendarDays },
  { href: "/admin/checkins", label: "Check-ins", icon: ClipboardCheck },
  {
    href: "/verificacao-operacional",
    label: "Verificacao diaria",
    icon: ClipboardCheck,
  },
  { href: "/admin/local-guide", label: "Guia local", icon: Map },
  { href: "/admin/extras", label: "Extras", icon: ConciergeBell },
  {
    href: "/admin/guest-experience",
    label: "Experiencia",
    icon: QrCode,
  },
  { href: "/admin/settings", label: "Configuracoes", icon: Settings },
];
