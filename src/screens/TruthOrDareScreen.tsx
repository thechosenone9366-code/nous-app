import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Header } from '../components/UI';
import { colors, spacing, radius, shadow } from '../utils/theme';
import { TRUTH_CARDS, DARE_CARDS } from '../assets/data/content';

type CardType = 'truth' | 'dare' | null;

function shuffle<T>(arr: T[]): T {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a[0];
}

export default function TruthOrDareScreen() {
  const navigation = useNavigation();
  const [cardType, setCardType] = useState<CardType>(null);
  const [cardText, setCardText] = useState('');
  const [count, setCount] = useState({ truth: 0, dare: 0 });

  function draw(type: CardType) {
    if (!type) return;
    const pool = type === 'truth' ? TRUTH_CARDS : DARE_CARDS;
    setCardText(shuffle(pool));
    setCardType(type);
    setCount(c => ({ ...c, [type]: c[type] + 1 }));
  }

  return (
    <Screen>
      <Header title="Vérité ou Défi 🎴" subtitle="Pour les amoureux" onBack={() => navigation.goBack()} />

      <View style={styles.container}>
        {/* Card */}
        <View style={[
          styles.card,
          cardType === 'truth' && styles.cardTruth,
          cardType === 'dare' && styles.cardDare,
        ]}>
          {cardType === null ? (
            <>
              <Text style={styles.cardPlaceholderEmoji}>🎴</Text>
              <Text style={styles.cardPlaceholderText}>Choisissez Vérité ou Défi pour commencer !</Text>
            </>
          ) : (
            <>
              <Text style={styles.cardBadge}>
                {cardType === 'truth' ? '🌸 VÉRITÉ' : '🔥 DÉFI'}
              </Text>
              <Text style={styles.cardText}>« {cardText} »</Text>
              <Text style={styles.cardCount}>
                {cardType === 'truth' ? count.truth : count.dare} cartes tirées
              </Text>
            </>
          )}
        </View>

        {/* Scores */}
        <View style={styles.scores}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreNum}>{count.truth}</Text>
            <Text style={styles.scoreLabel}>Vérités</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Text style={styles.scoreNum}>{count.dare}</Text>
            <Text style={styles.scoreLabel}>Défis</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.truthBtn} onPress={() => draw('truth')} activeOpacity={0.85}>
            <Text style={styles.truthBtnText}>🌸 Vérité</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dareBtn} onPress={() => draw('dare')} activeOpacity={0.85}>
            <Text style={styles.dareBtnText}>🔥 Défi</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>Appuyez sur un bouton pour tirer une carte</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: spacing.lg,
    alignItems: 'center', gap: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    width: '100%', minHeight: 200,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center', justifyContent: 'center',
    gap: spacing.md,
    ...shadow.md,
  },
  cardTruth: { backgroundColor: '#FFF0F5', borderWidth: 1.5, borderColor: colors.blush },
  cardDare: { backgroundColor: '#FFF5F0', borderWidth: 1.5, borderColor: '#F0C4B8' },
  cardPlaceholderEmoji: { fontSize: 48 },
  cardPlaceholderText: { fontSize: 14, color: colors.light, textAlign: 'center' },
  cardBadge: {
    fontSize: 11, letterSpacing: 1.5,
    color: colors.rose, fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardText: {
    fontFamily: 'Georgia', fontSize: 19,
    color: colors.deep, fontStyle: 'italic',
    lineHeight: 28, textAlign: 'center',
  },
  cardCount: { fontSize: 11, color: colors.light },
  scores: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg, padding: spacing.lg,
    width: '60%', ...shadow.sm,
  },
  scoreItem: { flex: 1, alignItems: 'center' },
  scoreNum: { fontFamily: 'Georgia', fontSize: 24, color: colors.rose },
  scoreLabel: { fontSize: 11, color: colors.light, marginTop: 2 },
  scoreDivider: { width: 1, height: 36, backgroundColor: colors.warm },
  buttons: { flexDirection: 'row', gap: spacing.md, width: '100%' },
  truthBtn: {
    flex: 1, paddingVertical: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.blush,
    alignItems: 'center',
  },
  truthBtnText: { fontSize: 15, color: colors.deep, fontWeight: '500' },
  dareBtn: {
    flex: 1, paddingVertical: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.rose,
    alignItems: 'center',
  },
  dareBtnText: { fontSize: 15, color: colors.white, fontWeight: '500' },
  hint: { fontSize: 12, color: colors.light },
});
