import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BackHeaderProps = {
  title: string;
  onBack: () => void;
  backgroundColor?: string;
  tintColor?: string;
  style?: ViewStyle;
};

export default function BackHeader({ title, onBack, backgroundColor = 'transparent', tintColor = '#ffffff', style }: BackHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, backgroundColor }, style]}>
      <TouchableOpacity accessibilityRole="button" onPress={onBack} style={[styles.backBtn, { borderColor: `${tintColor}33`, backgroundColor: `${tintColor}10` }]}> 
        <Ionicons name="chevron-back" size={22} color={tintColor} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: tintColor }]}>{title}</Text>
      {/* Spacer to keep the title centered */}
      <View style={{ width: 44 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
