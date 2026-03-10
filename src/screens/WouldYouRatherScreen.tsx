import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Header } from '../components/UI';
import { colors, spacing, radius, shadow } from '../utils/theme';
import { WOULD_YOU_RATHER } from '../assets/data/content';

export default function WouldYouRatherScreen() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [choiceA, setChoiceA] = useState(0);
  const [choiceB, setChoiceB] = useState(0);
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const question = WOULD_YOU_RATHER[index % WOULD_YOU_RATHER.length];
  const total = choiceA + choiceB;

  function choose(choice: 'a' | 'b') {
    if (selected) return;
    setSelected(choice);
    if (choice === 'a') setChoiceA(c => c + 1);
    else setChoiceB(c => c + 1);
  }

  function next() {
    setIndex(i => i + 1);
    setSelected(null);
  }

  const pctA = total > 0 ? Math.round((choiceA / total) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <Screen>
      <Header title="Tu préfères... ⚡" subtitle={`Question ${(index % WOULD_YOU_RATHER.length) + 1}/${WOULD_YOU_RATHER.length}`} onBack={() => navigation.goBack()} />

      <View style={styles.container}>
        <Text style={styles.versus}>Tu préfères...</Text>

        {/* Option A */}
        <TouchableOpacity
          style={[
            styles.option,
            styles.optionA,
            selected === 'a' && styles.optionSelected,
          ]}
          onPress={() => choose('a')}
          disabled={selected !== null}
          activeOpacity={0.85}
        >
          <Text style={styles.optionLabel}>A</Text>
          <Text style={styles.optionText}>{question.a}</Text>
          {selected && (
            <View style={styles.pctBar}>
              <View style={[styles.pctFill, { width: `${pctA}%` as any, backgroundColor: colors.rose }]} />
            </View>
          )}
          {selected && <Text style={styles.pctText}>{pctA}%</Text>}
        </TouchableOpacity>

        <View style={styles.orBadge}>
          <Text style={styles.orText}>ou</Text>
        </View>

        {/* Option B */}
        <TouchableOpacity
          style={[
            styles.option,
            styles.optionB,
            selected === 'b' && styles.optionSelected,
          ]}
          onPress={() => choose('b')}
          disabled={selected !== null}
          activeOpacity={0.85}
        >
          <Text style={styles.optionLabel}>B</Text>
          <Text style={styles.optionText}>{question.b}</Text>
          {selected && (
            <View style={styles.pctBar}>
              <View style={[styles.pctFill, { width: `${pctB}%` as any, backgroundColor: '#7986CB' }]} />
            </View>
          )}
          {selected && <Text style={styles.pctText}>{pctB}%</Text>}
        </TouchableOpacity>

        {selected && (
          <TouchableOpacity style={styles.nextBtn} onPress={next} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>Suivant →</Text>
          </TouchableOpacity>
        )}

        {!selected && (
          <Text style={styles.hint}>Chacun choisit sa réponse, puis comparez !</Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: spacing.lg,
    justifyContent: 'center', gap: spacing.md,
  },
  versus: {
    fontFamily: 'Georgia', fontSize: 16, color: colors.mid,
    textAlign: 'center', fontStyle: 'italic', marginBottom: spacing.sm,
  },
  option: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadow.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionA: {},
  optionB: {},
  optionSelected: { borderColor: colors.rose },
  optionLabel: {
    fontSize: 11, fontWeight: '700', color: colors.rose,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  optionText: { fontFamily: 'Georgia', fontSize: 18, color: colors.deep, lineHeight: 24 },
  pctBar: {
    height: 6, backgroundColor: colors.warm,
    borderRadius: radius.full, overflow: 'hidden',
    marginTop: spacing.xs,
  },
  pctFill: { height: '100%', borderRadius: radius.full },
  pctText: { fontSize: 13, fontWeight: '600', color: colors.mid },
  orBadge: {
    alignSelf: 'center',
    backgroundColor: colors.blush,
    borderRadius: radius.full,
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  orText: { fontSize: 13, color: colors.rose, fontWeight: '600' },
  nextBtn: {
    backgroundColor: colors.rose, borderRadius: radius.lg,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.md,
  },
  nextBtnText: { color: colors.white, fontSize: 15, fontWeight: '500' },
  hint: { fontSize: 12, color: colors.light, textAlign: 'center', marginTop: spacing.md },
});
