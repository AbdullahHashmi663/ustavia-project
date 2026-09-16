import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DEFAULT_WITHDRAWAL_FEE_PERCENTAGE, MINIMUM_WITHDRAWAL_AMOUNT } from '@ustavia/shared';
import { ArrowRight, Building2, Check, CheckCircle2, ChevronRight, Info, ShieldCheck, Wallet } from 'lucide-react-native';

import { useWallet } from '../../api/hooks';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { TextField } from '../../components/TextField';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

export function WithdrawalScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const userId = useAuthStore((state) => state.userId);
  const { data: wallet } = useWallet();
  const allBankAccounts = useJobsStore((state) => state.bankAccounts);
  const bankAccounts = allBankAccounts.filter((a) => a.mazdoorId === userId);
  const withdraw = useJobsStore((state) => state.withdraw);

  const [amountInput, setAmountInput] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(bankAccounts[0]?.id ?? null);
  const [authorized, setAuthorized] = useState(false);
  const [done, setDone] = useState<{ amount: number; bankName: string } | null>(null);

  const balance = wallet?.balance ?? 0;
  const amount = Number(amountInput) || 0;
  const fee = Math.round(amount * (DEFAULT_WITHDRAWAL_FEE_PERCENTAGE / 100));
  const willReceive = Math.max(amount - fee, 0);
  const canSubmit = authorized && selectedAccountId != null && amount >= MINIMUM_WITHDRAWAL_AMOUNT && amount + fee <= balance;

  if (bankAccounts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white, padding: spacing.xl, justifyContent: 'center' }]}>
        <EmptyState
          icon={Building2}
          title="No bank account linked"
          description="Link your bank account or Raast ID to withdraw your earnings instantly."
          actionLabel="Add Bank Account"
          onAction={() => navigation.navigate('AddBankAccount')}
        />
      </View>
    );
  }

  if (done) {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.canvas ?? colors.white, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' }]}>
        <View style={styles.centerBox}>
          <View style={[styles.successCircle, { backgroundColor: colors.successLight, borderRadius: radii.full }]}>
            <CheckCircle2 size={44} color={colors.success} strokeWidth={2.2} />
          </View>
          <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24, marginTop: spacing.md }]}>
            Withdrawal Initiated
          </Text>
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, lineHeight: 20 }}>
            Rs {done.amount.toLocaleString()} has been queued for transfer to your {done.bankName} account. It will reflect in your account shortly.
          </Text>

          <View style={{ marginTop: spacing.xxl, width: '100%' }}>
            <Button label="Done" variant="primary" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
        {/* Balance Card */}
        <Card variant="raised" style={{ marginBottom: spacing.lg }}>
          <View style={styles.balanceHeader}>
            <Wallet size={18} color={colors.brandOrange} />
            <Text style={{ color: colors.textSecondary, fontSize: typography.size.sm, fontFamily: typography.headingWeights.semibold }}>
              Available to Withdraw
            </Text>
          </View>
          <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 32, marginVertical: 4 }}>
            Rs {Math.max(balance, 0).toLocaleString()}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: typography.size.xs }}>
            Minimum withdrawal: Rs {MINIMUM_WITHDRAWAL_AMOUNT.toLocaleString()}
          </Text>
        </Card>

        {/* Amount Input */}
        <TextField
          label="Amount to Withdraw"
          placeholder="e.g. 2500"
          keyboardType="number-pad"
          value={amountInput}
          onChangeText={setAmountInput}
        />

        {/* Real-time Calculation Breakdown Card */}
        {amount > 0 && (
          <View
            style={[
              styles.calcCard,
              {
                backgroundColor: colors.white,
                borderColor: colors.borderSubtle,
                borderRadius: radii.md,
                padding: spacing.md,
                marginTop: spacing.md,
              },
              shadows.sm,
            ]}
          >
            <View style={styles.calcRow}>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Gross Amount</Text>
              <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.semibold }}>Rs {amount.toLocaleString()}</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Platform Fee ({DEFAULT_WITHDRAWAL_FEE_PERCENTAGE}%)</Text>
              <Text style={{ color: colors.danger, fontFamily: typography.headingWeights.semibold }}>- Rs {fee.toLocaleString()}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />
            <View style={styles.calcRow}>
              <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 14 }}>You Receive</Text>
              <Text style={{ color: colors.success, fontFamily: typography.headingWeights.bold, fontSize: 16 }}>Rs {willReceive.toLocaleString()}</Text>
            </View>
          </View>
        )}

        {/* Linked Accounts */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
          Transfer to Bank Account
        </Text>

        <View style={{ gap: spacing.sm }}>
          {bankAccounts.map((account) => {
            const isSelected = selectedAccountId === account.id;
            return (
              <Pressable
                key={account.id}
                onPress={() => setSelectedAccountId(account.id)}
                style={[
                  styles.accountRow,
                  {
                    borderColor: isSelected ? colors.brandOrange : colors.borderSubtle,
                    backgroundColor: isSelected ? colors.brandOrangeLight : colors.white,
                    borderRadius: radii.md,
                    padding: spacing.md,
                    borderWidth: isSelected ? 2 : 1,
                  },
                  isSelected ? shadows.sm : undefined,
                ]}
              >
                <View style={[styles.bankIconCircle, { backgroundColor: isSelected ? colors.white : colors.surfaceSubtle, borderRadius: radii.full }]}>
                  <Building2 size={18} color={isSelected ? colors.brandOrange : colors.textSecondary} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.base }}>
                    {account.bankName}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: typography.size.xs }}>
                    Account ending in ····{account.accountNumberLast4}
                  </Text>
                </View>

                {isSelected && <Check size={18} color={colors.brandOrange} strokeWidth={2.5} />}
              </Pressable>
            );
          })}

          <Pressable
            onPress={() => navigation.navigate('AddBankAccount')}
            style={[styles.addBankBtn, { borderColor: colors.border, borderRadius: radii.md }]}
          >
            <Text style={{ color: colors.brandBlue, fontSize: typography.size.sm, fontFamily: typography.headingWeights.semibold }}>
              + Link another bank account
            </Text>
          </Pressable>
        </View>

        {/* Authorization Checkbox */}
        <Pressable
          onPress={() => setAuthorized((v) => !v)}
          style={[styles.checkboxRow, { marginTop: spacing.xl }]}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderRadius: radii.sm,
                borderColor: authorized ? colors.brandOrange : colors.border,
                backgroundColor: authorized ? colors.brandOrange : colors.white,
              },
            ]}
          >
            {authorized && <Check size={14} color={colors.white} strokeWidth={2.5} />}
          </View>
          <Text style={{ color: colors.textPrimary, flex: 1, fontSize: 13, lineHeight: 18 }}>
            I authorize this withdrawal to my selected bank account under standard Ustavia terms.
          </Text>
        </Pressable>

        <View style={{ marginTop: spacing.xl }}>
          <Button
            label="Confirm Withdrawal"
            variant="primary"
            disabled={!canSubmit}
            onPress={() => {
              if (!userId || !selectedAccountId) return;
              withdraw(userId, selectedAccountId, amount);
              const bank = bankAccounts.find((a) => a.id === selectedAccountId);
              setDone({ amount, bankName: bank?.bankName ?? 'your' });
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 520,
  },
  centerBox: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calcCard: {
    borderWidth: 1,
    gap: 8,
  },
  calcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 16,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankIconCircle: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBankBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  successCircle: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
  },
});
