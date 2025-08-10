import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import TabIcon from '@/components/ui/TabIcon';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { HapticTab } from '@/components/HapticTab';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(27, 19, 54, 0.95)',
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          paddingBottom: 5,
          paddingTop: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center', 
          paddingVertical: 6,
          borderRadius: 12,
          marginHorizontal: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarActiveBackgroundColor: 'rgba(122,43,202,0.35)',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarButton: (props) => (
          <HapticTab {...props} style={[props.style, styles.tabBarButton]} />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'book' : 'book-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: 'Mine',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'flash' : 'flash-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explorer"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'eye' : 'eye-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'Network',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'people' : 'people-outline'} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarButton: {
    flex: 1,
    height: '100%',
    borderRadius: 12,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
});
