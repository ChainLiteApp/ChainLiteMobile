import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type HeaderProps = {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
};

export default function Header({ title, subtitle, style }: HeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.actionMuted]} accessibilityRole="button" accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={20} color="#fff" />
          <View style={styles.notifyDot} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionAccent]} accessibilityRole="button" accessibilityLabel="Wallet">
          <Ionicons name="wallet-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#c7c9ff',
    marginTop: 4,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionMuted: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  actionAccent: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  notifyDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fb7185',
  },
});
