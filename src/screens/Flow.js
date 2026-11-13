import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Page, FadeIn, Card } from "../components/ui";
import { Btn } from "../components/forms";
import { useEdge } from "../components/scroll";
import { makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useApp } from "../state/app";

const WOMAN = require("../../assets/people/welcome.jpg"); // imagem do protótipo de referência
const useS = makeStyles((c) => ({
  full: {
    flex: 1,
    backgroundColor: c.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: { width: 220, height: 84 },
  tag: {
    fontSize: 20,
    fontWeight: "600",
    color: c.ink,
    textAlign: "center",
    marginTop: 16,
    letterSpacing: -0.3,
  },
  skip: {
    position: "absolute",
    right: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: c.mist,
    zIndex: 5,
  },
  skipText: { color: c.accent, fontWeight: "700", fontSize: 14 },
  photo: { width: 220, height: 290, borderRadius: 28, marginBottom: 20 },
  big: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.7,
    color: c.ink,
    textAlign: "center",
  },
  sub: {
    fontSize: 16,
    lineHeight: 24,
    color: c.muted,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 340,
  },
  dots: { flexDirection: "row", gap: 6, marginTop: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.line },
  dotOn: { width: 22, backgroundColor: c.violet },
  round: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignSelf: "center",
    marginTop: 8,
  },
  name: {
    fontSize: 15,
    color: c.accent,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 14,
  },
  stack: { gap: 10, marginTop: 18 },
  sumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: c.line,
  },
  sumL: { fontSize: 14, color: c.muted },
  sumV: {
    flex: 1,
    textAlign: "right",
    fontSize: 15,
    fontWeight: "600",
    color: c.ink,
  },
  care: {
    backgroundColor: c.mist,
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
  },
  careText: { fontSize: 15, lineHeight: 22, color: c.ink },
}));

// Mensagem de cuidado conforme a fase: início, ponto intermediário (com ou sem pendências) e conclusão
export function CareMessage() {
  const { t } = useI18n();
  const a = useApp();
  const s = useS();
  const key =
    a.phase === "start"
      ? "msg.start"
      : a.phase === "mid"
        ? a.pending.length
          ? "msg.midPending"
          : "msg.midOk"
        : a.phase === "end"
          ? "msg.end"
          : null;
  return key ? (
    <View style={s.care}>
      <Text style={s.careText}>{t(key)}</Text>
    </View>
  ) : null;
}

// Abertura: logo e, em seguida, a mulher se conectando ao App. Até 10 segundos, com opção de pular.
export function Opening() {
  const { t } = useI18n();
  const a = useApp();
  const s = useS();
  const edge = useEdge();
  const [step, setStep] = useState(0);
  const done = useRef(() => a.go(null, true));
  done.current = () => a.go(null, true);
  useEffect(() => {
    const x = setTimeout(() => setStep(1), 2800),
      y = setTimeout(() => done.current(), 9500);
    return () => {
      clearTimeout(x);
      clearTimeout(y);
    };
  }, []);
  return (
    <View style={s.full}>
      <Pressable
        onPress={() => done.current()}
        style={[s.skip, { top: edge.top + 12 }]}
        accessibilityRole="button"
      >
        <Text style={s.skipText}>{t("open.skip")}</Text>
      </Pressable>
      {step === 0 ? (
        <FadeIn key="a" style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/logo.png")}
            style={s.logo}
            resizeMode="contain"
            accessibilityLabel="Lunera Healthcare"
          />
          <Text style={s.tag}>{t("open.tag")}</Text>
        </FadeIn>
      ) : (
        <FadeIn key="b" style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/people/opening.jpg")}
            style={s.photo}
            resizeMode="cover"
          />
          <Text style={s.big}>{t("open.connect")}</Text>
          <Text style={s.sub}>{t("open.sub")}</Text>
        </FadeIn>
      )}
      <View style={s.dots}>
        {[0, 1].map((i) => (
          <View key={i} style={[s.dot, step === i && s.dotOn]} />
        ))}
      </View>
    </View>
  );
}

