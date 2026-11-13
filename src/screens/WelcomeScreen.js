import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Page, FadeIn, PrimaryButton } from "../components/ui";
import Mulher from "../components/Mulher";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useCheckIn } from "../state/checkin";

const useS = makeStyles((c) => ({
  wrap: { alignItems: "center", paddingTop: 8 },
  bubble: {
    backgroundColor: c.mist,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginTop: 6,
    alignSelf: "stretch",
  },
  hi: { fontSize: 17, fontWeight: "700", color: c.ink, textAlign: "center" },
  phrase: {
    fontSize: 14.5,
    lineHeight: 21,
    color: c.muted,
    textAlign: "center",
    marginTop: 3,
  },
  ask: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.6,
    color: c.ink,
    textAlign: "center",
    marginTop: 22,
  },
  pick: {
    fontSize: 15,
    color: c.muted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  opt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: c.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: c.line,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 10,
    ...c.shadow,
  },
  optText: { flex: 1, fontSize: 16.5, fontWeight: "600", color: c.ink },
  out: { alignSelf: "center", paddingVertical: 14, paddingHorizontal: 20 },
  outText: { fontSize: 15, fontWeight: "600", color: c.muted },
  bye: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.7,
    color: c.ink,
    textAlign: "center",
    marginTop: 20,
  },
  byeP: {
    fontSize: 17,
    lineHeight: 25,
    color: c.muted,
    textAlign: "center",
    marginTop: 8,
  },
  sign: { alignItems: "center", marginVertical: 20 },
  heart: { fontSize: 22, color: c.violet },
  signText: {
    fontSize: 15,
    lineHeight: 22,
    color: c.accent,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
}));

// Acolhimento: depois de salvar ou sair de uma tarefa. Só as frases mudam; os botões ficam sempre no mesmo lugar.
export function WelcomeScreen() {
  const { t } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const nav = useNavigation();
  const k = useCheckIn();
  const phrase = t(`wel.p${k.welcomeN % 4}`);
  const go = (route) => nav.navigate(route);
  const opts = [
    ["home", "Today", "home-outline"],
    ["diary", "CheckIn", "body-outline"],
    ["evolution", "Journey", "analytics-outline"],
    ["consult", "Consult", "chatbubbles-outline"],
  ];
  return (
    <Page>
      <FadeIn style={s.wrap}>
        <Mulher variant="welcome" width={190} />
        <View style={s.bubble} accessibilityLiveRegion="polite">
          <Text style={s.hi}>
            {k.displayName
              ? t("wel.hi", { name: k.displayName })
              : t("wel.hiNeutral")}
          </Text>
          <Text style={s.phrase}>{phrase}</Text>
        </View>
        <Text style={s.ask}>{t("wel.ask")}</Text>
        <Text style={s.pick}>{t("wel.pick")}</Text>
      </FadeIn>
      <FadeIn delay={90}>
        {opts.map(([key, route, icon]) => (
          <Option
            key={key}
            icon={icon}
            label={t(`wel.${key}`)}
            onPress={() => go(route)}
          />
        ))}
        <Pressable
          onPress={() => go("Goodbye")}
          accessibilityRole="button"
          style={s.out}
        >
          <Text style={s.outText}>{t("wel.exit")}</Text>
        </Pressable>
      </FadeIn>
    </Page>
  );
}

function Option({ icon, label, onPress }) {
  const s = useS();
  const { colors: c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [s.opt, { opacity: pressed ? 0.88 : 1 }]}
    >
      <Ionicons name={icon} size={22} color={c.accent} />
      <Text style={s.optText}>{label}</Text>
      <Ionicons name="arrow-forward" size={18} color={c.muted} />
    </Pressable>
  );
}

// Até logo: a barra inferior fica oculta aqui. Voltar não apaga nenhum registro.
export function GoodbyeScreen() {
  const { t } = useI18n();
  const s = useS();
  const nav = useNavigation();
  const k = useCheckIn();
  return (
    <Page>
      <FadeIn style={s.wrap}>
        <Mulher variant="welcome" width={210} />
        <Text style={s.bye}>
          {k.displayName
            ? t("bye.title", { name: k.displayName })
            : t("bye.titleNeutral")}
        </Text>
        <Text style={s.byeP}>{t("bye.thanks")}</Text>
        <View style={s.sign}>
          <Text style={s.heart} accessibilityElementsHidden>
            ♡
          </Text>
          <Text style={s.signText}>
            {t("care.ongoing")}
            {"\n"}
            {t("bye.here")}
          </Text>
        </View>
        <View style={{ alignSelf: "stretch" }}>
          <PrimaryButton
            label={t("bye.back")}
            onPress={() => nav.navigate("Today")}
          />
        </View>
      </FadeIn>
    </Page>
  );
}
