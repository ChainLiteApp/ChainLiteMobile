import React from 'react';
import { Tabs } from 'expo-router';
import TabIcon from '@/components/ui/TabIcon';
import StandardTabs from '@/components/ui/StandardTabs';

export default function TabLayout() {
  return (
    <StandardTabs>
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
    </StandardTabs>
  );
}
