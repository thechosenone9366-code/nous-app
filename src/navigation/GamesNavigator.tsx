import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GamesStackParamList } from '../utils/types';
import GamesListScreen from '../screens/GamesListScreen';
import QuizScreen from '../screens/QuizScreen';
import TruthOrDareScreen from '../screens/TruthOrDareScreen';
import WouldYouRatherScreen from '../screens/WouldYouRatherScreen';

const Stack = createNativeStackNavigator<GamesStackParamList>();

export default function GamesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GamesList" component={GamesListScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="TruthOrDare" component={TruthOrDareScreen} />
      <Stack.Screen name="WouldYouRather" component={WouldYouRatherScreen} />
    </Stack.Navigator>
  );
}
