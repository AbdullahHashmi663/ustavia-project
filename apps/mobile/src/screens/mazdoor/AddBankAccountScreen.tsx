import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Building2, Check, Lock, ShieldCheck } from 'lucide-react-native';
import type { BankAccountType } from '@ustavia/shared';

import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

const BANKS = ['Meezan Bank', 'HBL', 'Bank Alfalah', 'MCB', 'UBL', 'Faysal Bank', 'NBP', 'Allied Bank'];
const ACCOUNT_TYPES: Array<{ id: BankAccountType; label: string }> = [
  { id: 'savings', label: 'Savings Account' },
  { id: 'current', label: 'Current Account' },
];

export function AddBankAccountScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const userId = useAuthStore((state) => state.userId);
  const addBankAccount = useJobsStore((state) => state.addBankAccount);

  const [bankName, setBankName] = useState<string | null>(BANKS[0]);
  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmNumber, setConfirmNumber] = useState('');
  const [accountType, setAccountType] = useState<BankAccountType>('savings');

  const numbersMatch = accountNumber.length >= 4 && accountNumber === confirmNumber;
  const canSave = bankName != null && holderName.trim().length > 0 && numbersMatch;

  const handleSave = () => {
    if (!userId || !bankName || !canSave) return;
    addBankAccount({
      mazdoorId: userId,
      bankName,
      accountHolderName: holderName.trim(),
      accountNumberLast4: accountNumber.slice(-4),
      accountType,
    });
    navigation.goBack();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
        <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24, marginBottom: spacing.xs }]}>
          Link Bank Account
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: spacing.lg, lineHeight: 20 }}>
          Connect your Pakistani bank account or Raast IBAN for direct job payouts.
        </Text>

        {/* Bank Selection Pills */}
        <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, marginBottom: spacing.xs }]}>
          Select Bank
        </Text>
        <View style={[styles.chipRow, { marginBottom: spacing.lg }]}>
          {BANKS.map((bank) => {
            const isSelected = bankName === bank;
            return (
              <Pressable
                key={bank}
                onPress={() => setBankName(bank)}
                style={[
                  styles.chip,
                  {
                    borderRadius: radii.full,
                    borderColor: isSelected ? colors.brandOrange : colors.borderSubtle,
                    backgroundColor: isSelected ? colors.brandOrange : colors.white,
                    borderWidth: 1.5,
                  },
                  isSelected && shadows.sm,
                ]}
              >
                <Text
                  style={{
                    color: isSelected ? colors.white : colors.textPrimary,
                    fontSize: 13,
                    fontFamily: isSelected ? typography.headingWeights.bold : typography.headingWeights.semibold,
                  }}
                >
                  {bank}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Inputs */}
        <View style={{ gap: spacing.md }}>
          <TextField
            label="Account Title / Holder Name"
            placeholder="e.g. Muhammad Ali"
            value={holderName}
            onChangeText={setHolderName}
            helperText="Must match your CNIC name exactly"
          />

          <TextField
            label="Account Number / IBAN"
            placeholder="16–24 digits"
            keyboardType="number-pad"
            value={accountNumber}
            onChangeText={setAccountNumber}
          />

          <TextField
            label="Confirm Account Number"
            placeholder="Re-enter your account number"
            keyboardType="number-pad"
            value={confirmNumber}
            onChangeText={setConfirmNumber}
            error={confirmNumber.length > 0 && !numbersMatch ? "Account numbers don't match" : undefined}
          />
        </View>

        {/* Account Type Selector */}
        <Text style={[styles.label, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, marginTop: spacing.lg, marginBottom: spacing.xs }]}>
          Account Type
        </Text>
        <View style={styles.typeRow}>
          {ACCOUNT_TYPES.map(({ id, label }) => {
            const isSelected = accountType === id;
            return (
              <Pressable
                key={id}
                onPress={() => setAccountType(id)}
                style={[
                  styles.typeCard,
                  {
                    flex: 1,
                    borderColor: isSelected ? colors.brandOrange : colors.borderSubtle,
                    backgroundColor: isSelected ? colors.brandOrangeLight : colors.white,
                    borderRadius: radii.md,
                    borderWidth: isSelected ? 2 : 1,
                    padding: spacing.md,
                  },
                ]}
              >
                <Text
                  style={{
                    color: isSelected ? colors.brandOrangeDark : colors.textPrimary,
                    fontFamily: isSelected ? typography.headingWeights.bold : typography.headingWeights.semibold,
                    fontSize: 13,
                    textAlign: 'center',
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Security Reassurance */}
        <View
          style={[
            styles.securityBox,
            {
              backgroundColor: colors.surfaceSubtle,
              borderRadius: radii.md,
              padding: spacing.md,
              marginTop: spacing.xl,
            },
          ]}
        >
          <ShieldCheck size={18} color={colors.brandBlue} />
          <Text style={{ color: colors.textSecondary, fontSize: 12, flex: 1, lineHeight: 16 }}>
            Your banking data is 256-bit encrypted and routed through State Bank of Pakistan authorized channels.
          </Text>
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Button
            label="Save Bank Account"
            variant="primary"
            disabled={!canSave}
            onPress={handleSave}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 24,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 500,
  },
  heading: {},
  label: {
    fontSize: 13,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
