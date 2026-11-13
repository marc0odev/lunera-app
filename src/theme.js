import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { StyleSheet, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cores extraídas da logo oficial (veja docs/BRAND_COLORS.md) + tokens semânticos para claro e escuro.
const brand = {
  indigo: "#3F399B",
  slate: "#495596",
  violet: "#7D5ADF",
  orchid: "#9C66D3",
  periwinkle: "#8299F8",
  royal: "#526CD7",
  sky: "#4794CE",
  aqua: "#6AC8E6",
  lavender: "#DBC0F7",
  white: "#FFFFFF",
};
const light = {
  ...brand,
  mode: "light",
  bg: "#FAF9FF",
  card: "#FFFFFF",
  mist: "#F1EEFC",
  line: "#E6E1F5",
  ink: "#1E1B52",
  muted: "#495596",
  accent: "#6446C8",
  primary: "#3F399B",
  lvl: {
    mild: "#526CD7",
    moderate: "#7D5ADF",
    strong: "#3F399B",
    veryStrong: "#241E6B",
  },
  lvlFg: {
    mild: "#FFFFFF",
    moderate: "#FFFFFF",
    strong: "#FFFFFF",
    veryStrong: "#FFFFFF",
  },
  bodyTop: "#E6D3FA",
  bodyBottom: "#9DB0F6",
  hair: "rgba(63,57,155,0.5)",
  bodyLine: "rgba(255,255,255,0.9)",
  scrim: "rgba(30,27,82,0.35)",
  shadow: {
    shadowColor: "#3F399B",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
};
const dark = {
  ...brand,
  mode: "dark",
  bg: "#0B0A2B",
  card: "#14123F",
  mist: "#1E1B66",
  line: "#2C2882",
  ink: "#F1EEFF",
  muted: "#B3AFDD",
  accent: "#C3B5FF",
  primary: "#6A5CE8",
  lvl: {
    mild: "#4A5FC4",
    moderate: "#6E55D6",
    strong: "#8E78F0",
    veryStrong: "#B7A6FF",
  },
  lvlFg: {
    mild: "#FFFFFF",
    moderate: "#FFFFFF",
    strong: "#14123F",
    veryStrong: "#14123F",
  },
  bodyTop: "#8C7BE0",
  bodyBottom: "#3F399B",
  hair: "rgba(219,192,247,0.45)",
  bodyLine: "rgba(255,255,255,0.32)",
  scrim: "rgba(0,0,0,0.6)",
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 0,
  },
};

export const MAX_W = 560; // largura máxima do conteúdo (no computador fica centralizado)

const Ctx = createContext({
  mode: "light",
  colors: light,
  setMode: () => {},
  toggle: () => {},
});
const KEY = "lunera.theme";

// Modo claro/escuro escolhido pela pessoa. Sem escolha salva, segue o sistema.
export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [choice, setChoice] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => (v === "light" || v === "dark") && setChoice(v))
      .catch(() => {});
  }, []);
  const mode = choice || (system === "dark" ? "dark" : "light");
  const value = useMemo(() => {
    const setMode = (m) => {
      setChoice(m);
      AsyncStorage.setItem(KEY, m).catch(() => {});
    };
    return {
      mode,
      colors: mode === "dark" ? dark : light,
      setMode,
      toggle: () => setMode(mode === "dark" ? "light" : "dark"),
    };
  }, [mode]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);

// makeStyles((c) => ({ ... })) devolve um hook que recria os estilos quando o tema muda.
export const makeStyles = (fn) => () => {
  const { colors } = useTheme();
  return useMemo(() => StyleSheet.create(fn(colors)), [colors]);
};
