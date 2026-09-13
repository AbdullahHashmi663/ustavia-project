/**
 * Defaults only — the live rate is configured server-side via
 * PLATFORM_CUT_PERCENTAGE / FBR_WITHHOLDING_RATE (see README env var table)
 * so Finance can adjust without a redeploy.
 */
export const DEFAULT_PLATFORM_CUT_PERCENTAGE = 10;
export const VOLUME_PROMO_PLATFORM_CUT_PERCENTAGE = 8;
export const DEFAULT_FBR_WITHHOLDING_RATE_PERCENTAGE = 2;

/** Workers.pdf §8.2 "Withdrawal Screen": "Withdrawal Fee: Rs. 20 (1.3%)", "Minimum: Rs. 500". */
export const DEFAULT_WITHDRAWAL_FEE_PERCENTAGE = 1.3;
export const MINIMUM_WITHDRAWAL_AMOUNT = 500;
