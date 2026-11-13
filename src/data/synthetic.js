// Dados SINTÉTICOS de exemplo.
// Os 4 sinais do patch: sono (movimento), batimento cardíaco, temperatura cutânea e condutância da pele (fogachos).
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wob = (i, k) =>
  Math.sin(i * 1.7 + k) * 0.5 + Math.cos(i * 0.9 + k * 2) * 0.5; // -1 a 1, sempre igual

export function makeSynthetic(days, symptomIds = []) {
  const arr = (f) => Array.from({ length: days }, (_, i) => f(i));
  const sleepDiary = arr(
    (i) => +clamp(5.6 + i * 0.07 + wob(i, 1) * 0.7, 4, 9).toFixed(1),
  );
  const hot = arr((i) =>
    Math.round(clamp(9 - i * 0.3 + wob(i, 2) * 1.5, 0, 12)),
  );
  const scores = {};
  symptomIds.forEach((id, n) => {
    scores[id] = arr((i) =>
      clamp(Math.round(3 - i * 0.07 + wob(i, n + 3) * 0.9), 0, 4),
    );
  });
  return {
    scores,
    sleepDiary,
    events: arr((i) =>
      Math.round(clamp(hot[i] * 0.8 + wob(i, 3) * 1.2, 0, 12)),
    ), // fogachos relatados
    energy: arr((i) =>
      clamp(Math.round(2.4 + i * 0.05 + wob(i, 4) * 0.8), 1, 5),
    ),
    patch: {
      sleep: sleepDiary.map(
        (h, i) => +clamp(h + wob(i, 5) * 0.5, 4, 9).toFixed(1),
      ), // horas estimadas por movimento
      hot, // eventos candidatos (condutância + temperatura)
      hr: arr((i) => Math.round(clamp(76 - i * 0.35 + wob(i, 6) * 3, 55, 85))), // bpm
      temp: arr((i) => +(33.3 + hot[i] * 0.04 + wob(i, 7) * 0.25).toFixed(2)), // °C
      cond: arr((i) => +(2.0 + hot[i] * 0.12 + wob(i, 8) * 0.2).toFixed(2)), // µS
    },
  };
}
