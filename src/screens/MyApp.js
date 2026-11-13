import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Page, FadeIn, Card, Chips, Segmented, ND } from "../components/ui";
import { Btn, TextField, TimeStepper, ScreenTop } from "../components/forms";
import Avatar from "../components/Avatar";
import { FigureSvg, BODIES } from "../components/Figure";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useApp } from "../state/app";
import {
  SYMPTOMS,
  SKIN,
  HAIR,
  EYES,
  HAIR_LENGTHS,
  TONES,
  MAX_SYMPTOMS,
} from "../data/symptoms";

const useS = makeStyles((c) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  div: { borderTopWidth: 1, borderTopColor: c.line },
  num: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: c.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  numT: { fontWeight: "700", color: c.accent },
  title: { fontSize: 17, fontWeight: "600", color: c.ink },
  sub: { fontSize: 13, color: c.muted, marginTop: 2 },
  group: { marginTop: 16 },
  gl: { fontSize: 14, fontWeight: "600", color: c.ink, marginBottom: 8 },
  dots: { flexDirection: "row", gap: 12, paddingRight: 8, paddingVertical: 2 },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "transparent",
  },
  dotOn: { borderColor: c.accent },
  check: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: c.line,
    alignItems: "center",
    justifyContent: "center",
  },
  checkOn: { backgroundColor: c.primary, borderColor: c.primary },
  warn: {
    backgroundColor: c.mist,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    gap: 10,
  },
  note: { fontSize: 12.5, color: c.muted, lineHeight: 18, marginTop: 10 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: c.line,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: c.accent,
  },
  section: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: c.ink,
    marginTop: 22,
    marginBottom: 10,
  },
}));

// Cada seção tem Salvar e um jeito claro de voltar. Ao sair com alterações, pergunta entre salvar ou descartar.
function Section({ title, sub, dirty, onSave, children }) {
  const { t } = useI18n();
  const a = useApp();
  const s = useS();
  const [ask, setAsk] = useState(false);
  const leave = () => a.go("myapp", true);
  useEffect(() => {
    a.guard.current = dirty ? () => setAsk(true) : null;
    return () => {
      a.guard.current = null;
    };
  }, [dirty]);
  return (
    <Page>
      <FadeIn>
        <ScreenTop
          title={title}
          subtitle={sub}
          onBack={() => (dirty ? setAsk(true) : leave())}
          backLabel={t("my.backMenu")}
        />
        {ask && (
          <View style={s.warn}>
            <Text style={s.title}>{t("my.unsaved")}</Text>
            <Btn title={t("my.save")} onPress={onSave} />
            <Btn title={t("my.discard")} variant="ghost" onPress={leave} />
          </View>
        )}
        {children}
        <View style={{ marginTop: 22, gap: 10 }}>
          <Btn title={t("my.save")} onPress={onSave} />
          <Btn
            title={t("my.backMenu")}
            variant="ghost"
            onPress={() => (dirty ? setAsk(true) : leave())}
          />
        </View>
      </FadeIn>
    </Page>
  );
}
const useDraft = (init) => {
  const [first] = useState(init);
  const [d, setD] = useState(init);
  return [
    d,
    (p) => setD((x) => ({ ...x, ...p })),
    JSON.stringify(d) !== JSON.stringify(first),
  ];
};

