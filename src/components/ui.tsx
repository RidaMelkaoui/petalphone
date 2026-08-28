import { Image, type ImageSource } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
  type PressableProps,
  type ScrollViewProps,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, paperThemes, radii, spacing } from '@/constants/theme';
import { softTap } from '@/lib/haptics';
import { useGame } from '@/state/game-context';

type ButtonTone = 'primary' | 'secondary' | 'ghost' | 'coral';

export function AppScreen({
  children,
  contentStyle,
  scrollEnabled = true,
  keyboard = false,
  testID,
}: {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  scrollEnabled?: boolean;
  keyboard?: boolean;
  testID?: string;
}) {
  const insets = useSafeAreaInsets();
  const { preferences } = useGame();
  const paper = paperThemes[preferences.paperTheme];
  const scrollProps: ScrollViewProps = {
    contentInsetAdjustmentBehavior: 'automatic',
    keyboardShouldPersistTaps: 'handled',
    keyboardDismissMode: 'interactive',
    scrollEnabled,
  };

  const content = (
    <ScrollView
      {...scrollProps}
      testID={testID}
      style={{ flex: 1, backgroundColor: paper.background }}
      contentContainerStyle={{
        flexGrow: 1,
        gap: spacing.md,
        paddingTop: insets.top + spacing.md,
        paddingBottom: insets.bottom + spacing.xl,
        paddingHorizontal: spacing.lg,
        ...contentStyle,
      }}
    >
      {children}
    </ScrollView>
  );

  if (!keyboard) return content;
  return (
    <KeyboardAvoidingView behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      {content}
    </KeyboardAvoidingView>
  );
}

export function ScreenTop({ eyebrow, title, body, back = false }: { eyebrow?: string; title: string; body?: string; back?: boolean }) {
  const router = useRouter();
  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        {back ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.55 : 1, paddingVertical: 8, paddingRight: 8 })}
          >
            <Text style={{ color: colors.cocoa, fontFamily: fonts.bodyBold, fontSize: 16 }}>Back</Text>
          </Pressable>
        ) : null}
        {eyebrow ? (
          <Text style={{ color: colors.cocoaSoft, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>
            {eyebrow}
          </Text>
        ) : null}
      </View>
      <Text accessibilityRole="header" style={{ color: colors.cocoa, fontFamily: fonts.display, fontSize: 34, lineHeight: 39 }}>
        {title}
      </Text>
      {body ? <BodyText>{body}</BodyText> : null}
    </View>
  );
}

export function BodyText({ children, centered = false, small = false }: { children: React.ReactNode; centered?: boolean; small?: boolean }) {
  return (
    <Text
      selectable
      style={{
        color: colors.cocoaSoft,
        fontFamily: fonts.body,
        fontSize: small ? 13 : 16,
        lineHeight: small ? 18 : 23,
        textAlign: centered ? 'center' : 'left',
      }}
    >
      {children}
    </Text>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: colors.cocoa, fontFamily: fonts.bodyBold, fontSize: 14 }}>{children}</Text>;
}

