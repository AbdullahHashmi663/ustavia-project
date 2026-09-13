import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DEFAULT_WITHDRAWAL_FEE_PERCENTAGE, MINIMUM_WITHDRAWAL_AMOUNT } from '@ustavia/shared';
import { Building2, Check, CheckCircle2, Info } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { TextField } from '../../components/TextField';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

/** Workers.pdf §8.2 Withdrawal Screen. */
export function WithdrawalScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const userId = useAuthStore((state) => state.userId);
  const walletLedger = useJobsStore((state) => state.walletLedger);
  // See ChatScreen.tsx's comment — filter outside the selector, not inside it.
  const allBankAccounts = useJobsStore((state) => state.bankAccounts);
  const bankAccounts = allBankAccounts.filter((a) => a.mazdoorId === userId);
  const withdraw = useJobsStore((state) => state.withdraw);

  const [amountInput, setAmountInput] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(bankAccounts[0]?.id ?? null);
  const [authorized, setAuthorized] = useState(false);
  const [done, setDone] = useState<{ amount: number; bankName: string } | null>(null);

  const balance = walletLedger.filter((e) => e.mazdoorId === userId).reduce((sum, e) => sum + e.amount, 0);
  const amount = Number(amountInput) || 0;
  const fee = Math.round(amount * (DEFAULT_WITHDRAWAL_FEE_PERCENTAGE / 100));
  const willReceive = Math.max(amount - fee, 0);
  const canSubmit = authorized && selectedAccountId != null && amount >= MINIMUM_WITHDRAWAL_AMOUNT && amount + fee <= balance;

  if (bankAccounts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl, justifyContent: 'center' }]}>
        <EmptyState
          icon={Building2}
          title="No bank account on file"
          description="Add a bank account before withdrawing your earnings."
          actionLabel="Add Bank Account"
          onAction={() => navigation.navigate('AddBankAccount')}
        />
      </View>
    );
  }

  if (done) {
    return (
      <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' }]}>
        <View style={[styles.successIcon, { backgroundColor: colors.successLight, borderRadius: radii.full }]}>
          <CheckCircle2 size={36} color={colors.success} />
        </View>
        <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.lg }]}>
          Withdrawal Initiated
        </Text>
        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }}>
          Rs {done.amount.toLocaleString()} is on its way to your {done.bankName} account. It usually arrives within 1–2 business days.
        </Text>
        <View style={{ marginTop: spacing.xl, width: '100%' }}>
          <Button label="Done" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Card variant="raised">
        <Text style={{ color: colors.textSecondary, fontSize: typography.size.sm }}>Available to withdraw</Text>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xxl }}>
          Rs {Math.max(balance, 0).toLocaleString()}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: typography.size.xs }}>Minimum: Rs {MINIMUM_WITHDRAWAL_AMOUNT.toLocaleString()}</Text>
      </Card>

      <View style={{ marginTop: spacing.lg }}>
        <TextField label="Amount to withdraw" placeholder="e.g. 1000" keyboardType="number-pad" value={amountInput} onChangeText={setAmountInput} />
      </View>

      <Text style={[styles.label, { color: colors.textSecondary, marginTop: spacing.lg }]}>Bank account</Text>
      <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
        {bankAccounts.map((account) => {
          const isSelected = selectedAccountId === account.id;
          return (
            <Pressable
              key={account.id}
              onPress={() => setSelectedAccountId(account.id)}
              style={[
                styles.accountRow,
                {
                  borderColor: isSelected ? colors.brandOrange : colors.border,
                  backgroundColor: isSelected ? colors.brandOrangeLight : colors.white,
                  borderRadius: radii.md,
                  padding: spacing.md,
                },
              ]}
            >
              <Building2 size={18} color={colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.semibold }}>{account.bankName}</Text>
                <Text style={{ color: colors.textMuted, fontSize: typography.size.xs }}>····{account.accountNumberLast4}</Text>
              </View>
            </Pressable>
          );
        })}
        <Pressable onPress={() => navigation.navigate('AddBankAccount')}>
          <Text style={{ color: colors.brandBlue, fontSize: typography.size.sm }}>+ Add another account</Text>
        </Pressable>
      </View>

      {amount > 0 && (
        <View style={[styles.feeRow, { marginTop: spacing.lg }]}>
          <Info size={14} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, fontSize: typography.size.xs, flex: 1 }}>
            Withdrawal fee: Rs {fee.toLocaleString()} ({DEFAULT_WITHDRAWAL_FEE_PERCENTAGE}%) · You'll receive Rs {willReceive.toLocaleString()}
          </Text>
        </View>
      )}

      <Pressable onPress={() => setAuthorized((v) => !v)} style={[styles.checkboxRow, { marginTop: spacing.lg }]}>
        <View
          style={[
            styles.checkbox,
            { borderRadius: radii.sm, borderColor: authorized ? colors.brandOrange : colors.border, backgroundColor: authorized ? colors.brandOrange : colors.white },
          ]}
        >
          {authorized && <Check size={14} color={colors.white} />}
        </View>
        <Text style={{ color: colors.textPrimary, flex: 1 }}>I authorize this withdrawal</Text>
      </Pressable>

      <View style={{ marginTop: spacing.xl }}>
        <Button
          label="Confirm Withdrawal"
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontSize: 13 },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1 },
  feeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 22, height: 22, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  successIcon: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heading: { textAlign: 'center' },
});
