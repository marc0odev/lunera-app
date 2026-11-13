import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, PrimaryButton } from "./ui";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useCheckIn } from "../state/checkin";

const useS = makeStyles((c) => ({
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  title: { fontSize: 18, fontWeight: "700", color: c.ink, letterSpacing: -0.3 },
  sub: { fontSize: 13.5, lineHeight: 20, color: c.muted, marginTop: 2 },
  demo: {
    fontSize: 12,
    color: c.accent,
    fontWeight: "600",
    marginTop: 10,
    lineHeight: 17,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  // flexBasis + flexGrow : duas larguras de 48,5% + o espaço (gap) passavam de 100% e cada card caía numa linha só.
  tile: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "44%",
    minWidth: 120,
    backgroundColor: c.mist,
    borderRadius: 16,
    padding: 12,
  },
  tIcon: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  tLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: c.muted,
    flex: 1,
    minWidth: 0,
  },
  tValue: {
    fontSize: 19,
    fontWeight: "700",
    color: c.ink,
    marginTop: 6,
    letterSpacing: -0.4,
  },
  tNote: { fontSize: 12.5, lineHeight: 17, color: c.muted, marginTop: 2 },
  cand: { marginTop: 12, fontSize: 13.5, lineHeight: 20, color: c.ink },
  busy: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 54,
  },
}));

const hm = (h) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}h ${String(mm).padStart(2, "0")}m`;
};

// Sincronização com o Patch. Na demonstração a leitura é SIMULADA e isso aparece na tela.
export default function PatchSync({ compact = false }) {
  const { t, num, locale } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const k = useCheckIn();
  const [busy, setBusy] = useState(false);
  const { last, reading: r } = k.sync;
  const run = () => {
    setBusy(true);
    setTimeout(() => {
      k.syncPatch();
      setBusy(false);
    }, 1600);
  };
  const when = last
    ? new Date(last).toLocaleString(locale, {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const tiles = r
    ? [
        [
          "moon-waning-crescent",
          t("px.sleep"),
          hm(r.sleep.hours),
          t("px.sleepNote", {
            n: num(r.sleep.wakes),
            how: t(`move.${r.sleep.movement}`),
          }),
        ],
        [
          "heart-pulse",
          t("px.hr"),
          `${num(r.heartRate.avg)} bpm`,
          t("px.hrNote", { n: num(r.heartRate.min) }),
        ],
        [
          "weather-windy",
          t("px.breath"),
          `${num(r.breathing ? r.breathing.avg : 15)} rpm`,
          t("px.breathNote", { n: num(r.breathing ? r.breathing.max : 18) }),
        ],
        [
          "flash-outline",
          t("px.eda"),
          `${num(r.conductance.mean, 1)} µS`,
          t("px.edaNote", { n: num(r.conductance.peaks) }),
        ],
        [
          "thermometer",
          t("px.temp"),
          `${num(r.skinTemp.delta, 1, true)} °C`,
          t("px.tempNote"),
        ],
      ]
    : [];
  return (
    <Card>
      <View style={s.head}>
        <MaterialCommunityIcons name="sync" size={26} color={c.accent} />
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{t("px.title")}</Text>
          <Text style={s.sub}>
            {last ? t("px.last", { when }) : t("px.never")}
          </Text>
        </View>
      </View>
      {busy ? (
        <View style={s.busy} accessibilityLiveRegion="polite">
          <ActivityIndicator color={c.accent} />
          <Text style={s.sub}>{t("px.syncing")}</Text>
        </View>
      ) : (
        <PrimaryButton
          icon="sync"
          label={t(last ? "px.syncAgain" : "px.sync")}
          onPress={run}
        />
      )}
      <Text style={s.demo}>{t("px.demo")}</Text>
      {!compact && !!r && (
        <>
          <View style={s.grid}>
            {tiles.map(([icon, label, value, note]) => (
              <View key={icon} style={s.tile}>
                <View style={s.tIcon}>
                  <MaterialCommunityIcons
                    name={icon}
                    size={18}
                    color={c.accent}
                    style={{ marginTop: 1 }}
                  />
                  <Text style={s.tLabel}>{label}</Text>
                </View>
                <Text style={s.tValue}>{value}</Text>
                <Text style={s.tNote}>{note}</Text>
              </View>
            ))}
          </View>
          <Text style={s.cand}>{t("px.cand", { n: num(r.candidates) })}</Text>
        </>
      )}
    </Card>
  );
}
