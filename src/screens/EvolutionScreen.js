import React, { useState } from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Page, FadeIn, Card, Chips, Segmented } from "../components/ui";
import { Btn, ScreenTop } from "../components/forms";
import { LineChart, BarChart } from "../components/Charts";
import SyncButton from "../components/SyncButton";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useApp } from "../state/app";
import { makeSynthetic } from "../data/synthetic";

const MOON = [
  "moon-new",
  "moon-waxing-crescent",
  "moon-first-quarter",
  "moon-waxing-gibbous",
  "moon-full",
];
const isN = (v) => typeof v === "number";
// Pearson só com pares suficientes (5 ou mais) e variância não nula
const pearson = (x, y) => {
  const p = x.map((v, i) => [v, y[i]]).filter(([a, b]) => isN(a) && isN(b)),
    n = p.length;
  if (n < 5) return null;
  const mx = p.reduce((s, q) => s + q[0], 0) / n,
    my = p.reduce((s, q) => s + q[1], 0) / n;
  let sxy = 0,
    sxx = 0,
    syy = 0;
  p.forEach(([a, b]) => {
    sxy += (a - mx) * (b - my);
    sxx += (a - mx) ** 2;
    syy += (b - my) ** 2;
  });
  return sxx && syy ? { r: sxy / Math.sqrt(sxx * syy), n } : null;
};

const useS = makeStyles((c) => ({
  h: { fontSize: 17, fontWeight: "700", color: c.ink, letterSpacing: -0.2 },
  sub: { fontSize: 13, color: c.muted, marginTop: 3, lineHeight: 19 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: c.line,
  },
  l: { fontSize: 14, color: c.muted },
  v: {
    fontSize: 14,
    fontWeight: "600",
    color: c.ink,
    flexShrink: 1,
    textAlign: "right",
  },
  section: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: c.ink,
    marginTop: 22,
    marginBottom: 10,
  },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 6 },
  lg: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  lgT: { fontSize: 12, color: c.muted },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: c.mist,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 11,
    marginBottom: 10,
  },
  tagT: { fontSize: 12, fontWeight: "700", color: c.accent },
  moons: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  synth: { fontSize: 15, lineHeight: 22, color: c.ink, marginTop: 10 },
}));

