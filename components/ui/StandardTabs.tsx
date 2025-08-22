import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

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
          height: 90,
          paddingTop: 10,
          paddingBottom: Math.max(10, 10 + insets.bottom * 0.4),
          paddingHorizontal: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 4,
          paddingVertical: 1,
          paddingHorizontal: 2,
          borderRadius: 32,
          overflow: 'hidden',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 5,
        },
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarBackground: () => (TabBarBackground ? React.createElement(TabBarBackground as any) : null),
        tabBarButton: (props) => (
          <HapticTab
            {...props}
            style={[
              props.style,
              styles.tabBarButton,
              props.accessibilityState?.selected ? styles.tabBarButtonActive : undefined,
            ]}
          />
        ),
      }}
    >
      {children}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 0,
    overflow: 'hidden',
    borderRadius: 24,
  },
  tabBarButtonActive: {
    borderRadius: 36,
    backgroundColor: '#7a2bca',
  },
});
