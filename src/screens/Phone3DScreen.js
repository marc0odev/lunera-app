import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  PanResponder,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Page,
  FadeIn,
  Card,
  PrimaryButton,
  GhostButton,
} from "../components/ui";
import Mulher from "../components/Mulher";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useCheckIn } from "../state/checkin";
import { canEmbed, embedUrl } from "../embed";

const PW = 236;
const PH = 488;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const useS = makeStyles((c) => ({
  h1: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.7,
    color: c.ink,
    marginTop: 6,
  },
  lead: {
    fontSize: 16,
    lineHeight: 23,
    color: c.muted,
    marginTop: 6,
    marginBottom: 14,
  },
  stage: {
    alignItems: "center",
    justifyContent: "center",
    height: PH + 70,
    borderRadius: 28,
    backgroundColor: c.mist,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    justifyContent: "center",
  },
  note: {
    fontSize: 12.5,
    lineHeight: 18,
    color: c.muted,
    textAlign: "center",
    marginTop: 10,
  },
  h2: { fontSize: 20, fontWeight: "700", color: c.ink, letterSpacing: -0.3 },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: c.muted,
    marginTop: 4,
    marginBottom: 6,
  },
  layerName: { fontSize: 13, fontWeight: "700", color: c.ink },
  layerDesc: { fontSize: 12, color: c.muted },
  mini: { flex: 1, padding: 14, backgroundColor: c.bg, alignItems: "center" },
  miniH: {
    fontSize: 15,
    fontWeight: "700",
    color: c.ink,
    textAlign: "center",
    marginTop: 10,
  },
  miniP: {
    fontSize: 12,
    lineHeight: 17,
    color: c.muted,
    textAlign: "center",
    marginTop: 4,
  },
}));

// ---- Prévia viva (quando não há iframe) ----
function MiniApp() {
  const { t, num } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const nav = useNavigation();
  const k = useCheckIn();
  return (
    <View style={s.mini}>
      <Mulher variant="welcome" width={110} round={18} caption={false} />
      <Text style={s.miniH}>
        {k.displayName
          ? `${t("greet.morning")}, ${k.displayName}`
          : t("greet.morning")}
      </Text>
      <Text style={s.miniP}>{t("home.lead")}</Text>
      <Text
        style={[s.miniP, { color: c.accent, fontWeight: "700", marginTop: 10 }]}
      >
        {t("rec.count", { n: num(k.day), total: num(k.total) })}
      </Text>
      <View style={{ alignSelf: "stretch", marginTop: 12, gap: 8 }}>
        <PrimaryButton
          label={t("care.begin")}
          onPress={() => nav.navigate("CheckIn")}
        />
        <GhostButton
          label={t("con.prepare")}
          onPress={() => nav.navigate("Consult")}
        />
      </View>
    </View>
  );
}

function PhoneScreen({ introKey }) {
  const url = embedUrl(introKey === 0);
  if (canEmbed && url) {
    const W = 390;
    const H = Math.round((PH * W) / PW);
    return (
      <View style={{ width: PW, height: PH, overflow: "hidden" }}>
        <View
          style={{
            position: "absolute",
            width: W,
            height: H,
            left: -(W - PW) / 2,
            top: -(H - PH) / 2,
            transform: [{ scale: PW / W }],
          }}
        >
          {React.createElement("iframe", {
            key: introKey,
            src: url,
            title: "Lunera App",
            style: { width: W, height: H, border: 0, background: "#fff" },
          })}
        </View>
      </View>
    );
  }
  return (
    <View style={{ width: PW, height: PH }}>
      <MiniApp />
    </View>
  );
}

function Phone3D({ ry, rx, introKey }) {
  const { colors: c } = useTheme();
  const rad = (ry * Math.PI) / 180;
  const body = "#523476";
  // espessura: camadas atrás do corpo, deslocadas para o lado oposto da rotação
  const layers = [1, 2, 3, 4, 5, 6];
  return (
    <View
      style={{
        width: PW + 30,
        height: PH + 30,
        alignItems: "center",
        justifyContent: "center",
        transform: [
          { perspective: 1100 },
          { rotateX: `${rx}deg` },
          { rotateY: `${ry}deg` },
        ],
      }}
    >
      {layers.map((i) => (
        <View
          key={i}
          pointerEvents="none"
          style={{
            position: "absolute",
            width: PW + 22,
            height: PH + 22,
            borderRadius: 40,
            backgroundColor: i % 2 ? "#6d4d93" : "#7c5ba2",
            left: 4 - Math.sin(rad) * i * 2.2,
            top: 4 + Math.sin((rx * Math.PI) / 180) * i * 2.2,
          }}
        />
      ))}
      <View
        style={{
          width: PW + 22,
          height: PH + 22,
          borderRadius: 40,
          backgroundColor: body,
          padding: 11,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 18,
          shadowOffset: { width: 8, height: 14 },
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 30,
            overflow: "hidden",
            backgroundColor: c.bg,
          }}
        >
          <PhoneScreen introKey={introKey} />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 16,
            alignSelf: "center",
            width: 76,
            height: 20,
            borderRadius: 12,
            backgroundColor: body,
          }}
        />
      </View>
    </View>
  );
}

