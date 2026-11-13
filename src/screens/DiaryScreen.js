import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Page, FadeIn, Card, Sheet, Segmented, ND } from "../components/ui";
import {
  Btn,
  ScalePicker,
  OptionalCount,
  ScreenTop,
} from "../components/forms";
import Body from "../components/Body";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useApp, symptomsOf } from "../state/app";
import { AREAS, SCALE, symptomById } from "../data/symptoms";
import { PLACEMENTS } from "../data/mock";

const useS = makeStyles((c) => ({
  badge: {
    alignSelf: "flex-start",
    backgroundColor: c.mist,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 6,
  },
  badgeT: { fontSize: 13, fontWeight: "700", color: c.accent },
  strip: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  dayDot: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: c.line,
  },
  dayT: { fontSize: 11, fontWeight: "700", color: c.muted },
  legend: { fontSize: 12.5, color: c.muted, marginTop: 8 },
  toggle: {
    flexDirection: "row",
    backgroundColor: c.mist,
    borderRadius: 999,
    padding: 3,
    alignSelf: "center",
    marginVertical: 12,
  },
  tBtn: { paddingVertical: 8, paddingHorizontal: 22, borderRadius: 999 },
  tOn: { backgroundColor: c.card, ...c.shadow, shadowOpacity: 0.14 },
  tText: { fontSize: 14, color: c.muted, fontWeight: "500" },
  h: { fontSize: 17, fontWeight: "600", color: c.ink },
  sub: { fontSize: 13, color: c.muted, marginTop: 2 },
  link: { alignSelf: "center", marginTop: 12, paddingVertical: 6 },
  linkT: { color: c.accent, fontSize: 14, fontWeight: "600" },
  prog: { fontSize: 13, color: c.muted, textAlign: "center", marginBottom: 12 },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: c.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  area: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  div: { borderTopWidth: 1, borderTopColor: c.line },
}));

