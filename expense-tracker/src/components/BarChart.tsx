import { View, Text, ScrollView } from "react-native";
import React from "react";
import Svg, { Rect, Line, Text as SvgText, G } from "react-native-svg";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  barColor?: string;
  currency?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 180,
  barColor = "#EF4444",
  currency = true,
}) => {
  if (data.length === 0) {
    return (
      <View className="items-center justify-center py-10">
        <Text className="text-zinc-600 text-xs">No data</Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartWidth = Math.max(data.length * 44, 60);
  const padding = { top: 10, bottom: 28, left: 0, right: 0 };
  const barWidth = 28;
  const chartHeight = height - padding.top - padding.bottom;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        <Svg width={chartWidth} height={height}>
          {/* Baseline */}
          <Line
            x1={0}
            y1={height - padding.bottom}
            x2={chartWidth}
            y2={height - padding.bottom}
            stroke="#27272A"
            strokeWidth={1}
          />

          {data.map((d, i) => {
            const barH = (d.value / maxValue) * chartHeight;
            const x = i * 44 + (44 - barWidth) / 2;
            const y = height - padding.bottom - barH;
            const color = d.color || barColor;

            return (
              <G key={i}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={4}
                  ry={4}
                  fill={color}
                  opacity={0.85}
                />
                {/* Amount label on top */}
                {barH > 20 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 6}
                    fill="#A1A1AA"
                    fontSize={9}
                    textAnchor="middle"
                  >
                    {currency ? `₹${d.value.toFixed(0)}` : `${d.value.toFixed(0)}`}
                  </SvgText>
                )}
                {/* Date label at bottom */}
                <SvgText
                  x={x + barWidth / 2}
                  y={height - 6}
                  fill="#52525B"
                  fontSize={9}
                  textAnchor="middle"
                >
                  {d.label}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    </ScrollView>
  );
};

export default BarChart;
