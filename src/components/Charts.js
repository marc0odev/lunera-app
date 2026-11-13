import React, { useState } from "react";
import { View } from "react-native";
import Svg, { Line, Rect, Path, Circle, Text as T } from "react-native-svg";
import { useTheme } from "../theme";

// Gráficos simples em SVG
const PL = 36,
  PR = 8,
  PT = 10,
  PB = 22;
const geom = (n, yMin, yMax, h, w) => ({
  x: (i) => PL + (n <= 1 ? 0 : (i * (w - PL - PR)) / (n - 1)),
  y: (v) => PT + (1 - (v - yMin) / (yMax - yMin || 1)) * (h - PT - PB),
});
const isN = (v) => v !== null && v !== undefined;

function Frame({ n, w, h, ticks, yMin, yMax, gaps }) {
  const { colors: c } = useTheme();
  const { x, y } = geom(n, yMin, yMax, h, w);
  const step = (w - PL - PR) / Math.max(n - 1, 1);
  const marks =
    n <= 7 ? [...Array(n).keys()] : [0, Math.floor((n - 1) / 2), n - 1];
  return (
    <>
      {gaps.map((g) => (
        <Rect
          key={`g${g}`}
          x={x(g) - step / 2}
          y={PT}
          width={Math.max(step, 6)}
          height={h - PT - PB}
          fill={c.mist}
        />
      ))}
      {ticks.map((tk) => (
        <React.Fragment key={tk}>
          <Line
            x1={PL}
            x2={w - PR}
            y1={y(tk)}
            y2={y(tk)}
            stroke={c.line}
            strokeWidth="1"
          />
          <T
            x={PL - 6}
            y={y(tk) + 3.5}
            fontSize="11"
            fill={c.muted}
            textAnchor="end"
          >
            {tk}
          </T>
        </React.Fragment>
      ))}
      {marks.map((i) => (
        <T
          key={i}
          x={x(i)}
          y={h - 6}
          fontSize="11"
          fill={c.muted}
          textAnchor="middle"
        >
          {i + 1}
        </T>
      ))}
    </>
  );
}

export function LineChart({ series, n, yMin, yMax, ticks, height = 150 }) {
  const [w, setW] = useState(0);
  const { x, y } = geom(n, yMin, yMax, height, w);
  const gaps = [...Array(n).keys()].filter((i) =>
    series.every((s) => !isN(s.values[i])),
  );
  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <Svg width={w} height={height}>
          <Frame
            n={n}
            w={w}
            h={height}
            ticks={ticks}
            yMin={yMin}
            yMax={yMax}
            gaps={gaps}
          />
          {series.map((s, k) => {
            let d = "";
            s.values.forEach((v, i) => {
              if (isN(v))
                d +=
                  (i > 0 && isN(s.values[i - 1]) ? " L" : " M") +
                  `${x(i)} ${y(v)}`;
            });
            return (
              <React.Fragment key={k}>
                <Path
                  d={d}
                  stroke={s.color}
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={s.dashed ? "5 4" : undefined}
                />
                {s.values.map((v, i) =>
                  isN(v) ? (
                    <Circle
                      key={i}
                      cx={x(i)}
                      cy={y(v)}
                      r="3.2"
                      fill={s.color}
                    />
                  ) : null,
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      )}
    </View>
  );
}

export function BarChart({ series, n, yMax, ticks, height = 130 }) {
  const [w, setW] = useState(0);
  const { x, y } = geom(n, 0, yMax, height, w);
  const gaps = [...Array(n).keys()].filter((i) =>
    series.every((s) => !isN(s.values[i])),
  );
  const bw = Math.max(
    3,
    Math.min(14, (((w - PL - PR) / Math.max(n, 1)) * 0.7) / series.length),
  );
  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <Svg width={w} height={height}>
          <Frame
            n={n}
            w={w}
            h={height}
            ticks={ticks}
            yMin={0}
            yMax={yMax}
            gaps={gaps}
          />
          {series.map((s, k) =>
            s.values.map((v, i) =>
              isN(v) ? (
                <Rect
                  key={`${k}-${i}`}
                  x={x(i) - (bw * series.length) / 2 + k * bw}
                  y={y(v)}
                  width={bw - 1}
                  height={Math.max(1, y(0) - y(v))}
                  rx="2"
                  fill={s.color}
                />
              ) : null,
            ),
          )}
        </Svg>
      )}
    </View>
  );
}
