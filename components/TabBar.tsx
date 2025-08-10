import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabs = [
  { label: 'Learn', icon: 'book-outline' },
  { label: 'Mine', icon: 'flash-outline' },
  { label: 'Explorer', icon: 'search-outline' },
  { label: 'Network', icon: 'people-outline' },
];

export default function TabBar({ activeIndex = 0, onTabPress }: { activeIndex?: number; onTabPress?: (index: number) => void }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab, idx) => (
        <TouchableOpacity
          key={tab.label}
          style={[styles.tab, activeIndex === idx && styles.activeTab]}
          onPress={() => onTabPress && onTabPress(idx)}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeIndex === idx ? 'white' : 'rgba(255,255,255,0.6)'}
          />
          <Text style={[styles.label, activeIndex === idx && styles.activeLabel]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(51,10,95,0.95)',
    paddingVertical: 22,
    paddingHorizontal: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#7a2bca',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginTop: 2,
  },
  activeLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
});