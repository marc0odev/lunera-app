import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Pressable, Animated, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme";
import { useI18n } from "../i18n";
import Mulher from "./Mulher";

// Abertura (até 10 s, com "Pular"): logo Lunera, depois a mulher conectando-se ao Lunera App (foto ilustrativa).
function Appear({ children, delay = 0, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 900,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v,
          transform: [
            {
              translateY: v.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export default function Intro({ onDone }) {
  const { colors: c, mode } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const a = setTimeout(() => setStage(1), 2600);
    const b = setTimeout(() => setStage(2), 5600);
    const e = setTimeout(onDone, 8600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(e);
    };
  }, []);
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: c.bg,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <Pressable
        onPress={onDone}
        accessibilityRole="button"
        accessibilityLabel={t("intro.skip")}
        hitSlop={10}
        style={{
          position: "absolute",
          top: insets.top + 14,
          right: 20,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 999,
          backgroundColor: c.card,
          borderWidth: 1,
          borderColor: c.line,
        }}
      >
        <Text style={{ color: c.accent, fontWeight: "700", fontSize: 14 }}>
          {t("intro.skip")}
        </Text>
      </Pressable>
      {stage === 0 && (
        <Appear key="logo">
          <Image
            source={require("../../assets/logo.png")}
            style={[
              { width: 240, height: 92 },
              mode === "dark" && { tintColor: "#fff", opacity: 0.92 },
            ]}
            resizeMode="contain"
            accessibilityLabel="Lunera Healthcare"
          />
        </Appear>
      )}
      {stage >= 1 && (
        <Appear key="fig" style={{ alignItems: "center" }}>
          <Mulher variant="phone" width={230} round={32} />
          <Text
            style={{
              marginTop: 22,
              fontSize: 20,
              fontWeight: "700",
              color: c.ink,
              letterSpacing: -0.3,
            }}
          >
            {stage === 1 ? t("intro.connecting") : t("intro.connected")}
          </Text>
          <Text style={{ marginTop: 6, fontSize: 15, color: c.muted }}>
            {stage === 1 ? t("intro.sub1") : t("intro.sub2")}
          </Text>
        </Appear>
      )}
    </View>
  );
}
