import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Page,
  FadeIn,
  Ring,
  Card,
  H1,
  Sub,
  DateText,
  Section,
} from "../components/ui";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useCheckIn } from "../state/checkin";
import { patch, night } from "../data/mock";
import { persona } from "../data/persona";

const MOON = [
  "moon-new",
  "moon-waxing-crescent",
  "moon-first-quarter",
  "moon-waxing-gibbous",
  "moon-full",
];

const useS = makeStyles((c) => ({
  stage: { alignItems: "center", marginTop: 4 },
  box: { width: "92%", aspectRatio: 1599 / 1570, maxHeight: 330 },
  info: { alignItems: "center", marginTop: 2 },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: c.mist,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 999,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: c.aqua },
  pillText: { fontSize: 12, fontWeight: "600", color: c.accent },
  title: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5, color: c.ink },
  subtitle: { fontSize: 14, color: c.muted, marginTop: 4, textAlign: "center" },
  stats: {
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: c.line,
  },
  stat: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  statValue: { fontSize: 18, fontWeight: "700", color: c.ink },
  statLabel: {
    fontSize: 12,
    color: c.muted,
    marginTop: 2,
    textAlign: "center",
  },
  sep: { width: 1, backgroundColor: c.line },
  placed: { color: c.accent, fontSize: 13, fontWeight: "600", marginTop: 14 },
  cta: { flexDirection: "row", alignItems: "center", gap: 18, marginBottom: 0 },
  ringNum: {
    fontSize: 28,
    fontWeight: "700",
    color: c.ink,
    letterSpacing: -0.5,
  },
  ringOf: { fontSize: 12, color: c.muted, marginTop: -2 },
  ctaTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: c.ink,
    letterSpacing: -0.3,
  },
  ctaSub: { fontSize: 14, color: c.muted, marginTop: 3 },
  ctaBtn: { marginTop: 12, alignSelf: "flex-start" },
  ctaGrad: { paddingVertical: 11, paddingHorizontal: 20, borderRadius: 14 },
  ctaBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  tileHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: c.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  tileTitle: { fontSize: 16, fontWeight: "600", color: c.ink },
  tileCap: { fontSize: 12, color: c.muted, marginTop: 1 },
  tileValue: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: c.ink,
  },
  tileMsg: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: c.accent,
    marginTop: 14,
  },
  moonRow: { flexDirection: "row", gap: 14, marginTop: 14 },
  band: { height: 10, borderRadius: 5, marginTop: 18, backgroundColor: c.mist },
  usual: {
    position: "absolute",
    left: "50%",
    top: -4,
    width: 2,
    height: 18,
    backgroundColor: "#fff",
    opacity: 0.9,
  },
  marker: {
    position: "absolute",
    top: -5,
    width: 20,
    height: 20,
    marginLeft: -10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: c.primary,
  },
  pips: { flexDirection: "row", gap: 8, marginTop: 16 },
  pip: { flex: 1, height: 8, borderRadius: 4, backgroundColor: c.mist },
}));

