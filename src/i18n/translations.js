// Idiomas do Lunera App. Principal: português do Brasil. Textos em um arquivo por idioma (pt.json, en.json...).
// Traduções feitas com apoio de IA.
import PT from "./pt.json";
import EN from "./en.json";
import ES from "./es.json";
import FR from "./fr.json";
import DE from "./de.json";
export const LANGUAGES = [
  { code: "PT", name: "Português", locale: "pt-BR" },
  { code: "EN", name: "English", locale: "en-US" },
  { code: "ES", name: "Español", locale: "es-ES" },
  { code: "FR", name: "Français", locale: "fr-CH" },
  { code: "DE", name: "Deutsch", locale: "de-CH" },
];
export const translations = { PT, EN, ES, FR, DE };
