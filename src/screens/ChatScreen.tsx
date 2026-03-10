import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../store/AppContext';
import { colors, spacing, radius } from '../utils/theme';
import { CHAT_EMOJIS } from '../assets/data/content';
import { Message } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg }: { msg: Message }) {
  const isMe = msg.sender === 'me';
  return (
    <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{msg.text}</Text>
        <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>{formatTime(msg.timestamp)}</Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { state, actions } = useAppContext();
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const { coupleInfo } = state;

  const scrollToBottom = useCallback(() => {
    if (state.messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [state.messages.length]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await actions.sendMessage(text);
    setTimeout(scrollToBottom, 100);
  }

  function insertEmoji(e: string) {
    setInput(prev => prev + e);
  }

  const partnerName = coupleInfo?.name2 ?? 'Partenaire';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerEmoji}>{coupleInfo?.emoji2 ?? '🌸'}</Text>
          <View>
            <Text style={styles.headerName}>Notre bulle 💕</Text>
            <Text style={styles.headerStatus}>{partnerName} · en ligne</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={listRef}
          data={state.messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatEmoji}>💌</Text>
              <Text style={styles.emptyChatText}>Commencez à discuter !</Text>
            </View>
          }
        />

        {/* Emoji picker */}
        {showEmojis && (
          <View style={styles.emojiPicker}>
            {CHAT_EMOJIS.map(e => (
              <TouchableOpacity key={e} onPress={() => insertEmoji(e)} style={styles.emojiItem}>
                <Text style={styles.emojiItemText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input area */}
        <View style={[styles.inputArea, { paddingBottom: insets.bottom + 8 }]}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowEmojis(v => !v)}
            activeOpacity={0.7}
          >
            <Text style={styles.iconBtnText}>{showEmojis ? '⌨️' : '🙂'}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Écrire un message..."
            placeholderTextColor={colors.light}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.sendIcon}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.warm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerEmoji: { fontSize: 28 },
  headerName: { fontFamily: 'Georgia', fontSize: 18, color: colors.deep },
  headerStatus: { fontSize: 11, color: colors.rose, marginTop: 1 },
  messageList: { padding: spacing.lg, gap: spacing.sm, flexGrow: 1 },
  msgRow: { flexDirection: 'row', marginBottom: spacing.xs },
  msgRowMe: { justifyContent: 'flex-end' },
  msgRowThem: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '72%',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleMe: {
    backgroundColor: colors.rose,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    shadowColor: colors.deep,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleText: { fontSize: 14, color: colors.deep, lineHeight: 20 },
  bubbleTextMe: { color: colors.white },
  msgTime: { fontSize: 10, color: colors.light, marginTop: 3, textAlign: 'right' },
  msgTimeMe: { color: 'rgba(255,255,255,0.65)' },
  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: spacing.md },
  emptyChatEmoji: { fontSize: 40 },
  emptyChatText: { fontSize: 14, color: colors.light },
  emojiPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.warm,
    gap: spacing.xs,
  },
  emojiItem: { padding: spacing.xs, borderRadius: radius.sm },
  emojiItemText: { fontSize: 24 },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.warm,
  },
  iconBtn: {
    width: 38, height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.warm,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtnText: { fontSize: 20 },
  textInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.warm,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.deep,
    backgroundColor: colors.cream,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38, height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.rose,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: colors.blush },
  sendIcon: { fontSize: 18, color: colors.white, fontWeight: '600' },
});
