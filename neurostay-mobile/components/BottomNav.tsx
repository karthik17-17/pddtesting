import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomNavProps = {
  activeTab: 'Home' | 'Hotels' | 'Map' | 'Compare' | 'Saved' | 'Profile';
};

export default function BottomNav({ activeTab }: BottomNavProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const navItems = [
    { name: 'Home', route: '/home', icon: 'home' as const, outlineIcon: 'home-outline' as const },
    { name: 'Hotels', route: '/results', icon: 'bed' as const, outlineIcon: 'bed-outline' as const },
    { name: 'Map', route: '/map', icon: 'map' as const, outlineIcon: 'map-outline' as const },
    { name: 'Compare', route: '/compare', icon: 'stats-chart' as const, outlineIcon: 'stats-chart-outline' as const },
    { name: 'Saved', route: '/saved', icon: 'bookmark' as const, outlineIcon: 'bookmark-outline' as const },
    { name: 'Profile', route: '/profile', icon: 'person' as const, outlineIcon: 'person-outline' as const },
  ];

  const handlePress = (route: string) => {
    router.replace(route as any);
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {navItems.map((item) => {
        const isActive = activeTab === item.name;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.tabItem}
            onPress={() => handlePress(item.route)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? item.icon : item.outlineIcon}
              size={22}
              color={isActive ? '#22d3ee' : '#94a3b8'}
            />
            <Text style={[styles.tabLabel, { color: isActive ? '#22d3ee' : '#94a3b8' }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0b1329',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
});
