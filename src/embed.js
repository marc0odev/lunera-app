import { Platform } from "react-native";

const search =
  Platform.OS === "web" && typeof window !== "undefined" && window.location
    ? window.location.search || ""
    : "";
export const isEmbed = /[?&]embed=1/.test(search);
export const skipIntro = /[?&]skipIntro=1/.test(search);
export const canEmbed = Platform.OS === "web" && typeof window !== "undefined";
export const embedUrl = (skip = true) => {
  if (!canEmbed) return null;
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?embed=1${skip ? "&skipIntro=1" : ""}`;
};
