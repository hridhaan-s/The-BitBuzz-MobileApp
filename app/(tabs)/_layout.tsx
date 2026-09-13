import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#ffffff',
      tabBarInactiveTintColor: 'rgba(255,255,255,0.38)',
      tabBarStyle: { backgroundColor: '#050505', borderTopColor: 'rgba(255,255,255,0.08)', height: 84, paddingTop: 8, paddingBottom: 20 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ color, size }) => <Ionicons name="newspaper-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="opportunities" options={{ title: 'Opportunities', tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}
