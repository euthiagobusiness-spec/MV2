import type { Metadata, Viewport } from "next";

import { CondominiumTour } from "@/components/tour/CondominiumTour";

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tour MV2",
  },
  title: "Tour 3D do Condominio | MV2",
  description:
    "Explore em tempo real o Condominio Maranduba Ville II em Ubatuba.",
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#151923",
  userScalable: false,
  width: "device-width",
};

export default function CondominiumTourPage() {
  return <CondominiumTour />;
}
