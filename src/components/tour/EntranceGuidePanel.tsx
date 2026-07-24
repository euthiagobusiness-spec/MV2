"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  Footprints,
  MapPinned,
  Navigation,
  PanelLeftOpen,
  Route,
  Star,
  Trash2,
  X,
} from "lucide-react";

import {
  commonAreaDestinations,
  trashDestination,
} from "@/components/tour/tour-locations";
import {
  tourApartments,
  type TourApartment,
} from "@/components/tour/tour-apartments";
import type { TourDestination } from "@/components/tour/tour-types";

type PanelView =
  | "apartments"
  | "facilities"
  | "find-apartment"
  | "menu"
  | "review";

type EntranceGuidePanelProps = {
  activeRoute: {
    id: TourDestination["id"];
    label: string;
  } | null;
  initiallyOpen?: boolean;
  isPointerLocked: boolean;
  isPortrait?: boolean;
  onNavigate: (destination: TourDestination) => void;
  onResumeWalk: () => void;
};

const menuItems = [
  {
    description: "Escolha o apartamento e veja a rota ate o bloco.",
    icon: Navigation,
    id: "find-apartment" as const,
    label: "Aprenda a chegar no seu AP",
  },
  {
    description: "Veja fotos e detalhes das acomodacoes.",
    icon: Building2,
    id: "apartments" as const,
    label: "Conheca nossos apartamentos",
  },
  {
    description: "Navegue ate os principais espacos do condominio.",
    icon: MapPinned,
    id: "facilities" as const,
    label: "Conheca as areas em comum",
  },
  {
    description: "Registre estrelas e conte como foi a experiencia.",
    icon: Star,
    id: "review" as const,
    label: "Avalie sua reserva",
  },
];

function ApartmentCard({
  apartment,
  pendingRoute,
}: {
  apartment: TourApartment;
  pendingRoute?: boolean;
}) {
  if (pendingRoute) {
    return (
      <article className="grid grid-cols-[72px_1fr] overflow-hidden rounded-md border border-white/12 bg-white/6">
        <div className="relative min-h-16">
          <Image
            alt={`Apartamento ${apartment.code}`}
            className="object-cover"
            fill
            sizes="72px"
            src={apartment.coverImage}
          />
        </div>
        <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-2">
          <div>
            <p className="text-sm font-black text-white">
              Apartamento {apartment.code}
            </p>
            <p className="mt-0.5 text-[11px] font-bold text-cyan-100/70">
              Rota em mapeamento
            </p>
          </div>
          <Route className="shrink-0 text-cyan-300/60" size={18} />
        </div>
      </article>
    );
  }

  const href = apartment.listingUrl ?? apartment.previewUrl;
  const isExternal = href.startsWith("http");

  return (
    <Link
      className="group grid grid-cols-[82px_1fr] overflow-hidden rounded-md border border-white/12 bg-white/6 transition hover:border-cyan-300/60 hover:bg-white/10"
      href={href}
      prefetch={!isExternal}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      <div className="relative min-h-20">
        <Image
          alt={`Apartamento ${apartment.code}`}
          className="object-cover transition duration-300 group-hover:scale-105"
          fill
          sizes="82px"
          src={apartment.coverImage}
        />
      </div>
      <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-2">
        <div>
          <p className="text-sm font-black text-white">
            Apartamento {apartment.code}
          </p>
          <p className="mt-1 text-[11px] font-bold text-cyan-100/70">
            Ver fotos e detalhes
          </p>
        </div>
        <ChevronRight
          className="shrink-0 text-cyan-300 transition group-hover:translate-x-0.5"
          size={18}
        />
      </div>
    </Link>
  );
}

