import React from "react";
import Svg, {
  Defs,
  ClipPath,
  RadialGradient,
  Stop,
  Path,
  Circle,
  Ellipse,
  Rect,
  G,
} from "react-native-svg";
import { useTheme } from "../theme";
import { SKIN, HAIR, EYES, TONES } from "../data/symptoms";

// Linguagem única de ilustração do App: traço fino, formas limpas, tom de pele e cabelo escolhidos pela usuária.
export const mix = (hex, to, k) => {
  const a = parseInt(hex.slice(1), 16),
    b = parseInt(to.slice(1), 16);
  const ch = (s) =>
    Math.round(((a >> s) & 255) + (((b >> s) & 255) - ((a >> s) & 255)) * k);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};

export function look(profile = {}) {
  const skin = SKIN[profile.skin] || SKIN[2],
    hair = HAIR[profile.hair] || HAIR[1];
  return {
    skin,
    hair,
    eyes: EYES[profile.eyes] || EYES[1],
    tone: TONES[profile.tone] || TONES[1],
    style: FRONT[profile.hairLength] ? profile.hairLength : "medium",
    glasses: !!profile.glasses,
    line: mix(skin, "#3A1626", 0.5),
    shade: mix(skin, "#3A1626", 0.16),
    brow: mix(hair, "#2B1D16", 0.35),
    shine: mix(hair, "#FFFFFF", 0.22),
  };
}

const FACE =
  "M-21 -4 C-21 -22 -12 -28 0 -28 C12 -28 21 -22 21 -4 C21 10 14 22 6 26 C2 28 -2 28 -6 26 C-14 22 -21 10 -21 -4 Z";
const CAP =
  "M-24 0 C-27 -45 27 -45 24 0 C24 15 14 23 0 23 C-14 23 -24 15 -24 0 Z";
const SHORT_BACK =
  "M-24 -2 C-27 -42 27 -42 24 -2 C24 6 23 10 21 13 L-21 13 C-23 10 -24 6 -24 -2 Z";
const BACK = {
  short: SHORT_BACK,
  bun: SHORT_BACK,
  curly: SHORT_BACK,
  bob: "M-26 -4 C-30 -44 30 -44 26 -4 C29 10 28 22 23 30 C10 33 -10 33 -23 30 C-28 22 -29 10 -26 -4 Z",
  medium:
    "M-27 -4 C-31 -44 31 -44 27 -4 C30 16 31 36 26 52 C10 56 -10 56 -26 52 C-31 36 -30 16 -27 -4 Z",
  long: "M-27 -4 C-31 -44 31 -44 27 -4 C31 22 33 46 29 63 C12 67 -12 67 -29 63 C-33 46 -31 22 -27 -4 Z",
};
const SWEEP =
  "M-22 -5 C-24 -26 -10 -31 2 -30.5 C14 -30 23 -24 22 -5 C19 -14 14 -19 8 -21 C0 -15 -12 -12 -22 -5 Z";
const FRONT = {
  short:
    "M-22 -4 C-25 -27 -8 -32 4 -31 C16 -30 24 -22 22 -4 C20 -12 17 -17 12 -20 C2 -14 -10 -12 -18 -12 C-20 -10 -21 -7 -22 -4 Z",
  bob: SWEEP,
  medium: SWEEP,
  long: SWEEP,
  bun: "M-22 -5 C-23 -25 -11 -31 0 -31 C11 -31 23 -25 22 -5 C19 -15 11 -21 0 -21 C-11 -21 -19 -15 -22 -5 Z",
  curly:
    "M-22 -5 C-23 -25 -11 -31 0 -31 C11 -31 23 -25 22 -5 C19 -13 11 -17 0 -17 C-11 -17 -19 -13 -22 -5 Z",
};
const CURLS_BACK = [
  [-21, -19, 11],
  [-11, -29, 11],
  [0, -32, 11],
  [11, -29, 11],
  [21, -19, 11],
  [-27, -5, 10],
  [27, -5, 10],
  [-28, 9, 10],
  [28, 9, 10],
  [-25, 22, 9],
  [25, 22, 9],
];
const CURLS_FRONT = [
  [-19, -13, 7.5],
  [-11, -20, 8],
  [-1, -22, 8],
  [9, -21, 8],
  [18, -14, 7.5],
];
const BUN = [0, -33.5, 9];
const dots = (list, fill) =>
  list.map(([x, y, r], i) => (
    <Circle key={i} cx={x} cy={y} r={r} fill={fill} />
  ));