export function PetalButton({
  children,
  tone = 'primary',
  compact = false,
  busy = false,
  disabled,
  onPress,
  style,
  ...props
}: PressableProps & {
  children: React.ReactNode;
  tone?: ButtonTone;
  compact?: boolean;
  busy?: boolean;
}) {
  const { preferences } = useGame();
  const palette = {
    primary: { background: colors.leaf, border: colors.leaf, text: colors.white },
    secondary: { background: colors.surface, border: colors.border, text: colors.cocoa },
    ghost: { background: colors.transparent, border: colors.transparent, text: colors.cocoa },
    coral: { background: colors.coral, border: colors.coral, text: colors.white },
  }[tone];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || busy}
      onPress={async (event) => {
        await softTap(preferences.haptics);
        onPress?.(event);
      }}
      {...props}
      style={(state) => [
        {
          minHeight: compact ? 44 : 54,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: compact ? 'flex-start' : 'stretch',
          borderWidth: 1,
          borderColor: disabled ? colors.disabled : palette.border,
          borderRadius: radii.capsule,
          backgroundColor: disabled ? colors.disabled : palette.background,
          opacity: state.pressed ? 0.74 : 1,
          paddingHorizontal: compact ? 20 : spacing.lg,
          paddingVertical: 12,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text style={{ color: disabled ? colors.white : palette.text, fontFamily: fonts.bodyBold, fontSize: 16 }}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

export function PaperCard({
  children,
  title,
  onPress,
  selected = false,
  quiet = false,
}: {
  children?: React.ReactNode;
  title?: string;
  onPress?: () => void;
  selected?: boolean;
  quiet?: boolean;
}) {
  const { preferences } = useGame();
  const paper = paperThemes[preferences.paperTheme];
  const content = (
    <>
      {title ? <Text style={{ color: colors.cocoa, fontFamily: fonts.displayRegular, fontSize: 21, lineHeight: 26 }}>{title}</Text> : null}
      {typeof children === 'string' ? <BodyText small>{children}</BodyText> : children}
    </>
  );
  const cardStyle = {
    gap: spacing.sm,
    borderWidth: selected ? 2 : 1,
    borderColor: selected ? paper.accent : colors.border,
    borderRadius: radii.medium,
    backgroundColor: quiet ? paper.background : paper.surface,
    padding: spacing.md,
    boxShadow: quiet ? undefined : '0 5px 12px rgba(74, 56, 46, 0.09)',
  } as const;

  if (!onPress) return <View style={cardStyle}>{content}</View>;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [cardStyle, { opacity: pressed ? 0.72 : 1 }]}>
      {content}
    </Pressable>
  );
}

export function ChoiceChip({ selected, label, onPress, locked = false }: { selected: boolean; label: string; onPress: () => void; locked?: boolean }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: locked }}
      disabled={locked}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: selected ? colors.cornflower : colors.border,
        borderRadius: radii.capsule,
        backgroundColor: selected ? colors.cornflower : colors.surface,
        opacity: locked ? 0.48 : pressed ? 0.7 : 1,
        paddingHorizontal: 18,
      })}
    >
      <Text style={{ color: selected ? colors.white : colors.cocoa, fontFamily: fonts.bodyBold, fontSize: 15 }}>
        {locked ? `${label} · Full Garden` : label}
      </Text>
    </Pressable>
  );
}

export function PetalInput(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.cocoaSoft}
      selectionColor={colors.cornflower}
      {...props}
      style={[
        {
          minHeight: 52,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.small,
          backgroundColor: colors.surface,
          color: colors.cocoa,
          fontFamily: fonts.body,
          fontSize: 16,
          paddingHorizontal: spacing.md,
          paddingVertical: 12,
        },
        props.style,
      ]}
    />
  );
}

export function SettingsRow({
  label,
  value,
  toggle,
  onPress,
}: {
  label: string;
  value?: string;
  toggle?: boolean;
  onPress?: (value?: boolean) => void;
}) {
  return (
    <Pressable
      accessibilityRole={toggle === undefined ? 'button' : undefined}
      onPress={() => onPress?.(toggle === undefined ? undefined : !toggle)}
      style={({ pressed }) => ({
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        opacity: pressed ? 0.65 : 1,
        paddingVertical: spacing.sm,
      })}
    >
      <Text style={{ color: colors.cocoa, fontFamily: fonts.body, fontSize: 16 }}>{label}</Text>
      {toggle === undefined ? (
        <Text style={{ color: colors.cocoaSoft, fontFamily: fonts.bodyMedium, fontSize: 14 }}>{value ?? 'Open'}</Text>
      ) : (
        <Switch
          accessibilityLabel={label}
          value={toggle}
          onValueChange={(next) => onPress?.(next)}
          trackColor={{ false: colors.disabled, true: colors.leaf }}
          thumbColor={colors.surface}
        />
      )}
    </Pressable>
  );
}

export function Mascot({ kind = 'sprout', size = 150 }: { kind?: 'sprout' | 'flower'; size?: number }) {
  const source: ImageSource = kind === 'sprout'
    ? require('../../assets/petalphone/bloomling-sprout.png')
    : require('../../assets/petalphone/bloomling-flower.png');
  return <Image accessibilityLabel={`${kind} Bloomling`} source={source} contentFit="contain" style={{ width: size, height: size, alignSelf: 'center' }} />;
}

export function TurnMeta({ left, right }: { left: string; right: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
      <Text style={{ color: colors.cocoaSoft, fontFamily: fonts.bodyBold, fontSize: 12, fontVariant: ['tabular-nums'] }}>{left}</Text>
      <Text style={{ color: colors.cocoaSoft, fontFamily: fonts.bodyBold, fontSize: 12, fontVariant: ['tabular-nums'] }}>{right}</Text>
    </View>
  );
}

export function Separator() {
  return <View style={{ height: 1, backgroundColor: colors.border }} />;
}

export function Spacer() {
  return <View style={{ flex: 1, minHeight: spacing.md }} />;
}

