/**
 * Defaults only — the live rate is configured server-side via
 * PLATFORM_CUT_PERCENTAGE / FBR_WITHHOLDING_RATE (see README env var table)
 * so Finance can adjust without a redeploy.
 */
export const DEFAULT_PLATFORM_CUT_PERCENTAGE = 10;
export const VOLUME_PROMO_PLATFORM_CUT_PERCENTAGE = 8;
