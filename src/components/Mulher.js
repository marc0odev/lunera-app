import React from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "../theme";
import { useI18n } from "../i18n";

// Imagem ilustrativa de uma mulher
// variant "phone": usando o celular (abertura). variant "welcome": sem celular, olhando e sorrindo (acolhimento e despedida).
const SRC = {
  phone: require("../../assets/mulher-celular.jpg"),
  welcome: require("../../assets/mulher-acolhe.jpg"),
};
const RATIO = { phone: 640 / 960, welcome: 720 / 1080 };

export default function Mulher({
  variant = "welcome",
  width = 220,
  round = 28,
  caption = true,
}) {
  const { colors: c } = useTheme();
  const { t } = useI18n();
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={SRC[variant]}
        accessibilityLabel={t("img.alt")}
        style={{
          width,
          height: Math.round(width / RATIO[variant]),
          borderRadius: round,
          backgroundColor: c.mist,
        }}
        resizeMode="cover"
      />
      {caption ? (
        <Text style={{ fontSize: 11.5, color: c.muted, marginTop: 6 }}>
          {t("img.illustrative")}
        </Text>
      ) : null}
    </View>
  );
}
