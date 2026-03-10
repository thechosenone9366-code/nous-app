import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GamesStackParamList } from '../utils/types';
import { Screen, SectionTitle } from '../components/UI';
import { colors, spacing, radius, shadow } from '../utils/theme';

type Nav = NativeStackNavigationProp<GamesStackParamList>;

const GAMES = [
  {
    screen: 'Quiz' as const,
    icon: '🧠',
    title: 'Quiz Couple',
    description: 'Vous connaissez-vous vraiment ?',
    bg: ['#FCE4EC', '#F8BBD0'],
    badge: 'Jouer',
  },
  {
    screen: 'TruthOrDare' as const,
    icon: '🎴',
    title: 'Vérité ou Défi',
    description: 'Questions & défis romantiques',
    bg: ['#E8EAF6', '#B3BCE6'],
    badge: 'Jouer',
  },
  {
    screen: 'WouldYouRather' as const,
    icon: '⚡',
    title: 'Tu préfères...',
    description: 'Des dilemmes à trancher ensemble',
    bg: ['#FFF9E6', '#FFE082'],
    badge: 'Jouer',
  },
];

export default function GamesListScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nos jeux 🎲</Text>
        <Text style={styles.headerSub}>3 activités disponibles</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {GAMES.map(game => (
          <TouchableOpacity
            key={game.screen}
            style={styles.card}
            onPress={() => navigation.navigate(game.screen)}
            activeOpacity={0.85}
          >
            <View style={[styles.gameIcon, { backgroundColor: game.bg[0] }]}>
              <Text style={styles.gameIconText}>{game.icon}</Text>
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>{game.title}</Text>
              <Text style={styles.gameDesc}>{game.description}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{game.badge}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.warm,
  },
  headerTitle: { fontFamily: 'Georgia', fontSize: 22, color: colors.deep },
  headerSub: { fontSize: 12, color: colors.light, marginTop: 2 },
  list: { padding: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadow.sm,
  },
  gameIcon: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  gameIconText: { fontSize: 26 },
  gameInfo: { flex: 1 },
  gameTitle: { fontSize: 15, fontWeight: '500', color: colors.deep },
  gameDesc: { fontSize: 12, color: colors.light, marginTop: 3 },
  badge: {
    backgroundColor: colors.rose,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
  },
  badgeText: { fontSize: 12, color: colors.white, fontWeight: '500' },
});
