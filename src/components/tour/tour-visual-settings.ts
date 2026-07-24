import type {
  TourVisualPreset,
  TourVisualSettings,
} from "@/components/tour/tour-types";

export const DEFAULT_TOUR_VISUAL_SETTINGS: TourVisualSettings = {
  contrast: 1.16,
  exposure: 0.68,
  lightIntensity: 0.76,
  msaaSamples: 2,
  preset: "natural",
  saturation: 0.98,
};

export const TOUR_VISUAL_PRESETS: Record<
  TourVisualPreset,
  Omit<TourVisualSettings, "msaaSamples" | "preset">
> = {
  natural: {
    contrast: 1.16,
    exposure: 0.68,
    lightIntensity: 0.76,
    saturation: 0.98,
  },
  vibrant: {
    contrast: 1.2,
    exposure: 0.74,
    lightIntensity: 0.78,
    saturation: 1.12,
  },
  soft: {
    contrast: 1.05,
    exposure: 0.8,
    lightIntensity: 0.88,
    saturation: 0.95,
  },
};

export function applyTourVisualPreset(
  settings: TourVisualSettings,
  preset: TourVisualPreset,
): TourVisualSettings {
  return {
    ...settings,
    ...TOUR_VISUAL_PRESETS[preset],
    preset,
  };
}

export function parseStoredTourVisualSettings(
  value: string | null,
): TourVisualSettings | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<TourVisualSettings>;
    const msaaSamples =
      parsed.msaaSamples === 0 ||
      parsed.msaaSamples === 2 ||
      parsed.msaaSamples === 4
        ? parsed.msaaSamples
        : DEFAULT_TOUR_VISUAL_SETTINGS.msaaSamples;
    const preset =
      parsed.preset === "natural" ||
      parsed.preset === "vibrant" ||
      parsed.preset === "soft"
        ? parsed.preset
        : DEFAULT_TOUR_VISUAL_SETTINGS.preset;

    return {
      contrast:
        typeof parsed.contrast === "number"
          ? parsed.contrast
          : DEFAULT_TOUR_VISUAL_SETTINGS.contrast,
      exposure:
        typeof parsed.exposure === "number"
          ? parsed.exposure
          : DEFAULT_TOUR_VISUAL_SETTINGS.exposure,
      lightIntensity:
        typeof parsed.lightIntensity === "number"
          ? parsed.lightIntensity
          : DEFAULT_TOUR_VISUAL_SETTINGS.lightIntensity,
      msaaSamples,
      preset,
      saturation:
        typeof parsed.saturation === "number"
          ? parsed.saturation
          : DEFAULT_TOUR_VISUAL_SETTINGS.saturation,
    };
  } catch {
    return null;
  }
}
