import React, { useState } from "react";
import { Btn } from "./forms";
import { useI18n } from "../i18n";
import { useApp } from "../state/app";

// Sincronização com o patch: SIMULADA nesta demonstração (nenhum sensor real é lido).
export default function SyncButton({ variant = "primary" }) {
  const { t } = useI18n();
  const a = useApp();
  const [busy, setBusy] = useState(false);
  const run = () => {
    setBusy(true);
    setTimeout(() => {
      a.setPatch({ synced: true, at: Date.now() });
      setBusy(false);
    }, 1800);
  };
  return (
    <Btn
      title={busy ? t("patch.syncing") : t("patch.sync")}
      icon="sync-outline"
      variant={variant}
      onPress={run}
      disabled={busy}
    />
  );
}
