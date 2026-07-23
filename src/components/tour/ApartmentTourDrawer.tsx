"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { tourApartments } from "@/components/tour/tour-apartments";

type ApartmentTourDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ApartmentTourDrawer({
  isOpen,
  onClose,
}: ApartmentTourDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-label="Escolher acomodacao"
      aria-modal="true"
      className="pointer-events-auto absolute inset-0 z-30 flex items-end bg-slate-950/50 backdrop-blur-[2px]"
      role="dialog"
    >
      <button
        aria-label="Fechar lista de acomodacoes"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <section className="relative z-10 w-full rounded-t-lg bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:px-6 sm:pb-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-sky-50 text-sky-700">
                <Building2 size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-sky-700">
                  Acomodacoes MV2
                </p>
                <h2 className="truncate text-lg font-black text-slate-950">
                  Escolha um apartamento
                </h2>
              </div>
            </div>
            <button
              aria-label="Fechar"
              className="grid size-11 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-800 transition hover:bg-slate-200"
              onClick={onClose}
              ref={closeButtonRef}
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          <div className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-8">
            {tourApartments.map((apartment) => {
              const href = apartment.listingUrl ?? apartment.previewUrl;
              const isExternal = Boolean(apartment.listingUrl);

              return (
                <Link
                  className="group w-[42vw] min-w-[148px] max-w-[180px] shrink-0 snap-start overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:border-sky-300 hover:shadow-md sm:w-auto sm:min-w-0"
                  href={href}
                  key={apartment.code}
                  onClick={onClose}
                  prefetch={!isExternal}
                  rel={isExternal ? "noreferrer" : undefined}
                  target={isExternal ? "_blank" : undefined}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      alt={`Apartamento ${apartment.code}`}
                      className="object-cover transition duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 639px) 42vw, (max-width: 1023px) 25vw, 160px"
                      src={apartment.coverImage}
                    />
                    <span className="absolute left-2 top-2 rounded-md bg-white/94 px-2 py-1 text-sm font-black text-slate-950 shadow-sm">
                      {apartment.code}
                    </span>
                  </div>
                  <span className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-black text-slate-800">
                    Ver unidade
                    <ArrowUpRight
                      className="shrink-0 text-sky-700"
                      size={16}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
