/**
 * Design language: "Interdimensional Field Dossier".
 * Deep-space dark surfaces, portal-green + Rick-cyan neon accents, and a
 * status-colored accent rail that encodes a character's state at a glance.
 * Dark is the signature theme; light is a faithful, high-contrast counterpart.
 */
export const darkTheme = {
  colors: {
    background: '#0B0F17', // deep space
    backgroundElevated: '#111826',
    cardBackground: '#161E2D',
    cardBackgroundRaised: '#1C2738',
    inputBackground: '#10172300',
    border: '#27313F',
    textPrimary: '#EEF2F8',
    textSecondary: '#8B97A8',
    primary: '#8CE05A', // portal green (neon)
    secondary: '#34D1E8', // Rick cyan
    accentSoft: 'rgba(140, 224, 90, 0.14)', // translucent portal green
    cyanSoft: 'rgba(52, 209, 232, 0.14)',
    glow: '#8CE05A',
    overlay: 'rgba(3, 6, 12, 0.72)',
    error: '#F87171',
    errorBackground: 'rgba(248, 113, 113, 0.12)',
    favoriteActive: '#FF5470',
    favoriteInactive: '#5A6678',
    loading: '#8CE05A',
    white: '#FFFFFF',
    badgeAlive: '#4ADE80',
    badgeDead: '#F87171',
    badgeUnknown: '#94A3B8',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 20,
    round: 9999,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 26,
  },
};

export type AppTheme = typeof darkTheme;

export const lightTheme: AppTheme = {
  colors: {
    background: '#EEF1F6',
    backgroundElevated: '#F6F8FB',
    cardBackground: '#FFFFFF',
    cardBackgroundRaised: '#F4F7FA',
    inputBackground: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F1A2A',
    textSecondary: '#64748B',
    primary: '#3FA535', // portal green, darkened for AA contrast on white
    secondary: '#0E9FBE', // Rick cyan, darkened
    accentSoft: 'rgba(63, 165, 53, 0.12)',
    cyanSoft: 'rgba(14, 159, 190, 0.12)',
    glow: '#9CCB5B',
    overlay: 'rgba(15, 23, 42, 0.45)',
    error: '#DC2626',
    errorBackground: 'rgba(220, 38, 38, 0.10)',
    favoriteActive: '#E63950',
    favoriteInactive: '#AEB6C2',
    loading: '#3FA535',
    white: '#FFFFFF',
    badgeAlive: '#16A34A',
    badgeDead: '#DC2626',
    badgeUnknown: '#64748B',
  },
  spacing: darkTheme.spacing,
  borderRadius: darkTheme.borderRadius,
  fontSizes: darkTheme.fontSizes,
};