// Evolução: síntese antes dos gráficos, origem dos dados sempre visível e comparação exploratória com o patch
export default function EvolutionScreen() {
  const { t, num } = useI18n();
  const { colors: c } = useTheme();
  const a = useApp();
  const s = useS();
  const [src, setSrc] = useState("mine");
  const n = a.plan.days,
    ids = a.plan.symptoms;
  const [focus, setFocus] = useState(ids[0]);
  const f = ids.includes(focus) ? focus : ids[0];
  const name = (id) => (id === "custom" ? a.plan.custom : t(`sym.${id}`));
  const per = (fn) => Array.from({ length: n }, (_, i) => fn(i + 1));
  const syn = makeSynthetic(n, ids);
  const mine = src === "mine";

  // Registros da usuária agrupados por dia (nunca zero)
  const byDay = {};
  Object.entries(a.records).forEach(([k, r]) => {
    const d = +k.split("|")[0];
    (byDay[d] = byDay[d] || []).push(r);
  });
  const col = (d, get) => (byDay[d] || []).map(get).filter(isN);
  const scores = mine
    ? per((d) => {
        const v = col(d, (r) => r.scores[f]);
        return v.length ? Math.max(...v) : null;
      })
    : syn.scores[f];
  const events = (id) =>
    mine
      ? per((d) => {
          const v = col(d, (r) => r.events && r.events[id]);
          return v.length ? v.reduce((x, y) => x + y, 0) : null;
        })
      : id === "hotFlashes"
        ? syn.events
        : per(() => null);
  const last = (key) =>
    per((d) => {
      const v = col(d, (r) => r[key]);
      return v.length ? v[v.length - 1] : null;
    });
  const sleepH = mine ? last("sleepHours") : syn.sleepDiary;
  const sleepQ = mine
    ? last("sleepQuality")
    : syn.sleepDiary.map((h) => Math.max(1, Math.min(5, Math.round(h - 3))));
  const energy = mine ? last("energy") : syn.energy;
  const cut = (arr) => (mine ? arr.map((v, i) => (i < a.day ? v : null)) : arr); // sinais do patch só até o dia atual
  const P = {
    sleep: cut(syn.patch.sleep),
    hot: cut(syn.patch.hot),
    hr: cut(syn.patch.hr),
    temp: cut(syn.patch.temp),
    cond: cut(syn.patch.cond),
  };
  const hotRep =
    mine && !ids.includes("hotFlashes")
      ? per(() => null)
      : events("hotFlashes");

  const have = scores.filter(isN),
    k = have.length,
    gaps = Math.max(0, (mine ? Math.min(a.day, n) : n) - k);
  const avg = (x) => x.reduce((p, q) => p + q, 0) / (x.length || 1),
    half = Math.floor(k / 2);
  const diff = k >= 4 ? avg(have.slice(half)) - avg(have.slice(0, half)) : 0;
  const trend = t(
    diff >= 0.5 ? "evo.up" : diff <= -0.5 ? "evo.down" : "evo.same",
  );
  const ev = events(f),
    evMax = Math.max(4, ...ev.filter(isN));
  const corr = !mine ? pearson(syn.events, syn.patch.hot) : null;
  const legend = (items) => (
    <View style={s.legend}>
      {items.map(([col2, lab]) => (
        <View key={lab} style={s.lg}>
          <View style={[s.dot, { backgroundColor: col2 }]} />
          <Text style={s.lgT}>{lab}</Text>
        </View>
      ))}
    </View>
  );
  const row = (l, v, first) => (
    <View key={l} style={[s.row, first && { borderTopWidth: 0 }]}>
      <Text style={s.l}>{l}</Text>
      <Text style={s.v}>{v}</Text>
    </View>
  );

  return (
    <Page>
      <FadeIn>
        <ScreenTop title={t("evo.title")} subtitle={t("evo.lead")} />
        <Segmented
          levels={[
            { id: "mine", label: t("evo.src.mine") },
            { id: "example", label: t("evo.src.example") },
          ]}
          value={src}
          onChange={setSrc}
          label={t("evo.origin")}
        />
        <Text style={[s.sub, { marginBottom: 12 }]}>
          {t(`evo.srcNote.${src}`)}
        </Text>
        <Card>
          <Text style={s.h}>{t("evo.summary")}</Text>
          <View style={{ marginTop: 8 }}>
            {row(
              t("evo.period"),
              t("evo.periodV", { d: num(a.day), n: num(n) }),
              true,
            )}
            {row(t("evo.origin"), t(`evo.src.${src}`))}
            {row(t("evo.withRec"), num(mine ? a.analyzable : n))}
            {row(t("evo.pend"), num(mine ? a.pending.length : 0))}
          </View>
          <Text style={s.synth}>
            {k < 3
              ? t("evo.empty")
              : t("evo.synth", {
                  name: name(f),
                  trend,
                  k: num(k),
                  n: num(n),
                  gaps: num(gaps),
                })}
          </Text>
        </Card>
      </FadeIn>

      <FadeIn delay={70}>
        <Text style={s.section}>{t("evo.focus")}</Text>
        <Chips
          options={ids.map((id) => ({ id, label: name(id) }))}
          value={f}
          onChange={setFocus}
        />
        <Card style={{ marginTop: 14 }}>
          <Text style={s.h}>{t("evo.intensity")}</Text>
          <LineChart
            n={n}
            yMin={0}
            yMax={4}
            ticks={[0, 1, 2, 3, 4]}
            series={[{ values: scores, color: c.violet }]}
          />
          <Text style={s.sub}>{t("evo.scaleLegend")}</Text>
        </Card>
        {ev.some(isN) && (
          <Card>
            <Text style={s.h}>{t("evo.eventsT")}</Text>
            <BarChart
              n={n}
              yMax={evMax}
              ticks={[0, evMax]}
              series={[{ values: ev, color: c.royal }]}
            />
          </Card>
        )}
        <Card>
          <Text style={s.h}>{t("evo.sleepT")}</Text>
          <Text style={s.sub}>{t("evo.sleepH")}</Text>
          <LineChart
            n={n}
            yMin={3}
            yMax={10}
            ticks={[4, 6, 8, 10]}
            height={120}
            series={[{ values: sleepH, color: c.primary }]}
          />
          <Text style={s.sub}>{t("evo.energyT")}</Text>
          <LineChart
            n={n}
            yMin={1}
            yMax={5}
            ticks={[1, 3, 5]}
            height={100}
            series={[{ values: energy, color: c.sky }]}
          />
          <Text style={[s.sub, { marginTop: 8 }]}>{t("evo.nights")}</Text>
          <View style={s.moons}>
            {sleepQ.map((q, i) => (
              <MaterialCommunityIcons
                key={i}
                name={isN(q) ? MOON[q - 1] : "circle-outline"}
                size={20}
                color={isN(q) ? c.violet : c.line}
              />
            ))}
          </View>
        </Card>
      </FadeIn>

      <FadeIn delay={130}>
        <Text style={s.section}>{t("evo.patchT")}</Text>
        {!a.patch.synced ? (
          <Card>
            <Text style={s.sub}>{t("evo.patchLead")}</Text>
            <View style={{ marginTop: 14 }}>
              <SyncButton />
            </View>
          </Card>
        ) : (
          <>
            <View style={s.tag}>
              <Text style={s.tagT}>{t("evo.patchSim")}</Text>
            </View>
            <Card>
              <Text style={s.h}>{t("evo.cSleep")}</Text>
              <LineChart
                n={n}
                yMin={3}
                yMax={10}
                ticks={[4, 6, 8, 10]}
                height={130}
                series={[
                  { values: sleepH, color: c.primary },
                  { values: P.sleep, color: c.aqua, dashed: true },
                ]}
              />
              {legend([
                [c.primary, t("evo.lgDiary")],
                [c.aqua, t("evo.lgPatch")],
              ])}
            </Card>
            <Card>
              <Text style={s.h}>{t("evo.cHot")}</Text>
              <BarChart
                n={n}
                yMax={12}
                ticks={[0, 6, 12]}
                series={[
                  { values: hotRep, color: c.violet },
                  { values: P.hot, color: c.aqua },
                ]}
              />
              {legend([
                [c.violet, t("evo.lgDiary")],
                [c.aqua, t("evo.lgPatch")],
              ])}
              {mine && !ids.includes("hotFlashes") && (
                <Text style={s.sub}>{t("evo.noHot")}</Text>
              )}
              <Text style={[s.sub, { marginTop: 8 }]}>
                {mine
                  ? t("evo.corrMine")
                  : corr
                    ? t("evo.corr", {
                        r: num(corr.r, 2),
                        n: num(corr.n),
                        d: num(n),
                      })
                    : t("evo.corrNone")}
              </Text>
            </Card>
            <Card>
              <Text style={s.h}>{t("evo.cHr")}</Text>
              <LineChart
                n={n}
                yMin={50}
                yMax={90}
                ticks={[50, 70, 90]}
                height={120}
                series={[{ values: P.hr, color: c.aqua }]}
              />
            </Card>
            <Card>
              <Text style={s.h}>{t("evo.cTemp")}</Text>
              <LineChart
                n={n}
                yMin={32.5}
                yMax={34.5}
                ticks={[33, 34]}
                height={110}
                series={[{ values: P.temp, color: c.aqua }]}
              />
              <Text style={[s.h, { marginTop: 10 }]}>{t("evo.cCond")}</Text>
              <LineChart
                n={n}
                yMin={1}
                yMax={4}
                ticks={[1, 2.5, 4]}
                height={110}
                series={[{ values: P.cond, color: c.aqua }]}
              />
            </Card>
            <Card>
              {ids
                .filter(
                  (id) =>
                    ![
                      "sleep",
                      "hotFlashes",
                      "nightSweats",
                      "palpitations",
                    ].includes(id),
                )
                .map((id, i) => row(name(id), t("evo.noEq"), i === 0))}
              <View style={{ marginTop: 12 }}>
                <SyncButton variant="ghost" />
              </View>
            </Card>
          </>
        )}
        <View style={{ gap: 10, marginTop: 10 }}>
          <Btn
            title={t("evo.toConsult")}
            variant="ghost"
            icon="medkit-outline"
            onPress={() => a.tab("Consult")}
          />
          <Btn title={t("evo.finish")} onPress={() => a.go("welcome")} />
        </View>
      </FadeIn>
    </Page>
  );
}
