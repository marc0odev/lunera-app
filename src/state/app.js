import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { symptomById } from "../data/symptoms";

// Estado único do Lunera App.
const KEY = "lunera.v3";
const iso = (d) => d.toISOString().slice(0, 10);
const diffDays = (a, b) => Math.floor((new Date(b) - new Date(a)) / 86400000);
const defaults = () => ({
  profile: {
    name: "",
    age: "",
    skin: 2,
    hair: 1,
    hairLength: "medium",
    eyes: 1,
    glasses: false,
    tone: 1,
    body: "a",
  }, // nome: fonte única, sem nome fixo de demonstração
  plan: {
    days: 14,
    symptoms: ["sleep", "hotFlashes", "memory"],
    custom: "",
    mode: "both",
    times: {
      wake: "07:00",
      bed: "22:00",
      morning: "08:00",
      afternoon: "15:00",
      night: "21:00",
    },
    assign: {},
    channel: "calendar",
    startDate: iso(new Date()),
    version: 1,
  },
  records: {}, // chave `${dia}|${momento}`
  consult: {
    priorities: [],
    question: "",
    notes: "",
    includeIntimate: false,
    includeFreeText: false,
  },
  patch: { synced: false, at: null, placement: "upperChest" },
  flags: { placed: false, shared: null },
  demoOffset: 0,
});
export const slotsOf = (plan) =>
  plan.mode === "both" ? ["wake", "bed"] : [plan.mode];
// No modo dividido cada sintoma pertence a um momento (padrão: sono ao levantar, o resto antes de dormir)
export const symptomsOf = (plan, slot) =>
  plan.mode !== "both"
    ? plan.symptoms
    : plan.symptoms.filter(
        (id) => (plan.assign[id] || (id === "sleep" ? "wake" : "bed")) === slot,
      );
export const midDay = (days) => Math.ceil((days + 1) / 2); // 7 -> 4, 14 -> 8, 21 -> 11
const answered = (rec, ids) =>
  !!rec &&
  ids.every((id) => rec.scores[id] !== undefined && rec.scores[id] !== "");
const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [S, setS] = useState(defaults);
  const [ready, setReady] = useState(false);
  const [slot, setSlot] = useState(null);
  const [overlay, setOverlay] = useState(null); // opening, start, myapp, rep, sym, times, welcome, bye
  const [tabName, setTabName] = useState("Home");
  const guard = useRef(null); // telas com alterações não salvas registram aqui um aviso

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => {
        if (v) {
          const d = defaults(),
            p = JSON.parse(v);
          setS({
            ...d,
            ...p,
            profile: { ...d.profile, ...p.profile },
            plan: { ...d.plan, ...p.plan },
            consult: { ...d.consult, ...p.consult },
            patch: { ...d.patch, ...p.patch },
            flags: { ...d.flags, ...p.flags },
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        setReady(true);
        setOverlay("opening");
      }); // abertura a cada entrada, com opção de pular
  }, []);

  const value = useMemo(() => {
    const { plan, records } = S;
    const rawDay = 1 + diffDays(plan.startDate, iso(new Date())) + S.demoOffset; // o dia avança pelo calendário, nunca ao salvar
    const day = Math.max(1, Math.min(plan.days, rawDay));
    const finished = rawDay > plan.days;
    const slots = slotsOf(plan);
    const curSlot =
      slot && slots.includes(slot)
        ? slot
        : slots.length === 2
          ? new Date().getHours() < 15
            ? "wake"
            : "bed"
          : slots[0];
    const key = (d, s) => `${d}|${s}`;
    const okDay = (d) =>
      slots.every((sl) => {
        const r = records[key(d, sl)];
        return answered(r, r ? r.ids : symptomsOf(plan, sl));
      });
    const pending = []; // momentos em aberto nos dias anteriores (avaliados com o plano usado em cada registro)
    for (let d = 1; d <= (finished ? plan.days : day - 1); d++)
      slots.forEach((s) => {
        const r = records[key(d, s)];
        if (!answered(r, r ? r.ids : symptomsOf(plan, s)))
          pending.push({ day: d, slot: s });
      });
    const nRecords = Object.keys(records).length;
    // dias com dados que permitem análise (pelo menos uma intensidade informada)
    const analyzable = new Set(
      Object.entries(records)
        .filter(([, r]) =>
          Object.values(r.scores).some((v) => typeof v === "number"),
        )
        .map(([k]) => +k.split("|")[0]),
    ).size;
    const phase =
      finished || (day === plan.days && okDay(day))
        ? "end"
        : day === midDay(plan.days)
          ? "mid"
          : nRecords === 0
            ? "start"
            : "normal";
    const save = (next) => {
      setS(next);
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
    };
    return {
      ...S,
      ready,
      day,
      finished,
      slots,
      slot: curSlot,
      setSlot,
      pending,
      nRecords,
      analyzable,
      phase,
      overlay,
      tabName,
      guard,
      name: S.profile.name.trim(),
      doneDays: [...Array(plan.days).keys()].filter((i) => okDay(i + 1)).length,
      dayState: (d) =>
        d > day && !finished
          ? "future"
          : okDay(d)
            ? "done"
            : d === day && !finished
              ? "today"
              : "pending",
      go: (o, force) => {
        if (guard.current && !force) return guard.current();
        setOverlay(o);
      },
      tab: (n, force) => {
        if (guard.current && !force) return guard.current();
        setOverlay(null);
        setTabName(n);
      },
      recordOf: (d, s) => records[key(d, s)],
      setProfile: (p) => save({ ...S, profile: { ...S.profile, ...p } }),
      // mudar o plano cria nova versão; registros antigos guardam os próprios sintomas e não ganham campos novos
      setPlan: (p) =>
        save({ ...S, plan: { ...S.plan, ...p, version: S.plan.version + 1 } }),
      saveRecord: (d, s, rec) =>
        save({
          ...S,
          records: {
            ...records,
            [key(d, s)]: {
              ...rec,
              ids: symptomsOf(plan, s),
              planVersion: plan.version,
              at: Date.now(),
            },
          },
        }),
      setConsult: (c) => save({ ...S, consult: { ...S.consult, ...c } }),
      setPatch: (p) => save({ ...S, patch: { ...S.patch, ...p } }),
      setFlags: (f) => save({ ...S, flags: { ...S.flags, ...f } }),
      nextDay: () => save({ ...S, demoOffset: S.demoOffset + 1 }), // só para demonstração
      resetPlan: () =>
        save({
          ...S,
          records: {},
          demoOffset: 0,
          plan: {
            ...S.plan,
            startDate: iso(new Date()),
            version: S.plan.version + 1,
          },
        }),
      resetAll: () => save(defaults()),
    };
  }, [S, ready, slot, overlay, tabName]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useApp = () => useContext(Ctx);
export { symptomById };
