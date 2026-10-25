import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7267D9',
        tabBarInactiveTintColor: '#9997A6',
        tabBarStyle: {
          height: 68,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E9E8EF',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sākums',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>⌂</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="market"
        options={{
          title: 'Tirgus',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>▥</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfelis',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>▣</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: 'Mācīties',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>◫</Text>
          ),
        }}
      />
    </Tabs>
  );
}