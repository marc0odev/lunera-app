import React, { useState } from "react";
import { View, Text, Switch, Share, Platform, Pressable } from "react-native";
import { Page, FadeIn, Card, Sheet } from "../components/ui";
import { Btn, TextField, ScreenTop } from "../components/forms";
import { useTheme, makeStyles } from "../theme";
import { useI18n } from "../i18n";
import { useApp, symptomById } from "../state/app";

const useS = makeStyles((c) => ({
  h: { fontSize: 17, fontWeight: "700", color: c.ink },
  sub: { fontSize: 13.5, color: c.muted, marginTop: 4, lineHeight: 20 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: c.mist,
    maxWidth: "100%",
  },
  chipOn: { backgroundColor: c.primary },
  chipT: { fontSize: 13, fontWeight: "600", color: c.accent },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  rowT: { flex: 1, fontSize: 15, fontWeight: "600", color: c.ink },
  rep: { fontSize: 14, lineHeight: 22, color: c.ink },
  status: {
    fontSize: 13.5,
    color: c.accent,
    marginTop: 12,
    lineHeight: 20,
    fontWeight: "600",
  },
}));

// Minhas consultas: prioridades, perguntas, relatório revisável e "Preparar envio" (demonstração)
export default function ConsultScreen() {
  const { t, num } = useI18n();
  const { colors: c } = useTheme();
  const a = useApp();
  const s = useS();
  const [d, setD] = useState(a.consult);
  const [sheet, setSheet] = useState(null);
  const [status, setStatus] = useState("none");
  const set = (p) => setD((x) => ({ ...x, ...p }));
  const ids = a.plan.symptoms;
  const name = (id) => (id === "custom" ? a.plan.custom : t(`sym.${id}`));
  const toggle = (id) =>
    set({
      priorities: d.priorities.includes(id)
        ? d.priorities.filter((x) => x !== id)
        : d.priorities.length < 3
          ? [...d.priorities, id]
          : d.priorities,
    });

  // Relatório só com o que a usuária registrou. Itens íntimos e textos livres entram apenas se ela permitir.
  const lines = [
    t("con.repTitle"),
    `${t("con.name")}: ${a.name || t("con.noName")}${a.profile.age ? ` · ${a.profile.age}` : ""}`,
    `${t("evo.period")}: ${t("evo.periodV", { d: num(a.day), n: num(a.plan.days) })} · ${t("evo.withRec")}: ${num(a.analyzable)}`,
    t("con.origin"),
    t("con.gaps", { n: num(a.pending.length) }),
    "",
  ];
  const prio = d.priorities.filter((id) => ids.includes(id));
  if (prio.length)
    lines.push(`${t("con.prio")}: ${prio.map(name).join(", ")}`, "");
  ids
    .filter((id) => d.includeIntimate || !symptomById(id).intimate)
    .forEach((id) => {
      const v = Object.values(a.records)
        .map((r) => r.scores[id])
        .filter((x) => typeof x === "number");
      lines.push(
        `• ${name(id)}: ${v.length ? t("con.avg", { level: t(`scale.${Math.round(v.reduce((p, q) => p + q, 0) / v.length)}`), k: num(v.length) }) : t("con.noData")}`,
      );
    });
  if (d.includeFreeText && d.question)
    lines.push("", `${t("con.question")}: ${d.question}`);
  if (d.includeFreeText && d.notes) lines.push(`${t("con.notes")}: ${d.notes}`);
  lines.push("", t("con.repFoot"));
  const report = lines.join("\n");

  const pdf = () => {
    if (Platform.OS !== "web" || typeof window === "undefined")
      return setStatus("pdfNative");
    const w = window.open("", "_blank");
    if (!w) return setStatus("draftFail");
    const esc = report.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    w.document.write(
      `<title>Lunera App</title><pre style="font:16px/1.7 system-ui,sans-serif;white-space:pre-wrap;max-width:640px;margin:40px auto;color:#1E1B52">${esc}</pre>`,
    );
    w.document.close();
    w.focus();
    w.print();
    setStatus("pdf");
  };
  const draft = () =>
    Share.share({ message: report })
      .then(() => setStatus("draft"))
      .catch(() => setStatus("draftFail"));
  const sw = (label, k) => (
    <View style={s.row}>
      <Text style={s.rowT}>{label}</Text>
      <Switch
        value={d[k]}
        onValueChange={(v) => set({ [k]: v })}
        trackColor={{ true: c.violet, false: c.line }}
        thumbColor="#fff"
        activeThumbColor="#fff"
        accessibilityLabel={label}
      />
    </View>
  );

  return (
    <Page>
      <FadeIn>
        <ScreenTop title={t("con.title")} subtitle={t("con.lead")} />
        <Card>
          <Text style={s.h}>{t("con.prio")}</Text>
          <View style={s.chips}>
            {ids.map((id) => (
              <Pressable
                key={id}
                onPress={() => toggle(id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: d.priorities.includes(id) }}
                style={[s.chip, d.priorities.includes(id) && s.chipOn]}
              >
                <Text
                  style={[
                    s.chipT,
                    d.priorities.includes(id) && { color: "#fff" },
                  ]}
                >
                  {name(id)}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextField
            label={t("con.question")}
            value={d.question}
            onChangeText={(v) => set({ question: v })}
            multiline
          />
          <TextField
            label={t("con.notes")}
            value={d.notes}
            onChangeText={(v) => set({ notes: v })}
            multiline
          />
        </Card>
      </FadeIn>
      <FadeIn delay={70}>
        <Card>
          <Text style={s.h}>{t("con.resume")}</Text>
          <Text
            style={s.sub}
          >{`${t("con.name")}: ${a.name || t("con.noName")}\n${t("con.origin")}\n${t("con.gaps", { n: num(a.pending.length) })}`}</Text>
        </Card>
        <Card>
          <Text style={s.h}>{t("con.privacy")}</Text>
          {sw(t("con.incIntimate"), "includeIntimate")}
          {sw(t("con.incText"), "includeFreeText")}
        </Card>
        <View style={{ gap: 10 }}>
          <Btn
            title={t("con.review")}
            variant="ghost"
            icon="document-text-outline"
            onPress={() => setSheet("review")}
          />
          <Btn
            title={t("con.prepare")}
            variant="ghost"
            icon="paper-plane-outline"
            onPress={() => setSheet("send")}
          />
          <Btn
            title={t("con.save")}
            onPress={() => {
              a.setConsult(d);
              a.go("welcome");
            }}
          />
        </View>
      </FadeIn>
      <Sheet
        visible={sheet === "review"}
        onClose={() => setSheet(null)}
        title={t("con.review")}
        footer={
          <View style={{ marginTop: 12 }}>
            <Btn title={t("con.prepare")} onPress={() => setSheet("send")} />
          </View>
        }
      >
        <Text style={s.rep}>{report}</Text>
      </Sheet>
      <Sheet
        visible={sheet === "send"}
        onClose={() => setSheet(null)}
        title={t("con.prepare")}
        subtitle={t("con.sendLead")}
      >
        <View style={{ gap: 10, marginTop: 8 }}>
          <Btn
            title={t("con.s.sim")}
            variant="ghost"
            onPress={() => {
              a.setFlags({ shared: "sim" });
              setStatus("sim");
            }}
          />
          <Btn title={t("con.s.pdf")} variant="ghost" onPress={pdf} />
          <Btn title={t("con.s.draft")} variant="ghost" onPress={draft} />
        </View>
        <Text style={s.status}>{t(`con.st.${status}`)}</Text>
      </Sheet>
    </Page>
  );
}