// ---- Patch em camadas separáveis ----
function PatchLayers() {
  const { t } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const sep = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);
  const [tilt, setTilt] = useState(-52);
  const [spin, setSpin] = useState(0);
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, g) => {
          setTilt(clamp(-52 + g.dy * 0.25, -80, -20));
          setSpin(clamp(g.dx * 0.3, -50, 50));
        },
        onPanResponderRelease: () => {
          setTilt(-52);
          setSpin(0);
        },
      }),
    [],
  );
  const toggle = () => {
    Animated.timing(sep, {
      toValue: open ? 0 : 1,
      duration: 650,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();
    setOpen(!open);
  };
  const L = [
    {
      k: "l1",
      color: "#F3ECFB",
      border: "#d9c6ee",
      name: t("p3.l1"),
      desc: t("p3.l1d"),
    },
    {
      k: "l2",
      color: "#C9B3EA",
      border: "#a98bd6",
      name: t("p3.l2"),
      desc: t("p3.l2d"),
    },
    {
      k: "l3",
      color: "#7EC9E3",
      border: "#52a9c8",
      name: t("p3.l3"),
      desc: t("p3.l3d"),
    },
    {
      k: "l4",
      color: "#EBDCCD",
      border: "#d3bda8",
      name: t("p3.l4"),
      desc: t("p3.l4d"),
    },
  ];
  const gap = 58;
  return (
    <Card style={{ marginTop: 16 }}>
      <Text style={s.h2}>{t("p3.patch")}</Text>
      <Text style={s.sub}>{t("p3.patchSub")}</Text>
      <View
        {...pan.panHandlers}
        style={{ height: 300, alignItems: "center", justifyContent: "center" }}
        accessibilityLabel={t("p3.patch")}
      >
        <View
          style={{
            width: 210,
            height: 250,
            alignItems: "center",
            justifyContent: "center",
            transform: [
              { perspective: 900 },
              { rotateX: `${tilt}deg` },
              { rotateZ: `${spin}deg` },
            ],
          }}
        >
          {L.map((l, i) => (
            <Animated.View
              key={l.k}
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                borderRadius: 40,
                backgroundColor: l.color,
                borderWidth: 1.5,
                borderColor: l.border,
                transform: [
                  {
                    translateY: sep.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-i * 3, (1.5 - i) * gap],
                    }),
                  },
                ],
              }}
            />
          ))}
        </View>
      </View>
      <View style={{ gap: 8, marginBottom: 12 }}>
        {L.map((l) => (
          <View
            key={l.k}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: l.color,
                borderWidth: 1.5,
                borderColor: l.border,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={s.layerName}>{l.name}</Text>
              <Text style={s.layerDesc}>{l.desc}</Text>
            </View>
          </View>
        ))}
      </View>
      <PrimaryButton
        label={open ? t("p3.join") : t("p3.split")}
        onPress={toggle}
      />
      <Text style={s.note}>{t("p3.patchNote")}</Text>
    </Card>
  );
}

export default function Phone3DScreen() {
  const { t } = useI18n();
  const s = useS();
  const nav = useNavigation();
  const [ry, setRy] = useState(-22);
  const [rx, setRx] = useState(6);
  const [spinning, setSpinning] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const base = useRef({ ry: -22, rx: 6 });
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          base.current = { ry: ryRef.current, rx: rxRef.current };
          setSpinning(false);
        },
        onPanResponderMove: (_, g) => {
          setRy(base.current.ry + g.dx * 0.5);
          setRx(clamp(base.current.rx - g.dy * 0.3, -25, 25));
        },
      }),
    [],
  );
  const ryRef = useRef(ry);
  ryRef.current = ry;
  const rxRef = useRef(rx);
  rxRef.current = rx;
  useEffect(() => {
    if (!spinning) return undefined;
    const id = setInterval(() => setRy((v) => v + 2), 40);
    return () => clearInterval(id);
  }, [spinning]);
  const front = () => {
    setSpinning(false);
    setRy(0);
    setRx(0);
  };

  return (
    <Page>
      <FadeIn>
        <Text style={s.h1}>{t("p3.title")}</Text>
        <Text style={s.lead}>{t("p3.lead")}</Text>
        <View
          style={s.stage}
          {...pan.panHandlers}
          accessibilityLabel={t("p3.hint")}
        >
          <Phone3D ry={ry} rx={rx} introKey={introKey} />
        </View>
        <View style={s.row}>
          <GhostButton label={t("p3.front")} onPress={front} />
          <GhostButton
            label={spinning ? t("p3.stop") : t("p3.spin")}
            onPress={() => setSpinning((v) => !v)}
          />
          <GhostButton
            label={t("p3.intro")}
            onPress={() => setIntroKey((k) => k + 1)}
          />
        </View>
        <Text style={s.note}>{t("p3.hint")}</Text>
        <Text style={s.note}>{t("p3.demo")}</Text>
      </FadeIn>
      <FadeIn delay={80}>
        <PatchLayers />
      </FadeIn>
      <View style={{ marginTop: 16 }}>
        <GhostButton
          label={t("p3.back")}
          onPress={() => nav.navigate("Today")}
        />
      </View>
    </Page>
  );
}
