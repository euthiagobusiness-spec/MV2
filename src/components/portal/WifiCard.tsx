import { Wifi } from "lucide-react";

import { CopyButton } from "@/components/ui/CopyButton";

type WifiCardProps = {
  name: string;
  password: string;
};

export function WifiCard({ name, password }: WifiCardProps) {
  return (
    <div className="card grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="flex gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-teal-100 text-teal-800">
          <Wifi size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500">Rede Wi-Fi</p>
          <p className="text-xl font-black text-teal-950">{name}</p>
          <p className="mt-1 font-mono text-lg">{password}</p>
        </div>
      </div>
      <CopyButton copiedLabel="Senha copiada" label="Copiar senha" value={password} />
    </div>
  );
}
