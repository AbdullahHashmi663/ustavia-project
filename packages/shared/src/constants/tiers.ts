export const MAZDOOR_TIERS = ['bronze', 'silver', 'gold', 'diamond'] as const;

export type MazdoorTier = (typeof MAZDOOR_TIERS)[number];
