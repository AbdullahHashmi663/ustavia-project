import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowDownLeft, ArrowUpRight, Building, CreditCard, Landmark, RefreshCw, ShieldCheck, Wallet } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import type { WalletLedgerEntryType } from '@ustavia/shared';

import { useWallet } from '../../api/hooks';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { IconButton } from '../../components/IconButton';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

const LEDGER_LABELS: Record<WalletLedgerEntryType, string> = {
  job_payout: 'Job payout',
  platform_commission: 'Platform commission',
  fbr_withholding: 'FBR withholding',
  cancellation_penalty: 'Cancellation penalty',
  promo_adjustment: 'Promo adjustment',
  withdrawal: 'Withdrawal to bank',
};

export function WalletScreen() {
  const { colors, radii, spacing, shadows, typography, gradients } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: wallet, isLoading, refetch, isRefetching } = useWallet();

  const balance = wallet?.balance ?? 0;
  const myEntries = wallet?.entries ?? [];

  const webCardGradient =
    Platform.OS === 'web'
      ? ({
          backgroundImage: `linear-gradient(135deg, ${gradients.mazdoor[0]} 0%, ${gradients.mazdoor[1]} 100%)`,
        } as unknown as object)
      : {};

  return (
    <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white }]}>
      <View style={styles.centerWrapper}>
        {/* Header */}
        <View style={[styles.headerRow, { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md }]}>
          <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
            My Wallet
          </Text>
          <IconButton
            icon={RefreshCw}
            onPress={() => refetch()}
            variant="filled"
            accessibilityLabel="Refresh wallet balance"
          />
        </View>

        {/* Virtual Hero Debit Card */}
        <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing.lg }}>
          <View
            style={[
              styles.virtualCard,
              shadows.glowOrange,
              {
                backgroundColor: colors.brandOrange,
                borderRadius: radii.xl ?? 24,
                padding: spacing.xl,
              },
              webCardGradient,
            ]}
          >
            {Platform.OS !== 'web' && (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Svg width="100%" height="100%">
                  <Defs>
                    <LinearGradient id="wallet-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor={gradients.mazdoor[0]} />
                      <Stop offset="100%" stopColor={gradients.mazdoor[1]} />
                    </LinearGradient>
                  </Defs>
                  <Rect width="100%" height="100%" rx={radii.xl ?? 24} fill="url(#wallet-card-grad)" />
                </Svg>
              </View>
            )}

            <View style={styles.cardTopRow}>
              <View style={styles.brandBadge}>
                <Wallet size={18} color={colors.white} />
                <Text style={[styles.brandTitle, { fontFamily: typography.headingWeights.bold }]}>
                  USTAVIA PAYOUT
                </Text>
              </View>
              <View style={styles.verifiedChip}>
                <ShieldCheck size={14} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.chipText}>Secured</Text>
              </View>
            </View>

            <View style={{ marginVertical: spacing.lg }}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={[styles.balanceValue, { fontFamily: typography.headingWeights.bold }]}>
                Rs {balance.toLocaleString()}
              </Text>
            </View>

            <View style={styles.cardBottomRow}>
              <Text style={styles.accountHolder}>Verified Mazdoor Account</Text>
              <Text style={styles.cardType}>Instant Transfer</Text>
            </View>
          </View>
        </View>

        {/* Quick Action Dock */}
        <View style={[styles.actionRow, { paddingHorizontal: spacing.xl, gap: 12, marginBottom: spacing.xl }]}>
          <View style={{ flex: 1 }}>
            <Button
              label="Withdraw"
              variant="primary"
              icon={Landmark}
              onPress={() => navigation.navigate('Withdrawal')}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="Add Bank"
              variant="outline"
              icon={Building}
              onPress={() => navigation.navigate('AddBankAccount')}
            />
          </View>
        </View>

        {/* Recent Activity Stream */}
        <View style={{ paddingHorizontal: spacing.xl, flex: 1 }}>
          <Text style={[styles.subheading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 16, marginBottom: spacing.md }]}>
            Recent Transactions
          </Text>

          <FlatList
            data={myEntries}
            keyExtractor={(entry) => entry.id}
            refreshing={isRefetching}
            onRefresh={refetch}
            contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xxl, flexGrow: 1 }}
            renderItem={({ item }) => {
              const isCredit = item.amount >= 0;
              return (
                <View
                  style={[
                    styles.txRow,
                    {
                      backgroundColor: colors.white,
                      borderColor: colors.borderSubtle,
                      borderRadius: radii.md,
                      padding: spacing.md + 2,
                    },
                    shadows.sm,
                  ]}
                >
                  <View style={styles.txLeft}>
                    <View
                      style={[
                        styles.iconCircle,
                        {
                          backgroundColor: isCredit ? colors.successLight : colors.surfaceSubtle,
                          borderRadius: radii.full,
                        },
                      ]}
                    >
                      {isCredit ? (
                        <ArrowDownLeft size={18} color={colors.success} strokeWidth={2.2} />
                      ) : (
                        <ArrowUpRight size={18} color={colors.danger} strokeWidth={2.2} />
                      )}
                    </View>
                    <View style={{ gap: 2 }}>
                      <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, fontSize: typography.size.sm }}>
                        {LEDGER_LABELS[item.type]}
                      </Text>
                      <Text style={{ color: colors.textMuted, fontSize: typography.size.xs }}>
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      color: isCredit ? colors.success : colors.danger,
                      fontFamily: typography.headingWeights.bold,
                      fontSize: typography.size.base,
                    }}
                  >
                    {isCredit ? '+' : ''}
                    Rs {Math.abs(item.amount).toLocaleString()}
                  </Text>
                </View>
              );
            }}
            ListEmptyComponent={
              isLoading ? null : (
                <EmptyState
                  icon={Wallet}
                  title="No wallet activity yet"
                  description="Payouts from completed jobs will automatically credit to this wallet."
                />
              )
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {},
  virtualCard: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 34,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  accountHolder: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
  },
  cardType: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
  },
  subheading: {},
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