export function EntranceGuidePanel({
  activeRoute,
  initiallyOpen = true,
  isPointerLocked,
  isPortrait = false,
  onNavigate,
  onResumeWalk,
}: EntranceGuidePanelProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [panelView, setPanelView] = useState<PanelView>("menu");
  const [rating, setRating] = useState(0);
  const [reviewApartment, setReviewApartment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewSaved, setReviewSaved] = useState(false);

  const openView = (view: PanelView) => {
    setPanelView(view);
    setIsOpen(true);
  };

  const navigate = (destination: TourDestination) => {
    setIsOpen(false);
    onNavigate(destination);
  };

  const resumeWalk = () => {
    setIsOpen(false);
    onResumeWalk();
  };

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!reviewApartment || rating === 0 || !reviewMessage.trim()) {
      return;
    }

    let storedReviews: unknown[] = [];

    try {
      const storedValue = JSON.parse(
        window.localStorage.getItem("mv2-tour-reviews") ?? "[]",
      ) as unknown;
      storedReviews = Array.isArray(storedValue) ? storedValue : [];
    } catch {
      storedReviews = [];
    }

    storedReviews.push({
      apartment: reviewApartment,
      createdAt: new Date().toISOString(),
      message: reviewMessage.trim(),
      rating,
    });
    window.localStorage.setItem(
      "mv2-tour-reviews",
      JSON.stringify(storedReviews),
    );
    setReviewSaved(true);
    setReviewMessage("");
  };

  if (isPointerLocked) {
    return (
      <div className="pointer-events-none absolute left-3 top-[5.75rem] z-20 hidden max-w-[300px] rounded-md border border-cyan-300/30 bg-slate-950/66 px-4 py-3 text-white shadow-xl backdrop-blur-sm sm:block">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-300">
          Conheca nossas instalacoes
        </p>
        <p className="mt-1 text-xs font-bold text-white/75">
          {activeRoute
            ? `Em rota: ${activeRoute.label}`
            : "Caminhada ativa. Pressione ESC para usar o painel."}
        </p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        className={`pointer-events-auto absolute left-3 z-20 flex min-h-12 max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-md border border-cyan-300/35 bg-slate-950/72 px-4 text-left text-xs font-black text-white shadow-xl backdrop-blur-sm transition hover:border-cyan-200 sm:top-[5.75rem] ${
          isPortrait ? "top-[7.25rem]" : "top-[4.75rem]"
        }`}
        onContextMenu={(event) => event.preventDefault()}
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <PanelLeftOpen className="shrink-0 text-cyan-300" size={19} />
        Conheca nossas instalacoes
      </button>
    );
  }

  return (
    <aside
      className="pointer-events-auto absolute inset-x-3 bottom-[4.9rem] z-20 flex max-h-[58dvh] flex-col overflow-hidden rounded-md border border-cyan-300/35 bg-slate-950/78 text-white shadow-2xl backdrop-blur-md sm:inset-x-auto sm:bottom-auto sm:left-4 sm:top-[5.75rem] sm:max-h-[calc(100dvh-7rem)] sm:w-[370px]"
      onContextMenu={(event) => event.preventDefault()}
    >
      <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-3.5">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-300">
            Painel da portaria
          </p>
          <h2 className="mt-1 text-base font-black text-white">
            Conheca nossas instalacoes
          </h2>
        </div>
        <button
          aria-label="Fechar painel"
          className="grid size-9 shrink-0 place-items-center rounded-md text-white/75 transition hover:bg-white/10 hover:text-white"
          onClick={() => setIsOpen(false)}
          title="Fechar"
          type="button"
        >
          <X size={19} />
        </button>
      </header>

      <div className="min-h-0 overflow-y-auto overscroll-contain p-3.5">
        {panelView !== "menu" ? (
          <button
            className="mb-3 flex min-h-10 items-center gap-2 rounded-md px-2 text-xs font-black text-cyan-200 transition hover:bg-white/8"
            onClick={() => setPanelView("menu")}
            type="button"
          >
            <ArrowLeft size={17} />
            Voltar ao menu
          </button>
        ) : null}

        {panelView === "menu" ? (
          <div className="grid gap-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  className="group grid min-h-[66px] grid-cols-[34px_1fr_18px] items-center gap-2.5 rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-left transition hover:border-cyan-300/55 hover:bg-white/10"
                  key={item.id}
                  onClick={() => openView(item.id)}
                  type="button"
                >
                  <span className="grid size-8 place-items-center rounded-md bg-cyan-300/12 text-cyan-300">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-black text-white">
                      {index + 1}. {item.label}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-semibold leading-4 text-white/58">
                      {item.description}
                    </span>
                  </span>
                  <ChevronRight
                    className="text-white/35 transition group-hover:translate-x-0.5 group-hover:text-cyan-300"
                    size={17}
                  />
                </button>
              );
            })}

            <button
              className="group grid min-h-[66px] grid-cols-[34px_1fr_18px] items-center gap-2.5 rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-left transition hover:border-cyan-300/55 hover:bg-white/10"
              onClick={() => navigate(trashDestination)}
              type="button"
            >
              <span className="grid size-8 place-items-center rounded-md bg-cyan-300/12 text-cyan-300">
                <Trash2 size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-black text-white">
                  5. Lixeira
                </span>
                <span className="mt-0.5 block text-[10px] font-semibold leading-4 text-white/58">
                  Siga automaticamente ate o final do condominio.
                </span>
              </span>
              <ChevronRight
                className="text-white/35 transition group-hover:translate-x-0.5 group-hover:text-cyan-300"
                size={17}
              />
            </button>

            <button
              className="mt-1 flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 text-xs font-black text-slate-950 transition hover:bg-cyan-300"
              onClick={resumeWalk}
              type="button"
            >
              <Footprints size={18} />
              Iniciar caminhada
            </button>
          </div>
        ) : null}

        {panelView === "find-apartment" ? (
          <div>
            <h3 className="text-sm font-black text-white">
              Aprenda a chegar no seu AP
            </h3>
            <p className="mt-1 text-xs leading-5 text-white/62">
              Os apartamentos ja estao preparados. As rotas serao
              ativadas depois da identificacao exata de cada bloco.
            </p>
            <div className="mt-3 grid gap-2">
              {tourApartments.map((apartment) => (
                <ApartmentCard
                  apartment={apartment}
                  key={apartment.code}
                  pendingRoute
                />
              ))}
            </div>
          </div>
        ) : null}

        {panelView === "apartments" ? (
          <div>
            <h3 className="text-sm font-black text-white">
              Conheca nossos apartamentos
            </h3>
            <p className="mt-1 text-xs leading-5 text-white/62">
              Escolha uma acomodacao para abrir fotos e informacoes.
            </p>
            <div className="mt-3 grid gap-2">
              {tourApartments.map((apartment) => (
                <ApartmentCard
                  apartment={apartment}
                  key={apartment.code}
                />
              ))}
            </div>
          </div>
        ) : null}

        {panelView === "facilities" ? (
          <div>
            <h3 className="text-sm font-black text-white">
              Areas em comum
            </h3>
            <p className="mt-1 text-xs leading-5 text-white/62">
              O passeio seguira automaticamente a 2,5x ate o local.
            </p>
            <div className="mt-3 grid gap-2">
              {commonAreaDestinations.map((destination) => (
                <button
                  className="flex min-h-[64px] items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 px-3 text-left transition hover:border-cyan-300/55 hover:bg-white/10"
                  key={destination.id}
                  onClick={() => navigate(destination)}
                  type="button"
                >
                  <span>
                    <span className="block text-sm font-black text-white">
                      {destination.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/58">
                      {destination.description}
                    </span>
                  </span>
                  {activeRoute?.id === destination.id ? (
                    <span className="shrink-0 text-[10px] font-black uppercase text-cyan-300">
                      Em rota
                    </span>
                  ) : (
                    <Navigation
                      className="shrink-0 text-cyan-300"
                      size={18}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {panelView === "review" ? (
          <form onSubmit={submitReview}>
            <h3 className="text-sm font-black text-white">
              Avalie sua reserva
            </h3>
            <p className="mt-1 text-xs leading-5 text-white/62">
              Selecione a acomodacao e compartilhe sua experiencia.
            </p>

            {reviewSaved ? (
              <div
                className="mt-3 flex items-start gap-2 rounded-md border border-emerald-300/35 bg-emerald-300/10 p-3 text-xs font-bold leading-5 text-emerald-100"
                role="status"
              >
                <CheckCircle2 className="mt-0.5 shrink-0" size={17} />
                Avaliacao registrada neste dispositivo. A sincronizacao
                online sera ativada na etapa do banco de dados.
              </div>
            ) : null}

            <label className="mt-4 block text-xs font-black text-white">
              Apartamento
              <select
                className="mt-1.5 min-h-11 w-full rounded-md border border-white/15 bg-slate-900 px-3 text-sm font-bold text-white outline-none focus:border-cyan-300"
                onChange={(event) => {
                  setReviewApartment(event.target.value);
                  setReviewSaved(false);
                }}
                required
                value={reviewApartment}
              >
                <option value="">Selecione</option>
                {tourApartments.map((apartment) => (
                  <option key={apartment.code} value={apartment.code}>
                    Apartamento {apartment.code}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="mt-4">
              <legend className="text-xs font-black text-white">
                Sua nota
              </legend>
              <div className="mt-1.5 flex gap-1" role="radiogroup">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    aria-label={`${value} ${value === 1 ? "estrela" : "estrelas"}`}
                    aria-pressed={rating === value}
                    className="grid size-10 place-items-center rounded-md transition hover:bg-white/10"
                    key={value}
                    onClick={() => {
                      setRating(value);
                      setReviewSaved(false);
                    }}
                    type="button"
                  >
                    <Star
                      className={
                        value <= rating
                          ? "fill-amber-300 text-amber-300"
                          : "text-white/30"
                      }
                      size={24}
                    />
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-4 block text-xs font-black text-white">
              Comentario
              <textarea
                className="mt-1.5 min-h-24 w-full resize-y rounded-md border border-white/15 bg-slate-900 px-3 py-2.5 text-sm leading-5 text-white outline-none placeholder:text-white/35 focus:border-cyan-300"
                maxLength={800}
                onChange={(event) => {
                  setReviewMessage(event.target.value);
                  setReviewSaved(false);
                }}
                placeholder="Conte como foi a estadia"
                required
                value={reviewMessage}
              />
            </label>

            <button
              className="mt-3 min-h-11 w-full rounded-md bg-cyan-400 px-4 text-xs font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={
                !reviewApartment || rating === 0 || !reviewMessage.trim()
              }
              type="submit"
            >
              Registrar avaliacao
            </button>
          </form>
        ) : null}
      </div>
    </aside>
  );
}
