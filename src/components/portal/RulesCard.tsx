import { CheckCircle2 } from "lucide-react";

type RulesCardProps = {
  items: string[];
};

export function RulesCard({ items }: RulesCardProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div className="card flex gap-3 p-4" key={item}>
          <CheckCircle2 className="mt-0.5 shrink-0 text-teal-700" size={20} />
          <p className="leading-6 text-slate-700">{item}</p>
        </div>
      ))}
    </div>
  );
}