// Menu "Meu aplicativo": "Configure:" e as quatro seções na ordem do briefing
export function MyAppMenu() {
  const { t } = useI18n();
  const { colors: c, mode, setMode } = useTheme();
  const a = useApp();
  const s = useS();
  const rows = [
    ["my.rep", "my.repSub", () => a.go("rep"), "person", "#7D5ADF"],
    ["my.sym", "my.symSub", () => a.go("sym"), "pulse", "#526CD7"],
    ["my.times", "my.timesSub", () => a.go("times"), "alarm", "#3F399B"],
    [
      "my.consult",
      "my.consultSub",
      () => a.tab("Consult"),
      "medkit",
      "#2E9CC4",
    ],
  ];
  return (
    <Page>
      <FadeIn>
        <ScreenTop
          title={t("my.title")}
          subtitle={t("my.configure")}
          onBack={() => a.tab("Home")}
          backLabel={t("my.backHome")}
        />
        <Card style={{ padding: 0, overflow: "hidden" }}>
          {rows.map(([tt, ss, fn, icon, tint], i) => (
            <Pressable
              key={tt}
              onPress={fn}
              style={[s.row, i > 0 && s.div]}
              accessibilityRole="button"
            >
              <View style={[s.num, { backgroundColor: tint }]}>
                <Ionicons name={icon} size={18} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.title}>{t(tt)}</Text>
                <Text style={s.sub}>{t(ss)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.muted} />
            </Pressable>
          ))}
        </Card>
        <Text style={s.section}>{t("my.appearance")}</Text>
        <Segmented
          levels={[
            { id: "light", label: t("th.light") },
            { id: "dark", label: t("th.dark") },
          ]}
          value={mode}
          onChange={setMode}
          label={t("my.appearance")}
        />
        <Text style={s.section}>{t("my.demo")}</Text>
        <Card>
          <Text style={[s.sub, { marginBottom: 12 }]}>{t("my.demoNote")}</Text>
          <View style={{ gap: 10 }}>
            <Btn
              title={`${t("my.nextDay")} (${a.day}/${a.plan.days})`}
              variant="ghost"
              icon="play-forward-outline"
              onPress={a.nextDay}
            />
            <Btn
              title={t("my.restart")}
              variant="ghost"
              icon="refresh-outline"
              onPress={a.resetPlan}
            />
            <Btn
              title={t("my.resetAll")}
              variant="ghost"
              icon="trash-outline"
              onPress={() => {
                a.resetAll();
                a.tab("Home");
              }}
            />
          </View>
        </Card>
      </FadeIn>
    </Page>
  );
}

