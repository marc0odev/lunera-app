import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated, Easing } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { makeStyles, useTheme } from "../theme";
import { FigureSvg, bodyAmount } from "./Figure";
import { ND } from "./scroll";

function Pulse({ color, size = 44 }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(v, {
        toValue: 1,
        duration: 1700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: ND,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] }),
        transform: [
          {
            scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] }),
          },
        ],
      }}
    />
  );
}

const pos = (x, y) => ({
  position: "absolute",
  left: `${(x / 300) * 100}%`,
  top: `${(y / 600) * 100}%`,
});

const useS = makeStyles((c) => ({
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.card,
    paddingVertical: 16,
    ...c.shadow,
  },
  stage: { width: "78%", aspectRatio: 300 / 600, alignSelf: "center" },
  spot: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.card,
    borderWidth: 2,
    borderColor: c.violet,
    ...c.shadow,
    shadowOpacity: 0.25,
  },
  dotDone: { backgroundColor: c.violet },
  patchSpot: {
    width: 64,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  patch: {
    width: 50,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F4F5FA",
    borderWidth: 2,
    borderColor: c.aqua,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 8,
    ...c.shadow,
    shadowOpacity: 0.3,
  },
  ghost: {
    borderStyle: "dashed",
    borderColor: c.violet,
    backgroundColor: "transparent",
  },
  selected: {
    backgroundColor: "#F4F5FA",
    borderColor: c.violet,
    borderWidth: 3,
  },
  led: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.aqua },
  hint: {
    position: "absolute",
    top: -34,
    left: -68,
    width: 200,
    alignItems: "center",
    zIndex: 20,
  },
  hintIn: {
    backgroundColor: c.ink,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  hintText: { color: c.bg, fontSize: 12, fontWeight: "600" },
}));

// Corpo com pontos que "acendem" até a usuária registrar cada área.
export default function Body({
  side,
  flip,
  areas = [],
  done = {},
  onArea,
  spots = [],
  selectedSpot,
  onSpot,
  hint,
  label,
  profile,
}) {
  const { colors: c } = useTheme();
  const s = useS();
  const [hover, setHover] = useState(null);
  return (
    <View style={s.card}>
      <Animated.View style={[s.stage, { transform: [{ scaleX: flip }] }]}>
        <FigureSvg
          profile={profile}
          side={side}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {areas.map((a) => (
          <Pressable
            key={a.id}
            onPress={() => onArea(a.id)}
            accessibilityRole="button"
            accessibilityLabel={label(a.id)}
            style={[
              pos(a.id === "body" ? a.x - 21 * bodyAmount(profile) : a.x, a.y),
              s.spot,
              { marginLeft: -24, marginTop: -24 },
            ]}
          >
            {!done[a.id] && <Pulse color={c.violet} />}
            <View style={[s.dot, done[a.id] && s.dotDone]}>
              {done[a.id] ? (
                <Ionicons name="checkmark" size={20} color="#fff" />
              ) : (
                <MaterialCommunityIcons
                  name={a.icon}
                  size={20}
                  color={c.accent}
                />
              )}
            </View>
          </Pressable>
        ))}

        {spots.map((p) => {
          const picked = selectedSpot === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => onSpot(p.id)}
              onHoverIn={() => setHover(p.id)}
              onHoverOut={() => setHover(null)}
              onPressIn={() => setHover(p.id)}
              onPressOut={() => setHover(null)}
              accessibilityRole="button"
              accessibilityLabel={hint?.(p.id) || p.id}
              style={[
                pos(p.x, p.y),
                s.patchSpot,
                {
                  marginLeft: -32,
                  marginTop: -22,
                  zIndex: hover === p.id ? 30 : 5,
                },
              ]}
            >
              {(!selectedSpot || picked) && (
                <Pulse color={p.pickMode ? c.violet : c.aqua} size={40} />
              )}
              <View
                style={[
                  s.patch,
                  p.pickMode && !picked && s.ghost,
                  picked && p.pickMode && s.selected,
                ]}
              >
                <View style={s.led} />
              </View>
              {hover === p.id && hint && (
                <View style={s.hint} pointerEvents="none">
                  <View style={s.hintIn}>
                    <Text style={s.hintText} numberOfLines={1}>
                      {hint(p.id)}
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}
