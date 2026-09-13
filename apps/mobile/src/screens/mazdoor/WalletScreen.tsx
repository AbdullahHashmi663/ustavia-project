import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowDownCircle, ArrowUpCircle, Landmark, Wallet } from 'lucide-react-native';
import type { WalletLedgerEntryType } from '@ustavia/shared';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { RatingBadge } from '../../components/RatingBadge';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

const LEDGER_LABELS: Record<WalletLedgerEntryType, string> = {
  job_payout: 'Job payout',
  platform_commission: 'Platform commission',
  fbr_withholding: 'FBR withholding',
  cancellation_penalty: 'Cancellation penalty',
  promo_adjustment: 'Promo adjustment',
  withdrawal: 'Withdrawal',
};

export function WalletScreen() {
  const { colors, radii, spacing, shadows, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const userId = useAuthStore((state) => state.userId);
  const mazdoors = useJobsStore((state) => state.mazdoors);
  const walletLedger = useJobsStore((state) => state.walletLedger);

  const me = mazdoors.find((m) => m.id === userId);
  const myEntries = walletLedger
    .filter((entry) => entry.mazdoorId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const balance = myEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
          Wallet
        </Text>
        {me?.tier && me.ratingAvg != null && <RatingBadge tier={me.tier} ratingAvg={me.ratingAvg} />}
      </View>

      <View
        style={[
          styles.balanceCard,
          { backgroundColor: colors.brandOrange, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.lg },
          shadows.md,
        ]}
      >
        <View style={styles.balanceHeaderRow}>
          <Wallet size={20} color={colors.white} />
          <Text style={[styles.balanceLabel, { color: colors.white }]}>Available balance</Text>
        </View>
        <Text style={[styles.balanceValue, { color: colors.white, fontFamily: typography.headingWeights.bold }]}>
          Rs {balance.toLocaleString()}
        </Text>
      </View>

      <View style={{ marginTop: spacing.md }}>
        <Button label="Withdraw" variant="outline" icon={Landmark} onPress={() => navigation.navigate('Withdrawal')} />
      </View>

      <Text style={[styles.subheading, { color: colors.textSecondary, marginTop: spacing.xl }]}>Recent activity</Text>
      <FlatList
        data={myEntries}
        keyExtractor={(entry) => entry.id}
        contentContainerStyle={{ gap: spacing.sm, marginTop: spacing.sm, flexGrow: 1 }}
        renderItem={({ item }) => {
          const isCredit = item.amount >= 0;
          return (
            <View style={[styles.row, { borderColor: colors.border, borderRadius: radii.md, padding: spacing.md }]}>
              <View style={styles.rowLeft}>
                {isCredit ? (
                  <ArrowDownCircle size={22} color={colors.success} />
                ) : (
                  <ArrowUpCircle size={22} color={colors.danger} />
                )}
                <View>
                  <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, fontSize: typography.size.sm }}>
                    {LEDGER_LABELS[item.type]}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: typography.size.xs }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={{ color: isCredit ? colors.success : colors.danger, fontFamily: typography.headingWeights.semibold }}>
                {isCredit ? '+' : ''}
                {item.amount.toLocaleString()}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState icon={Wallet} title="No wallet activity yet" description="Payouts and fees for completed jobs will show up here." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: {},
  balanceCard: {},
  balanceHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  balanceLabel: { fontSize: 13 },
  balanceValue: { fontSize: 32, marginTop: 6 },
  subheading: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
