import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Page, Segmented, text } from "../components/ui";
import { colors, muted, MAX_W, shadow } from "../theme";
import { useI18n } from "../i18n";

const SYMPTOMS = ["brainFog", "fatigue", "mood", "sleep", "hotFlashes"];
const LEVELS = ["none", "mild", "moderate", "severe"];
const todayKey = () => `lunera.log.${new Date().toISOString().slice(0, 10)}`;
const blank = () => Object.fromEntries(SYMPTOMS.map((id) => [id, "none"])); // dia tranquilo

export default function DailyLogScreen() {
  const { t, locale } = useI18n();
  const [values, setValues] = useState(blank);
  const [saved, setSaved] = useState(false);

  // Recarrega o registro de hoje, se já existir.
  useEffect(() => {
    AsyncStorage.getItem(todayKey())
      .then((v) => {
        if (v) {
          setValues({ ...blank(), ...JSON.parse(v) });
          setSaved(true);
        }
      })
      .catch(() => {});
  }, []);

  const noted = Object.values(values).filter((v) => v !== "none").length;
  const date = new Date().toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const levels = LEVELS.map((id) => ({ id, label: t(`level.${id}`) }));

  const change = (id, lvl) => {
    setValues((p) => ({ ...p, [id]: lvl }));
    setSaved(false);
  };
  // TODO: além do armazenamento local, enviar para a API e cruzar com os dados do Patch.
  const save = () =>
    AsyncStorage.setItem(todayKey(), JSON.stringify(values))
      .catch(() => {})
      .finally(() => setSaved(true));

  const footer = (
    <View style={s.footer}>
      <View style={s.footerIn}>
        <Text style={s.note}>
          {saved
            ? t("log.savedNote")
            : noted === 0
              ? t("log.noneNoted")
              : t("log.count", { n: noted, total: SYMPTOMS.length })}
        </Text>
        <Pressable
          onPress={save}
          accessibilityRole="button"
          accessibilityLabel={t("log.save")}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <LinearGradient
            colors={
              saved
                ? [colors.royal, colors.sky]
                : [colors.indigo, colors.violet]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.save}
          >
            {saved && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.white}
              />
            )}
            <Text style={s.saveText}>
              {saved ? t("log.saved") : t("log.save")}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Page footer={footer}>
      {/* Imagem da lua com a pergunta central sobre ela */}
      <ImageBackground
        source={require("../../assets/night-banner.jpg")}
        style={s.banner}
        imageStyle={{ borderRadius: 28 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(23,20,74,0)", "rgba(23,20,74,0.82)", "#17144A"]}
          locations={[0.2, 0.7, 1]}
          style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
        />
        <Text style={s.date}>{date}</Text>
        <Text style={s.question}>{t("log.question")}</Text>
      </ImageBackground>
      <Text style={text.lead}>{t("log.lead")}</Text>

      {/* Lista agrupada */}
      <View style={s.group}>
        {SYMPTOMS.map((id, i) => (
          <View key={id} style={[s.row, i > 0 && s.divider]}>
            <Text style={s.name}>{t(`sym.${id}`)}</Text>
            <Text style={s.hint}>{t(`sym.${id}.hint`)}</Text>
            <Segmented
              levels={levels}
              value={values[id]}
              onChange={(l) => change(id, l)}
              label={t(`sym.${id}`)}
            />
          </View>
        ))}
      </View>
    </Page>
  );
}

const s = StyleSheet.create({
  banner: {
    width: "100%",
    height: 230,
    marginTop: 6,
    justifyContent: "flex-end",
    padding: 22,
  },
  date: {
    color: "#D9D5F5",
    fontSize: 14,
    marginBottom: 4,
    textTransform: "capitalize",
  },
  question: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.8,
    lineHeight: 35,
  },
  group: {
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    ...shadow,
  },
  row: { padding: 16 },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  name: { fontSize: 17, fontWeight: "600", color: colors.ink },
  hint: { fontSize: 13, color: muted, marginTop: 2, marginBottom: 12 },
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: colors.paper,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  footerIn: { width: "100%", maxWidth: MAX_W },
  note: { fontSize: 13, color: muted, textAlign: "center", marginBottom: 10 },
  save: {
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
