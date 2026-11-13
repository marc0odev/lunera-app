// Regras do acompanhamento (plano, dias, momentos, pendências, mensagens de cuidado, correlação).
import { SYMPTOMS, AREAS } from "./symptoms";

export const MAX_SYMPTOMS = 5; // limite de sintomas acompanhados (briefing)
export const PLAN_DAYS = [7, 14, 21];
export const MOMENTS = ["wakeSleep", "morning", "afternoon", "evening"];
export const CHANNELS = ["alarm", "whatsapp", "sms"];
export const slotsFor = (moment) =>
  moment === "wakeSleep" ? ["wake", "sleep"] : [moment];

// Opções de aparência (representação ilustrativa). "lilac" é o corpo estilizado original.
export const LOOK = {
  skin: {
    lilac: null,
    s1: "#F6D9C4",
    s2: "#E8B98F",
    s3: "#C98E63",
    s4: "#9C6444",
    s5: "#6B4430",
  },
  hairColor: {
    default: null,
    black: "#2A2430",
    brown: "#5A3B2E",
    auburn: "#8A4A2F",
    blond: "#CDAA6A",
    gray: "#A9A7B5",
    white: "#E9E7F2",
  },
  eyes: {
    none: null,
    brown: "#5A3B2E",
    hazel: "#8A6A3A",
    green: "#4F7A55",
    blue: "#4A7FBF",
    gray: "#7E8796",
  },
  hairLength: ["short", "medium", "long"],
};

export const defaultProfile = {
  name: "",
  age: "",
  skin: "lilac",
  hairColor: "default",
  hairLength: "medium",
  eyes: "none",
};
export const defaultPlan = {
  days: 14,
  symptoms: ["hotFlashes", "nightSweats", "sleep", "mood", "memory"], // sugestão inicial; a pessoa troca em Meu aplicativo
  custom: "", // outro sintoma, descrito pela pessoa
  moment: "wakeSleep",
  times: {
    wake: "07:00",
    sleep: "22:00",
    morning: "08:00",
    afternoon: "15:00",
    evening: "21:00",
  },
  channel: "alarm",
  assign: {}, // sintoma -> 'wake' | 'sleep' (só no modo dividido)
};
export const defaultConsult = {
  priorities: [],
  questions: [],
  notes: "",
  includeIntimate: false,
  includeFree: false,
};
export const INTIMATE = ["desire", "intimate", "urinary", "period"]; // controle específico de inclusão no relatório

export const activeSymptoms = (plan) => {
  const list = SYMPTOMS.filter((s) => plan.symptoms.includes(s.id));
  return plan.custom && plan.custom.trim()
    ? [...list, { id: "custom", area: "body", custom: true }]
    : list;
};
const NIGHT = ["sleep", "nightSweats"];
export const slotOf = (plan, id) => {
  if (plan.moment !== "wakeSleep") return plan.moment;
  return plan.assign[id] || (NIGHT.includes(id) ? "wake" : "sleep");
};
export const symptomsForSlot = (plan, slot) =>
  activeSymptoms(plan).filter((s) => slotOf(plan, s.id) === slot);
export const areasForSlot = (plan, slot) => {
  const have = new Set(symptomsForSlot(plan, slot).map((s) => s.area));
  return AREAS.filter((a) => have.has(a.id));
};

// Dia do acompanhamento pelo calendário
export const rawDayNumber = (startISO, offset = 0, now = new Date()) => {
  if (!startISO) return 0;
  const a = new Date(`${startISO}T00:00:00`);
  const b = new Date(now);
  b.setHours(0, 0, 0, 0);
  return Math.round((b - a) / 864e5) + 1 + offset;
};
export const dayNumber = (startISO, offset, total, now) =>
  Math.max(
    startISO ? 1 : 0,
    Math.min(total, rawDayNumber(startISO, offset, now)),
  );
// Centro do período, arredondado para o dia seguinte: 4 de 7, 8 de 14, 11 de 21.
export const midDay = (total) => Math.ceil((total + 1) / 2);

export const slotComplete = (rec, plan, slot) => {
  const areas = areasForSlot(plan, slot);
  return (
    !!rec &&
    !!rec.saved &&
    areas.length > 0 &&
    areas.every((a) => rec.done && rec.done[a.id])
  );
};
export const dayComplete = (dayRec, plan) =>
  slotsFor(plan.moment).every((sl) =>
    slotComplete(dayRec && dayRec[sl], plan, sl),
  );
export const hasAnyData = (dayRec) =>
  !!dayRec &&
  Object.values(dayRec).some(
    (r) =>
      r &&
      Object.values(r.values || {}).some(
        (v) => v !== undefined && v !== "skip",
      ),
  );

