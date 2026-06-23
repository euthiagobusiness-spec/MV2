import type { Metadata } from "next";
import { Comfortaa, Geist_Mono } from "next/font/google";

import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal Digital do Hospede",
  description:
    "Portal para check-in digital, manual do apartamento, guia local e painel administrativo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${comfortaa.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      lang="pt-BR"
    >
      <body>{children}</body>
    </html>
  );
}
