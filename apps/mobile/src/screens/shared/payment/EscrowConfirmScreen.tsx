import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, CheckCircle2, Lock, ShieldCheck, Sparkles } from 'lucide-react-native';

import { ApiError } from '../../../api/client';
import { useJob, usePayJob } from '../../../api/hooks';
import { Button } from '../../../components/Button';
import type { AppStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'EscrowConfirm'>;

const METHOD_NAMES: Record<string, string> = {
  jazzcash: 'JazzCash Mobile Account',
  easypaisa: 'Easypaisa Wallet',
  raast: 'Raast (State Bank Instant)',
  nayapay: 'NayaPay / SadaPay',
  card: 'Debit / Credit Card',
  cod: 'Cash on Completion (Escrow Verified)',
};

/** customer.pdf §10.3 Escrow Confirmation Screen. */
export function EscrowConfirmScreen({ route }: Props) {
  const { jobId, method } = route.params;
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: job } = useJob(jobId);
  const pay = usePayJob();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!job || job.agreedPrice == null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
        <Text style={{ color: colors.textSecondary }}>This job no longer exists.</Text>
      </View>
    );
  }

  const methodName = METHOD_NAMES[method] || method || 'Digital Payment';

  const handlePay = async () => {
    setError(null);
    try {
      await pay.mutateAsync(jobId);
      navigation.replace('PaymentSuccess', { jobId });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Payment authorization failed. Please try again.');
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { padding: spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.brandBlueLight, borderRadius: radii.full }]}>
        <ShieldCheck size={36} color={colors.brandBlueDark} />
      </View>

      <Text
        style={[
          styles.heading,
          {
            color: colors.textPrimary,
            fontFamily: typography.headingWeights.bold,
            fontSize: 24,
          },
        ]}
      >
        Ustavia Escrow Guarantee
      </Text>

      <Text
        style={[
          styles.body,
          {
            color: colors.textSecondary,
            marginTop: spacing.xs,
            lineHeight: 20,
          },
        ]}
      >
        Your funds are safely held in a segregated escrow account. The Mazdoor is only paid after you verify satisfactory completion with your 4-digit doorstep PIN.
      </Text>

      {/* Escrow Breakdown Card */}
      <View
        style={[
          styles.breakdownCard,
          {
            backgroundColor: colors.white,
            borderColor: colors.border,
            borderRadius: radii.lg,
            padding: spacing.lg,
            marginTop: spacing.xl,
          },
          shadows.sm,
        ]}
      >
        <View style={styles.breakdownRow}>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Job Details</Text>
          <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13, flex: 1, textAlign: 'right', marginLeft: 8 }} numberOfLines={1}>
            {job.description}
          </Text>
        </View>

        <View style={[styles.breakdownRow, { marginTop: 10 }]}>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Selected Method</Text>
          <Text style={{ color: colors.brandBlueDark, fontWeight: '600', fontSize: 13 }}>
            {methodName}
          </Text>
        </View>

        <View style={[styles.breakdownRow, { marginTop: 10 }]}>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Escrow Protection Fee</Text>
          <Text style={{ color: colors.success, fontWeight: '600', fontSize: 13 }}>
            FREE (0%)
          </Text>
        </View>

        <View style={[styles.breakdownRow, { marginTop: 10 }]}>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Workmanship Warranty</Text>
          <Text style={{ color: colors.brandOrange, fontWeight: '700', fontSize: 13 }}>
            7 Days Included
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: spacing.md }]} />

        <View style={styles.breakdownRow}>
          <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 15 }}>Total Payable</Text>
          <Text style={{ color: colors.textPrimary, fontWeight: '800', fontSize: 20 }}>
            Rs {job.agreedPrice.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Guarantee Bullet Points */}
      <View style={{ marginTop: spacing.lg, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={16} color={colors.success} strokeWidth={2.5} />
          <Text style={{ color: colors.textPrimary, fontSize: 12, flex: 1 }}>
            Funds stay locked until you verify work and share your secret PIN
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={16} color={colors.success} strokeWidth={2.5} />
          <Text style={{ color: colors.textPrimary, fontSize: 12, flex: 1 }}>
            Full refund eligibility if worker does not show up
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={16} color={colors.success} strokeWidth={2.5} />
          <Text style={{ color: colors.textPrimary, fontSize: 12, flex: 1 }}>
            Free 7-Day rework claim supported by Ustavia Quality Assurance
          </Text>
        </View>
      </View>

      {/* Agreement Checkbox */}
      <Pressable onPress={() => setAgreed((v) => !v)} style={[styles.checkboxRow, { marginTop: spacing.xl }]}>
        <View
          style={[
            styles.checkbox,
            {
              borderRadius: radii.sm,
              borderColor: agreed ? colors.brandBlue : colors.border,
              backgroundColor: agreed ? colors.brandBlue : colors.white,
            },
          ]}
        >
          {agreed && <Check size={14} color={colors.white} />}
        </View>
        <Text style={{ color: colors.textPrimary, flex: 1, fontSize: 13, lineHeight: 18 }}>
          I understand and agree to the Ustavia Escrow Protection terms and conditions
        </Text>
      </Pressable>

      {error && (
        <Text style={{ color: colors.danger, marginTop: spacing.md, textAlign: 'center', fontSize: 13 }}>
          {error}
        </Text>
      )}

      {/* Action CTA */}
      <View style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}>
        <Button
          label={`Pay Rs ${job.agreedPrice.toLocaleString()} into Escrow`}
          disabled={!agreed}
          loading={pay.isPending}
          onPress={handlePay}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  heading: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
  breakdownCard: {
    borderWidth: 1,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
