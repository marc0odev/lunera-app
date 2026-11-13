import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PortalProvider } from "./components/ui";
import { useEdge } from "./components/scroll";
import { useTheme, makeStyles, MAX_W } from "./theme";
import { useI18n } from "./i18n";
import { useApp } from "./state/app";
import HomeScreen from "./screens/HomeScreen";
import DiaryScreen from "./screens/DiaryScreen";
import EvolutionScreen from "./screens/EvolutionScreen";
import ConsultScreen from "./screens/ConsultScreen";
import { Opening, Start, Welcome, Bye } from "./screens/Flow";
import {
  MyAppMenu,
  RepSection,
  SymSection,
  TimesSection,
} from "./screens/MyApp";

const useS = makeStyles((c) => ({
  bar: {
    backgroundColor: c.card,
    borderTopWidth: 1,
    borderTopColor: c.line,
    alignItems: "center",
  },
  barIn: {
    flexDirection: "row",
    width: "100%",
    maxWidth: MAX_W,
    paddingTop: 7,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 2,
    minHeight: 50,
  },
  label: {
    fontSize: 10.5,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 12.5,
  },
  shortcut: {
    position: "absolute",
    right: 0,
    top: "36%",
    backgroundColor: c.primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    paddingVertical: 11,
    paddingLeft: 7,
    paddingRight: 5,
    alignItems: "center",
    gap: 2,
    ...c.shadow,
    shadowOpacity: 0.3,
  },
  shortcutT: { color: "#fff", fontSize: 11, fontWeight: "800" },
}));
function TabIcon({ on, name, color }) {
  const k = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (on) {
      k.setValue(0.7);
      Animated.spring(k, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    }
  }, [on]);
  return (
    <Animated.View style={{ transform: [{ scale: k }] }}>
      <Ionicons name={name} size={22} color={color} />
    </Animated.View>
  );
}
const TABS = {
  Home: HomeScreen,
  Diary: DiaryScreen,
  Evolution: EvolutionScreen,
  Consult: ConsultScreen,
};
const OVERLAYS = {
  opening: Opening,
  bye: Bye,
  start: Start,
  welcome: Welcome,
  myapp: MyAppMenu,
  rep: RepSection,
  sym: SymSection,
  times: TimesSection,
};
const ITEMS = [
  ["Home", "nav.home", "home"],
  ["Diary", "nav.diary", "journal"],
  ["Evolution", "nav.evolution", "stats-chart"],
  ["Consult", "nav.consult", "medkit"],
  ["Settings", "nav.settings", "settings"],
];

// O App inteiro em um componente. onOpen3D abre a experiência 3D (caixa e patch em camadas) pelo atalho lateral.
export default function Shell({ onOpen3D }) {
  const a = useApp();
  const { colors: c } = useTheme();
  const { t } = useI18n();
  const narrow = useWindowDimensions().width < 380; // rótulos da barra cabem em telas estreitas
  const s = useS();
  const edge = useEdge();
  if (!a.ready) return <View style={{ flex: 1, backgroundColor: c.bg }} />;
  const o = a.overlay;
  const Screen = (o && OVERLAYS[o]) || TABS[a.tabName];
  const bar = o !== "opening" && o !== "bye"; // a abertura e a despedida ocultam a barra
  const active = ["myapp", "rep", "sym", "times"].includes(o)
    ? "Settings"
    : o
      ? null
      : a.tabName;
  return (
    <PortalProvider>
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <View style={{ flex: 1 }} key={o || a.tabName}>
          <Screen />
        </View>
        {bar && (
          <View
            style={[s.bar, { paddingBottom: edge.bottom + 6 }]}
            accessibilityRole="tablist"
          >
            <View style={s.barIn}>
              {ITEMS.map(([id, label, icon]) => {
                const on = active === id,
                  col = on ? c.accent : c.muted;
                return (
                  <Pressable
                    key={id}
                    onPress={() =>
                      id === "Settings" ? a.go("myapp") : a.tab(id)
                    }
                    style={s.item}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={t(label)}
                  >
                    <TabIcon
                      on={on}
                      name={on ? icon : `${icon}-outline`}
                      color={col}
                    />
                    <Text
                      style={[
                        s.label,
                        { color: col },
                        narrow && { fontSize: 9, letterSpacing: -0.2 },
                      ]}
                      numberOfLines={2}
                    >
                      {t(label)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
        {bar && !!onOpen3D && (
          <Pressable
            onPress={onOpen3D}
            style={s.shortcut}
            accessibilityRole="button"
            accessibilityLabel={t("nav.3d")}
          >
            <Ionicons name="cube-outline" size={17} color="#fff" />
            <Text style={s.shortcutT}>3D</Text>
          </Pressable>
        )}
      </View>
    </PortalProvider>
  );
}
