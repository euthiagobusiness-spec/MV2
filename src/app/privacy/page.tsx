import { LegalPage } from "@/components/legal/LegalPage";
import { privacyPolicySections } from "@/lib/legal";

export default function PrivacyPage() {
  return (
    <LegalPage
      sections={privacyPolicySections}
      subtitle="Como tratamos dados pessoais de hospedes, usuarios administrativos e contatos operacionais."
      title="Politica de Privacidade"
      updatedAt="23/06/2026"
    />
  );
}
