import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export type ProgressBarProps = {
  progress: number; // 0..100
  height?: number;
  trackColor?: string;
  fillColor?: string;
  style?: ViewStyle;
  rounded?: boolean;
};

export default function ProgressBar({
  progress,
  height = 8,
  trackColor = 'rgba(255,255,255,0.35)',
  fillColor = '#ffffff',
  style,
  rounded = true,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, progress));
  const radius = rounded ? height / 2 : 0;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor,
          borderRadius: radius,
        },
        style,
      ]}
    >
      <View
        style={{
          height: '100%',
          width: `${clamped}%`,
          backgroundColor: fillColor,
          borderRadius: radius,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
});
