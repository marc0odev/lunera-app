// Persona do protótipo: uma respondente da pesquisa de perimenopausa e menopausa (PrimaConsult), ANONIMIZADA.
export const persona = {
  name: "Helena",
  ageBand: "55–59",
  region: "southeast", // Sudeste
  status: "confirmed", // "Um profissional me informou que estou na perimenopausa"
  bother: "sleep", // sintoma que mais incomodou
  priorities: ["options", "nextSteps"], // conhecer opções de cuidado; entender os próximos passos
  // frequência (1 a 5) e intensidade (none, mild, moderate, severe) relatadas na pesquisa
  usual: {
    hotFlashes: { freq: 2, level: "mild" },
    nightSweats: { freq: 5, level: "severe" },
    sleep: { freq: 5, level: "severe" },
    fatigue: { freq: 5, level: "severe" },
    mood: { freq: 3, level: "moderate" },
    brainFog: { freq: 5, level: "severe" },
    joints: { freq: 5, level: "moderate" },
  },
};

// Séries dos últimos 6 dias (ilustrativas, coerentes com a pesquisa dela): qualidade do sono (0 a 4) e sintomas (0 a 3).
export const past = [
  { sleep: 1, sym: 2 },
  { sleep: 0, sym: 3 },
  { sleep: 2, sym: 2 },
  { sleep: 1, sym: 3 },
  { sleep: 2, sym: 2 },
  { sleep: 1, sym: 3 },
];

// Dados agregados da pesquisa (mulheres com 40 anos ou mais).
export const survey = {
  n: 42, // responderam sobre as mudanças dos últimos 6 meses
  top: [
    { id: "fatigue", pct: 74 },
    { id: "brainFog", pct: 71 },
    { id: "mood", pct: 64 },
    { id: "sleep", pct: 60 },
    { id: "hotFlashes", pct: 52 },
    { id: "nightSweats", pct: 48 },
    { id: "joints", pct: 48 },
  ],
  wantSummary: 48, // % que prefere "resumo para levar à consulta"
  notifyIfConfigured: 52, // % que quer notificações só se configurar
  shareWithDoctor: 60, // % que compartilharia com profissional escolhido
};

export const journey = { day: 9, total: 21 };
