import type { Metadata } from "next";

import { OperationalVerificationApp } from "@/components/operational/OperationalVerificationApp";

export const metadata: Metadata = {
  title: "Verificação Diária | MV2",
  description: "Rotina diária de verificação operacional dos apartamentos MV2.",
};

export default function OperationalVerificationPage() {
  return <OperationalVerificationApp />;
}