// Bolinhas de cor em UMA linha, junto à descrição; em telas estreitas a linha rola na horizontal sem cortar opções
function Swatches({ label, colors, value, onChange }) {
  const s = useS();
  return (
    <View style={s.group}>
      <Text style={s.gl}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.dots}
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
      >
        {colors.map((col, i) => (
          <Pressable
            key={col}
            onPress={() => onChange(i)}
            accessibilityRole="radio"
            accessibilityState={{ selected: value === i }}
            accessibilityLabel={`${label} ${i + 1}`}
            style={[s.dot, { backgroundColor: col }, value === i && s.dotOn]}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// Prévia viva: retrato e corpo mudam juntos a cada escolha (fica fixa no topo enquanto a pessoa ajusta, na web)
function Preview({ profile, note }) {
  const s = useS();
  const { colors: c } = useTheme();
  const v = useRef(new Animated.Value(1)).current;
  const key = [
    profile.skin,
    profile.hair,
    profile.hairLength,
    profile.eyes,
    profile.glasses,
    profile.tone,
  ].join("|");
  useEffect(() => {
    v.setValue(0.94);
    Animated.spring(v, {
      toValue: 1,
      friction: 5,
      tension: 160,
      useNativeDriver: ND,
    }).start();
  }, [key]);
  return (
    <View
      style={[
        {
          backgroundColor: c.bg,
          paddingTop: 10,
          paddingBottom: 8,
          marginTop: 8,
          zIndex: 5,
          borderBottomWidth: 1,
          borderBottomColor: c.line,
        },
        Platform.OS === "web" && { position: "sticky", top: 0 },
      ]}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          transform: [{ scale: v }],
        }}
      >
        <Avatar profile={profile} size={112} />
        <FigureSvg
          profile={profile}
          halo={false}
          style={{ width: 70, height: 140 }}
        />
      </Animated.View>
      <Text style={[s.note, { textAlign: "center", marginTop: 6 }]}>
        {note}
      </Text>
    </View>
  );
}

// 1. Minha representação: nome (fonte única para todo o App), idade e aparência ilustrativa
export function RepSection() {
  const { t } = useI18n();
  const { colors: c } = useTheme();
  const a = useApp();
  const s = useS();
  const [d, set, dirty] = useDraft(a.profile);
  const save = () => {
    a.setProfile({
      ...d,
      name: d.name.trim(),
      age: String(d.age).replace(/\D/g, "").slice(0, 3),
    });
    a.go("welcome", true);
  };
  return (
    <Section title={t("my.rep")} sub={t("rep.sub")} dirty={dirty} onSave={save}>
      <TextField
        label={t("rep.name")}
        value={d.name}
        onChangeText={(v) => set({ name: v })}
        maxLength={40}
      />
      <TextField
        label={t("rep.age")}
        value={String(d.age)}
        onChangeText={(v) => set({ age: v.replace(/\D/g, "") })}
        keyboardType="numeric"
        maxLength={3}
      />
      <Preview profile={d} note={t("rep.illus")} />
      <Swatches
        label={t("rep.skin")}
        colors={SKIN}
        value={d.skin}
        onChange={(v) => set({ skin: v })}
      />
      <Swatches
        label={t("rep.hair")}
        colors={HAIR}
        value={d.hair}
        onChange={(v) => set({ hair: v })}
      />
      <View style={s.group}>
        <Text style={s.gl}>{t("rep.length")}</Text>
        <Chips
          options={HAIR_LENGTHS.map((l) => ({ id: l, label: t(`rep.${l}`) }))}
          value={d.hairLength}
          onChange={(v) => set({ hairLength: v })}
        />
      </View>
      <Swatches
        label={t("rep.eyes")}
        colors={EYES}
        value={d.eyes}
        onChange={(v) => set({ eyes: v })}
      />
      <View style={s.group}>
        <Text style={s.gl}>{t("rep.glasses")}</Text>
        <Chips
          options={[
            { id: "n", label: t("rep.glassesOff") },
            { id: "y", label: t("rep.glassesOn") },
          ]}
          value={d.glasses ? "y" : "n"}
          onChange={(v) => set({ glasses: v === "y" })}
        />
      </View>
      <View style={s.group}>
        <Text style={s.gl}>{t("rep.body")}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {BODIES.map((b, i) => {
            const on = (d.body || "a") === b;
            return (
              <Pressable
                key={b}
                onPress={() => set({ body: b })}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${t("rep.body")} ${i + 1}`}
                style={{
                  flex: 1,
                  maxWidth: 110,
                  alignItems: "center",
                  paddingVertical: 8,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: on ? c.accent : c.line,
                  backgroundColor: on ? c.mist : c.card,
                }}
              >
                <FigureSvg
                  profile={{ ...d, body: b }}
                  halo={false}
                  style={{ width: 50, height: 100 }}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
      <Swatches
        label={t("rep.tone")}
        colors={TONES}
        value={d.tone}
        onChange={(v) => set({ tone: v })}
      />
    </Section>
  );
}

// 2. Sintomas e duração: 7, 14 ou 21 dias; até 5 sintomas (um deles pode ser descrito pela própria pessoa)
export function SymSection() {
  const { t } = useI18n();
  const { colors: c } = useTheme();
  const a = useApp();
  const s = useS();
  const [d, set, dirty] = useDraft({
    days: a.plan.days,
    symptoms: a.plan.symptoms.filter((i) => i !== "custom"),
    custom: a.plan.custom,
  });
  const hasCustom = d.custom.trim().length > 0,
    total = d.symptoms.length + (hasCustom ? 1 : 0);
  const toggle = (id) =>
    set({
      symptoms: d.symptoms.includes(id)
        ? d.symptoms.filter((x) => x !== id)
        : total < MAX_SYMPTOMS
          ? [...d.symptoms, id]
          : d.symptoms,
    });
  const save = () => {
    if (total === 0) return;
    a.setPlan({
      days: d.days,
      symptoms: [...d.symptoms, ...(hasCustom ? ["custom"] : [])],
      custom: d.custom.trim(),
    });
    a.go("welcome", true);
  };
  return (
    <Section title={t("my.sym")} sub={t("sym.sub")} dirty={dirty} onSave={save}>
      <Text style={s.gl}>{t("sym.duration")}</Text>
      <Chips
        options={[7, 14, 21].map((n) => ({
          id: n,
          label: t("start.daysV", { n }),
        }))}
        value={d.days}
        onChange={(v) => set({ days: v })}
      />
      <View style={s.group}>
        <Text style={s.gl}>{t("sym.choose", { max: MAX_SYMPTOMS })}</Text>
        <Text style={s.sub}>
          {t("sym.count", { n: total, max: MAX_SYMPTOMS })}
        </Text>
      </View>
      <Card style={{ padding: 0, overflow: "hidden", marginTop: 10 }}>
        {SYMPTOMS.map((sy, i) => {
          const on = d.symptoms.includes(sy.id),
            locked = !on && total >= MAX_SYMPTOMS;
          return (
            <Pressable
              key={sy.id}
              onPress={() => toggle(sy.id)}
              disabled={locked}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on, disabled: locked }}
              style={[
                s.row,
                i > 0 && s.div,
                { opacity: locked ? 0.45 : 1, paddingVertical: 13 },
              ]}
            >
              <View style={[s.check, on && s.checkOn]}>
                {on && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={[s.title, { flex: 1, fontSize: 15 }]}>
                {t(`sym.${sy.id}`)}
              </Text>
            </Pressable>
          );
        })}
      </Card>
      <TextField
        label={t("sym.other")}
        value={d.custom}
        onChangeText={(v) =>
          set({ custom: total >= MAX_SYMPTOMS && !hasCustom ? "" : v })
        }
        placeholder={t("sym.otherPh")}
        maxLength={60}
      />
      {total === 0 && (
        <Text style={[s.note, { color: c.accent }]}>{t("sym.min")}</Text>
      )}
    </Section>
  );
}

// 3. Horários e lembretes: as mesmas quatro opções usadas no diário
export function TimesSection() {
  const { t } = useI18n();
  const a = useApp();
  const s = useS();
  const [d, set, dirty] = useDraft({
    mode: a.plan.mode,
    times: a.plan.times,
    assign: a.plan.assign,
    channel: a.plan.channel,
  });
  const save = () => {
    a.setPlan(d);
    a.go("welcome", true);
  };
  const setTime = (k, v) => set({ times: { ...d.times, [k]: v } });
  return (
    <Section
      title={t("my.times")}
      sub={t("times.sub")}
      dirty={dirty}
      onSave={save}
    >
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {["both", "morning", "afternoon", "night"].map((m, i) => (
          <Pressable
            key={m}
            onPress={() => set({ mode: m })}
            accessibilityRole="radio"
            accessibilityState={{ selected: d.mode === m }}
            style={[s.row, i > 0 && s.div, { paddingVertical: 14 }]}
          >
            <View
              style={[
                s.radio,
                d.mode === m && { borderColor: s.radioDot.backgroundColor },
              ]}
            >
              {d.mode === m && <View style={s.radioDot} />}
            </View>
            <Text style={[s.title, { flex: 1, fontSize: 15 }]}>
              {t(`mode.${m}`)}
            </Text>
          </Pressable>
        ))}
      </Card>
      <Card style={{ marginTop: 14 }}>
        {d.mode === "both" ? (
          <>
            <TimeStepper
              label={t("slot.wake")}
              value={d.times.wake}
              onChange={(v) => setTime("wake", v)}
            />
            <TimeStepper
              label={t("slot.bed")}
              value={d.times.bed}
              onChange={(v) => setTime("bed", v)}
            />
          </>
        ) : (
          <TimeStepper
            label={t(`slot.${d.mode}`)}
            value={d.times[d.mode]}
            onChange={(v) => setTime(d.mode, v)}
          />
        )}
      </Card>
      {d.mode === "both" && (
        <Card>
          <Text style={s.gl}>{t("times.assign")}</Text>
          {a.plan.symptoms.map((id) => (
            <View key={id} style={{ marginTop: 10 }}>
              <Text style={s.sub}>
                {id === "custom" ? a.plan.custom : t(`sym.${id}`)}
              </Text>
              <View style={{ marginTop: 6 }}>
                <Segmented
                  levels={[
                    { id: "wake", label: t("slot.wake") },
                    { id: "bed", label: t("slot.bed") },
                  ]}
                  value={d.assign[id] || (id === "sleep" ? "wake" : "bed")}
                  onChange={(v) => set({ assign: { ...d.assign, [id]: v } })}
                  label={id}
                />
              </View>
            </View>
          ))}
        </Card>
      )}
      <Card>
        <Chips
          label={t("times.channel")}
          options={["calendar", "whatsapp", "sms"].map((k) => ({
            id: k,
            label: t(`ch.${k}`),
          }))}
          value={d.channel}
          onChange={(v) => set({ channel: v })}
        />
        <Text style={s.note}>{t("times.sim")}</Text>
      </Card>
    </Section>
  );
}
