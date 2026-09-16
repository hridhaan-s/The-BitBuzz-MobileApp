import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: 'rgba(255,255,255,.36)',
      tabBarStyle: { backgroundColor: '#08080a', borderTopColor: 'rgba(255,255,255,.08)', height: 82, paddingTop: 8, paddingBottom: 17 },
      tabBarLabelStyle: { fontSize: 9, fontWeight: '700', letterSpacing: .1 },
      tabBarItemStyle: { borderRadius: 18 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="opportunities" options={{ title: 'Build', tabBarIcon: ({ color, size }) => <Ionicons name="rocket-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved', tabBarIcon: ({ color, size }) => <Ionicons name="bookmark-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'You', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}