// A foto da caixa tem fundo transparente: ela repousa direto sobre o fundo da tela, fixa (sem parallax).
function PatchHero() {
  const { t, num } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const { placement } = useCheckIn();
  const stat = (label, value) => (
    <View style={s.stat}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
  return (
    <View>
      <View style={s.stage}>
        <Image
          source={require("../../assets/box-open.png")}
          style={s.box}
          resizeMode="contain"
          accessibilityLabel={t("patch.title")}
        />
      </View>
      <View style={s.info}>
        <View style={s.pills}>
          <View style={s.pill}>
            <View style={s.dot} />
            <Text style={s.pillText}>{t("patch.connected")}</Text>
          </View>
          <View style={s.pill}>
            <Text style={s.pillText}>
              {t("patch.synced", { n: num(patch.syncedMinAgo) })}
            </Text>
          </View>
        </View>
        <Text style={s.title}>{t("patch.title")}</Text>
        <Text style={s.subtitle}>{t("patch.subtitle")}</Text>
        <View style={s.stats}>
          {stat(t("patch.battery"), `${num(patch.battery)}%`)}
          <View style={s.sep} />
          {stat(t("patch.contact"), t("patch.contactGood"))}
          <View style={s.sep} />
          {stat(t("patch.worn"), patch.wornToday)}
        </View>
        <Text style={s.placed}>
          {t("ps.placed", { where: t(`place.${placement}`) })}
        </Text>
      </View>
    </View>
  );
}

function CheckInCta() {
  const { t, num } = useI18n();
  const s = useS();
  const { colors: c } = useTheme();
  const nav = useNavigation();
  const { doneCount, total, period } = useCheckIn();
  const all = doneCount === total;
  return (
    <Card style={s.cta}>
      <Ring id="ctaRing" progress={doneCount / total}>
        <Text style={s.ringNum}>{num(doneCount)}</Text>
        <Text style={s.ringOf}>/ {num(total)}</Text>
      </Ring>
      <View style={{ flex: 1 }}>
        <Text style={s.ctaTitle}>
          {t(period === "morning" ? "cta.titleMorning" : "cta.titleEvening")}
        </Text>
        <Text style={s.ctaSub}>
          {all
            ? t("cta.done")
            : t("cta.progress", { done: num(doneCount), total: num(total) })}
        </Text>
        {!all && (
          <Pressable
            onPress={() => nav.navigate("CheckIn")}
            style={({ pressed }) => [s.ctaBtn, { opacity: pressed ? 0.88 : 1 }]}
          >
            <LinearGradient
              colors={[c.primary, c.violet]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.ctaGrad}
            >
              <Text style={s.ctaBtnText}>
                {doneCount ? t("cta.continue") : t("cta.start")}
              </Text>
            </LinearGradient>
          </Pressable>
        )}
      </View>
    </Card>
  );
}

function Tile({ icon, title, value, msg, caption, children }) {
  const s = useS();
  return (
    <Card>
      <View style={s.tileHead}>
        <View style={s.tileIcon}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={s.tileTitle}>{title}</Text>
          <Text style={s.tileCap}>{caption}</Text>
        </View>
        <Text style={s.tileValue}>{value}</Text>
      </View>
      <Text style={s.tileMsg}>{msg}</Text>
      {children}
    </Card>
  );
}

function Night() {
  const { t, num } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const [lo, hi] = night.hrvRange;
  const lit = Math.max(1, Math.round(((night.hrv - lo) / (hi - lo)) * 5));
  const warmPos = Math.min(95, Math.max(5, 50 + night.warmth * 60)); // 50% = habitual
  return (
    <>
      <FadeIn delay={40}>
        <Tile
          icon={
            <MaterialCommunityIcons
              name={MOON[night.sleepQuality]}
              size={24}
              color={c.accent}
            />
          }
          title={t("sleep.title")}
          value={night.sleepTotal}
          msg={t("sleep.msg")}
          caption={t("sleep.wakes", { n: num(night.awakenings) })}
        >
          <View style={s.moonRow}>
            {MOON.map((m, i) => (
              <MaterialCommunityIcons
                key={m}
                name={m}
                size={22}
                color={i === night.sleepQuality ? c.violet : c.line}
              />
            ))}
          </View>
        </Tile>
      </FadeIn>
      <FadeIn delay={100}>
        <Tile
          icon={
            <MaterialCommunityIcons
              name="thermometer"
              size={24}
              color={c.accent}
            />
          }
          title={t("warm.title")}
          value={`${num(night.warmth, 1, true)} °C`}
          msg={t("warm.msg")}
          caption={t("warm.caption")}
        >
          <View style={s.band}>
            <LinearGradient
              colors={[c.aqua, c.lavender, c.violet]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 5,
              }}
            />
            <View style={s.usual} />
            <View style={[s.marker, { left: `${warmPos}%` }]} />
          </View>
        </Tile>
      </FadeIn>
      <FadeIn delay={160}>
        <Tile
          icon={
            <MaterialCommunityIcons
              name="heart-pulse"
              size={24}
              color={c.accent}
            />
          }
          title={t("rec.title")}
          value={`${num(night.hrv)} ms`}
          msg={t("rec.msg")}
          caption={t("rec.caption")}
        >
          <View style={s.pips}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={[s.pip, i < lit && { backgroundColor: c.violet }]}
              />
            ))}
          </View>
        </Tile>
      </FadeIn>
    </>
  );
}

export default function TodayScreen() {
  const { t, locale } = useI18n();
  const h = new Date().getHours();
  const greet =
    h < 12 ? "greet.morning" : h < 18 ? "greet.afternoon" : "greet.evening";
  const date = new Date().toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <Page>
      <FadeIn>
        <DateText>{date}</DateText>
        <H1>
          {t(greet)}, {persona.name}
        </H1>
        <Sub>{t("today.sub")}</Sub>
      </FadeIn>
      <FadeIn delay={60}>
        <PatchHero />
      </FadeIn>
      <FadeIn delay={120} style={{ marginTop: 22 }}>
        <CheckInCta />
      </FadeIn>
      <FadeIn delay={170}>
        <Section>{t("night.title")}</Section>
      </FadeIn>
      <Night />
    </Page>
  );
}
