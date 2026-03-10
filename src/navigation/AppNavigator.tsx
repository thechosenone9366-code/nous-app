import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';
import { RootStackParamList, MainTabParamList } from '../utils/types';
import { colors } from '../utils/theme';
import { useAppContext } from '../store/AppContext';

import SetupScreen from '../screens/SetupScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import GamesNavigator from './GamesNavigator';
import CalendarScreen from '../screens/CalendarScreen';
import PhotosScreen from '../screens/PhotosScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_CONFIG = [
  { name: 'Home' as const,     icon: '🏡', label: 'Accueil', screen: HomeScreen },
  { name: 'Chat' as const,     icon: '💬', label: 'Chat',    screen: ChatScreen },
  { name: 'Games' as const,    icon: '🎲', label: 'Jeux',    screen: GamesNavigator },
  { name: 'Calendar' as const, icon: '📅', label: 'Agenda',  screen: CalendarScreen },
  { name: 'Photos' as const,   icon: '📸', label: 'Photos',  screen: PhotosScreen },
];

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.warm,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
      }}
    >
      {TAB_CONFIG.map(({ name, icon, label, screen }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={screen as any}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 22 }}>{icon}</Text>
                <Text style={{ fontSize: 10, color: focused ? colors.rose : colors.light, marginTop: 2 }}>
                  {label}
                </Text>
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { state } = useAppContext();

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream }}>
        <Text style={{ fontSize: 36, marginBottom: 16 }}>♡</Text>
        <ActivityIndicator color={colors.rose} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!state.coupleInfo ? (
          <Stack.Screen name="Setup" component={SetupScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
