"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Footprints,
  Maximize2,
  Minimize2,
  Orbit,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";

import type { TourMode, WalkDirection } from "@/components/tour/tour-types";

type TourOverlayProps = {
  error: string | null;
  isFullscreen: boolean;
  isLoaded: boolean;
  loadProgress: number;
  mode: TourMode;
  onModeChange: (mode: TourMode) => void;
  onReset: () => void;
  onRetry: () => void;
  onToggleFullscreen: () => void;
  onWalkDirectionChange: (
    direction: WalkDirection,
    active: boolean,
  ) => void;
};

function ModeButton({
  active,
  children,
  disabled,
  label,
  onClick,
  shortLabel,
}: {
  active: boolean;
  children: ReactNode;
  disabled: boolean;
  label: string;
  onClick: () => void;
  shortLabel?: string;
}) {
  return (
    <button
      aria-pressed={active}
      className={`flex min-h-10 items-center gap-2 rounded-md px-3 text-xs font-black transition sm:text-sm ${
        active
          ? "bg-sky-700 text-white"
          : "text-slate-700 hover:bg-slate-100"
      } disabled:cursor-not-allowed disabled:opacity-45`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
      {shortLabel ? (
        <>
          <span className="sm:hidden">{shortLabel}</span>
          <span className="hidden sm:inline">{label}</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}

function IconButton({
  children,
  disabled,
  label,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="grid size-10 place-items-center rounded-md bg-white/95 text-slate-800 shadow-md ring-1 ring-slate-900/10 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function WalkButton({
  children,
  direction,
  label,
  onDirectionChange,
}: {
  children: ReactNode;
  direction: WalkDirection;
  label: string;
  onDirectionChange: (
    direction: WalkDirection,
    active: boolean,
  ) => void;
}) {
  const release = () => onDirectionChange(direction, false);

  return (
    <button
      aria-label={label}
      className="grid size-11 touch-none place-items-center rounded-md bg-slate-950/88 text-white shadow-md ring-1 ring-white/20 transition active:bg-sky-700"
      onContextMenu={(event) => event.preventDefault()}
      onPointerCancel={release}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        onDirectionChange(direction, true);
      }}
      onPointerLeave={release}
      onPointerUp={release}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

export function TourOverlay({
  error,
  isFullscreen,
  isLoaded,
  loadProgress,
  mode,
  onModeChange,
  onReset,
  onRetry,
  onToggleFullscreen,
  onWalkDirectionChange,
}: TourOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between gap-4 p-3 sm:p-5">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
        <div className="pointer-events-auto flex min-w-0 items-center gap-2">
          <Link
            aria-label="Voltar para a pagina inicial"
            className="grid size-10 shrink-0 place-items-center rounded-md bg-white/95 text-slate-900 shadow-md ring-1 ring-slate-900/10 transition hover:bg-white"
            href="/"
            title="Voltar"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="min-w-0 rounded-lg bg-white/95 px-4 py-2.5 shadow-md ring-1 ring-slate-900/10">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-sky-700">
              Tour 3D interativo
            </p>
            <h1 className="truncate text-sm font-black text-slate-950 sm:text-base">
              Maranduba Ville II
            </h1>
          </div>
        </div>

        <div className="pointer-events-auto flex max-w-full flex-wrap gap-2">
          <div className="flex rounded-lg bg-white/95 p-1 shadow-md ring-1 ring-slate-900/10">
            <ModeButton
              active={mode === "overview"}
              disabled={!isLoaded}
              label="Vista geral"
              onClick={() => onModeChange("overview")}
              shortLabel="Geral"
            >
              <Orbit size={17} />
            </ModeButton>
            <ModeButton
              active={mode === "walk"}
              disabled={!isLoaded}
              label="Caminhar"
              onClick={() => onModeChange("walk")}
            >
              <Footprints size={17} />
            </ModeButton>
          </div>
          <IconButton
            disabled={!isLoaded}
            label="Reiniciar vista"
            onClick={onReset}
          >
            <RotateCcw size={18} />
          </IconButton>
          <IconButton
            label={
              isFullscreen ? "Sair da tela cheia" : "Abrir em tela cheia"
            }
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 size={18} />
            ) : (
              <Maximize2 size={18} />
            )}
          </IconButton>
        </div>
      </div>

      {!isLoaded && !error ? (
        <div
          aria-live="polite"
          className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(88vw,320px)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/95 p-5 text-center shadow-xl ring-1 ring-slate-900/10"
          role="status"
        >
          <p className="text-sm font-black text-slate-950">
            Preparando o condominio
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-sky-700 transition-[width]"
              style={{ width: `${Math.max(4, loadProgress)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-bold text-slate-600">
            {loadProgress}% carregado
          </p>
        </div>
      ) : null}

      {error ? (
        <div
          className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(88vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-5 text-center shadow-xl ring-1 ring-red-200"
          role="alert"
        >
          <TriangleAlert className="mx-auto text-red-600" size={28} />
          <p className="mt-3 text-sm font-black text-slate-950">
            Passeio indisponivel
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
          <button
            className="mt-4 min-h-10 rounded-md bg-sky-700 px-4 text-sm font-black text-white transition hover:bg-sky-800"
            onClick={onRetry}
            type="button"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      <div className="mt-auto flex items-end justify-between gap-3">
        {isLoaded ? (
          <div className="max-w-[210px] rounded-lg bg-slate-950/82 px-3 py-2 text-xs font-bold leading-5 text-white shadow-md sm:max-w-none">
            {mode === "overview"
              ? "Arraste para girar e use o zoom para aproximar."
              : "Arraste para olhar. Use WASD, as setas ou os controles."}
          </div>
        ) : (
          <span />
        )}

        {isLoaded && mode === "walk" ? (
          <div
            aria-label="Controles de caminhada"
            className="pointer-events-auto grid shrink-0 grid-cols-3 gap-1"
          >
            <span />
            <WalkButton
              direction="forward"
              label="Caminhar para frente"
              onDirectionChange={onWalkDirectionChange}
            >
              <ChevronUp size={23} />
            </WalkButton>
            <span />
            <WalkButton
              direction="left"
              label="Caminhar para a esquerda"
              onDirectionChange={onWalkDirectionChange}
            >
              <ChevronLeft size={23} />
            </WalkButton>
            <WalkButton
              direction="backward"
              label="Caminhar para tras"
              onDirectionChange={onWalkDirectionChange}
            >
              <ChevronDown size={23} />
            </WalkButton>
            <WalkButton
              direction="right"
              label="Caminhar para a direita"
              onDirectionChange={onWalkDirectionChange}
            >
              <ChevronRight size={23} />
            </WalkButton>
          </div>
        ) : null}
      </div>
    </div>
  );
}