// Dias anteriores ao atual com pendências (momentos não concluídos)
export const pendingDays = (records, plan, uptoDay) => {
  const out = [];
  for (let d = 1; d < uptoDay; d += 1)
    if (!dayComplete(records[d], plan)) out.push(d);
  return out;
};
export const filledDays = (records, plan, total) => {
  let n = 0;
  for (let d = 1; d <= total; d += 1) if (hasAnyData(records[d])) n += 1;
  return n;
};

// Qual mensagem de cuidado mostrar (sem culpa e sem prometer resultado clínico)
export const careStage = ({ started, day, total, finished, pending }) => {
  if (!started) return "invite";
  if (finished) return "complete";
  if (day === midDay(total)) return pending.length ? "midPending" : "midOk";
  if (day === 1) return "start";
  return "ongoing";
};

const LV = ["none", "mild", "moderate", "strong", "veryStrong"];
// Série do diário para um sintoma: maior intensidade registrada em cada dia; null = sem dado (lacuna, nunca zero)
export const mySeries = (records, symId, total) =>
  Array.from({ length: total }, (_, i) => {
    const rec = records[i + 1];
    if (!rec) return null;
    const vals = Object.values(rec)
      .map((r) => r && r.values && r.values[symId])
      .filter((v) => v !== undefined && v !== "skip");
    return vals.length ? Math.max(...vals.map((v) => LV.indexOf(v))) : null;
  });

// Correlação de Pearson só com pares suficientes e variância não nula
export const MIN_PAIRS = 7;
export const pearson = (xs, ys) => {
  const pairs = xs
    .map((x, i) => [x, ys[i]])
    .filter(([x, y]) => x != null && y != null);
  const n = pairs.length;
  if (n < MIN_PAIRS) return { ok: false, n, reason: "pairs" };
  const mx = pairs.reduce((a, p) => a + p[0], 0) / n;
  const my = pairs.reduce((a, p) => a + p[1], 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  pairs.forEach(([x, y]) => {
    sxy += (x - mx) * (y - my);
    sxx += (x - mx) ** 2;
    syy += (y - my) ** 2;
  });
  if (sxx === 0 || syy === 0) return { ok: false, n, reason: "variance" };
  return { ok: true, n, r: sxy / Math.sqrt(sxx * syy) };
};

// EXEMPLO SINTÉTICO (14 dias). Não vem de pessoa real nem de Patch real. Usado só para mostrar como os gráficos ficam.
export const EXAMPLE = {
  days: 14,
  diary: {
    hotFlashes: [1, 2, 2, 3, 2, 3, 4, 3, null, 2, 3, 2, 2, 1],
    nightSweats: [1, 1, 2, 3, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1],
    sleep: [2, 2, 3, 3, 3, 4, 4, 3, 3, 2, 3, 2, 2, 2],
    mood: [1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1],
    memory: [1, 1, 2, 2, 2, 3, 3, 2, 2, 2, 1, 1, 1, 1],
  },
  patch: {
    sleepHours: [
      6.8, 6.2, 6.0, 5.4, 5.9, 5.2, 4.9, 5.5, 5.6, 6.1, 5.8, 6.3, 6.5, 6.9,
    ],
    heartRate: [62, 63, 64, 66, 65, 67, 69, 66, 66, 64, 65, 63, 62, 61],
    breathRate: [14, 14, 15, 16, 15, 16, 17, 16, 15, 15, 15, 14, 14, 14],
    conductance: [
      2.1, 2.3, 2.6, 3.0, 2.8, 3.2, 3.6, 3.1, 3.0, 2.7, 2.9, 2.5, 2.3, 2.1,
    ],
    skinTemp: [
      0.1, 0.2, 0.3, 0.5, 0.3, 0.6, 0.8, 0.5, 0.5, 0.3, 0.4, 0.2, 0.1, 0.0,
    ],
    hotFlashCandidates: [2, 1, 3, 3, 4, 4, 5, 3, 5, 2, 4, 4, 2, 1],
  },
};

// Leitura simulada do Patch (sincronização na demonstração). Mesmos 4 parâmetros do dispositivo.
export const demoPatchReading = () => ({
  sleep: { hours: 5.7, movement: "restless", wakes: 3 }, // sono estimado pelo movimento
  heartRate: { avg: 64, min: 53 }, // bpm
  conductance: { mean: 2.9, peaks: 4 }, // µS
  breathing: { avg: 15, max: 18 }, // respirações por minuto (rpm), média da noite
  skinTemp: { delta: 0.4 }, // °C acima da sua média
  candidates: 3, // possíveis fogachos (condutância + temperatura juntas)
});
