"use client";

import { Check, SlidersHorizontal, X } from "lucide-react";

import {
  applyTourVisualPreset,
  TOUR_VISUAL_PRESETS,
} from "@/components/tour/tour-visual-settings";
import type {
  TourMsaaSamples,
  TourVisualPreset,
  TourVisualSettings,
} from "@/components/tour/tour-types";

type TourVisualSettingsPanelProps = {
  isOpen: boolean;
  onChange: (settings: TourVisualSettings) => void;
  onOpenChange: (isOpen: boolean) => void;
  settings: TourVisualSettings;
};

const presetLabels: Record<TourVisualPreset, string> = {
  natural: "Natural",
  vibrant: "Vibrante",
  soft: "Suave",
};

function SettingRange({
  label,
  max,
  min,
  onChange,
  step,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="flex items-center justify-between gap-3 text-[11px] font-bold text-slate-700">
        {label}
        <span className="tabular-nums text-slate-950">
          {Math.round(value * 100)}%
        </span>
      </span>
      <input
        className="h-2 w-full cursor-pointer accent-sky-700"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

export function TourVisualSettingsPanel({
  isOpen,
  onChange,
  onOpenChange,
  settings,
}: TourVisualSettingsPanelProps) {
  const updateSetting = <Key extends keyof TourVisualSettings>(
    key: Key,
    value: TourVisualSettings[Key],
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        aria-label="Ajustar imagem do tour"
        className="grid size-9 place-items-center rounded-md bg-white/78 text-slate-800 shadow-md ring-1 ring-slate-900/10 backdrop-blur-sm transition hover:bg-white/90"
        onClick={() => onOpenChange(!isOpen)}
        title="Cor e qualidade"
        type="button"
      >
        <SlidersHorizontal size={17} />
      </button>

      {isOpen ? (
        <section
          aria-label="Configurações de imagem"
          className="absolute right-0 top-11 z-40 w-[min(82vw,292px)] rounded-md bg-white/92 p-4 text-slate-950 shadow-xl ring-1 ring-slate-900/15 backdrop-blur-md"
        >
          <header className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black">Cor e qualidade</p>
              <p className="text-[10px] font-semibold text-slate-500">
                Ajustes aplicados em tempo real
              </p>
            </div>
            <button
              aria-label="Fechar configuracoes"
              className="grid size-8 place-items-center rounded-md text-slate-600 transition hover:bg-slate-100"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              <X size={16} />
            </button>
          </header>

          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {(Object.keys(TOUR_VISUAL_PRESETS) as TourVisualPreset[]).map(
              (preset) => (
                <button
                  className={`flex min-h-9 items-center justify-center gap-1 rounded-md px-2 text-[10px] font-black transition ${
                    settings.preset === preset
                      ? "bg-sky-700 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  key={preset}
                  onClick={() =>
                    onChange(applyTourVisualPreset(settings, preset))
                  }
                  type="button"
                >
                  {settings.preset === preset ? <Check size={12} /> : null}
                  {presetLabels[preset]}
                </button>
              ),
            )}
          </div>

          <div className="mt-4 grid gap-3">
            <SettingRange
              label="Exposição"
              max={1.1}
              min={0.5}
              onChange={(value) => updateSetting("exposure", value)}
              step={0.01}
              value={settings.exposure}
            />
            <SettingRange
              label="Contraste"
              max={1.35}
              min={0.9}
              onChange={(value) => updateSetting("contrast", value)}
              step={0.01}
              value={settings.contrast}
            />
            <SettingRange
              label="Saturação"
              max={1.35}
              min={0.8}
              onChange={(value) => updateSetting("saturation", value)}
              step={0.01}
              value={settings.saturation}
            />
            <SettingRange
              label="Luz ambiente"
              max={1.2}
              min={0.55}
              onChange={(value) =>
                updateSetting("lightIntensity", value)
              }
              step={0.01}
              value={settings.lightIntensity}
            />
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold text-slate-700">
              Suavização multiamostral
            </p>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {([0, 2, 4] as TourMsaaSamples[]).map((samples) => (
                <button
                  aria-label={
                    samples === 0
                      ? "Desligar suavização multiamostral"
                      : `Usar suavização multiamostral ${samples}x`
                  }
                  aria-pressed={settings.msaaSamples === samples}
                  className={`min-h-9 rounded-md px-2 text-[10px] font-black transition ${
                    settings.msaaSamples === samples
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  key={samples}
                  onClick={() => updateSetting("msaaSamples", samples)}
                  type="button"
                >
                  {samples === 0 ? "Sem MSAA" : `${samples}x`}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
