import { View, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";

interface SkeletonProps {
  className?: string;
  style?: object;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      className={`bg-zinc-800 rounded-xl ${className}`}
      style={[{ opacity }, style]}
    />
  );
};

export const SkeletonCircle: React.FC<{ size: number; className?: string }> = ({
  size,
  className = "",
}) => <Skeleton className={`rounded-full ${className}`} style={{ width: size, height: size }} />;

export const SkeletonLine: React.FC<{ className?: string }> = ({ className = "" }) => (
  <Skeleton className={`h-3 ${className}`} />
);

export const HomeScreenSkeleton = () => (
  <View className="px-5">
    {/* Summary cards skeleton */}
    <View className="flex-row gap-3 mb-6">
      <Skeleton className="flex-1 h-28" />
      <Skeleton className="flex-1 h-28" />
      <Skeleton className="flex-1 h-28" />
    </View>

    {/* Category breakdown skeleton */}
    <Skeleton className="w-full h-64 mb-6" />
    <Skeleton className="w-full h-48 mb-6" />
  </View>
);

export const TransactionsScreenSkeleton = () => (
  <View className="px-5">
    {/* Monthly summary skeleton */}
    <Skeleton className="w-full h-32 mb-4" />

    {/* Transaction items skeleton */}
    {[1, 2, 3, 4, 5].map((i) => (
      <View key={i} className="flex-row items-center gap-3.5 mb-3">
        <SkeletonCircle size={48} />
        <View className="flex-1 gap-2">
          <Skeleton className="w-3/5 h-4" />
          <Skeleton className="w-2/5 h-3" />
        </View>
        <Skeleton className="w-20 h-5" />
      </View>
    ))}
  </View>
);

export default Skeleton;
