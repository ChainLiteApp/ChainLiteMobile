import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

type StatusType = 'active' | 'live' | 'stopped' | 'paused';

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  status: StatusType;
  iconName?: MaterialIconName;
};

const statusColors = {
  active: '#3B82F6', // blue-500
  live: '#00FF00',   // emerald-500
  stopped: '#EF4444', // red-500
  paused: '#F59E0B'  // amber-500
};

const statusIcons: Record<StatusType, MaterialIconName> = {
  active: 'power-settings-new',
  live: 'flash-on',
  stopped: 'power-off',
  paused: 'pause-circle-outline'
};

const StatCard = ({ title, value, subtitle, status, iconName }: StatCardProps) => {
  const statusColor = statusColors[status] || '#FFFFFF';
  const statusIcon = iconName || statusIcons[status] || 'info' as MaterialIconName;
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialIcons 
          name={statusIcon} 
          size={24} 
          color={statusColor} 
          style={styles.icon}
        />
        <Text style={[styles.status, { color: statusColor }]}>
          {status.toUpperCase()}
        </Text>
      </View>
      
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(14px)',
    borderRadius: 16,
    padding: 20,
    width: '45%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    margin: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '40%',
    // alignSelf: 'flex-start',
    // marginBottom: 12,
  },
  icon: {
    // marginRight: 8,
  },
  status: {
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    textAlign: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginVertical: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default StatCard;
