import React, { useMemo, useState } from "react";
import { View } from "react-native";
import Svg, {
  Defs,
  LinearGradient as G,
  Stop,
  Path,
  Circle,
} from "react-native-svg";
import { colors } from "../theme";

const smooth = (pts) =>
  pts.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const q = a[i - 1];
    const cx = (q.x + p.x) / 2;
    return `${acc} C ${cx} ${q.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, "");

export default function Sparkline({ data, height = 84 }) {
  const [w, setW] = useState(0);
  const pad = 8;
  const pts = useMemo(() => {
    if (!w) return [];
    const min = Math.min(...data),
      max = Math.max(...data),
      span = max - min || 1;
    return data.map((v, i) => ({
      x: pad + (i * (w - pad * 2)) / (data.length - 1),
      y: pad + (1 - (v - min) / span) * (height - pad * 2),
    }));
  }, [w, data, height]);
  const line = pts.length ? smooth(pts) : "";
  const last = pts[pts.length - 1];
  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <Svg width={w} height={height}>
          <Defs>
            <G id="area" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.violet} stopOpacity="0.22" />
              <Stop offset="1" stopColor={colors.violet} stopOpacity="0" />
            </G>
            <G id="line" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={colors.periwinkle} />
              <Stop offset="1" stopColor={colors.violet} />
            </G>
          </Defs>
          <Path
            d={`${line} L ${last.x} ${height} L ${pts[0].x} ${height} Z`}
            fill="url(#area)"
          />
          <Path
            d={line}
            fill="none"
            stroke="url(#line)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <Circle
            cx={last.x}
            cy={last.y}
            r={7}
            fill={colors.violet}
            opacity={0.18}
          />
          <Circle cx={last.x} cy={last.y} r={4} fill={colors.violet} />
          <Circle cx={last.x} cy={last.y} r={1.6} fill={colors.white} />
        </Svg>
      )}
    </View>
  );
}
