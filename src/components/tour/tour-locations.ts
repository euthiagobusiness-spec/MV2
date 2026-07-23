import type {
  NormalizedTourPoint,
  TourDestination,
} from "@/components/tour/tour-types";

export const entrancePosition: NormalizedTourPoint = [0.483, 0.892];
export const entranceTarget: NormalizedTourPoint = [0.463, 0.883];

export const commonAreaDestinations: TourDestination[] = [
  {
    description: "Espaco coberto para confraternizacoes.",
    id: "barbecue",
    label: "Churrasqueira",
    waypoints: [
      [0.5, 0.84],
      [0.5, 0.74],
      [0.58, 0.7],
      [0.66, 0.68],
      [0.68, 0.66],
    ],
  },
  {
    description: "Praca proxima as vagas e ao acesso principal.",
    id: "parking-square",
    label: "Praca do estacionamento",
    waypoints: [
      [0.5, 0.84],
      [0.5, 0.76],
      [0.57, 0.72],
    ],
  },
  {
    description: "Area de convivencia ao lado da quadra.",
    id: "court-square",
    label: "Praca da quadra",
    waypoints: [
      [0.5, 0.84],
      [0.5, 0.72],
      [0.5, 0.6],
      [0.5, 0.53],
    ],
  },
  {
    description: "Piscina central do condominio.",
    id: "pool",
    label: "Piscina",
    waypoints: [
      [0.5, 0.84],
      [0.5, 0.74],
      [0.58, 0.7],
      [0.66, 0.68],
      [0.7, 0.64],
      [0.65, 0.62],
    ],
  },
];

export const trashDestination: TourDestination = {
  description: "Lixeira localizada no final do condominio.",
  id: "trash",
  label: "Lixeira",
  waypoints: [
    [0.5, 0.84],
    [0.5, 0.72],
    [0.5, 0.62],
    [0.5, 0.52],
    [0.5, 0.42],
    [0.5, 0.32],
    [0.5, 0.25],
  ],
};
