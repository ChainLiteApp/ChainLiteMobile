import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type StandardTabsProps = Omit<React.ComponentProps<typeof Tabs>, 'children'> & {
  children: React.ReactNode;
};

export default function StandardTabs({ children, ...rest }: StandardTabsProps) {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      {...rest}
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: 'rgba(27, 19, 54, 1)',
          borderTopWidth: 0,
          // Base height + bottom inset to avoid overlap with home indicator
          height: 56 + insets.bottom,
          paddingTop: 5,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingHorizontal: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // Subtle shadow
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 5,
        },
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
      }}
    >
      {children}
    </Tabs>
  );
}