// Cabelo que fica atrás da cabeça e do pescoço (vista de frente)
export function HairBack({ L }) {
  return (
    <G>
      <Path d={BACK[L.style]} fill={L.hair} />
      {L.style === "curly" && dots(CURLS_BACK, L.hair)}
      {L.style === "bun" && (
        <Circle cx={BUN[0]} cy={BUN[1]} r={BUN[2]} fill={L.hair} />
      )}
    </G>
  );
}

// Rosto de frente: orelhas, contorno fino, sobrancelhas, olhos, nariz, lábios, franja e óculos opcionais
export function HeadFront({ L }) {
  const sw = 1.5;
  return (
    <G>
      <Ellipse
        cx={-21.5}
        cy={2}
        rx={3.2}
        ry={5.2}
        fill={L.skin}
        stroke={L.line}
        strokeWidth={1.2}
      />
      <Ellipse
        cx={21.5}
        cy={2}
        rx={3.2}
        ry={5.2}
        fill={L.skin}
        stroke={L.line}
        strokeWidth={1.2}
      />
      <Path
        d={FACE}
        fill={L.skin}
        stroke={L.line}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <Path d={FRONT[L.style]} fill={L.hair} />
      {L.style === "curly" && dots(CURLS_FRONT, L.hair)}
      {L.style !== "curly" && (
        <Path
          d={
            L.style === "bun"
              ? "M-13 -24 C-6 -28 6 -28 13 -24"
              : "M-6 -26 C2 -27 10 -25 15 -21"
          }
          stroke={L.shine}
          strokeWidth={1.3}
          strokeLinecap="round"
          fill="none"
        />
      )}
      <Path
        d="M-14.5 -5.5 C-11.5 -8 -7.5 -8 -5 -6.2 M14.5 -5.5 C11.5 -8 7.5 -8 5 -6.2"
        stroke={L.brow}
        strokeWidth={1.6}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={-9.2} cy={1.6} r={1.9} fill={L.eyes} />
      <Circle cx={9.2} cy={1.6} r={1.9} fill={L.eyes} />
      <Path
        d="M-13.4 1 C-11.4 -2 -7 -2 -5 1 M13.4 1 C11.4 -2 7 -2 5 1"
        stroke={L.line}
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M0.4 4.5 C0 9 -2 10.8 -2.6 12.2 C-1.6 13.4 0.4 13.6 1.8 13.1"
        stroke={L.line}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M-5.6 19 C-3 17.5 -1 17.7 0 18.3 C1 17.7 3 17.5 5.6 19 C3 21.8 -3 21.8 -5.6 19 Z"
        fill={mix(L.skin, "#B24A62", 0.55)}
      />
      {L.glasses && (
        <G
          stroke={mix(L.hair, "#1E1B52", 0.6)}
          strokeWidth={1.4}
          fill="none"
          strokeLinecap="round"
        >
          <Rect
            x={-15.8}
            y={-3.6}
            width={12.6}
            height={10.2}
            rx={4.6}
            fill="rgba(255,255,255,0.16)"
          />
          <Rect
            x={3.2}
            y={-3.6}
            width={12.6}
            height={10.2}
            rx={4.6}
            fill="rgba(255,255,255,0.16)"
          />
          <Path d="M-3.2 0.6 C-1.4 -1 1.4 -1 3.2 0.6 M-15.8 0.4 L-21 -0.6 M15.8 0.4 L21 -0.6" />
        </G>
      )}
    </G>
  );
}

// Cabeça vista de costas
export function HeadBack({ L }) {
  return (
    <G>
      <Ellipse
        cx={-21.5}
        cy={2}
        rx={3.2}
        ry={5.2}
        fill={L.skin}
        stroke={L.line}
        strokeWidth={1.2}
      />
      <Ellipse
        cx={21.5}
        cy={2}
        rx={3.2}
        ry={5.2}
        fill={L.skin}
        stroke={L.line}
        strokeWidth={1.2}
      />
      <Path d={FACE} fill={L.skin} />
      <Path d={BACK[L.style]} fill={L.hair} />
      <Path d={CAP} fill={L.hair} />
      {L.style === "curly" &&
        dots(
          [
            ...CURLS_BACK,
            [-12, -8, 11],
            [12, -8, 11],
            [0, 8, 12],
            [-14, 14, 9],
            [14, 14, 9],
          ],
          L.hair,
        )}
      {L.style === "bun" && (
        <Circle cx={BUN[0]} cy={BUN[1]} r={BUN[2]} fill={L.hair} />
      )}
      {L.style !== "curly" && (
        <Path
          d="M-12 -24 C-5 -29 5 -29 12 -24"
          stroke={L.shine}
          strokeWidth={1.3}
          strokeLinecap="round"
          fill="none"
        />
      )}
    </G>
  );
}

