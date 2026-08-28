import type { PaperThemeId } from '@/types/game';

export const colors = {
  cream: '#F7EBD5',
  surface: '#FFF9EF',
  quiet: '#F0DEBC',
  cocoa: '#4A382E',
  cocoaSoft: '#776359',
  ink: '#2F241E',
  leaf: '#8DA269',
  leafDark: '#6D8350',
  coral: '#D98571',
  cornflower: '#7895C4',
  border: '#E6CFAB',
  white: '#FFFFFF',
  danger: '#A34F46',
  disabled: '#CDBFAE',
  transparent: 'transparent',
} as const;

export const paperThemes: Record<PaperThemeId, { name: string; background: string; surface: string; accent: string }> = {
  cream: { name: 'Warm cream', background: '#F7EBD5', surface: '#FFF9EF', accent: '#8DA269' },
  sage: { name: 'Soft sage', background: '#E8EBD6', surface: '#F8F7E9', accent: '#788D60' },
  rose: { name: 'Dusty rose', background: '#F3DDDA', surface: '#FFF6F1', accent: '#BF756F' },
  sky: { name: 'Cloud blue', background: '#DDE8ED', surface: '#F6FBFC', accent: '#6F92A5' },
  lavender: { name: 'Quiet lavender', background: '#E9E0EC', surface: '#FBF6FC', accent: '#8E789C' },
  night: { name: 'Firefly night', background: '#D9DDCE', surface: '#F1F0DF', accent: '#80714A' },
};

export const fonts = {
  display: 'Fraunces_700Bold',
  displayRegular: 'Fraunces_600SemiBold',
  body: 'Nunito_400Regular',
  bodyMedium: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
} as const;

export const radii = {
  small: 14,
  medium: 20,
  large: 28,
  capsule: 999,
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
} as const;
