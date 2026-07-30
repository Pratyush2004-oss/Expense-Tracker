import { View, Text } from "react-native";
import React from "react";
import Svg, { Path, G, Circle } from "react-native-svg";

interface PieSlice {
  value: number;
  color: string;
  label: string;
}

interface PieChartProps {
  data: PieSlice[];
  size?: number;
}

const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
};

const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
};

const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 180,
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const innerR = r * 0.55;
  const filteredData = data.filter((d) => d.value > 0);

  if (filteredData.length === 0) {
    return (
      <View className="items-center justify-center" style={{ width: size, height: size }}>
        <Text className="text-zinc-600 text-xs">No data</Text>
      </View>
    );
  }

  let currentAngle = 0;
  const slices = filteredData.map((d) => {
    const angle = (d.value / total) * 360;
    const slice = {
      path: describeArc(cx, cy, r, currentAngle, currentAngle + angle),
      color: d.color,
      label: d.label,
      value: d.value,
      percentage: Math.round((d.value / total) * 100),
    };
    currentAngle += angle;
    return slice;
  });

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G rotation={0} origin={`${cx}, ${cy}`}>
            {slices.map((slice, i) => (
              <Path
                key={i}
                d={slice.path}
                fill={slice.color}
                opacity={0.85}
              />
            ))}
            {/* Inner cutout for donut */}
            <Circle cx={cx} cy={cy} r={innerR} fill="#0D0D0D" />
          </G>
        </Svg>
        {/* Center text overlay */}
        <View
          className="absolute items-center justify-center"
          style={{ left: cx - 30, top: cy - 22, width: 60, height: 44 }}
        >
          <Text className="text-white text-lg font-bold">₹{total.toFixed(0)}</Text>
          <Text className="text-zinc-500 text-[10px] -mt-0.5">Total</Text>
        </View>
      </View>

      {/* Legend */}
      <View className="flex-row flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {slices.map((slice, i) => (
          <View key={i} className="flex-row items-center gap-2">
            <View
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <Text className="text-zinc-400 text-xs">{slice.label}</Text>
            <Text className="text-zinc-500 text-xs">{slice.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PieChart;
