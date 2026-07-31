import { View, Text, ScrollView, Animated } from "react-native";
import React from "react";
import Svg, { Rect, Line, Text as SvgText, G } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

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
  fadeColor?: string;
}

const FADE_WIDTH = 44;

const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 180,
  barColor = "#EF4444",
  currency = true,
  fadeColor = "#18181B",
}) => {
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [contentWidth, setContentWidth] = React.useState(0);
  const scrollRef = React.useRef<ScrollView>(null);
  const hasAutoScrolled = React.useRef(false);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const leftFadeOpacity = scrollX.interpolate({
    inputRange: [0, FADE_WIDTH],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const rightFadeOpacity = scrollX.interpolate({
    inputRange: [
      Math.max(contentWidth - containerWidth - FADE_WIDTH, 0),
      Math.max(contentWidth - containerWidth, 1),
    ],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

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

  // Auto-scroll to the current date on mount
  React.useEffect(() => {
    if (containerWidth === 0 || contentWidth === 0) return;
    if (hasAutoScrolled.current) return;

    const currentDay = new Date().getDate();
    const dayIndex = currentDay - 1;

    // Only scroll if the current day is within the data range
    if (dayIndex < 0 || dayIndex >= data.length) return;

    // Position the current day's bar slot near the right edge
    // so days leading up to it are visible
    const maxScroll = Math.max(chartWidth - containerWidth, 0);
    const targetX = Math.min((dayIndex + 1) * 44 - containerWidth + 44, maxScroll);

    scrollRef.current?.scrollTo({ x: Math.max(0, targetX), animated: true });
    hasAutoScrolled.current = true;
  }, [containerWidth, contentWidth, data.length, chartWidth]);

  return (
    <View
      className="relative"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onContentSizeChange={(w) => setContentWidth(w)}
      >
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
                      fontFamily="Outfit_400Regular"
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
                    fontFamily="Outfit_400Regular"
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

      {/* Fade overlays — only shown when content overflows the container */}
      {contentWidth > containerWidth && (
        <>
          <Animated.View
            pointerEvents="none"
            style={{ opacity: leftFadeOpacity }}
            className="absolute left-0 top-0 bottom-0 w-11"
          >
            <LinearGradient
              colors={[fadeColor, "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={{ opacity: rightFadeOpacity }}
            className="absolute right-0 top-0 bottom-0 w-11"
          >
            <LinearGradient
              colors={["transparent", fadeColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default BarChart;
