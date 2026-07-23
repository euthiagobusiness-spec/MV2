"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FastForward,
  Footprints,
  Maximize2,
  Minimize2,
  MoveDown,
  MoveUp,
  Orbit,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";

import { ApartmentTourDrawer } from "@/components/tour/ApartmentTourDrawer";
import type {
  TourMode,
  TourQuality,
  VerticalDirection,
  WalkDirection,
} from "@/components/tour/tour-types";

type TourOverlayProps = {
  error: string | null;
  isFullscreen: boolean;
  isLoaded: boolean;
  isRunning: boolean;
  loadProgress: number;
  mode: TourMode;
  quality: TourQuality;
  onModeChange: (mode: TourMode) => void;
  onReset: () => void;
  onRetry: () => void;
  onRunToggle: () => void;
  onToggleFullscreen: () => void;
  onVerticalDirectionChange: (
    direction: VerticalDirection,
    active: boolean,
  ) => void;
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
      className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md px-3 text-xs font-black transition sm:min-h-10 sm:flex-none sm:text-sm ${
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
      className="grid size-11 place-items-center rounded-md bg-white/95 text-slate-800 shadow-md ring-1 ring-slate-900/10 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 sm:size-10"
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function HoldButton({
  active,
  children,
  label,
  onActiveChange,
}: {
  active?: boolean;
  children: ReactNode;
  label: string;
  onActiveChange: (active: boolean) => void;
}) {
  const release = () => onActiveChange(false);

  return (
    <button
      aria-label={label}
      className={`grid min-h-12 touch-none place-items-center rounded-md px-3 text-white shadow-md ring-1 ring-white/20 transition ${
        active ? "bg-sky-600" : "bg-slate-950/88 active:bg-sky-700"
      }`}
      onContextMenu={(event) => event.preventDefault()}
      onPointerCancel={release}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        onActiveChange(true);
      }}
      onPointerUp={release}
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
  return (
    <HoldButton
      label={label}
      onActiveChange={(active) => onDirectionChange(direction, active)}
    >
      {children}
    </HoldButton>
  );
}

function ModeSwitcher({
  className,
  isLoaded,
  mode,
  onModeChange,
}: {
  className: string;
  isLoaded: boolean;
  mode: TourMode;
  onModeChange: (mode: TourMode) => void;
}) {
  return (
    <div
      className={`pointer-events-auto rounded-lg bg-white/95 p-1 shadow-md ring-1 ring-slate-900/10 ${className}`}
    >
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
  );
}

export function TourOverlay({
  error,
  isFullscreen,
  isLoaded,
  isRunning,
  loadProgress,
  mode,
  quality,
  onModeChange,
  onReset,
  onRetry,
  onRunToggle,
  onToggleFullscreen,
  onVerticalDirectionChange,
  onWalkDirectionChange,
}: TourOverlayProps) {
  const [apartmentsOpen, setApartmentsOpen] = useState(false);
  const closeApartments = useCallback(() => setApartmentsOpen(false), []);

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col gap-3 px-3 sm:px-5"
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="pointer-events-auto flex min-w-0 items-center gap-2">
            <Link
              aria-label="Voltar para a pagina inicial"
              className="grid size-11 shrink-0 place-items-center rounded-md bg-white/95 text-slate-900 shadow-md ring-1 ring-slate-900/10 transition hover:bg-white sm:size-10"
              href="/"
              prefetch={false}
              title="Voltar"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="min-w-0 rounded-md bg-white/95 px-3 py-2 shadow-md ring-1 ring-slate-900/10 sm:px-4 sm:py-2.5">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.12em] text-sky-700 sm:text-[11px]">
                Tour 3D interativo
              </p>
              <h1 className="truncate text-sm font-black text-slate-950 sm:text-base">
                Maranduba Ville II
              </h1>
            </div>
          </div>

          <div className="pointer-events-auto flex shrink-0 gap-2">
            <ModeSwitcher
              className="hidden sm:flex"
              isLoaded={isLoaded}
              mode={mode}
              onModeChange={onModeChange}
            />
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
            className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(88vw,320px)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/96 p-5 text-center shadow-xl ring-1 ring-slate-900/10"
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
            <div className="mt-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
              <span>{loadProgress}% carregado</span>
              <span>
                {quality === "mobile" ? "Versao leve" : "Alta qualidade"}
              </span>
            </div>
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
              className="mt-4 min-h-11 rounded-md bg-sky-700 px-4 text-sm font-black text-white transition hover:bg-sky-800"
              onClick={onRetry}
              type="button"
            >
              Tentar novamente
            </button>
          </div>
        ) : null}

        <div className="mt-auto grid gap-2">
          {isLoaded ? (
            <div className="flex items-end justify-between gap-2">
              <div className="grid gap-2">
                <button
                  aria-label="Abrir apartamentos"
                  className="pointer-events-auto flex min-h-12 items-center gap-2 rounded-md bg-white/95 px-3 text-xs font-black text-slate-900 shadow-md ring-1 ring-slate-900/10 transition hover:bg-white sm:text-sm"
                  onClick={() => setApartmentsOpen(true)}
                  type="button"
                >
                  <Building2 className="text-sky-700" size={18} />
                  <span className={mode === "walk" ? "hidden sm:inline" : ""}>
                    Apartamentos
                  </span>
                </button>
                <p className="hidden rounded-md bg-slate-950/82 px-3 py-2 text-xs font-bold leading-5 text-white shadow-md sm:block">
                  {mode === "overview"
                    ? "Arraste para girar e use o zoom para aproximar."
                    : "Arraste para olhar. Use WASD, as setas ou os controles."}
                </p>
              </div>

              {mode === "walk" ? (
                <div
                  aria-label="Controles de caminhada"
                  className="pointer-events-auto flex shrink-0 items-end gap-2"
                >
                  <div className="grid w-[148px] grid-cols-3 gap-1">
                    <span />
                    <WalkButton
                      direction="forward"
                      label="Caminhar para frente"
                      onDirectionChange={onWalkDirectionChange}
                    >
                      <ChevronUp size={24} />
                    </WalkButton>
                    <span />
                    <WalkButton
                      direction="left"
                      label="Caminhar para a esquerda"
                      onDirectionChange={onWalkDirectionChange}
                    >
                      <ChevronLeft size={24} />
                    </WalkButton>
                    <WalkButton
                      direction="backward"
                      label="Caminhar para tras"
                      onDirectionChange={onWalkDirectionChange}
                    >
                      <ChevronDown size={24} />
                    </WalkButton>
                    <WalkButton
                      direction="right"
                      label="Caminhar para a direita"
                      onDirectionChange={onWalkDirectionChange}
                    >
                      <ChevronRight size={24} />
                    </WalkButton>
                  </div>

                  <div className="grid w-[82px] gap-1">
                    <button
                      aria-pressed={isRunning}
                      className={`flex min-h-12 items-center justify-center gap-1 rounded-md px-2 text-[11px] font-black text-white shadow-md ring-1 ring-white/20 transition ${
                        isRunning ? "bg-sky-600" : "bg-slate-950/88"
                      }`}
                      onClick={onRunToggle}
                      title="Correr em velocidade 2x"
                      type="button"
                    >
                      <FastForward size={17} />
                      Correr
                    </button>
                    <HoldButton
                      label="Subir enquanto estiver pressionado"
                      onActiveChange={(active) =>
                        onVerticalDirectionChange("up", active)
                      }
                    >
                      <span className="flex items-center gap-1 text-[11px] font-black">
                        <MoveUp size={17} />
                        Subir
                      </span>
                    </HoldButton>
                    <HoldButton
                      label="Descer enquanto estiver pressionado"
                      onActiveChange={(active) =>
                        onVerticalDirectionChange("down", active)
                      }
                    >
                      <MoveDown size={19} />
                    </HoldButton>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <ModeSwitcher
            className="flex w-full sm:hidden"
            isLoaded={isLoaded}
            mode={mode}
            onModeChange={onModeChange}
          />
        </div>
      </div>

      <ApartmentTourDrawer
        isOpen={apartmentsOpen}
        onClose={closeApartments}
      />
    </>
  );
}
