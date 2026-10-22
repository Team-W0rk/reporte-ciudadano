import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="mis-reportes" options={{ title: 'Mis reportes' }} />
    </Tabs>
  );
}
