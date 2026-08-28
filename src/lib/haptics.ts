import * as Haptics from 'expo-haptics';

export async function softTap(enabled: boolean) {
  if (!enabled || process.env.EXPO_OS !== 'ios') return;
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
}

export async function warmSuccess(enabled: boolean) {
  if (!enabled || process.env.EXPO_OS !== 'ios') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
}

