export const UTIL = {
  INVTZ: 68, INKRI: 62, "HUB-NEL": 58, INKAT: 74, INENR: 79, INMAA: 91,
  "WH-SRI": 51, "HUB-HSR": 44, INPNY: 48, "HUB-MDU": 40, INTUT: 35,
};

export const SCENARIOS = {
  cyclone: {
    label: "Cyclone Vardha watch",
    status: { INMAA: "closed", INKAT: "degraded", INENR: "degraded" },
    cyclone: { center: [13.15, 80.9], radiusKm: 95, coreKm: 45, kts: 64 },
  },
  normal: { label: "Nominal operations", status: {}, cyclone: null },
};