// Vamos começar: mostra só o plano salvo (não pede a duração de novo), em resumo compacto
export function Start() {
  const { t } = useI18n();
  const a = useApp();
  const s = useS();
  const p = a.plan;
  const syms = [
    ...p.symptoms.filter((i) => i !== "custom").map((i) => t(`sym.${i}`)),
    ...(p.symptoms.includes("custom") && p.custom ? [p.custom] : []),
  ].join(", ");
  const rows = [
    [t("start.days"), t("start.daysV", { n: p.days })],
    [t("start.period"), t(`mode.${p.mode}`)],
    [
      t("start.times"),
      p.mode === "both" ? `${p.times.wake} · ${p.times.bed}` : p.times[p.mode],
    ],
    [t("start.symptoms"), syms],
  ];
  return (
    <Page>
      <FadeIn>
        <Text style={[s.big, { textAlign: "left", marginTop: 8 }]}>
          {t("start.title")}
        </Text>
        <Text style={[s.sub, { textAlign: "left" }]}>{t("start.tag")}</Text>
        <Card style={{ marginTop: 16 }}>
          {rows.map(([l, v], i) => (
            <View
              key={l}
              style={[
                s.sumRow,
                i === 0 && { borderTopWidth: 0, paddingTop: 0 },
              ]}
            >
              <Text style={s.sumL}>{l}</Text>
              <Text style={s.sumV}>{v}</Text>
            </View>
          ))}
        </Card>
        <View style={s.stack}>
          <Btn title={t("start.go")} onPress={() => a.tab("Diary")} />
          <Btn
            title={t("start.adjust")}
            variant="ghost"
            onPress={() => a.go("myapp")}
          />
        </View>
      </FadeIn>
    </Page>
  );
}

// Acolhimento depois de salvar ou sair de uma tarefa. Só a frase varia; os botões ficam sempre no mesmo lugar.
export function Welcome() {
  const { t } = useI18n();
  const a = useApp();
  const s = useS();
  const [n] = useState(() => Math.floor(Math.random() * 4));
  return (
    <Page>
      <FadeIn>
        <Image source={WOMAN} style={s.round} resizeMode="cover" />
        {!!a.name && <Text style={s.name}>{a.name}</Text>}
        <Text style={[s.big, { marginTop: a.name ? 4 : 14 }]}>
          {t(`wel.p${n}`)}
        </Text>
        <Text style={[s.sub, { alignSelf: "center" }]}>
          {t("wel.ask")}
          {"\n"}
          {t("wel.select")}
        </Text>
        <CareMessage />
        <View style={s.stack}>
          <Btn
            title={t("nav.home")}
            icon="home-outline"
            variant="ghost"
            onPress={() => a.tab("Home")}
          />
          <Btn
            title={t("nav.diary")}
            icon="journal-outline"
            variant="ghost"
            onPress={() => a.tab("Diary")}
          />
          <Btn
            title={t("nav.evolution")}
            icon="stats-chart-outline"
            variant="ghost"
            onPress={() => a.tab("Evolution")}
          />
          <Btn
            title={t("nav.consult")}
            icon="medkit-outline"
            variant="ghost"
            onPress={() => a.tab("Consult")}
          />
          <Btn title={t("wel.exit")} onPress={() => a.go("bye")} />
        </View>
      </FadeIn>
    </Page>
  );
}

// Até logo: despedida humanizada. Voltar não apaga os registros.
export function Bye() {
  const { t } = useI18n();
  const a = useApp();
  const s = useS();
  return (
    <View style={s.full}>
      <FadeIn style={{ alignItems: "center" }}>
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 170, height: 66 }}
          resizeMode="contain"
          accessibilityLabel="Lunera Healthcare"
        />
        <Image
          source={WOMAN}
          style={[s.photo, { marginTop: 18, width: 200, height: 250 }]}
          resizeMode="cover"
        />
        <Text style={s.big}>
          {a.name ? t("bye.title", { name: a.name }) : t("bye.titleNeutral")}
        </Text>
        <Text style={s.sub}>{t("bye.sub")}</Text>
        <View style={{ marginTop: 22, minWidth: 240 }}>
          <Btn title={t("bye.back")} onPress={() => a.tab("Home", true)} />
        </View>
      </FadeIn>
    </View>
  );
}
