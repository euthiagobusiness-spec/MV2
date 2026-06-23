import { LegalPage } from "@/components/legal/LegalPage";
import { termsSections } from "@/lib/legal";

export default function TermsPage() {
  return (
    <LegalPage
      sections={termsSections}
      subtitle="Regras gerais para uso do portal, acesso administrativo, check-in digital e servicos extras."
      title="Termos de Uso"
      updatedAt="23/06/2026"
    />
  );
}
