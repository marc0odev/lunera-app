import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Page, MetricCard, text } from "../components/ui";
import Sparkline from "../components/Sparkline";
import { colors, muted, shadow } from "../theme";
import { useI18n } from "../i18n";
import { patch, skinTemp, hrv, sleep } from "../data/mock";

const Stat = ({ label, value }) => (
  <View style={{ flex: 1 }}>
    <Text style={s.statValue}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

// Card principal: foto oficial da caixa do Patch (assets/box-open.jpg).
function PatchCard() {
  const { t, num } = useI18n();
  return (
    <View style={s.hero}>
      <ImageBackground
        source={require("../../assets/box-open.jpg")}
        style={s.heroImg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(15,18,56,0)", "rgba(15,18,56,0.3)", colors.hero]}
          locations={[0.35, 0.75, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.heroTop}>
          <View style={s.live}>
            <View style={s.dot} />
            <Text style={s.liveText}>{t("patch.connected")}</Text>
          </View>
          <Text style={s.sync}>
            {t("patch.synced", { n: patch.syncedMinAgo })}
          </Text>
        </View>
      </ImageBackground>
      <View style={s.heroBody}>
        <Text style={s.heroTitle}>{t("patch.title")}</Text>
        <Text style={s.heroSub}>{t("patch.subtitle")}</Text>
        <View style={s.stats}>
          <Stat label={t("patch.battery")} value={`${num(patch.battery)}%`} />
          <View style={s.sep} />
          <Stat label={t("patch.contact")} value={t("patch.contactGood")} />
          <View style={s.sep} />
          <Stat label={t("patch.worn")} value={patch.wornToday} />
        </View>
      </View>
    </View>
  );
}

function TemperatureCard() {
  const { t, num, locale } = useI18n();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString(locale, { weekday: "narrow" });
  });
  return (
    <MetricCard
      title={t("temp.title")}
      status={t("temp.status")}
      icon={
        <MaterialCommunityIcons
          name="thermometer"
          size={20}
          color={colors.violetDeep}
        />
      }
    >
      <View style={s.valueRow}>
        <Text style={s.value}>{num(skinTemp.today, 1, true)}</Text>
        <Text style={s.unit}>°C</Text>
      </View>
      <Text style={s.caption}>{t("temp.caption")}</Text>
      <View style={{ marginTop: 14 }}>
        <Sparkline data={skinTemp.series} />
        <View style={s.days}>
          {days.map((d, i) => (
            <Text
              key={i}
              style={[
                s.day,
                i === 6 && { color: colors.violetDeep, fontWeight: "700" },
              ]}
            >
              {d}
            </Text>
          ))}
        </View>
      </View>
    </MetricCard>
  );
}

function HRVCard() {
  const { t, num } = useI18n();
  const [lo, hi] = hrv.range;
  const pct = ((hrv.value - lo) / (hi - lo)) * 100;
  return (
    <MetricCard
      title={t("hrv.title")}
      status={t("hrv.status")}
      icon={
        <MaterialCommunityIcons
          name="heart-pulse"
          size={20}
          color={colors.violetDeep}
        />
      }
    >
      <View style={s.valueRow}>
        <Text style={s.value}>{num(hrv.value)}</Text>
        <Text style={s.unit}>ms</Text>
      </View>
      <Text style={s.caption}>{t("hrv.caption", { avg: num(hrv.avg7) })}</Text>
      <View style={{ marginTop: 18 }}>
        <View style={s.track}>
          <LinearGradient
            colors={[colors.mist, colors.periwinkle, colors.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[s.marker, { left: `${pct}%` }]} />
        </View>
        <View style={s.rangeLabels}>
          <Text style={s.day}>{lo} ms</Text>
          <Text style={s.day}>{t("hrv.range")}</Text>
          <Text style={s.day}>{hi} ms</Text>
        </View>
      </View>
    </MetricCard>
  );
}

function SleepCard() {
  const { t, num } = useI18n();
  const fmt = (m) => `${Math.floor(m / 60)}h ${m % 60}m`;
  return (
    <MetricCard
      title={t("sleep.title")}
      status={t("sleep.status")}
      icon={
        <MaterialCommunityIcons
          name="moon-waning-crescent"
          size={20}
          color={colors.violetDeep}
        />
      }
    >
      <View style={s.valueRow}>
        <Text style={s.value}>{sleep.total}</Text>
      </View>
      <Text style={s.caption}>
        {t("sleep.caption", { n: num(sleep.awakenings) })}
      </Text>
      <View style={s.stageBar}>
        {sleep.stages.map((st) => (
          <View
            key={st.id}
            style={{ flex: st.min, backgroundColor: st.color }}
          />
        ))}
      </View>
      <View style={s.legend}>
        {sleep.stages.map((st) => (
          <View key={st.id} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: st.color }]} />
            <Text style={s.day}>
              {t(`stage.${st.id}`)} {fmt(st.min)}
            </Text>
          </View>
        ))}
      </View>
    </MetricCard>
  );
}

export default function DashboardScreen() {
  const { t } = useI18n();
  return (
    <Page>
      <Text style={text.h1}>{t("dash.today")}</Text>
      <PatchCard />
      <Text style={text.section}>{t("dash.signals")}</Text>
      <TemperatureCard />
      <HRVCard />
      <SleepCard />
    </Page>
  );
}

const s = StyleSheet.create({
  hero: {
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: colors.hero,
    ...shadow,
    shadowOpacity: 0.22,
  },
  heroImg: { width: "100%", aspectRatio: 1.5, padding: 16, overflow: "hidden" },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  live: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 999,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.aqua },
  liveText: { color: colors.white, fontSize: 12, fontWeight: "600" },
  sync: {
    color: colors.white,
    fontSize: 12,
    backgroundColor: "rgba(15,18,56,0.62)",
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 999,
    overflow: "hidden",
  },
  heroBody: { paddingHorizontal: 22, paddingBottom: 22, marginTop: -6 },
  heroTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  heroSub: { color: "#C9C5F0", fontSize: 14, marginTop: 4 },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.28)",
  },
  sep: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.28)",
    marginHorizontal: 14,
  },
  statValue: { color: colors.white, fontSize: 18, fontWeight: "700" },
  statLabel: { color: "#C9C5F0", fontSize: 12, marginTop: 2 },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 16,
    gap: 4,
  },
  value: {
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: -1,
    color: colors.ink,
  },
  unit: { fontSize: 16, fontWeight: "600", color: muted },
  caption: { fontSize: 13, color: muted, marginTop: 2 },
  days: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginTop: 4,
  },
  day: { fontSize: 12, color: muted },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.mist },
  marker: {
    position: "absolute",
    top: -5,
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 9,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: colors.indigo,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  stageBar: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    gap: 2,
    marginTop: 18,
  },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
});
