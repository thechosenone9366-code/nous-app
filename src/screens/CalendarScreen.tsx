import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal,
  TextInput, StyleSheet, Alert,
} from 'react-native';

import { useAppContext } from '../store/AppContext';
import { Screen, Header, EmptyState } from '../components/UI';
import { colors, spacing, radius, shadow } from '../utils/theme';
import { CalendarEvent } from '../utils/types';

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const EVENT_COLORS: CalendarEvent['color'][] = ['rose', 'blue', 'green', 'yellow'];
const COLOR_MAP: Record<CalendarEvent['color'], string> = {
  rose: colors.rose,
  blue: '#7986CB',
  green: '#81C784',
  yellow: '#FFB300',
};

const QUICK_EMOJIS = ['💕','🎬','🍽️','✈️','🎂','🌹','🏠','🎁','🎉','🌅','💐','🎶'];

export default function CalendarScreen() {
  const { state, actions } = useAppContext();
  const [viewDate, setViewDate] = useState(new Date());
  const [addModalVisible, setAddModalVisible] = useState(false);

  // New event form
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [emoji, setEmoji] = useState('💕');
  const [color, setColor] = useState<CalendarEvent['color']>('rose');
  const [saving, setSaving] = useState(false);
  const [dateInputText, setDateInputText] = useState('');

  function handleDateInput(t: string) {
    setDateInputText(t);
    const parts = t.split('/');
    if (parts.length === 3 && t.length === 10) {
      const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]);
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 2000) {
        const date = new Date(y, m - 1, d);
        if (!isNaN(date.getTime())) setSelectedDate(date);
      }
    }
  }

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon-start
    const cells: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [year, month]);

  // Events for this month
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthEvents = state.events.filter(e => e.date.startsWith(monthStr));
  const eventDays = new Set(monthEvents.map(e => parseInt(e.date.split('-')[2], 10)));

  async function saveEvent() {
    if (!title.trim()) { Alert.alert('', 'Veuillez entrer un titre.'); return; }
    setSaving(true);
    await actions.addEvent({
      title: title.trim(),
      date: selectedDate.toISOString().split('T')[0],
      emoji,
      note: note.trim() || undefined,
      color,
    });
    setSaving(false);
    setAddModalVisible(false);
    setTitle(''); setNote(''); setEmoji('💕'); setColor('rose');
  }

  function prevMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  return (
    <Screen>
      <Header
        title="Notre agenda 📅"
        subtitle="Moments à partager"
        right={
          <TouchableOpacity onPress={() => setAddModalVisible(true)} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity style={styles.navBtn} onPress={prevMonth}>
            <Text style={styles.navBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
          <TouchableOpacity style={styles.navBtn} onPress={nextMonth}>
            <Text style={styles.navBtnText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar grid */}
        <View style={styles.calGrid}>
          {DAYS.map(d => (
            <Text key={d} style={styles.dayLabel}>{d}</Text>
          ))}
          {calendarDays.map((day, i) => {
            if (day === null) return <View key={`empty-${i}`} />;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const hasEvent = eventDays.has(day);
            return (
              <View key={`day-${day}`} style={styles.dayCell}>
                <View style={[styles.dayInner, isToday && styles.dayToday]}>
                  <Text style={[styles.dayNum, isToday && styles.dayNumToday]}>{day}</Text>
                </View>
                {hasEvent && <View style={[styles.eventDot, isToday && styles.eventDotOnToday]} />}
              </View>
            );
          })}
        </View>

        {/* Events list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {monthEvents.length > 0 ? `${monthEvents.length} événement${monthEvents.length > 1 ? 's' : ''} ce mois` : 'Aucun événement ce mois'}
          </Text>
          {monthEvents.length === 0 ? (
            <EmptyState emoji="📭" message="Ajoutez votre premier événement !" />
          ) : (
            monthEvents.map(event => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onLongPress={() => Alert.alert('Supprimer', `Supprimer "${event.title}" ?`, [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Supprimer', style: 'destructive', onPress: () => actions.deleteEvent(event.id) },
                ])}
                activeOpacity={0.8}
              >
                <View style={[styles.eventColorBar, { backgroundColor: COLOR_MAP[event.color] }]} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.emoji} {event.title}</Text>
                  <Text style={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </Text>
                  {event.note ? <Text style={styles.eventNote}>{event.note}</Text> : null}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Event Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide" onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nouvel événement</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Titre de l'événement..."
              placeholderTextColor={colors.light}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

                    <TextInput
              style={styles.modalInput}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor={colors.light}
              value={dateInputText}
              onChangeText={handleDateInput}
              keyboardType="numeric"
              maxLength={10}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Note (optionnel)..."
              placeholderTextColor={colors.light}
              value={note}
              onChangeText={setNote}
            />

            <Text style={styles.fieldLabel}>Emoji</Text>
            <View style={styles.emojiRow}>
              {QUICK_EMOJIS.map(e => (
                <TouchableOpacity
                  key={e}
                  style={[styles.emojiOpt, emoji === e && styles.emojiOptActive]}
                  onPress={() => setEmoji(e)}
                >
                  <Text style={styles.emojiOptText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Couleur</Text>
            <View style={styles.colorRow}>
              {EVENT_COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorOpt, { backgroundColor: COLOR_MAP[c] }, color === c && styles.colorOptActive]}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddModalVisible(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={saveEvent}
                disabled={saving}
              >
                <Text style={styles.saveText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 32, height: 32, borderRadius: radius.full,
    backgroundColor: colors.rose, alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: colors.white, fontSize: 20, fontWeight: '300', lineHeight: 22 },
  monthNav: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  navBtn: {
    width: 32, height: 32, borderRadius: radius.full,
    backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center',
  },
  navBtnText: { fontSize: 18, color: colors.deep },
  monthTitle: { fontFamily: 'Georgia', fontSize: 20, color: colors.deep },
  calGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.md, marginBottom: spacing.lg,
  },
  dayLabel: {
    width: `${100 / 7}%`, textAlign: 'center',
    fontSize: 11, color: colors.light, paddingVertical: spacing.xs,
    textTransform: 'uppercase',
  },
  dayCell: {
    width: `${100 / 7}%`, alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dayInner: {
    width: 32, height: 32, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  dayToday: { backgroundColor: colors.rose },
  dayNum: { fontSize: 13, color: colors.deep },
  dayNumToday: { color: colors.white, fontWeight: '600' },
  eventDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: colors.rose, marginTop: 1,
  },
  eventDotOnToday: { backgroundColor: colors.white },
  section: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },
  sectionTitle: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: colors.light, marginBottom: spacing.xs },
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadow.sm,
  },
  eventColorBar: { width: 4 },
  eventContent: { flex: 1, padding: spacing.md },
  eventTitle: { fontSize: 14, fontWeight: '500', color: colors.deep },
  eventDate: { fontSize: 11, color: colors.light, marginTop: 3 },
  eventNote: { fontSize: 12, color: colors.mid, marginTop: 3 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: spacing.xl, gap: spacing.md, paddingBottom: 40,
  },
  modalTitle: { fontFamily: 'Georgia', fontSize: 22, color: colors.deep, textAlign: 'center' },
  modalInput: {
    borderWidth: 1.5, borderColor: colors.warm,
    borderRadius: radius.md, padding: spacing.md,
    fontSize: 14, color: colors.deep,
    backgroundColor: colors.cream,
  },
  dateRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1.5, borderColor: colors.warm,
  },
  dateRowLabel: { fontSize: 13, color: colors.mid },
  dateRowValue: { fontSize: 13, color: colors.rose, fontWeight: '500' },
  fieldLabel: { fontSize: 12, color: colors.light, textTransform: 'uppercase', letterSpacing: 1 },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  emojiOpt: {
    width: 40, height: 40, borderRadius: radius.sm,
    backgroundColor: colors.warm, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  emojiOptActive: { borderColor: colors.rose, backgroundColor: '#FFF0EE' },
  emojiOptText: { fontSize: 20 },
  colorRow: { flexDirection: 'row', gap: spacing.md },
  colorOpt: { width: 32, height: 32, borderRadius: radius.full },
  colorOptActive: { borderWidth: 3, borderColor: colors.deep },
  modalActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  cancelBtn: {
    flex: 1, padding: 14, borderRadius: radius.md,
    backgroundColor: colors.warm, alignItems: 'center',
  },
  cancelText: { fontSize: 14, color: colors.mid, fontWeight: '500' },
  saveBtn: {
    flex: 2, padding: 14, borderRadius: radius.md,
    backgroundColor: colors.rose, alignItems: 'center',
  },
  saveText: { fontSize: 14, color: colors.white, fontWeight: '500' },
});
