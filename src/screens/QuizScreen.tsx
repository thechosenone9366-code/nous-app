import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Header } from '../components/UI';
import { colors, spacing, radius, shadow } from '../utils/theme';
import { QUIZ_QUESTIONS } from '../assets/data/content';

type AnswerState = 'none' | 'correct' | 'wrong';

export default function QuizScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerStates, setAnswerStates] = useState<AnswerState[]>([]);
  const [finished, setFinished] = useState(false);

  // Shuffle questions at start
  const [questions] = useState(() => [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5));
  const currentQ = questions[currentIndex];

  function handleAnswer(optionIndex: number) {
    if (selectedIndex !== null) return; // already answered
    const isCorrect = optionIndex === (currentIndex % currentQ.options.length); // demo: first option is always "correct"
    // In a real app you'd compare to a stored correct answer per question
    const states: AnswerState[] = currentQ.options.map((_, i) => {
      if (i === 0) return 'correct'; // first option = correct answer
      if (i === optionIndex && optionIndex !== 0) return 'wrong';
      return 'none';
    });
    setAnswerStates(states);
    setSelectedIndex(optionIndex);
    if (optionIndex === 0) setScore(s => s + 1);
    setTimeout(nextQuestion, 1200);
  }

  function nextQuestion() {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedIndex(null);
      setAnswerStates([]);
    }
  }

  function restart() {
    setCurrentIndex(0);
    setScore(0);
    setSelectedIndex(null);
    setAnswerStates([]);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Screen>
        <Header title="Quiz Couple 🧠" onBack={() => navigation.goBack()} />
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>{score === questions.length ? '🏆' : score > 2 ? '🥰' : '💪'}</Text>
          <Text style={styles.resultTitle}>
            {score}/{questions.length} bonnes réponses
          </Text>
          <Text style={styles.resultText}>
            {score === questions.length
              ? 'Parfait ! Vous vous connaissez par cœur !'
              : score > 2
              ? 'Pas mal ! Continuez à vous découvrir.'
              : 'Encore un peu de travail... mais c\'est l\'occasion d\'apprendre !'}
          </Text>
          <View style={styles.scoreBar}>
            <View style={[styles.scoreBarFill, { width: `${pct}%` as any }]} />
          </View>
          <TouchableOpacity style={styles.restartBtn} onPress={restart}>
            <Text style={styles.restartText}>Rejouer ↺</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Quiz Couple 🧠"
        subtitle={`Score : ${score} / ${questions.length}`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Progress dots */}
        <View style={styles.progress}>
          {questions.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i < currentIndex ? styles.dotDone : i === currentIndex ? styles.dotCurrent : styles.dotEmpty]}
            />
          ))}
        </View>

        {/* Question */}
        <View style={styles.questionBox}>
          <Text style={styles.qNum}>Question {currentIndex + 1} / {questions.length}</Text>
          <Text style={styles.qCategory}>{currentQ.category.toUpperCase()}</Text>
          <Text style={styles.qText}>{currentQ.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.options}>
          {currentQ.options.map((opt, i) => {
            const state = answerStates[i] ?? 'none';
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.option,
                  state === 'correct' && styles.optionCorrect,
                  state === 'wrong' && styles.optionWrong,
                ]}
                onPress={() => handleAnswer(i)}
                disabled={selectedIndex !== null}
                activeOpacity={0.8}
              >
                <View style={styles.optionLetter}>
                  <Text style={[styles.optionLetterText, state === 'correct' && { color: '#2E7D32' }, state === 'wrong' && { color: '#C62828' }]}>
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text style={[
                  styles.optionText,
                  state === 'correct' && styles.optionTextCorrect,
                  state === 'wrong' && styles.optionTextWrong,
                ]}>
                  {opt}
                </Text>
                {state === 'correct' && <Text style={styles.optionCheckmark}>✓</Text>}
                {state === 'wrong' && <Text style={styles.optionCheckmark}>✗</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg },
  progress: { flexDirection: 'row', gap: spacing.sm },
  dot: { flex: 1, height: 4, borderRadius: 2 },
  dotEmpty: { backgroundColor: colors.warm },
  dotDone: { backgroundColor: colors.rose },
  dotCurrent: { backgroundColor: colors.blush },
  questionBox: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadow.sm,
  },
  qNum: { fontSize: 11, color: colors.rose, textTransform: 'uppercase', letterSpacing: 1 },
  qCategory: { fontSize: 10, color: colors.light, letterSpacing: 1 },
  qText: { fontFamily: 'Georgia', fontSize: 19, color: colors.deep, lineHeight: 26 },
  options: { gap: spacing.md },
  option: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.warm,
  },
  optionCorrect: { borderColor: '#A5D6A7', backgroundColor: '#E8F5E9' },
  optionWrong: { borderColor: '#FFCDD2', backgroundColor: '#FFEBEE' },
  optionLetter: {
    width: 32, height: 32, borderRadius: radius.full,
    backgroundColor: colors.warm,
    alignItems: 'center', justifyContent: 'center',
  },
  optionLetterText: { fontSize: 13, fontWeight: '600', color: colors.mid },
  optionText: { flex: 1, fontSize: 14, color: colors.deep },
  optionTextCorrect: { color: '#2E7D32', fontWeight: '500' },
  optionTextWrong: { color: '#C62828' },
  optionCheckmark: { fontSize: 16 },
  resultContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: spacing.xl, gap: spacing.lg,
  },
  resultEmoji: { fontSize: 60 },
  resultTitle: { fontFamily: 'Georgia', fontSize: 26, color: colors.deep },
  resultText: { fontSize: 14, color: colors.mid, textAlign: 'center', lineHeight: 20 },
  scoreBar: {
    width: '100%', height: 8, backgroundColor: colors.warm,
    borderRadius: radius.full, overflow: 'hidden',
  },
  scoreBarFill: { height: '100%', backgroundColor: colors.rose, borderRadius: radius.full },
  restartBtn: {
    backgroundColor: colors.rose, borderRadius: radius.lg,
    paddingVertical: 14, paddingHorizontal: spacing.xxl,
  },
  restartText: { color: colors.white, fontSize: 15, fontWeight: '500' },
});
