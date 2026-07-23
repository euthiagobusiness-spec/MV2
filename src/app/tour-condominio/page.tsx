import type { Metadata } from "next";

import { CondominiumTour } from "@/components/tour/CondominiumTour";

export const metadata: Metadata = {
  title: "Tour 3D do Condominio | MV2",
  description:
    "Explore em tempo real o Condominio Maranduba Ville II em Ubatuba.",
};

export default function CondominiumTourPage() {
  return <CondominiumTour />;
}