// Retrato (avatar) — representação ILUSTRATIVA
export function Portrait({ profile, size = 96 }) {
  const { colors: c } = useTheme();
  const L = look(profile),
    head = "translate(60 53) scale(1.14)";
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <ClipPath id="avClip">
          <Circle cx="60" cy="60" r="59" />
        </ClipPath>
      </Defs>
      <Circle cx="60" cy="60" r="59" fill={c.mist} />
      <G clipPath="url(#avClip)">
        <G transform={head}>
          <HairBack L={L} />
        </G>
        <Path
          d="M12 122 C14 106 32 99 50 96 L70 96 C88 99 106 106 108 122 Z"
          fill={L.skin}
          stroke={L.line}
          strokeWidth={1.6}
        />
        <Path d="M51 76 L51 98 C54 102 66 102 69 98 L69 76 Z" fill={L.skin} />
        <Path d="M51 84 C56 90 64 90 69 84 L69 80 L51 80 Z" fill={L.shade} />
        <Path
          d="M51 82 L51 97 M69 82 L69 97"
          stroke={L.line}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M27 122 L32 103.4 C35 102 38 101 41.5 100 C41.5 108 42.5 113 44.5 116.5 C54 119.5 66 119.5 75.5 116.5 C77.5 113 78.5 108 78.5 100 C82 101 85 102 88 103.4 L93 122 Z"
          fill={L.tone}
        />
        <G transform={head}>
          <HeadFront L={L} />
        </G>
      </G>
      <Circle
        cx="60"
        cy="60"
        r="59"
        fill="none"
        stroke={c.line}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

// Corpo inteiro (espaço 300 x 600): metade esquerda desenhada à mão e espelhada.
// Proporções: quadril na metade da altura (pernas mais longas) e mãos na altura do alto da coxa.
// Pontos do contorno, na ordem do traço (o 1º é "M", o 2º é "L" e os demais vêm em trios de curva).
const PTS = [
  [151, 100],
  [140, 100],
  [130, 106],
  [114, 108],
  [101, 114],
  [91, 119],
  [86, 134],
  [84, 152],
  [82, 176],
  [78, 202],
  [76, 224],
  [74, 254],
  [70, 290],
  [66, 324],
  [64, 338],
  [62, 348],
  [64, 356],
  [68, 364],
  [77, 361],
  [79, 352],
  [83, 318],
  [88, 276],
  [91, 244],
  [93, 222],
  [95, 200],
  [100, 184],
  [102, 178],
  [104, 172],
  [106, 168],
  [108, 188],
  [118, 210],
  [122, 234],
  [123, 250],
  [100, 272],
  [100, 300],
  [100, 326],
  [104, 376],
  [108, 420],
  [110, 456],
  [112, 500],
  [118, 548],
  [119, 560],
  [112, 576],
  [104, 586],
  [103, 594],
  [128, 596],
  [136, 590],
  [137, 580],
  [136, 566],
  [135, 548],
  [134, 520],
  [138, 478],
  [140, 428],
  [142, 388],
  [147, 344],
  [151, 322],
];
// Quanto cada ponto se afasta do eixo na silhueta mais ampla (a = 1). Ombro, braço, tronco, quadril e pernas mudam; cabeça, mãos e pés não.
const WIDE = [
  0, 0, 3, 6, 9, 18, 23, 25, 26, 26, 25, 23, 21, 19, 18, 18, 17, 16, 15, 14, 14,
  14, 14, 14, 14, 14, 14, 14, 14, 17, 23, 27, 28, 19, 18, 18, 16, 13, 11, 8, 4,
  2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
export const BODIES = ["a", "b", "c"]; // três silhuetas, sem rótulo de julgamento
export const bodyAmount = (profile = {}) =>
  ({ a: 0, b: 0.5, c: 1 })[profile.body] ?? 0;
const cache = {};
function shape(a) {
  if (cache[a]) return cache[a];
  const f = (n) => Math.round(n * 10) / 10;
  const p = PTS.map(([x, y], i) => `${f(x - WIDE[i] * a)} ${y}`);
  let out = `M${p[0]} L${p[1]}`;
  for (let i = 2; i < p.length; i += 3)
    out += ` C${p[i]} ${p[i + 1]} ${p[i + 2]}`;
  const d = (n) => f(n * a); // roupas acompanham o tronco (só o lado esquerdo importa: o direito é espelhado)
  return (cache[a] = {
    out,
    half: out + " L151 100 Z",
    // top curto de decote reto: deixa livres o esterno superior, a região abaixo do peito e o alto das costas (locais do patch)
    topFront: `M${113 - d(9)} 104 L122 103 C121 125 121 145 122 158 C132 163 142 164 150 160 C158 164 168 163 178 158 C179 145 179 125 178 103 L187 104 C190 125 194 150 195 168 L198 197 C170 ${201 + d(3)} 130 ${201 + d(3)} ${102 - d(17)} 197 L${105 - d(14)} 168 C${106 - d(14)} 150 ${110 - d(11)} 125 ${113 - d(9)} 104 Z`,
    topBack: `M${102 - d(16)} 182 C130 178 170 178 198 182 L198 197 C170 201 130 201 ${102 - d(17)} 197 Z`,
    strap: `M${117.5 - d(7)} 102 C${117 - d(8)} 130 ${114 - d(11)} 160 ${109 - d(13)} 182`,
    brief: `M${96 - d(19)} 272 C122 ${279 + d(4)} 178 ${279 + d(4)} 204 272 L206 303 C180 307 160 316 150 327 C140 316 120 307 ${94 - d(18)} 303 Z`,
    hem: `M${102 - d(17)} 197 C130 ${201 + d(3)} 170 201 198 197 M${96 - d(19)} 272 C122 ${279 + d(4)} 178 279 204 272`,
  });
}
const mirror = "translate(300 0) scale(-1 1)";

export function FigureSvg({ profile, side = "front", style, halo = true }) {
  const { colors: c } = useTheme();
  const L = look(profile),
    head = "translate(150 51) scale(1.18)",
    front = side === "front";
  const amt = bodyAmount(profile),
    B = shape(amt),
    clip = `bodyClip${amt * 10}`;
  const cloth = mix(L.tone, "#FFFFFF", 0.08),
    seam = mix(L.tone, "#1E1B52", 0.28);
  return (
    <Svg style={style} viewBox="0 0 300 600" pointerEvents="none">
      <Defs>
        <RadialGradient id="halo" cx="50%" cy="45%" r="50%">
          <Stop offset="0" stopColor={c.violet} stopOpacity="0.16" />
          <Stop offset="1" stopColor={c.violet} stopOpacity="0" />
        </RadialGradient>
        <ClipPath id={clip}>
          <Path d={B.half} />
        </ClipPath>
      </Defs>
      {halo && (
        <Ellipse cx="150" cy="300" rx="150" ry="300" fill="url(#halo)" />
      )}
      {front && (
        <G transform={head}>
          <HairBack L={L} />
        </G>
      )}
      <Path d={B.half} fill={L.skin} />
      <G transform={mirror}>
        <Path d={B.half} fill={L.skin} />
      </G>
      <Rect x="140" y="74" width="20" height="38" rx="6" fill={L.skin} />
      {front && (
        <Path
          d="M140 88 C146 95 154 95 160 88 L160 80 L140 80 Z"
          fill={L.shade}
        />
      )}
      {/* roupas simétricas: recorta pela metade esquerda do corpo e espelha */}
      {[undefined, mirror].map((tr, i) => (
        <G key={i} transform={tr}>
          <G clipPath={`url(#${clip})`}>
            {front ? (
              <Path d={B.topFront} fill={cloth} />
            ) : (
              <G>
                <Path d={B.topBack} fill={cloth} />
                <Path d={B.strap} stroke={cloth} strokeWidth={9} fill="none" />
              </G>
            )}
            <Path d={B.brief} fill={cloth} />
            <Path
              d={B.hem}
              stroke={seam}
              strokeWidth={1.2}
              fill="none"
              opacity={0.55}
            />
          </G>
        </G>
      ))}
      <G
        stroke={L.line}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d={B.out} />
        <G transform={mirror}>
          <Path d={B.out} />
        </G>
        <Path d="M140 86 L140 100 M160 86 L160 100" />
        {front ? (
          <Path
            d="M128 114 C134 117 142 118 146 117 M172 114 C166 117 158 118 154 117 M150 248 L150 252 M131 470 C134 474 138 474 141 470 M169 470 C166 474 162 474 159 470"
            opacity={0.7}
          />
        ) : (
          <Path
            d="M150 206 L150 262 M126 122 C120 136 121 150 128 160 M174 122 C180 136 179 150 172 160 M131 470 C134 466 138 466 141 470 M169 470 C166 466 162 466 159 470"
            opacity={0.6}
          />
        )}
      </G>
      <G transform={head}>{front ? <HeadFront L={L} /> : <HeadBack L={L} />}</G>
    </Svg>
  );
}
