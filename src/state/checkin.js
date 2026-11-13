import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AREAS, SYMPTOMS } from "../data/mock";

const Ctx = createContext(null);
const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({
  values: Object.fromEntries(SYMPTOMS.map((s) => [s.id, "none"])), // dia tranquilo = zero toques
  count: 0,
  done: {},
  saved: false,
});
const LEVELS = ["none", "mild", "moderate", "severe"];
const initialPeriod = () =>
  new Date().getHours() < 15 ? "morning" : "evening"; // manhã (ao acordar) ou noite (antes de dormir)
const store = (k, v) =>
  AsyncStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)).catch(
    () => {},
  );

// Estado compartilhado: check-in de hoje (manhã e noite), local do Patch, onboarding e lembretes. Tudo salvo no aparelho.
export function CheckInProvider({ children }) {
  const [period, setPeriod] = useState(initialPeriod);
  const [days, setDays] = useState({ morning: blank(), evening: blank() });
  const [placement, setPlacementState] = useState("upperChest");
  const [onboarded, setOnboarded] = useState(null); // null enquanto carrega
  const [prefs, setPrefsState] = useState({ morning: true, evening: true });

  useEffect(() => {
    ["morning", "evening"].forEach((p) =>
      AsyncStorage.getItem(`lunera.checkin.${today()}.${p}`)
        .then(
          (v) =>
            v &&
            setDays((d) => ({ ...d, [p]: { ...blank(), ...JSON.parse(v) } })),
        )
        .catch(() => {}),
    );
    AsyncStorage.getItem("lunera.placement")
      .then((v) => v && setPlacementState(v))
      .catch(() => {});
    AsyncStorage.getItem("lunera.onboarded")
      .then((v) => setOnboarded(v === "1"))
      .catch(() => setOnboarded(true));
    AsyncStorage.getItem("lunera.reminders")
      .then((v) => v && setPrefsState(JSON.parse(v)))
      .catch(() => {});
  }, []);

  const value = useMemo(() => {
    const cur = days[period];
    const update = (next) => {
      setDays((d) => ({ ...d, [period]: next }));
      store(`lunera.checkin.${today()}.${period}`, next);
    };
    const level = (d) =>
      Math.max(
        0,
        ...Object.entries(d.values).map(([id, v]) =>
          id === "period" ? 0 : LEVELS.indexOf(v),
        ),
      );
    return {
      ...cur,
      period,
      setPeriod,
      doneCount: AREAS.filter((a) => cur.done[a.id]).length,
      total: AREAS.length,
      overall: Math.max(level(days.morning), level(days.evening)), // maior intensidade de hoje (0 a 3)
      placement,
      onboarded,
      prefs,
      setLevel: (id, l) =>
        update({ ...cur, values: { ...cur.values, [id]: l }, saved: false }),
      setCount: (n) =>
        update({ ...cur, count: Math.max(0, Math.min(20, n)), saved: false }),
      markDone: (a) =>
        update({ ...cur, done: { ...cur.done, [a]: true }, saved: false }),
      save: () => update({ ...cur, saved: true }),
      setPlacement: (p) => {
        setPlacementState(p);
        store("lunera.placement", p);
      },
      finishOnboarding: () => {
        setOnboarded(true);
        store("lunera.onboarded", "1");
      },
      replayOnboarding: () => {
        setOnboarded(false);
        store("lunera.onboarded", "0");
      },
      setReminder: (k, v) => {
        const n = { ...prefs, [k]: v };
        setPrefsState(n);
        store("lunera.reminders", n);
      },
    };
  }, [days, period, placement, onboarded, prefs]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useCheckIn = () => useContext(Ctx);
