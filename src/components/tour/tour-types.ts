export type TourMode = "overview" | "walk";

export type WalkDirection = "forward" | "backward" | "left" | "right";

export type VerticalDirection = "down" | "up";

export type NormalizedTourPoint = [x: number, z: number];

export type TourMsaaSamples = 0 | 2 | 4;

export type TourVisualPreset = "natural" | "vibrant" | "soft";

export type TourVisualSettings = {
  contrast: number;
  exposure: number;
  lightIntensity: number;
  msaaSamples: TourMsaaSamples;
  preset: TourVisualPreset;
  saturation: number;
};

export type TourDestinationId =
  | "barbecue"
  | "parking-square"
  | "court-square"
  | "pool"
  | "trash";

export type TourDestination = {
  description: string;
  id: TourDestinationId;
  label: string;
  waypoints: NormalizedTourPoint[];
};
