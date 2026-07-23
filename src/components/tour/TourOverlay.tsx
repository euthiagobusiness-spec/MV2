"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Footprints,
  Maximize2,
  Minimize2,
  Orbit,
  Play,
  RotateCcw,
  RotateCw,
  TriangleAlert,
} from "lucide-react";

import { EntranceGuidePanel } from "@/components/tour/EntranceGuidePanel";
import { MobileTourControls } from "@/components/tour/MobileTourControls";
import type {
  TourDestination,
  TourMode,
  VerticalDirection,
} from "@/components/tour/tour-types";

type TourOverlayProps = {
  activeRoute: {
    id: TourDestination["id"];
    label: string;
  } | null;
  error: string | null;
  isFullscreen: boolean;
  isLoaded: boolean;
  isMobile: boolean;
  isMobileTourStarted: boolean;
  isPointerLocked: boolean;
  isPortrait: boolean;
  isRunning: boolean;
  loadProgress: number;
  mode: TourMode;
  onModeChange: (mode: TourMode) => void;
  onMobileMovementChange: (
    right: number,
    forward: number,
  ) => void;
  onNavigate: (destination: TourDestination) => void;
  onReset: () => void;
  onRetry: () => void;
  onRunToggle: () => void;
  onStartMobileTour: () => void;
  onToggleFullscreen: () => void;
  onVerticalDirectionChange: (
    direction: VerticalDirection,
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
  activeRoute,
  error,
  isFullscreen,
  isLoaded,
  isMobile,
  isMobileTourStarted,
  isPointerLocked,
  isPortrait,
  isRunning,
  loadProgress,
  mode,
  onModeChange,
  onMobileMovementChange,
  onNavigate,
  onReset,
  onRetry,
  onRunToggle,
  onStartMobileTour,
  onToggleFullscreen,
  onVerticalDirectionChange,
}: TourOverlayProps) {
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
            {!isMobile ? (
              <ModeSwitcher
                className="flex"
                isLoaded={isLoaded}
                mode={mode}
                onModeChange={onModeChange}
              />
            ) : null}
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
              Preparando o condominio completo
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-sky-700 transition-[width]"
                style={{ width: `${Math.max(4, loadProgress)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
              <span>{loadProgress}% carregado</span>
              <span>Materiais e paisagismo</span>
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

        {isLoaded &&
        isMobile &&
        (!isMobileTourStarted || isPortrait) &&
        !error ? (
          <div
            className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(84vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-950/94 p-5 text-center text-white shadow-2xl ring-1 ring-white/20"
            onContextMenu={(event) => event.preventDefault()}
          >
            <RotateCw className="mx-auto text-cyan-300" size={30} />
            <p className="mt-3 text-base font-black">
              {isMobileTourStarted
                ? "Gire o celular para continuar"
                : "Iniciar tour em tela horizontal"}
            </p>
            <p className="mt-1.5 text-xs font-semibold leading-5 text-white/65">
              A navegacao foi preparada para o telefone deitado.
            </p>
            {!isMobileTourStarted ? (
              <button
                className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 text-sm font-black text-slate-950"
                onClick={onStartMobileTour}
                type="button"
              >
                <Play size={18} />
                Entrar no passeio
              </button>
            ) : null}
          </div>
        ) : null}

        {isLoaded &&
        mode === "walk" &&
        isPointerLocked &&
        !isMobile ? (
          <>
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/75 shadow" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/75 shadow" />
            </div>
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-slate-950/78 px-4 py-2 text-center text-xs font-bold text-white shadow-lg">
              WASD mover | CTRL correr | ESPACO subir | SHIFT descer |
              ESC liberar cursor
            </p>
          </>
        ) : null}

        {isLoaded &&
        isMobile &&
        isMobileTourStarted &&
        !isPortrait &&
        mode === "walk" ? (
          <div className="mt-auto">
            <MobileTourControls
              isRunning={isRunning}
              onMovementChange={onMobileMovementChange}
              onRunToggle={onRunToggle}
              onVerticalDirectionChange={onVerticalDirectionChange}
            />
          </div>
        ) : (
          <div className="mt-auto" />
        )}

        {isMobile && isMobileTourStarted && !isPortrait ? (
          <ModeSwitcher
            className="mx-auto flex w-[min(48vw,240px)]"
            isLoaded={isLoaded}
            mode={mode}
            onModeChange={onModeChange}
          />
        ) : null}
      </div>

      {isLoaded &&
      !error &&
      (!isMobile || (isMobileTourStarted && !isPortrait)) ? (
        <EntranceGuidePanel
          activeRoute={activeRoute}
          initiallyOpen={!isMobile}
          isPointerLocked={isPointerLocked}
          onNavigate={onNavigate}
          onResumeWalk={() => onModeChange("walk")}
        />
      ) : null}
    </>
  );
}
