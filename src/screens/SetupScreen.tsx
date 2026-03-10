import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../store/AppContext';
import { colors, spacing, radius } from '../utils/theme';
import { Button } from '../components/UI';

const EMOJIS = ['🌸','🌊','⭐','🦋','🌿','🍓','🌙','☀️','🎀','🎵','🌺','🐾'];

export default function SetupScreen() {
  const { actions } = useAppContext();
  const insets = useSafeAreaInsets();
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [emoji1, setEmoji1] = useState('🌸');
  const [emoji2, setEmoji2] = useState('🌊');
  const [dateText, setDateText] = useState('');
  const [dateError, setDateError] = useState('');
  const [startDate, setStartDate] = useState(new Date(2023, 0, 1));
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  function handleDateChange(t: string) {
    setDateText(t);
    const parts = t.split('/');
    if (parts.length === 3 && t.length === 10) {
      const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]);
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 2000 && y <= new Date().getFullYear()) {
        const date = new Date(y, m - 1, d);
        if (!isNaN(date.getTime()) && date <= new Date()) {
          setStartDate(date); setDateError(''); return;
        }
      }
      setDateError('Date invalide');
    } else { setDateError(''); }
  }

  async function handleFinish() {
    if (dateText.length < 10) { Alert.alert('', 'Entrez votre date au format JJ/MM/AAAA'); return; }
    if (dateError) { Alert.alert('', 'Date invalide'); return; }
    setLoading(true);
    await actions.setCoupleInfo({ name1: name1.trim(), name2: name2.trim(), emoji1, emoji2, startDate: startDate.toISOString() });
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>♡</Text>
        <Text style={styles.title}>Nous</Text>
        <Text style={styles.subtitle}>Votre espace à deux</Text>

        {step === 0 && (
          <View style={styles.step}>
            <Text style={styles.stepLabel}>Vos prénoms</Text>
            <TextInput style={styles.input} placeholder="Ton prénom..." placeholderTextColor={colors.light}
              value={name1} onChangeText={setName1} maxLength={20} autoFocus />
            <TextInput style={styles.input} placeholder="Prénom de ton partenaire..." placeholderTextColor={colors.light}
              value={name2} onChangeText={setName2} maxLength={20} />
            <Button label="Continuer →" style={{ marginTop: spacing.sm }} onPress={() => {
              if (!name1.trim() || !name2.trim()) { Alert.alert('', 'Entrez les deux prénoms.'); return; }
              setStep(1);
            }} />
          </View>
        )}

        {step === 1 && (
          <View style={styles.step}>
            <Text style={styles.stepLabel}>Vos emojis</Text>
            <Text style={styles.emojiLabel}>{name1}</Text>
            <View style={styles.emojiGrid}>
              {EMOJIS.map(e => (
                <TouchableOpacity key={'a'+e} style={[styles.emojiBtn, emoji1===e && styles.emojiBtnActive]} onPress={() => setEmoji1(e)}>
                  <Text style={styles.emojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.emojiLabel, { marginTop: spacing.lg }]}>{name2}</Text>
            <View style={styles.emojiGrid}>
              {EMOJIS.map(e => (
                <TouchableOpacity key={'b'+e} style={[styles.emojiBtn, emoji2===e && styles.emojiBtnActive]} onPress={() => setEmoji2(e)}>
                  <Text style={styles.emojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              <Button label="← Retour" onPress={() => setStep(0)} variant="ghost" style={{ flex: 1 }} />
              <Button label="Continuer →" onPress={() => setStep(2)} style={{ flex: 2 }} />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.step}>
            <Text style={styles.stepLabel}>Votre date de rencontre</Text>
            <TextInput style={[styles.input, dateError ? styles.inputError : null]}
              placeholder="JJ/MM/AAAA" placeholderTextColor={colors.light}
              value={dateText} onChangeText={handleDateChange}
              keyboardType="numeric" maxLength={10} />
            {dateError ? <Text style={styles.errText}>{dateError}</Text> : null}
            <View style={styles.preview}>
              <Text style={styles.previewTitle}>{emoji1} {name1} & {name2} {emoji2}</Text>
              <Text style={styles.previewSub}>
                Ensemble depuis le {startDate.toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
              </Text>
            </View>
            <View style={styles.row}>
              <Button label="← Retour" onPress={() => setStep(1)} variant="ghost" style={{ flex: 1 }} />
              <Button label="C'est parti ! ♡" onPress={handleFinish} loading={loading} style={{ flex: 2 }} />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: spacing.xl, alignItems: 'center' },
  logo: { fontSize: 48, marginBottom: spacing.sm },
  title: { fontFamily: 'Georgia', fontSize: 42, color: colors.deep, fontWeight: '300' },
  subtitle: { fontSize: 14, color: colors.light, marginTop: spacing.xs, marginBottom: spacing.xxl * 1.5 },
  step: { width: '100%', gap: spacing.md },
  stepLabel: { fontFamily: 'Georgia', fontSize: 22, color: colors.deep, textAlign: 'center', marginBottom: spacing.sm },
  input: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, fontSize: 15, color: colors.deep, borderWidth: 1.5, borderColor: colors.warm },
  inputError: { borderColor: colors.rose },
  errText: { fontSize: 11, color: colors.rose, marginTop: -spacing.xs },
  emojiLabel: { fontSize: 13, color: colors.mid, fontWeight: '500' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  emojiBtn: { width: 48, height: 48, borderRadius: radius.sm, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.warm },
  emojiBtnActive: { borderColor: colors.rose, backgroundColor: '#FFF0EE' },
  emojiText: { fontSize: 22 },
  preview: { backgroundColor: colors.rose, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', gap: spacing.xs },
  previewTitle: { fontSize: 18, color: colors.white, fontFamily: 'Georgia' },
  previewSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
});
