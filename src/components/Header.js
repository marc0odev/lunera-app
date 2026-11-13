import React, { useState } from "react";
import { View, Text, Pressable, Image, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, makeStyles, MAX_W } from "../theme";
import { LANGUAGES } from "../i18n/translations";
import { useI18n } from "../i18n";
import { useScrollY, useEdge } from "./scroll";
import { Portal } from "./ui";

const useS = makeStyles((c) => ({
  header: {
    backgroundColor: c.bg,
    paddingBottom: 10,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  row: {
    width: "100%",
    maxWidth: MAX_W,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { height: 40, width: 105 },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  line: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: c.line,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.line,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.line,
  },
  pillText: { fontSize: 13, fontWeight: "700", color: c.ink },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: c.scrim,
    zIndex: 60,
  },
  menu: {
    position: "absolute",
    right: 16,
    width: 200,
    backgroundColor: c.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.line,
    overflow: "hidden",
    ...c.shadow,
    shadowOpacity: 0.25,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 12,
  },
  divider: { borderTopWidth: 1, borderTopColor: c.line },
  code: { width: 26, fontSize: 13, fontWeight: "700", color: c.muted },
  name: { flex: 1, fontSize: 15, color: c.ink },
}));

// Seletor de idioma: pílula discreta + menu
export function LanguageSelector() {
  const { lang, setLang, t } = useI18n();
  const { colors } = useTheme();
  const s = useS();
  const edge = useEdge();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={s.pill}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`${t("lang.title")}: ${lang}`}
      >
        <Ionicons name="globe-outline" size={16} color={colors.accent} />
        <Text style={s.pillText}>{lang}</Text>
        <Ionicons name="chevron-down" size={13} color={colors.muted} />
      </Pressable>
      <Portal visible={open}>
        <Pressable style={s.backdrop} onPress={() => setOpen(false)}>
          <View style={[s.menu, { top: edge.top + 58 }]}>
            {LANGUAGES.map((l, i) => (
              <Pressable
                key={l.code}
                onPress={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: l.code === lang }}
                style={[s.item, i > 0 && s.divider]}
              >
                <Text
                  style={[s.code, l.code === lang && { color: colors.accent }]}
                >
                  {l.code}
                </Text>
                <Text style={s.name}>{l.name}</Text>
                {l.code === lang && (
                  <Ionicons name="checkmark" size={18} color={colors.accent} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Portal>
    </>
  );
}

export default function Header() {
  const edge = useEdge();
  const { colors, mode, toggle } = useTheme();
  const { t } = useI18n();
  const s = useS();
  const y = useScrollY();
  const dark = mode === "dark";
  return (
    <View style={[s.header, { paddingTop: edge.top + 10 }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          s.line,
          {
            opacity: y.interpolate({
              inputRange: [0, 28],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
          },
        ]}
      />
      <View style={s.row}>
        {/* Logo oficial. No modo escuro vira a versão clara para ler sobre o fundo escuro. */}
        <Image
          source={require("../../assets/logo.png")}
          style={[s.logo, dark && { tintColor: "#FFFFFF", opacity: 0.92 }]}
          resizeMode="contain"
          accessibilityLabel="Lunera Healthcare"
        />
        <View style={s.right}>
          <Pressable
            onPress={toggle}
            style={s.circle}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={dark ? t("th.toLight") : t("th.toDark")}
          >
            <Ionicons
              name={dark ? "sunny-outline" : "moon-outline"}
              size={18}
              color={colors.accent}
            />
          </Pressable>
          <LanguageSelector />
        </View>
      </View>
    </View>
  );
}
