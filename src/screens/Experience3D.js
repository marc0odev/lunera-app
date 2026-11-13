import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  PanResponder,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Segmented, Card } from "../components/ui";
import { Btn } from "../components/forms";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const useS = makeStyles((c) => ({
  root: { flex: 1, backgroundColor: c.bg },
  top: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 10,
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
  close: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingRight: 10,
  },
  closeT: { color: c.accent, fontSize: 15, fontWeight: "700" },
  title: { fontSize: 15, fontWeight: "700", color: c.muted },
  tabs: { width: "100%", maxWidth: 520 },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  halo: {
    position: "absolute",
    width: 620,
    height: 620,
    borderRadius: 310,
    backgroundColor: c.violet,
    opacity: c.mode === "dark" ? 0.16 : 0.1,
  },
  hint: { fontSize: 13, color: c.muted, textAlign: "center" },
  controls: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  round: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.line,
    alignItems: "center",
    justifyContent: "center",
  },
  foot: { paddingHorizontal: 20, paddingTop: 6, gap: 8, alignItems: "center" },
  box: { width: "86%", maxWidth: 470, aspectRatio: 1599 / 1570 },
  h: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.6,
    color: c.ink,
    textAlign: "center",
  },
  p: {
    fontSize: 15,
    lineHeight: 22,
    color: c.muted,
    textAlign: "center",
    maxWidth: 420,
  },
  patchStage: { height: 330, alignItems: "center", justifyContent: "center" },
  layer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  adhesive: {
    width: 290,
    height: 150,
    borderRadius: 75,
    backgroundColor: c.lavender,
    opacity: 0.75,
    borderWidth: 2,
    borderColor: c.orchid,
    borderStyle: "dashed",
  },
  board: {
    width: 250,
    height: 118,
    borderRadius: 59,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: c.periwinkle,
  },
  cover: {
    width: 250,
    height: 118,
    borderRadius: 59,
    backgroundColor: "#F4F5FA",
    borderWidth: 2,
    borderColor: "#C9CFE3",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  coverT: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3F399B",
    letterSpacing: -0.5,
  },
  led: { width: 12, height: 12, borderRadius: 6, backgroundColor: c.aqua },
  sensor: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: c.aqua,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  battery: {
    width: 54,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    opacity: 0.8,
  },
  sel: { borderColor: c.aqua, borderWidth: 4, borderStyle: "solid" },
  part: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  num: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: c.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  numT: { fontWeight: "700", color: c.accent },
  partT: { fontSize: 16, fontWeight: "700", color: c.ink },
  partD: { fontSize: 13.5, lineHeight: 20, color: c.muted, marginTop: 2 },
  note: {
    fontSize: 12.5,
    lineHeight: 18,
    color: c.muted,
    textAlign: "center",
    marginTop: 4,
  },
}));

// Rotação controlada por arrasto ou pelos botões (valores em graus)
function useRotation(init, limits) {
  const cur = useRef({ ...init });
  const ax = useRef(new Animated.Value(init.a)).current,
    bx = useRef(new Animated.Value(init.b)).current;
  const set = (a, b, animate) => {
    cur.current = {
      a: clamp(a, limits.a[0], limits.a[1]),
      b: clamp(b, limits.b[0], limits.b[1]),
    };
    if (animate) {
      Animated.spring(ax, {
        toValue: cur.current.a,
        useNativeDriver: false,
        friction: 8,
      }).start();
      Animated.spring(bx, {
        toValue: cur.current.b,
        useNativeDriver: false,
        friction: 8,
      }).start();
    } else {
      ax.setValue(cur.current.a);
      bx.setValue(cur.current.b);
    }
  };
  const start = useRef({ a: 0, b: 0 });
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        start.current = { ...cur.current };
      },
      onPanResponderMove: (_, g) =>
        set(start.current.a + g.dx * 0.35, start.current.b - g.dy * 0.25),
    }),
  ).current;
  const deg = (v, r) =>
    v.interpolate({
      inputRange: [-r, r],
      outputRange: [`-${r}deg`, `${r}deg`],
    });
  return { cur, ax, bx, set, pan, reset: () => set(init.a, init.b, true), deg };
}

// Cena 1: a caixa aberta (imagem oficial, sem fundo), no lugar do patch sozinho
function BoxScene({ go }) {
  const { t } = useI18n();
  const s = useS();
  const r = useRotation({ a: 0, b: 0 }, { a: [-22, 22], b: [-14, 14] });
  return (
    <>
      <View style={s.stage} {...r.pan.panHandlers}>
        <View style={s.halo} pointerEvents="none" />
        <Animated.Image
          source={require("../../assets/box-open.png")}
          resizeMode="contain"
          accessibilityLabel={t("patch.title")}
          style={[
            s.box,
            {
              transform: [
                { perspective: 900 },
                { rotateY: r.deg(r.ax, 30) },
                { rotateX: r.deg(r.bx, 30) },
              ],
            },
          ]}
        />
      </View>
      <View style={[s.foot, { paddingBottom: 6 }]}>
        <Text style={s.h}>{t("patch.title")}</Text>
        <Text style={s.p}>{t("x3.boxLead")}</Text>
        <View
          style={{
            gap: 10,
            alignSelf: "center",
            maxWidth: 420,
            width: "100%",
            marginTop: 6,
          }}
        >
          <Btn
            title={t("x3.openPatch")}
            icon="layers-outline"
            onPress={() => go("patch")}
          />
        </View>
      </View>
    </>
  );
}

