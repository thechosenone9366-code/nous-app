import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  StyleSheet, FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAppContext } from '../store/AppContext';
import { Screen, Card, SectionTitle, Button } from '../components/UI';
import { colors, spacing, radius, shadow } from '../utils/theme';
import { DAILY_QUESTIONS, MOODS } from '../assets/data/content';
import { MainTabParamList } from '../utils/types';

type Nav = BottomTabNavigationProp<MainTabParamList>;

function getDaysBetween(isoDate: string): number {
  const start = new Date(isoDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDateShort(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function HomeScreen() {
  const { state, actions } = useAppContext();
  const navigation = useNavigation<Nav>();
  const [moodModalVisible, setMoodModalVisible] = useState(false);

  const { coupleInfo } = state;
  const daysTogether = coupleInfo ? getDaysBetween(coupleInfo.startDate) : 0;
  const currentQuestion = DAILY_QUESTIONS[state.dailyQuestionIndex % DAILY_QUESTIONS.length];

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return state.events.filter(e => e.date >= today).slice(0, 3);
  }, [state.events]);

  if (!coupleInfo) return null;

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.coupleNames}>
          {coupleInfo.name1} <Text style={styles.ampersand}>&</Text> {coupleInfo.name2}
        </Text>
        <TouchableOpacity style={styles.moodBtn} onPress={() => setMoodModalVisible(true)}>
          <Text style={styles.moodEmoji}>{state.mood?.emoji ?? '🌸'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Love Banner */}
        <Card style={styles.loveBanner}>
          <View style={styles.avatars}>
            <View style={[styles.avatar, styles.avatar1]}>
              <Text style={styles.avatarEmoji}>{coupleInfo.emoji1}</Text>
            </View>
            <View style={[styles.avatar, styles.avatar2]}>
              <Text style={styles.avatarEmoji}>{coupleInfo.emoji2}</Text>
            </View>
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Ensemble depuis</Text>
            <Text style={styles.bannerDate}>
              {new Date(coupleInfo.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.daysBox}>
            <Text style={styles.daysNum}>{daysTogether}</Text>
            <Text style={styles.daysLabel}>jours</Text>
          </View>
        </Card>

        {/* Daily Question */}
        <View style={styles.dailyQ}>
          <Text style={styles.dailyTag}>✨ Question du jour</Text>
          <Text style={styles.dailyText}>« {currentQuestion} »</Text>
          <View style={styles.dailyActions}>
            <TouchableOpacity
              style={styles.answerBtn}
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.8}
            >
              <Text style={styles.answerBtnText}>Répondre dans le chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={actions.nextDailyQuestion}
              activeOpacity={0.8}
            >
              <Text style={styles.skipBtnText}>Suivante →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <SectionTitle label="Actions rapides" />
        <View style={styles.actionsGrid}>
          {[
            { icon: '💬', label: 'Chat', screen: 'Chat' as const },
            { icon: '🎲', label: 'Jeux', screen: 'Games' as const },
            { icon: '📅', label: 'Agenda', screen: 'Calendar' as const },
            { icon: '📸', label: 'Photos', screen: 'Photos' as const },
          ].map(item => (
            <TouchableOpacity
              key={item.screen}
              style={styles.actionCard}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>{item.icon}</Text>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Events */}
        <SectionTitle label="Prochainement" />
        {upcomingEvents.length === 0 ? (
          <Card style={styles.noEvents}>
            <Text style={styles.noEventsText}>Aucun événement prévu 📅</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
              <Text style={styles.noEventsLink}>Ajouter un événement →</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <View style={styles.eventsList}>
            {upcomingEvents.map(event => (
              <Card key={event.id} style={styles.eventCard}>
                <View style={styles.eventDate}>
                  <Text style={styles.eventDay}>
                    {new Date(event.date).getDate()}
                  </Text>
                  <Text style={styles.eventMonth}>
                    {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}
                  </Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.emoji} {event.title}</Text>
                  {event.note ? <Text style={styles.eventNote}>{event.note}</Text> : null}
                </View>
              </Card>
            ))}
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* Mood Modal */}
      <Modal
        visible={moodModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMoodModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMoodModalVisible(false)}
        >
          <View style={styles.moodModal}>
            <Text style={styles.moodModalTitle}>Comment tu te sens ?</Text>
            <View style={styles.moodGrid}>
              {MOODS.map(m => (
                <TouchableOpacity
                  key={m.emoji}
                  style={[
                    styles.moodOption,
                    state.mood?.emoji === m.emoji && styles.moodOptionActive,
                  ]}
                  onPress={() => {
                    actions.setMood({ ...m, date: new Date().toISOString() });
                    setMoodModalVisible(false);
                  }}
                >
                  <Text style={styles.moodOptionEmoji}>{m.emoji}</Text>
                  <Text style={styles.moodOptionLabel}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.cream,
  },
  coupleNames: { fontFamily: 'Georgia', fontSize: 22, color: colors.deep, fontWeight: '300' },
  ampersand: { color: colors.rose },
  moodBtn: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...shadow.sm,
  },
  moodEmoji: { fontSize: 20 },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  loveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatars: { flexDirection: 'row' },
  avatar: {
    width: 44, height: 44, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.white,
  },
  avatar1: { backgroundColor: '#FCE4EC', zIndex: 2 },
  avatar2: { backgroundColor: '#E3F2FD', marginLeft: -12 },
  avatarEmoji: { fontSize: 20 },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 12, color: colors.light },
  bannerDate: { fontSize: 13, color: colors.deep, fontWeight: '500', marginTop: 2 },
  daysBox: { alignItems: 'center' },
  daysNum: { fontFamily: 'Georgia', fontSize: 26, color: colors.rose, lineHeight: 28 },
  daysLabel: { fontSize: 10, color: colors.light, textTransform: 'uppercase', letterSpacing: 0.5 },
  dailyQ: {
    backgroundColor: colors.rose,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  dailyTag: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.sm },
  dailyText: { fontFamily: 'Georgia', fontSize: 15, color: colors.white, fontStyle: 'italic', lineHeight: 22 },
  dailyActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  answerBtn: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.md, padding: spacing.sm,
    alignItems: 'center',
  },
  answerBtnText: { color: colors.white, fontSize: 12, fontWeight: '500' },
  skipBtn: {
    flex: 0, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md, padding: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  skipBtnText: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  actionCard: {
    flex: 1, backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadow.sm,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: { fontSize: 10, color: colors.mid, fontWeight: '500' },
  noEvents: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  noEventsText: { fontSize: 14, color: colors.light },
  noEventsLink: { fontSize: 13, color: colors.rose, fontWeight: '500' },
  eventsList: { gap: spacing.sm, marginBottom: spacing.lg },
  eventCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  eventDate: { width: 44, alignItems: 'center' },
  eventDay: { fontFamily: 'Georgia', fontSize: 22, color: colors.rose, lineHeight: 24 },
  eventMonth: { fontSize: 10, color: colors.light, textTransform: 'uppercase' },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 13, fontWeight: '500', color: colors.deep },
  eventNote: { fontSize: 11, color: colors.light, marginTop: 2 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  moodModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: spacing.xl,
    paddingBottom: 40,
  },
  moodModalTitle: {
    fontFamily: 'Georgia', fontSize: 20, color: colors.deep,
    textAlign: 'center', marginBottom: spacing.xl,
  },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center' },
  moodOption: {
    width: 76, alignItems: 'center', gap: spacing.xs,
    padding: spacing.sm, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.warm,
    backgroundColor: colors.cream,
  },
  moodOptionActive: { borderColor: colors.rose, backgroundColor: '#FFF0EE' },
  moodOptionEmoji: { fontSize: 28 },
  moodOptionLabel: { fontSize: 10, color: colors.mid, textAlign: 'center' },
});
