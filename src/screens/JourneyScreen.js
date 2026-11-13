import React, { useState } from "react";
import { View, Text, Pressable, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Page, FadeIn, Ring, Card, H1, Section } from "../components/ui";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useCheckIn } from "../state/checkin";
import { night } from "../data/mock";
import { persona, past, survey, journey } from "../data/persona";

const MOON = [
  "moon-new",
  "moon-waxing-crescent",
  "moon-first-quarter",
  "moon-waxing-gibbous",
  "moon-full",
];

const useS = makeStyles((c) => ({
  ringRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 14,
  },
  big: { fontSize: 36, fontWeight: "700", color: c.ink, letterSpacing: -1 },
  of: { fontSize: 13, color: c.muted, marginTop: -3 },
  dayText: {
    fontSize: 20,
    fontWeight: "700",
    color: c.ink,
    letterSpacing: -0.3,
  },
  caption: { fontSize: 15, lineHeight: 22, color: c.muted, marginTop: 4 },
  week: { flexDirection: "row" },
  day: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderRadius: 14,
  },
  dayToday: { backgroundColor: c.mist },
  dayLabel: { fontSize: 12, color: c.muted, textTransform: "uppercase" },
  symDot: { width: 10, height: 10, borderRadius: 5 },
  legend: { fontSize: 12, color: c.muted, marginTop: 12, lineHeight: 18 },
  insight: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: c.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  iTitle: { fontSize: 16, fontWeight: "600", color: c.ink },
  iDesc: { fontSize: 14, lineHeight: 21, color: c.muted, marginTop: 3 },
  small: { fontSize: 12, color: c.muted, marginTop: 2 },
  barRow: { marginTop: 12 },
  barHead: { flexDirection: "row", justifyContent: "space-between" },
  barLabel: { fontSize: 14, color: c.ink, fontWeight: "500" },
  barPct: { fontSize: 14, color: c.accent, fontWeight: "700" },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: c.mist,
    marginTop: 6,
    overflow: "hidden",
  },
  share: {
    minHeight: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  shareText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "center",
  },
  remind: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
}));

function Reminder({ icon, title, sub, value, onChange }) {
  const s = useS();
  const { colors: c } = useTheme();
  return (
    <Card style={s.remind}>
      <View style={s.iIcon}>
        <Ionicons name={icon} size={22} color={c.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.iTitle}>{title}</Text>
        <Text style={s.iDesc}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: c.violet, false: c.line }}
        thumbColor="#fff"
        activeThumbColor="#fff"
      />
    </Card>
  );
}

export default function JourneyScreen() {
  const { t, num, locale } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const k = useCheckIn();
  const [shared, setShared] = useState(false);
  const symColor = [c.line, c.royal, c.violet, c.primary]; // nenhum, leve, moderado, intenso

  // últimos 6 dias (ilustrativos, coerentes com a pesquisa da persona) + hoje (vem do check-in real)
  const week = [...past, { sleep: night.sleepQuality, sym: k.overall }].map(
    (d, i, a) => {
      const date = new Date();
      date.setDate(date.getDate() - (a.length - 1 - i));
      return {
        ...d,
        label: date.toLocaleDateString(locale, { weekday: "narrow" }),
        today: i === a.length - 1,
      };
    },
  );
  const insights = [
    ["thermometer", "ins1"],
    ["moon-waning-crescent", "ins2"],
    ["brain", "ins3"],
  ];

  return (
    <Page>
      <FadeIn>
        <H1>{t("jr.title")}</H1>
        <View style={s.ringRow}>
          <Ring
            id="journeyRing"
            size={132}
            stroke={12}
            progress={journey.day / journey.total}
          >
            <Text style={s.big}>{num(journey.day)}</Text>
            <Text style={s.of}>/ {num(journey.total)}</Text>
          </Ring>
          <View style={{ flex: 1 }}>
            <Text style={s.dayText}>
              {t("jr.day", { n: num(journey.day), total: num(journey.total) })}
            </Text>
            <Text style={s.caption}>{t("jr.caption")}</Text>
          </View>
        </View>
      </FadeIn>

      <FadeIn delay={80}>
        <Section>{t("jr.week")}</Section>
        <Card>
          <View style={s.week}>
            {week.map((d, i) => (
              <View key={i} style={[s.day, d.today && s.dayToday]}>
                <Text
                  style={[
                    s.dayLabel,
                    d.today && { color: c.accent, fontWeight: "700" },
                  ]}
                >
                  {d.label}
                </Text>
                <MaterialCommunityIcons
                  name={MOON[d.sleep]}
                  size={24}
                  color={c.violet}
                />
                <View
                  style={[s.symDot, { backgroundColor: symColor[d.sym] }]}
                />
              </View>
            ))}
          </View>
          <Text style={s.legend}>{t("jr.legend")}</Text>
        </Card>
      </FadeIn>

      <FadeIn delay={140}>
        <Section>{t("jr.insights")}</Section>
        {insights.map(([icon, key]) => (
          <Card key={key} style={s.insight}>
            <View style={s.iIcon}>
              <MaterialCommunityIcons name={icon} size={22} color={c.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.iTitle}>{t(`${key}.t`)}</Text>
              <Text style={s.iDesc}>{t(`${key}.d`)}</Text>
            </View>
          </Card>
        ))}
        <Text style={s.small}>{t("jr.sim")}</Text>
      </FadeIn>

      {/* Dados reais da pesquisa: o que mulheres de 40+ perceberam nos últimos 6 meses */}
      <FadeIn delay={180}>
        <Section>{t("jr.survey.title")}</Section>
        <Card>
          <Text style={s.iTitle}>
            {t("jr.survey.sub", { n: num(survey.n) })}
          </Text>
          <Text style={s.iDesc}>{t("jr.survey.note")}</Text>
          {survey.top.slice(0, 6).map((r) => (
            <View key={r.id} style={s.barRow}>
              <View style={s.barHead}>
                <Text style={s.barLabel}>{t(`sym.${r.id}`)}</Text>
                <Text style={s.barPct}>{num(r.pct)}%</Text>
              </View>
              <View style={s.barTrack}>
                <LinearGradient
                  colors={[c.periwinkle, c.violet]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: `${r.pct}%`, height: 8, borderRadius: 4 }}
                />
              </View>
            </View>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={220}>
        <Card style={{ marginTop: 18 }}>
          <Text style={s.iTitle}>{t("jr.report.title")}</Text>
          <Text style={[s.iDesc, { marginBottom: 14 }]}>
            {t("jr.report.desc")}
          </Text>
          <Pressable
            onPress={() => setShared(true)}
            style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
          >
            <LinearGradient
              colors={shared ? [c.royal, c.sky] : [c.primary, c.violet]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.share}
            >
              <Ionicons
                name={shared ? "checkmark-circle" : "paper-plane-outline"}
                size={20}
                color="#fff"
              />
              <Text style={s.shareText}>
                {shared ? t("jr.report.ready") : t("jr.report.share")}
              </Text>
            </LinearGradient>
          </Pressable>
        </Card>
        <Reminder
          icon="sunny-outline"
          title={t("jr.remind.morning")}
          sub={t("jr.remind.morningSub")}
          value={k.prefs.morning}
          onChange={(v) => k.setReminder("morning", v)}
        />
        <Reminder
          icon="moon-outline"
          title={t("jr.remind.evening")}
          sub={t("jr.remind.eveningSub")}
          value={k.prefs.evening}
          onChange={(v) => k.setReminder("evening", v)}
        />
      </FadeIn>
    </Page>
  );
}
