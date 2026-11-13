import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Page, FadeIn, Card } from "../components/ui";
import { Btn } from "../components/forms";
import SyncButton from "../components/SyncButton";
import { CareMessage } from "./Flow";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useApp } from "../state/app";

const useS = makeStyles((c) => ({
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  hello: { flex: 1, fontSize: 15, color: c.muted },
  gear: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.line,
  },
  gearT: { fontSize: 13, fontWeight: "700", color: c.accent },
  h1: {
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: -1.2,
    color: c.ink,
    marginTop: 6,
  },
  sub: { fontSize: 18, lineHeight: 26, color: c.muted, marginTop: 4 },
  inv: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: c.ink,
    lineHeight: 26,
  },
  h2: { fontSize: 19, fontWeight: "700", color: c.ink, letterSpacing: -0.3 },
  muted: { fontSize: 14, color: c.muted, marginTop: 4, lineHeight: 20 },
  bar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: c.mist,
    marginTop: 12,
    overflow: "hidden",
  },
  fill: { height: 8, borderRadius: 4, backgroundColor: c.violet },
  stats: { flexDirection: "row", gap: 16, marginTop: 10, flexWrap: "wrap" },
  face: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: c.mist,
  },
  box: {
    width: "100%",
    aspectRatio: 1599 / 1570,
    maxHeight: 260,
    alignSelf: "center",
  },
  section: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: c.ink,
    marginTop: 20,
    marginBottom: 12,
  },
}));

// Início: "Climatério" em destaque, convite ao registro, progresso, patch (caixa aberta) e informação que acolhe
// Rosto humano nas telas que conversam com a usuária. Provisório para a apresentação:
// depois, a foto acompanhará a aparência escolhida em "Minha representação" (o desenho fica na configuração e no corpo).
const COMPANION = require("../../assets/people/companion.jpg");

export default function HomeScreen() {
  const { t, locale, num } = useI18n();
  const { colors: c } = useTheme();
  const a = useApp();
  const s = useS();
  const h = new Date().getHours();
  const greet = t(
    h < 12 ? "greet.morning" : h < 18 ? "greet.afternoon" : "greet.evening",
  );
  const days = a.plan.days,
    started = a.nRecords > 0,
    end = a.phase === "end";
  const sync = a.patch.synced
    ? t("patch.syncedAt", {
        time: new Date(a.patch.at).toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })
    : t("patch.notSynced");
  return (
    <Page>
      <FadeIn>
        <View style={s.top}>
          <Text style={s.hello}>{a.name ? `${greet}, ${a.name}` : greet}</Text>
          <Pressable
            onPress={() => a.go("myapp")}
            style={s.gear}
            accessibilityRole="button"
            accessibilityLabel={t("home.settings")}
          >
            <Ionicons name="settings-outline" size={18} color={c.accent} />
            <Text style={s.gearT}>{t("home.settings")}</Text>
          </Pressable>
        </View>
        <Text style={s.h1}>{t("home.title")}</Text>
        <Text style={s.sub}>{t("home.tag")}</Text>
      </FadeIn>
      <FadeIn delay={70} style={{ marginTop: 20 }}>
        <Card>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <Image
              source={COMPANION}
              style={s.face}
              accessibilityIgnoresInvertColors
            />
            <Text style={s.inv}>{t("home.invite")}</Text>
          </View>
          {end ? (
            <View style={{ gap: 10 }}>
              <Btn
                title={t("home.review")}
                onPress={() => a.tab("Evolution")}
              />
              <Btn
                title={t("home.prepare")}
                variant="ghost"
                onPress={() => a.tab("Consult")}
              />
            </View>
          ) : (
            <Btn
              title={t(started ? "home.continue" : "home.begin")}
              onPress={() => (started ? a.tab("Diary") : a.go("start"))}
            />
          )}
        </Card>
        <CareMessage />
      </FadeIn>
      <FadeIn delay={130} style={{ marginTop: 16 }}>
        <Card>
          <Text style={s.muted}>{t("prog.sub")}</Text>
          <Text style={s.h2}>
            {t("prog.title", { d: num(a.day), n: num(days) })}
          </Text>
          <View style={s.bar} accessibilityRole="progressbar">
            <View
              style={[
                s.fill,
                { width: `${Math.round((a.day / days) * 100)}%` },
              ]}
            />
          </View>
          <View style={s.stats}>
            <Text style={s.muted}>
              {t("prog.recorded", { n: num(a.analyzable) })}
            </Text>
            <Text style={s.muted}>
              {t("prog.pending", { n: num(a.pending.length) })}
            </Text>
          </View>
        </Card>
      </FadeIn>
      <FadeIn delay={190}>
        <Card>
          <Image
            source={require("../../assets/box-open.png")}
            style={s.box}
            resizeMode="contain"
            accessibilityLabel={t("patch.title")}
          />
          <Text style={s.h2}>{t("patch.title")}</Text>
          <Text style={s.muted}>{sync}</Text>
          <Text style={[s.muted, { fontSize: 12.5 }]}>
            {t("patch.simNote")}
          </Text>
          <View style={{ marginTop: 14 }}>
            <SyncButton variant="ghost" />
          </View>
        </Card>
      </FadeIn>
      <FadeIn delay={240}>
        <Text style={s.section}>{t("info.title")}</Text>
        {["i1", "i2", "i3"].map((k) => (
          <Card key={k}>
            <Text style={s.h2}>{t(`info.${k}.t`)}</Text>
            <Text style={s.muted}>{t(`info.${k}.d`)}</Text>
          </Card>
        ))}
      </FadeIn>
    </Page>
  );
}
