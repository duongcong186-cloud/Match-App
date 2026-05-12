import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const tabBarConfig = useMemo(() => {
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const isDark = theme === 'dark';
    const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 0);

    return {
      theme,
      bottomInset,
      backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
      borderColor: isDark ? '#38383a' : '#e5e7eb',
      inactiveTintColor: '#8e8e93',
      activeTintColor: Colors[theme]?.tint ?? (isDark ? '#0a84ff' : '#007aff'),
    };
  }, [colorScheme, insets.bottom]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarConfig.activeTintColor,
        tabBarInactiveTintColor: tabBarConfig.inactiveTintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingTop: 4,
          paddingBottom: 0,
        },
        tabBarStyle: {
          height: 64 + tabBarConfig.bottomInset,
          paddingBottom: Math.max(tabBarConfig.bottomInset, 10),
          paddingTop: 10,
          paddingHorizontal: 5,
          backgroundColor: tabBarConfig.backgroundColor,
          borderTopWidth: 1,
          borderTopColor: tabBarConfig.borderColor,
          elevation: Platform.OS === 'android' ? 8 : 0,
          shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
          shadowRadius: Platform.OS === 'ios' ? 4 : 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? 'home' : 'home-outline'}
              color={color}
              accessible={true}
              accessibilityLabel="Home icon"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Rankings',
          tabBarAccessibilityLabel: 'Rankings tab',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? 'trophy' : 'trophy-outline'}
              color={color}
              accessible={true}
              accessibilityLabel="Rankings icon"
            />
          ),
        }}
      />
    </Tabs>
  );
}