// Cena 2: patch em três camadas separáveis (modelo conceitual)
function PatchScene() {
  const { t } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const [open, setOpen] = useState(true);
  const [sel, setSel] = useState(null);
  const sep = useRef(new Animated.Value(1)).current;
  const r = useRotation({ a: -24, b: 56 }, { a: [-180, 180], b: [30, 72] });
  useEffect(() => {
    Animated.timing(sep, {
      toValue: open ? 1 : 0,
      duration: 520,
      useNativeDriver: false,
    }).start();
  }, [open]);
  const [sw, setSw] = useState(0);
  const k = sw ? Math.min(1, (sw - 48) / 300) : 1; // encolhe o patch em telas estreitas
  const tf = (off) => [
    {
      translateY: sep.interpolate({
        inputRange: [0, 1],
        outputRange: [off * 0.16, off],
      }),
    },
    { perspective: 900 },
    { rotateX: r.deg(r.bx, 90) },
    { rotateZ: r.deg(r.ax, 180) },
    { scale: k },
  ];
  const layer = (id, off, style, children) => (
    <Animated.View style={[s.layer, { transform: tf(off) }]}>
      <Pressable
        onPress={() => setSel(id)}
        accessibilityRole="button"
        accessibilityLabel={t(`x3.${id}.t`)}
        style={[style, sel === id && s.sel]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center", paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[s.patchStage, { alignSelf: "stretch", overflow: "hidden" }]}
        {...r.pan.panHandlers}
        onLayout={(e) => setSw(e.nativeEvent.layout.width)}
      >
        <View
          style={[s.halo, { width: 420, height: 420 }]}
          pointerEvents="none"
        />
        {layer("l3", 78, s.adhesive, null)}
        {layer(
          "l2",
          0,
          s.board,
          <LinearGradient
            colors={[c.indigo, c.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              alignSelf: "stretch",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              paddingHorizontal: 18,
            }}
          >
            <View style={s.sensor} />
            <View style={s.sensor} />
            <View style={s.battery} />
            <View style={s.sensor} />
            <View style={s.sensor} />
          </LinearGradient>,
        )}
        {layer(
          "l1",
          -78,
          s.cover,
          <>
            <Text style={s.coverT}>lunera.</Text>
            <View style={s.led} />
          </>,
        )}
      </View>
      <View style={s.controls}>
        <Btn
          title={t(open ? "x3.join" : "x3.separate")}
          icon="layers-outline"
          onPress={() => setOpen(!open)}
        />
        <Btn
          title={t("x3.rotate")}
          variant="ghost"
          onPress={() =>
            r.set(
              r.cur.current.a + 45 > 180 ? -135 : r.cur.current.a + 45,
              r.cur.current.b,
              true,
            )
          }
        />
        <Btn title={t("x3.front")} variant="ghost" onPress={r.reset} />
      </View>
      <Text style={[s.hint, { marginTop: 8 }]}>{t("x3.drag")}</Text>
      <View
        style={{
          alignSelf: "center",
          paddingHorizontal: 20,
          marginTop: 14,
          maxWidth: 560,
          width: "100%",
        }}
      >
        <Card>
          <Text style={[s.partT, { fontSize: 18, marginBottom: 4 }]}>
            {t("x3.parts")}
          </Text>
          {["l1", "l2", "l3"].map((id, i) => (
            <Pressable
              key={id}
              onPress={() => setSel(id)}
              style={[
                s.part,
                i > 0 && { borderTopWidth: 1, borderTopColor: c.line },
              ]}
            >
              <View style={[s.num, sel === id && { backgroundColor: c.aqua }]}>
                <Text style={s.numT}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.partT}>{t(`x3.${id}.t`)}</Text>
                <Text style={s.partD}>{t(`x3.${id}.d`)}</Text>
              </View>
            </Pressable>
          ))}
        </Card>
        <Text style={s.note}>{t("x3.illus")}</Text>
      </View>
    </ScrollView>
  );
}

export default function Experience3D({ onClose }) {
  const { t } = useI18n();
  const { colors: c } = useTheme();
  const s = useS();
  const insets = useSafeAreaInsets();
  const [scene, setScene] = useState("box"); // a experiência abre na caixa
  const go = setScene;
  return (
    <View
      style={[
        s.root,
        { paddingTop: insets.top + 6, paddingBottom: insets.bottom + 10 },
      ]}
    >
      <View style={s.top}>
        <View style={s.topRow}>
          <Pressable
            onPress={onClose}
            style={s.close}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={20} color={c.accent} />
            <Text style={s.closeT}>{t("x3.close")}</Text>
          </Pressable>
          <Text style={s.title}>{t("x3.title")}</Text>
        </View>
        <View style={s.tabs}>
          <Segmented
            levels={[
              { id: "box", label: t("x3.box") },
              { id: "patch", label: t("x3.patch") },
            ]}
            value={scene}
            onChange={go}
            label={t("x3.title")}
          />
        </View>
      </View>
      {scene === "box" ? <BoxScene go={go} /> : <PatchScene />}
    </View>
  );
}
