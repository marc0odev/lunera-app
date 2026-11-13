import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LANGUAGES, translations } from "./translations";

export const DEFAULT_LANG = "PT"; // troque por 'EN' para o App abrir em inglês
const KEY = "lunera.lang";
const Ctx = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);
  useEffect(() => {
    const q =
      typeof window !== "undefined" && window.location && window.location.search
        ? new URLSearchParams(window.location.search).get("lang")
        : null;
    if (q && translations[q.toUpperCase()]) {
      setLangState(q.toUpperCase());
      return;
    }
    AsyncStorage.getItem(KEY)
      .then((v) => v && translations[v] && setLangState(v))
      .catch(() => {});
  }, []);
  const setLang = useCallback((code) => {
    setLangState(code);
    AsyncStorage.setItem(KEY, code).catch(() => {});
  }, []);
  const value = useMemo(() => {
    const locale = LANGUAGES.find((l) => l.code === lang).locale;
    const comma = lang !== "EN";
    // t('chave', { n: 3 }); se faltar no idioma, usa o português
    const t = (key, vars = {}) =>
      (translations[lang][key] ?? translations.PT[key] ?? key).replace(
        /\{\{(\w+)\}\}/g,
        (_, k) => String(vars[k] ?? ""),
      );
    const num = (n, digits = 0, signed = false) => {
      const s = Math.abs(n).toFixed(digits);
      return (
        (n < 0 ? "−" : signed ? "+" : "") + (comma ? s.replace(".", ",") : s)
      );
    };
    return { lang, setLang, locale, t, num };
  }, [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
