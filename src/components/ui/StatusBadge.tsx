import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
};

const labels: Record<string, string> = {
  draft: "Rascunho",
  confirmed: "Confirmada",
  checked_in: "Check-in feito",
  completed: "Finalizada",
  cancelled: "Cancelada",
  pending: "Pendente",
  done: "Concluido",
  active: "Ativo",
  inactive: "Inativo",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const positive = ["confirmed", "checked_in", "completed", "done", "active"];
  const danger = ["cancelled", "inactive"];

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
        positive.includes(status) && "bg-teal-100 text-teal-900",
        danger.includes(status) && "bg-rose-100 text-rose-900",
        !positive.includes(status) &&
          !danger.includes(status) &&
          "bg-slate-100 text-slate-700",
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
