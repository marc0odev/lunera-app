import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  PanResponder,
} from "react-native";
import Header from "./Header";
import { ND, ScrollCtx, useEdge } from "./scroll";
import { useTheme, makeStyles, MAX_W } from "../theme";
export { ND };

const useS = makeStyles((c) => ({
  card: {
    backgroundColor: c.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: c.line,
    ...c.shadow,
  },
  track: {
    flexDirection: "row",
    backgroundColor: c.mist,
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  seg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 9,
    minHeight: 42,
  },
  segOn: {
    backgroundColor: c.card,
    ...c.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  segText: {
    fontSize: 13,
    color: c.muted,
    fontWeight: "500",
    textAlign: "center",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: c.mist,
    maxWidth: "100%",
  },
  chipOn: { backgroundColor: c.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: c.accent },
  label: { fontSize: 14, color: c.muted, fontWeight: "500" },
  scrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: c.scrim,
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 50,
  },
  sheet: {
    width: "100%",
    maxWidth: MAX_W,
    maxHeight: "88%",
    backgroundColor: c.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: c.line,
    marginBottom: 14,
  },
  grab: { paddingTop: 10, marginTop: -10, cursor: "grab", userSelect: "none" },
  fill: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  scrimBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: c.scrim,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: c.ink,
  },
  sheetSub: { fontSize: 14, color: c.muted, marginTop: 2 },
}));

export const Card = ({ style, children }) => (
  <View style={[useS().card, style]}>{children}</View>
);

// Estrutura comum das telas: header da marca + conteúdo centralizado
export function Page({ children }) {
  const { colors } = useTheme();
  const y = useRef(new Animated.Value(0)).current;
  return (
    <ScrollCtx.Provider value={y}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <Header />
        <Animated.ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y } } }],
            { useNativeDriver: false },
          )}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 36 }}
        >
          <View
            style={{ width: "100%", maxWidth: MAX_W, paddingHorizontal: 20 }}
          >
            {children}
          </View>
        </Animated.ScrollView>
      </View>
    </ScrollCtx.Provider>
  );
}

// Entrada suave (sobe e aparece) a cada tela
export function FadeIn({ children, delay = 0, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 560,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: ND,
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
                outputRange: [22, 0],
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

// Controle segmentado (duas a quatro opções)
export function Segmented({ levels, value, onChange, label }) {
  const s = useS();
  const { colors } = useTheme();
  return (
    <View
      style={s.track}
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
    >
      {levels.map(({ id, label: text }) => (
        <Pressable
          key={id}
          onPress={() => onChange(id)}
          accessibilityRole="radio"
          accessibilityState={{ selected: value === id }}
          style={[s.seg, value === id && s.segOn]}
        >
          <Text
            style={[
              s.segText,
              value === id && { color: colors.ink, fontWeight: "700" },
            ]}
            numberOfLines={2}
          >
            {text}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// Opções em chips (escolha única)
export function Chips({ options, value, onChange, label }) {
  const s = useS();
  return (
    <View>
      {!!label && <Text style={s.label}>{label}</Text>}
      <View style={s.chipRow} accessibilityRole="radiogroup">
        {options.map((o) => (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: value === o.id }}
            style={[s.chip, value === o.id && s.chipOn]}
          >
            <Text style={[s.chipText, value === o.id && { color: "#fff" }]}>
              {o.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/* Portal: folhas e menus aparecem por cima do App, mas DENTRO da moldura dele (assim também funcionam no telefone 3D). */
const PortalCtx = createContext(null);
export function PortalProvider({ children }) {
  const store = useRef({ nodes: {}, update: () => {} }).current;
  const [, force] = useState(0);
  store.update = () => force((n) => n + 1);
  return (
    <PortalCtx.Provider value={store}>
      {children}
      {Object.entries(store.nodes).map(([k, n]) => (
        <React.Fragment key={k}>{n}</React.Fragment>
      ))}
    </PortalCtx.Provider>
  );
}
export function Portal({ visible, children }) {
  const store = useContext(PortalCtx);
  const id = useRef(`p${Math.random()}`).current;
  useEffect(() => {
    if (visible) store.nodes[id] = children;
    else delete store.nodes[id];
    store.update();
  });
  useEffect(
    () => () => {
      delete store.nodes[id];
      store.update();
    },
    [],
  );
  return null;
}

// Folha que sobe de baixo. Para fechar: arraste o topo para baixo (ou toque fora). Abre e fecha com animação.
function SheetView({ onClose, title, subtitle, children, footer }) {
  const s = useS();
  const edge = useEdge();
  const v = useRef(new Animated.Value(0)).current; // 0 fechada, 1 aberta
  const drag = useRef(new Animated.Value(0)).current; // deslocamento do arrasto
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    Animated.spring(v, {
      toValue: 1,
      friction: 9,
      tension: 70,
      useNativeDriver: ND,
    }).start();
  }, []);
  const dismiss = () =>
    Animated.parallel([
      Animated.timing(drag, {
        toValue: 700,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: ND,
      }),
      Animated.timing(v, { toValue: 0, duration: 220, useNativeDriver: ND }),
    ]).start(() => close.current());
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 4,
      onPanResponderMove: (_, g) => drag.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) =>
        g.dy > 90 || g.vy > 0.8
          ? dismiss()
          : Animated.spring(drag, {
              toValue: 0,
              friction: 7,
              useNativeDriver: ND,
            }).start(),
      onPanResponderTerminate: () =>
        Animated.spring(drag, {
          toValue: 0,
          friction: 7,
          useNativeDriver: ND,
        }).start(),
    }),
  ).current;
  const fade = Animated.multiply(
    v,
    drag.interpolate({
      inputRange: [0, 400],
      outputRange: [1, 0.3],
      extrapolate: "clamp",
    }),
  );
  return (
    <View style={[s.scrim, { backgroundColor: "transparent" }]}>
      <Animated.View
        pointerEvents="none"
        style={[s.scrimBg, { opacity: fade }]}
      />
      <Pressable style={s.fill} onPress={dismiss} accessibilityLabel="×" />
      <Animated.View
        style={[
          s.sheet,
          {
            paddingBottom: edge.bottom + 16,
            transform: [
              {
                translateY: Animated.add(
                  drag,
                  v.interpolate({ inputRange: [0, 1], outputRange: [420, 0] }),
                ),
              },
            ],
          },
        ]}
      >
        <View {...pan.panHandlers} style={s.grab} accessibilityHint="↓">
          <View style={s.handle} />
          <Text style={s.sheetTitle}>{title}</Text>
          {!!subtitle && <Text style={s.sheetSub}>{subtitle}</Text>}
        </View>
        <ScrollView
          style={{ marginTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {footer}
      </Animated.View>
    </View>
  );
}
export const Sheet = ({ visible, ...props }) => (
  <Portal visible={visible}>
    <SheetView {...props} />
  </Portal>
);
