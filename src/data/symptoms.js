// Catálogo de sintomas do protótipo de referência da Ana (20 sintomas + "outro", escolha de até 5).
// Escala igual para todos: 0 Não senti, 1 Leve, 2 Moderado, 3 Forte, 4 Muito forte. A pessoa também pode
// deixar "Escolha a escala" (sem valor) ou marcar "Não registrar". Textos em src/i18n/*.json (sym.<id>, scale.<n>).
// `area` liga o sintoma ao corpo estilizado; `intimate` exige permissão para entrar no relatório.
export const MAX_SYMPTOMS = 5;
export const SCALE = [0, 1, 2, 3, 4];
export const AREAS = [
  { id: "mind", icon: "brain", x: 150, y: 52 },
  { id: "sleep", icon: "moon-waning-crescent", x: 214, y: 34 },
  { id: "mouth", icon: "tooth-outline", x: 88, y: 40 },
  { id: "chest", icon: "heart-pulse", x: 202, y: 152 },
  { id: "body", icon: "arm-flex-outline", x: 78, y: 222 },
  { id: "cycle", icon: "water-outline", x: 150, y: 296 },
];
export const SYMPTOMS = [
  { id: "period", area: "cycle" },
  { id: "hotFlashes", area: "chest" },
  { id: "nightSweats", area: "chest" },
  { id: "sleep", area: "sleep" },
  { id: "fatigue", area: "body" },
  { id: "mood", area: "mind" },
  { id: "memory", area: "mind" },
  { id: "desire", area: "cycle", intimate: true },
  { id: "intimate", area: "cycle", intimate: true },
  { id: "urinary", area: "cycle", intimate: true },
  { id: "aches", area: "body" },
  { id: "joints", area: "body" },
  { id: "alcohol", area: "body" },
  { id: "dryMouth", area: "mouth" },
  { id: "dizziness", area: "mind" },
  { id: "taste", area: "mouth" },
  { id: "palpitations", area: "chest" },
  { id: "panic", area: "mind" },
  { id: "tingling", area: "body" },
  { id: "gums", area: "mouth" },
];
export const CUSTOM = { id: "custom", area: "body", custom: true }; // "Outro sintoma (descrever)"
export const symptomById = (id) =>
  id === "custom" ? CUSTOM : SYMPTOMS.find((s) => s.id === id);
// Aparência da representação
export const SKIN = [
  "#F6D9C4",
  "#EBC3A3",
  "#D9A67F",
  "#BE8359",
  "#8F5B3A",
  "#5E3B28",
];
export const HAIR = [
  "#2B1D16",
  "#5A3A28",
  "#8A5A32",
  "#D4A85A",
  "#B5532F",
  "#B9B9C2",
];
export const EYES = [
  "#4A2E1F",
  "#7A5230",
  "#3F7A5B",
  "#4C86C6",
  "#6E7B86",
  "#1A1412",
];
export const HAIR_LENGTHS = ["short", "bob", "medium", "long", "curly", "bun"]; // penteados
export const TONES = [
  "#3F399B",
  "#7D5ADF",
  "#526CD7",
  "#6AC8E6",
  "#DBC0F7",
  "#E8A9BD",
]; // cor da roupa (paleta da marca)
