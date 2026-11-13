import React, { useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { makeStyles, useTheme } from "../theme";

const useS = makeStyles((c) => ({
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: c.mist,
    borderWidth: 1,
    borderColor: "transparent",
    maxWidth: "100%",
  },
  chipText: { fontSize: 13, fontWeight: "600", color: c.accent },
  skip: { backgroundColor: "transparent", borderColor: c.line },
  hint: { fontSize: 12, color: c.muted, marginTop: 8 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 12,
  },
  label: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 140,
    fontSize: 14,
    color: c.muted,
    fontWeight: "500",
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: c.mist,
  },
  pillText: { fontSize: 13, fontWeight: "700", color: c.accent },
  step: { flexDirection: "row", alignItems: "center", gap: 10 },
  sBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: c.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  sVal: {
    minWidth: 52,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "700",
    color: c.ink,
  },
  btn: {
    minHeight: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    flexShrink: 1,
  },
  ghost: { backgroundColor: c.mist },
  input: {
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.card,
    color: c.ink,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginTop: 6,
  },
  fLabel: { fontSize: 14, fontWeight: "600", color: c.ink, marginTop: 14 },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  backText: { color: c.accent, fontSize: 15, fontWeight: "600" },
  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.7,
    color: c.ink,
    marginTop: 6,
  },
  sub: {
    fontSize: 16,
    lineHeight: 23,
    color: c.muted,
    marginTop: 6,
    marginBottom: 14,
  },
}));
const KEYS = ["none", "mild", "moderate", "strong", "veryStrong"];

// Seletor de escala: começa SEM valor ("Escolha a escala") e oferece "Não registrar". Ausência de registro não é "Não senti".
export function ScalePicker({
  value,
  onChange,
  options = [0, 1, 2, 3, 4],
  labelOf,
  chooseLabel,
  skipLabel,
  base = 0,
  a11y,
}) {
  const s = useS();
  const { colors: c } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={a11y}>
      {value === "" && <Text style={s.hint}>{chooseLabel}</Text>}
      <View style={s.chips}>
        {options.map((o) => {
          const on = value === o,
            k = KEYS[Math.min(4, o - base)];
          return (
            <Pressable
              key={o}
              onPress={() => onChange(o)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              style={[
                s.chip,
                on && { backgroundColor: k === "none" ? c.ink : c.lvl[k] },
              ]}
            >
              <Text
                style={[
                  s.chipText,
                  on && { color: k === "none" ? c.bg : c.lvlFg[k] },
                ]}
              >
                {labelOf(o)}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => onChange("skip")}
          accessibilityRole="radio"
          accessibilityState={{ selected: value === "skip" }}
          style={[
            s.chip,
            s.skip,
            value === "skip" && {
              backgroundColor: c.mist,
              borderColor: c.accent,
            },
          ]}
        >
          <Text
            style={[
              s.chipText,
              { color: value === "skip" ? c.accent : c.muted },
            ]}
          >
            {skipLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// Contagem opcional: mostra "Selecione" até a pessoa escolher; limita os valores sem apagar o que já foi preenchido
export function OptionalCount({
  value,
  onChange,
  label,
  placeholder,
  max = 99,
}) {
  const s = useS();
  const { colors: c } = useTheme();
  const set = (n) => onChange(Math.max(0, Math.min(max, n)));
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      {value === "" || value === undefined ? (
        <Pressable onPress={() => set(0)} style={s.pill}>
          <Text style={s.pillText}>{placeholder}</Text>
        </Pressable>
      ) : (
        <View style={s.step}>
          <Pressable
            onPress={() => set(value - 1)}
            style={s.sBtn}
            accessibilityLabel="−"
          >
            <Ionicons name="remove" size={20} color={c.accent} />
          </Pressable>
          <Text style={s.sVal}>{value}</Text>
          <Pressable
            onPress={() => set(value + 1)}
            style={s.sBtn}
            accessibilityLabel="+"
          >
            <Ionicons name="add" size={20} color={c.accent} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

// Horário em passos de 30 minutos
export function TimeStepper({ value, onChange, label }) {
  const s = useS();
  const { colors: c } = useTheme();
  const [h, m] = value.split(":").map(Number);
  const move = (d) => {
    const t = (((h * 60 + m + d) % 1440) + 1440) % 1440;
    onChange(
      `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`,
    );
  };
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <View style={s.step}>
        <Pressable
          onPress={() => move(-30)}
          style={s.sBtn}
          accessibilityLabel="−"
        >
          <Ionicons name="remove" size={20} color={c.accent} />
        </Pressable>
        <Text style={s.sVal}>{value}</Text>
        <Pressable
          onPress={() => move(30)}
          style={s.sBtn}
          accessibilityLabel="+"
        >
          <Ionicons name="add" size={20} color={c.accent} />
        </Pressable>
      </View>
    </View>
  );
}

// Botão com resposta ao toque: encolhe um pouco ao pressionar e volta com mola
export function Btn({
  title,
  onPress,
  variant = "primary",
  icon,
  style,
  disabled,
}) {
  const s = useS();
  const { colors: c } = useTheme();
  const k = useRef(new Animated.Value(1)).current;
  const to = (v) =>
    Animated.spring(k, {
      toValue: v,
      friction: 5,
      tension: 220,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  const primary = variant === "primary";
  const inner = (
    <>
      {icon && (
        <Ionicons name={icon} size={20} color={primary ? "#fff" : c.accent} />
      )}
      <Text style={[s.btnText, { color: primary ? "#fff" : c.accent }]}>
        {title}
      </Text>
    </>
  );
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => !disabled && to(0.96)}
      onPressOut={() => to(1)}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={[{ opacity: disabled ? 0.45 : 1 }, style]}
    >
      <Animated.View style={{ transform: [{ scale: k }] }}>
        {primary ? (
          <LinearGradient
            colors={[c.primary, c.violet]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.btn}
          >
            {inner}
          </LinearGradient>
        ) : (
          <View style={[s.btn, s.ghost]}>{inner}</View>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  maxLength,
}) {
  const s = useS();
  const { colors: c } = useTheme();
  return (
    <View>
      <Text style={s.fLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={[
          s.input,
          multiline && { minHeight: 84, textAlignVertical: "top" },
        ]}
        accessibilityLabel={label}
      />
    </View>
  );
}

// Topo das telas: voltar (opcional), título e subtítulo
export function ScreenTop({ title, subtitle, onBack, backLabel }) {
  const s = useS();
  const { colors: c } = useTheme();
  return (
    <View>
      {onBack && (
        <Pressable onPress={onBack} style={s.back} accessibilityRole="button">
          <Ionicons name="chevron-back" size={20} color={c.accent} />
          <Text style={s.backText}>{backLabel}</Text>
        </Pressable>
      )}
      <Text style={s.title}>{title}</Text>
      {!!subtitle && <Text style={s.sub}>{subtitle}</Text>}
    </View>
  );
}
