import React, { ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing } from '../utils/theme';

// ─── Screen Wrapper ───────────────────────────────────────────────────────────
export function Screen({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top }, style]}>
      {children}
    </View>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}
export function Header({ title, subtitle, onBack, right }: HeaderProps) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      ) : <View style={styles.headerPlaceholder} />}
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.headerRight}>{right}</View> : <View style={styles.headerPlaceholder} />}
    </View>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}) {
  const content = <View style={[styles.card, style]}>{children}</View>;
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
  textStyle,
}: ButtonProps) {
  const btnStyle = [
    styles.btn,
    variant === 'primary' && styles.btnPrimary,
    variant === 'secondary' && styles.btnSecondary,
    variant === 'ghost' && styles.btnGhost,
    disabled && styles.btnDisabled,
    style,
  ];
  const txtStyle = [
    styles.btnText,
    variant === 'primary' && styles.btnTextPrimary,
    variant === 'secondary' && styles.btnTextSecondary,
    variant === 'ghost' && styles.btnTextGhost,
    textStyle,
  ];
  return (
    <TouchableOpacity
      style={btnStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.rose} size="small" />
      ) : (
        <Text style={txtStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Section Title ─────────────────────────────────────────────────────────────
export function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ emoji, message }: { emoji: string; message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.warm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.warm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: colors.deep,
  },
  headerPlaceholder: { width: 36 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Georgia',
    color: colors.deep,
    fontWeight: '400',
  },
  headerSub: {
    fontSize: 11,
    color: colors.rose,
    marginTop: 1,
  },
  headerRight: { width: 36, alignItems: 'flex-end' },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.sm,
  },
  btn: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: colors.rose },
  btnSecondary: { backgroundColor: colors.warm, borderWidth: 1, borderColor: colors.blush },
  btnGhost: { backgroundColor: 'transparent' },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontSize: 14, fontWeight: '500' },
  btnTextPrimary: { color: colors.white },
  btnTextSecondary: { color: colors.deep },
  btnTextGhost: { color: colors.rose },
  sectionTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.light,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  empty: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.md },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 14, color: colors.light, textAlign: 'center' },
});