// "Gira" o corpo: encolhe na horizontal, troca a vista e volta
function useFlip() {
  const [side, setSide] = useState("front");
  const flip = useRef(new Animated.Value(1)).current;
  const turn = (next) => {
    if (next !== side)
      Animated.timing(flip, {
        toValue: 0.02,
        duration: 190,
        useNativeDriver: ND,
      }).start(() => {
        setSide(next);
        Animated.timing(flip, {
          toValue: 1,
          duration: 240,
          useNativeDriver: ND,
        }).start();
      });
  };
  return { side, flip, turn };
}
function Toggle({ options, value, onChange }) {
  const s = useS();
  const { colors: c } = useTheme();
  return (
    <View style={s.toggle}>
      {options.map(([k, label]) => (
        <Pressable
          key={k}
          onPress={() => onChange(k)}
          style={[s.tBtn, value === k && s.tOn]}
          accessibilityRole="radio"
          accessibilityState={{ selected: value === k }}
        >
          <Text
            style={[
              s.tText,
              value === k && { color: c.ink, fontWeight: "700" },
            ]}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// Primeira vez no diário: a pessoa mostra onde colocou o patch (três posições possíveis no corpo)
function Placement() {
  const { t } = useI18n();
  const a = useApp();
  const { side, flip, turn } = useFlip();
  const [pick, setPick] = useState(a.patch.placement);
  const choose = (id) => {
    setPick(id);
    turn(PLACEMENTS.find((p) => p.id === id).side);
  };
  return (
    <Page>
      <FadeIn>
        <ScreenTop title={t("ob.title")} subtitle={t("ob.lead")} />
      </FadeIn>
      <FadeIn delay={70}>
        <Toggle
          options={[
            ["front", t("ci.front")],
            ["back", t("ci.back")],
          ]}
          value={side}
          onChange={turn}
        />
        <Body
          side={side}
          flip={flip}
          spots={PLACEMENTS.filter((p) => p.side === side).map((p) => ({
            ...p,
            pickMode: true,
          }))}
          selectedSpot={pick}
          onSpot={choose}
          hint={(id) => t(`place.${id}`)}
          label={() => ""}
          profile={a.profile}
        />
        <View style={{ marginTop: 18, gap: 10 }}>
          {PLACEMENTS.map((p) => (
            <Btn
              key={p.id}
              title={t(`place.${p.id}`)}
              variant={pick === p.id ? "primary" : "ghost"}
              onPress={() => choose(p.id)}
            />
          ))}
          <Btn
            title={t("ob.continue")}
            icon="arrow-forward"
            onPress={() => {
              a.setPatch({ placement: pick });
              a.setFlags({ placed: true });
            }}
            style={{ marginTop: 8 }}
          />
        </View>
      </FadeIn>
    </Page>
  );
}

const blank = () => ({
  scores: {},
  events: {},
  sleepQuality: "",
  sleepHours: "",
  energy: "",
});

function Diary() {
  const { t, num } = useI18n();
  const { colors: c } = useTheme();
  const a = useApp();
  const s = useS();
  const { side, flip, turn } = useFlip();
  const [view, setView] = useState("body");
  const [viewDay, setViewDay] = useState(null);
  const [sheet, setSheet] = useState(null);
  const day = viewDay || a.day,
    slot = a.slot;
  const ids = symptomsOf(a.plan, slot);
  const rec = a.recordOf(day, slot);
  const [draft, setDraft] = useState(rec ? { ...blank(), ...rec } : blank());
  useEffect(() => {
    setDraft(rec ? { ...blank(), ...rec } : blank());
  }, [day, slot, a.plan.version]); // editar o mesmo dia e momento atualiza o registro existente
  const name = (id) => (id === "custom" ? a.plan.custom : t(`sym.${id}`));
  const answered = (id) =>
    draft.scores[id] !== undefined && draft.scores[id] !== "";
  const setScore = (id, v) =>
    setDraft((d) => ({ ...d, scores: { ...d.scores, [id]: v } }));
  const setEvents = (id, v) =>
    setDraft((d) => ({ ...d, events: { ...d.events, [id]: v } }));
  const areas = AREAS.filter((ar) =>
    ids.some((id) => symptomById(id).area === ar.id),
  );
  const done = Object.fromEntries(
    areas.map((ar) => [
      ar.id,
      ids.filter((id) => symptomById(id).area === ar.id).every(answered),
    ]),
  );
  const placement = PLACEMENTS.find((p) => p.id === a.patch.placement);
  const wakeLike = slot === "wake" || slot === "morning";
  const dayStyle = {
    done: { backgroundColor: c.violet, borderColor: c.violet },
    pending: { borderColor: c.accent, borderStyle: "dashed" },
    today: { backgroundColor: c.mist, borderColor: c.violet },
    future: { opacity: 0.45 },
  };

  const symptomCard = (id) => (
    <View style={{ paddingVertical: 12 }}>
      <Text style={s.h}>{name(id)}</Text>
      <ScalePicker
        value={draft.scores[id] ?? ""}
        onChange={(v) => setScore(id, v)}
        options={SCALE}
        labelOf={(o) => t(`scale.${o}`)}
        chooseLabel={t("scale.choose")}
        skipLabel={t("scale.skip")}
        a11y={name(id)}
      />
      <OptionalCount
        value={draft.events[id] ?? ""}
        onChange={(v) => setEvents(id, v)}
        label={t("diary.events")}
        placeholder={t("diary.select")}
      />
    </View>
  );

  return (
    <Page>
      <FadeIn>
        <ScreenTop title={t("diary.title")} subtitle={t("diary.lead")} />
        <View style={s.badge}>
          <Text style={s.badgeT}>
            {t("diary.reg", { d: num(day), n: num(a.plan.days) })}
          </Text>
        </View>
        <View style={s.strip}>
          {[...Array(a.plan.days).keys()].map((i) => {
            const st = a.dayState(i + 1);
            return (
              <Pressable
                key={i}
                disabled={st === "future"}
                onPress={() => setViewDay(i + 1 === a.day ? null : i + 1)}
                accessibilityRole="button"
                accessibilityLabel={`${t("diary.day")} ${i + 1}: ${t(`dayst.${st}`)}`}
                style={[
                  s.dayDot,
                  dayStyle[st],
                  day === i + 1 && {
                    borderWidth: 2.5,
                    borderColor: c.accent,
                    borderStyle: "solid",
                  },
                ]}
              >
                {st === "done" ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                  <Text style={s.dayT}>{i + 1}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
        <Text style={s.legend}>
          {t("diary.legend", {
            done: num(a.doneDays),
            pend: num(a.pending.length),
          })}
        </Text>
        {!!viewDay && (
          <Pressable onPress={() => setViewDay(null)} style={s.link}>
            <Text style={s.linkT}>{t("diary.backToday")}</Text>
          </Pressable>
        )}
      </FadeIn>

      <FadeIn delay={60} style={{ marginTop: 14 }}>
        {a.slots.length === 2 ? (
          <Segmented
            levels={a.slots.map((x) => ({ id: x, label: t(`slot.${x}`) }))}
            value={slot}
            onChange={a.setSlot}
            label={t("diary.moment")}
          />
        ) : (
          <View style={s.badge}>
            <Text style={s.badgeT}>
              {t("diary.moment")}: {t(`slot.${slot}`)}
            </Text>
          </View>
        )}
        <Toggle
          options={[
            ["body", t("diary.body")],
            ["list", t("diary.list")],
          ]}
          value={view}
          onChange={setView}
        />
        <Text style={s.prog}>
          {t("diary.answered", {
            n: num(ids.filter(answered).length),
            total: num(ids.length),
          })}
        </Text>

        {view === "body" ? (
          <>
            <Toggle
              options={[
                ["front", t("ci.front")],
                ["back", t("ci.back")],
              ]}
              value={side}
              onChange={turn}
            />
            <Body
              side={side}
              flip={flip}
              areas={areas}
              done={done}
              onArea={setSheet}
              spots={placement.side === side ? [placement] : []}
              onSpot={() => {}}
              hint={() => t("ci.patchHint")}
              label={(id) => t(`area.${id}`)}
              profile={a.profile}
            />
            <Pressable
              onPress={() => a.setFlags({ placed: false })}
              style={s.link}
            >
              <Text style={s.linkT}>{t("ci.change")}</Text>
            </Pressable>
            <Card style={{ padding: 0, overflow: "hidden", marginTop: 6 }}>
              {areas.map((ar, i) => (
                <Pressable
                  key={ar.id}
                  onPress={() => setSheet(ar.id)}
                  style={[s.area, i > 0 && s.div]}
                  accessibilityRole="button"
                >
                  <View
                    style={[
                      s.rowIcon,
                      done[ar.id] && { backgroundColor: c.violet },
                    ]}
                  >
                    {done[ar.id] ? (
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    ) : (
                      <MaterialCommunityIcons
                        name={ar.icon}
                        size={20}
                        color={c.accent}
                      />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.h}>{t(`area.${ar.id}`)}</Text>
                    <Text style={s.sub}>
                      {ids
                        .filter((id) => symptomById(id).area === ar.id)
                        .map(name)
                        .join(", ")}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={c.muted} />
                </Pressable>
              ))}
            </Card>
          </>
        ) : (
          <Card>
            {ids.map((id, i) => (
              <View key={id} style={i > 0 && s.div}>
                {symptomCard(id)}
              </View>
            ))}
          </Card>
        )}

        <Card style={{ marginTop: 14 }}>
          <Text style={s.h}>{t("diary.optional")}</Text>
          {wakeLike ? (
            <>
              <Text style={[s.sub, { marginTop: 10 }]}>
                {t("diary.sleepQ")}
              </Text>
              <ScalePicker
                value={draft.sleepQuality}
                onChange={(v) => setDraft((d) => ({ ...d, sleepQuality: v }))}
                options={[1, 2, 3, 4, 5]}
                base={1}
                labelOf={(o) => t(`q.${o}`)}
                chooseLabel={t("scale.choose")}
                skipLabel={t("scale.skip")}
                a11y={t("diary.sleepQ")}
              />
              <OptionalCount
                value={draft.sleepHours}
                onChange={(v) => setDraft((d) => ({ ...d, sleepHours: v }))}
                label={t("diary.sleepH")}
                placeholder={t("diary.select")}
                max={24}
              />
            </>
          ) : (
            <>
              <Text style={[s.sub, { marginTop: 10 }]}>
                {t("diary.energy")}
              </Text>
              <ScalePicker
                value={draft.energy}
                onChange={(v) => setDraft((d) => ({ ...d, energy: v }))}
                options={[1, 2, 3, 4, 5]}
                base={1}
                labelOf={(o) => t(`e.${o}`)}
                chooseLabel={t("scale.choose")}
                skipLabel={t("scale.skip")}
                a11y={t("diary.energy")}
              />
            </>
          )}
        </Card>
        <View style={{ marginTop: 18 }}>
          <Btn
            title={t("diary.save")}
            onPress={() => {
              a.saveRecord(day, slot, draft);
              a.go("welcome");
            }}
          />
        </View>
      </FadeIn>

      <Sheet
        visible={!!sheet}
        onClose={() => setSheet(null)}
        title={sheet ? t(`area.${sheet}`) : ""}
        subtitle={sheet ? t(`area.${sheet}.sub`) : ""}
        footer={
          <View style={{ marginTop: 12 }}>
            <Btn title={t("ci.done")} onPress={() => setSheet(null)} />
          </View>
        }
      >
        {ids
          .filter((id) => symptomById(id).area === sheet)
          .map((id, i) => (
            <View key={id} style={i > 0 && s.div}>
              {symptomCard(id)}
            </View>
          ))}
      </Sheet>
    </Page>
  );
}

export default function DiaryScreen() {
  const a = useApp();
  return a.flags.placed ? <Diary /> : <Placement />;
}
