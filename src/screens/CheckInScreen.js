import React, { useRef, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Page,
  FadeIn,
  Segmented,
  Counter,
  Sheet,
  H1,
  Sub,
  Section,
  ND,
} from "../components/ui";
import Body from "../components/Body";
import { useTheme, makeStyles, MAX_W } from "../theme";
import { useI18n } from "../i18n";
import { useCheckIn } from "../state/checkin";
import { AREAS, SYMPTOMS, PLACEMENTS, night } from "../data/mock";
import { persona } from "../data/persona";

const LEVELS = ["none", "mild", "moderate", "severe"];

const useS = makeStyles((c) => ({
  toggleRow: { alignItems: "center", marginBottom: 14 },
  toggle: {
    flexDirection: "row",
    backgroundColor: c.mist,
    borderRadius: 999,
    padding: 3,
  },
  tBtn: { paddingVertical: 8, paddingHorizontal: 22, borderRadius: 999 },
  tOn: { backgroundColor: c.card, ...c.shadow, shadowOpacity: 0.14 },
  tText: { fontSize: 14, color: c.muted, fontWeight: "500" },
  link: { alignSelf: "center", marginTop: 14, paddingVertical: 6 },
  linkText: { color: c.accent, fontSize: 14, fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  chip: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.line,
  },
  chipOn: { backgroundColor: c.primary, borderColor: c.primary },
  chipText: { fontSize: 14, fontWeight: "600", color: c.accent },
  list: {
    backgroundColor: c.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: c.line,
    overflow: "hidden",
    ...c.shadow,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  divider: { borderTopWidth: 1, borderTopColor: c.line },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: c.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontSize: 16, fontWeight: "600", color: c.ink },
  rowSub: { fontSize: 13, color: c.muted, marginTop: 1 },
  sym: { paddingVertical: 14, borderTopWidth: 1, borderTopColor: c.line },
  symName: { fontSize: 17, fontWeight: "600", color: c.ink },
  symHint: { fontSize: 13, color: c.muted, marginTop: 2 },
  symUsual: {
    fontSize: 12,
    color: c.accent,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 12,
  },
  sheetBtn: {
    marginTop: 14,
    height: 54,
    borderRadius: 16,
    backgroundColor: c.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  noticed: {
    fontSize: 13,
    fontWeight: "600",
    color: c.muted,
    marginTop: 6,
    marginBottom: 4,
  },
  noticeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: c.bg,
    borderTopWidth: 1,
    borderTopColor: c.line,
  },
  footerIn: { width: "100%", maxWidth: MAX_W },
  note: { fontSize: 13, color: c.muted, textAlign: "center", marginBottom: 10 },
  save: {
    minHeight: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  cont: {
    marginTop: 22,
    minHeight: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
}));

// "Gira" o corpo: encolhe na horizontal, troca a vista e volta (parece uma rotação)
function useFlip() {
  const [side, setSide] = useState("front");
  const flip = useRef(new Animated.Value(1)).current;
  const turn = (next) => {
    if (next === side) return;
    Animated.timing(flip, {
      toValue: 0.02,
      duration: 190,
      useNativeDriver: ND,
    }).start(() => {
      setSide(next);
      Animated.timing(flip, {
        toValue: 1,
        duration: 240,
        useNativeDriver: ND,
      }).start();
    });
  };
  return { side, flip, turn };
}

function SideToggle({ side, turn }) {
  const { t } = useI18n();
  const s = useS();
  return (
    <View style={s.toggleRow}>
      <View style={s.toggle}>
        {["front", "back"].map((k) => (
          <Pressable
            key={k}
            onPress={() => turn(k)}
            style={[s.tBtn, side === k && s.tOn]}
          >
            <Text
              style={[
                s.tText,
                side === k && { color: s.symName.color, fontWeight: "700" },
              ]}
            >
              {t(`ci.${k}`)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// Onboarding (só na primeira vez): a pessoa escolhe onde colocou o Patch. Mostra as 3 posições possíveis no corpo.
function Onboarding() {
  const { t } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const k = useCheckIn();
  const { side, flip, turn } = useFlip();
  const [pick, setPick] = useState(k.placement);
  const choose = (id) => {
    setPick(id);
    turn(PLACEMENTS.find((p) => p.id === id).side);
  };
  const spots = PLACEMENTS.filter((p) => p.side === side).map((p) => ({
    ...p,
    pickMode: true,
  }));
  return (
    <Page>
      <FadeIn>
        <H1>{t("ob.title")}</H1>
        <Sub>{t("ob.lead")}</Sub>
      </FadeIn>
      <FadeIn delay={70}>
        <SideToggle side={side} turn={turn} />
        <Body
          side={side}
          flip={flip}
          spots={spots}
          selectedSpot={pick}
          onSpot={choose}
          hint={(id) => t(`place.${id}`)}
          label={() => ""}
        />
      </FadeIn>
      <FadeIn delay={130}>
        <Section>{t("acc.where")}</Section>
        <View style={s.chips}>
          {PLACEMENTS.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => choose(p.id)}
              style={[s.chip, pick === p.id && s.chipOn]}
            >
              <Text style={[s.chipText, pick === p.id && { color: "#fff" }]}>
                {t(`place.${p.id}`)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={() => {
            k.setPlacement(pick);
            k.finishOnboarding();
          }}
        >
          <LinearGradient
            colors={[c.primary, c.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.cont}
          >
            <Text style={s.btnText}>{t("ob.continue")}</Text>
          </LinearGradient>
        </Pressable>
      </FadeIn>
    </Page>
  );
}

function CheckIn() {
  const { t, num } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const k = useCheckIn();
  const { side, flip, turn } = useFlip();
  const [sheet, setSheet] = useState(null); // id da área, 'patch' ou null
  const placement = PLACEMENTS.find((p) => p.id === k.placement);
  const levels = LEVELS.map((id) => ({ id, label: t(`level.${id}`) }));
  const yesno = [
    { id: "none", label: t("yn.no") },
    { id: "yes", label: t("yn.yes") },
  ];
  const area = AREAS.find((a) => a.id === sheet);
  const symptoms = SYMPTOMS.filter((x) => x.area === sheet);
  const spots = placement.side === side ? [placement] : [];

  const footer = (
    <View style={s.footer}>
      <View style={s.footerIn}>
        <Text style={s.note}>
          {k.saved
            ? t("log.savedNote")
            : t("cta.progress", {
                done: num(k.doneCount),
                total: num(k.total),
              })}
        </Text>
        <Pressable
          onPress={k.save}
          accessibilityRole="button"
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <LinearGradient
            colors={k.saved ? [c.royal, c.sky] : [c.primary, c.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.save}
          >
            {k.saved && (
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            )}
            <Text style={s.btnText}>
              {k.saved ? t("log.saved") : t("log.save")}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Page footer={footer}>
      <FadeIn>
        <View style={s.toggleRow}>
          <View style={s.toggle}>
            {["morning", "evening"].map((p) => (
              <Pressable
                key={p}
                onPress={() => k.setPeriod(p)}
                style={[s.tBtn, k.period === p && s.tOn]}
              >
                <Text
                  style={[
                    s.tText,
                    k.period === p && {
                      color: s.symName.color,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {t(`per.${p}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <H1>{t("ci.title")}</H1>
        <Sub>
          {t(k.period === "morning" ? "ci.leadMorning" : "ci.leadEvening")}
        </Sub>
      </FadeIn>

      <FadeIn delay={70}>
        <SideToggle side={side} turn={turn} />
        <Body
          side={side}
          flip={flip}
          areas={AREAS}
          done={k.done}
          onArea={setSheet}
          spots={spots}
          onSpot={() => setSheet("patch")}
          hint={() => t("ci.patchHint")}
          label={(id) => t(`area.${id}`)}
        />
        <Pressable onPress={k.replayOnboarding} style={s.link}>
          <Text style={s.linkText}>{t("ci.change")}</Text>
        </Pressable>
      </FadeIn>

      <FadeIn delay={130}>
        <Section>{t("ci.areas")}</Section>
        <View style={s.list}>
          {AREAS.map((a, i) => (
            <Pressable
              key={a.id}
              onPress={() => setSheet(a.id)}
              style={[s.row, i > 0 && s.divider]}
            >
              <View
                style={[
                  s.rowIcon,
                  k.done[a.id] && { backgroundColor: c.violet },
                ]}
              >
                {k.done[a.id] ? (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                ) : (
                  <MaterialCommunityIcons
                    name={a.icon}
                    size={20}
                    color={c.accent}
                  />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>{t(`area.${a.id}`)}</Text>
                <Text style={s.rowSub}>{t(`area.${a.id}.sub`)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.muted} />
            </Pressable>
          ))}
        </View>
      </FadeIn>

      {/* Folha de uma área: só os sintomas daquela região, um toque por sintoma */}
      <Sheet
        visible={!!area}
        onClose={() => setSheet(null)}
        title={area ? t(`area.${area.id}`) : ""}
        subtitle={area ? t(`area.${area.id}.sub`) : ""}
        footer={
          <Pressable
            onPress={() => {
              k.markDone(sheet);
              setSheet(null);
            }}
            style={s.sheetBtn}
          >
            <Text style={s.btnText}>{t("ci.done")}</Text>
          </Pressable>
        }
      >
        {symptoms.map((sym) => {
          const usual = persona.usual[sym.id]; // o que ela relatou na pesquisa
          return (
            <View key={sym.id} style={s.sym}>
              <Text style={s.symName}>{t(`sym.${sym.id}`)}</Text>
              <Text style={s.symHint}>{t(`sym.${sym.id}.hint`)}</Text>
              {usual ? (
                <Text style={s.symUsual}>
                  {t("sheet.usual", { level: t(`level.${usual.level}`) })}
                </Text>
              ) : (
                <View style={{ height: 12 }} />
              )}
              <Segmented
                levels={sym.type === "yesno" ? yesno : levels}
                value={k.values[sym.id]}
                onChange={(l) => k.setLevel(sym.id, l)}
                label={t(`sym.${sym.id}`)}
              />
              {sym.counter && k.values[sym.id] !== "none" && (
                <Counter
                  value={k.count}
                  onChange={k.setCount}
                  label={t("count.label")}
                />
              )}
            </View>
          );
        })}
      </Sheet>

      {/* Folha do Patch: o que ele percebeu na noite, em palavras simples */}
      <Sheet
        visible={sheet === "patch"}
        onClose={() => setSheet(null)}
        title={t("ps.title")}
        subtitle={t("ps.placed", { where: t(`place.${k.placement}`) })}
        footer={
          <Pressable onPress={() => setSheet(null)} style={s.sheetBtn}>
            <Text style={s.btnText}>{t("ps.continue")}</Text>
          </Pressable>
        }
      >
        <Text style={s.noticed}>{t("ps.noticed")}</Text>
        {[
          [
            "moon-waning-crescent",
            `${t("sleep.title")}: ${night.sleepTotal}`,
            t("sleep.msg"),
          ],
          [
            "thermometer",
            `${t("warm.title")}: ${num(night.warmth, 1, true)} °C`,
            t("warm.msg"),
          ],
          [
            "heart-pulse",
            `${t("rec.title")}: ${num(night.hrv)} ms`,
            t("rec.msg"),
          ],
        ].map(([icon, title, msg]) => (
          <View key={icon} style={s.noticeRow}>
            <View style={s.rowIcon}>
              <MaterialCommunityIcons name={icon} size={20} color={c.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>{title}</Text>
              <Text style={s.rowSub}>{msg}</Text>
            </View>
          </View>
        ))}
      </Sheet>
    </Page>
  );
}

export default function CheckInScreen() {
  const k = useCheckIn();
  if (k.onboarded === null) return <Page>{null}</Page>; // carregando
  return k.onboarded ? <CheckIn /> : <Onboarding />;
}
