import React, { useState } from "react";
import { View, Text, Pressable, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Page, FadeIn, Card, Segmented, H1, Section } from "../components/ui";
import { useTheme, makeStyles } from "../theme";
import { LANGUAGES } from "../i18n/translations";
import { useI18n } from "../i18n";
import { useCheckIn } from "../state/checkin";
import { patch } from "../data/mock";
import { persona } from "../data/persona";

const useS = makeStyles((c) => ({
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
    marginBottom: 6,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.violet,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  name: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5, color: c.ink },
  sub: { fontSize: 14, color: c.muted, marginTop: 2 },
  group: {
    backgroundColor: c.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: c.line,
    overflow: "hidden",
    ...c.shadow,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  divider: { borderTopWidth: 1, borderTopColor: c.line },
  label: { fontSize: 14, color: c.muted, width: 112 },
  value: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: c.ink,
    textAlign: "right",
  },
  rowTitle: { fontSize: 16, fontWeight: "600", color: c.ink },
  rowSub: { fontSize: 13, color: c.muted, marginTop: 1 },
  tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  tagText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  link: { paddingVertical: 14, paddingHorizontal: 16 },
  linkText: { fontSize: 15, fontWeight: "600", color: c.accent },
  danger: { fontSize: 15, fontWeight: "600", color: "#D64B6A" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 16 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: c.mist,
  },
  chipOn: { backgroundColor: c.primary },
  chipText: { fontSize: 14, fontWeight: "600", color: c.accent },
  pad: { padding: 16 },
  note: { fontSize: 13, color: c.accent, textAlign: "center", marginTop: 12 },
}));

const Row = ({ label, value, first }) => {
  const s = useS();
  return (
    <View style={[s.row, !first && s.divider]}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
};

// "Você": informações da pessoa logada (persona vinda da pesquisa), Patch, privacidade e preferências.
export default function AccountScreen() {
  const { t, lang, setLang } = useI18n();
  const { colors: c, mode, setMode } = useTheme();
  const s = useS();
  const nav = useNavigation();
  const k = useCheckIn();
  const [share, setShare] = useState({
    doctor: true,
    research: false,
    close: false,
  });
  const [sim, setSim] = useState(false);
  const tagColor = { mild: c.royal, moderate: c.violet, severe: c.primary };
  const usual = Object.entries(persona.usual);

  return (
    <Page>
      <FadeIn>
        <View style={s.head}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{persona.name[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{persona.name}</Text>
            <Text style={s.sub}>
              {persona.ageBand} · {t("region.southeast")}
            </Text>
          </View>
        </View>
      </FadeIn>

      <FadeIn delay={60}>
        <Section>{t("acc.profile")}</Section>
        <View style={s.group}>
          <Row first label={t("acc.age")} value={persona.ageBand} />
          <Row label={t("acc.region")} value={t(`region.${persona.region}`)} />
          <Row label={t("acc.status")} value={t(`status.${persona.status}`)} />
          <Row label={t("acc.bother")} value={t(`sym.${persona.bother}`)} />
          <Row
            label={t("acc.priority")}
            value={persona.priorities.map((p) => t(`prio.${p}`)).join("\n")}
          />
        </View>
      </FadeIn>

      <FadeIn delay={110}>
        <Section>{t("acc.usual")}</Section>
        <View style={s.group}>
          {usual.map(([id, u], i) => (
            <View key={id} style={[s.row, i > 0 && s.divider]}>
              <Text style={[s.rowTitle, { flex: 1 }]}>{t(`sym.${id}`)}</Text>
              <View style={[s.tag, { backgroundColor: tagColor[u.level] }]}>
                <Text style={s.tagText}>{t(`level.${u.level}`)}</Text>
              </View>
            </View>
          ))}
        </View>
      </FadeIn>

      <FadeIn delay={150}>
        <Section>{t("acc.patch")}</Section>
        <View style={s.group}>
          <Row first label={t("patch.battery")} value={`${patch.battery}%`} />
          <Row label={t("acc.where")} value={t(`place.${k.placement}`)} />
          <Pressable
            onPress={() => {
              k.replayOnboarding();
              nav.navigate("CheckIn");
            }}
            style={[s.link, s.divider]}
          >
            <Text style={s.linkText}>{t("acc.change")}</Text>
          </Pressable>
        </View>
      </FadeIn>

      <FadeIn delay={190}>
        <Section>{t("acc.privacy")}</Section>
        <View style={s.group}>
          {[
            ["doctor", "acc.shareDoctor", "acc.shareDoctorSub"],
            ["research", "acc.shareResearch", "acc.shareResearchSub"],
            ["close", "acc.shareClose", null],
          ].map(([key, title, sub], i) => (
            <View key={key} style={[s.row, i > 0 && s.divider]}>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>{t(title)}</Text>
                {!!sub && <Text style={s.rowSub}>{t(sub)}</Text>}
              </View>
              <Switch
                value={share[key]}
                onValueChange={(v) => setShare({ ...share, [key]: v })}
                trackColor={{ true: c.violet, false: c.line }}
                thumbColor="#fff"
                activeThumbColor="#fff"
              />
            </View>
          ))}
        </View>
      </FadeIn>

      <FadeIn delay={230}>
        <Section>{t("acc.prefs")}</Section>
        <View style={s.group}>
          <View style={s.pad}>
            <Text style={[s.rowSub, { marginBottom: 10 }]}>
              {t("acc.appearance")}
            </Text>
            <Segmented
              levels={[
                { id: "light", label: t("th.light") },
                { id: "dark", label: t("th.dark") },
              ]}
              value={mode}
              onChange={setMode}
              label={t("acc.appearance")}
            />
          </View>
          <View style={s.divider}>
            <Text style={[s.rowSub, { paddingHorizontal: 16, paddingTop: 14 }]}>
              {t("acc.language")}
            </Text>
            <View style={s.chips}>
              {LANGUAGES.map((l) => (
                <Pressable
                  key={l.code}
                  onPress={() => setLang(l.code)}
                  style={[s.chip, lang === l.code && s.chipOn]}
                >
                  <Text
                    style={[s.chipText, lang === l.code && { color: "#fff" }]}
                  >
                    {l.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Pressable onPress={() => setSim(true)} style={[s.link, s.divider]}>
            <Text style={s.linkText}>{t("acc.signout")}</Text>
          </Pressable>
          <Pressable onPress={() => setSim(true)} style={[s.link, s.divider]}>
            <Text style={s.danger}>{t("acc.delete")}</Text>
          </Pressable>
        </View>
        {sim && <Text style={s.note}>{t("acc.sim")}</Text>}
      </FadeIn>
    </Page>
  );
}
