import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Banknote,
  CheckCircle2,
  Circle,
  CreditCard,
  Lock,
  QrCode,
  ShieldCheck,
  Smartphone,
  Wallet,
  Zap,
} from 'lucide-react-native';

import { useJob } from '../../../api/hooks';
import { Button } from '../../../components/Button';
import type { AppStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'PaymentMethod'>;

export type PaymentMethodId = 'jazzcash' | 'easypaisa' | 'raast' | 'nayapay' | 'card' | 'cod';

interface MethodOption {
  id: PaymentMethodId;
  label: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  icon: typeof Smartphone;
  inputPlaceholder?: string;
  inputLabel?: string;
}

const METHODS: MethodOption[] = [
  {
    id: 'jazzcash',
    label: 'JazzCash',
    subtitle: 'Pay via JazzCash mobile account or retail voucher',
    badge: 'Popular',
    badgeColor: '#EF4444',
    icon: Smartphone,
    inputLabel: 'JazzCash Mobile Number',
    inputPlaceholder: '0300 1234567',
  },
  {
    id: 'easypaisa',
    label: 'Easypaisa',
    subtitle: 'Direct debit from Easypaisa mobile wallet',
    badge: 'Popular',
    badgeColor: '#10B981',
    icon: Smartphone,
    inputLabel: 'Easypaisa Mobile Number',
    inputPlaceholder: '0345 1234567',
  },
  {
    id: 'raast',
    label: 'Raast (SBP Instant)',
    subtitle: 'State Bank of Pakistan instant payment system',
    badge: '0% Fee • Instant',
    badgeColor: '#006199',
    icon: Zap,
    inputLabel: 'Raast ID / Registered Phone Number',
    inputPlaceholder: '03XX XXXXXXX',
  },
  {
    id: 'nayapay',
    label: 'NayaPay / SadaPay',
    subtitle: 'Instant digital wallet transfer',
    icon: Wallet,
    inputLabel: 'Registered Mobile Number or Nayatag',
    inputPlaceholder: '03XX XXXXXXX or @username',
  },
  {
    id: 'card',
    label: 'Debit / Credit Card',
    subtitle: 'Visa, Mastercard, or PayPak card',
    badge: 'Bank Grade',
    icon: CreditCard,
    inputLabel: 'Card Number',
    inputPlaceholder: '4123 •••• •••• 4589',
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    subtitle: 'Pay cash to the mazdoor upon job completion',
    badge: 'Pay Later',
    icon: Banknote,
  },
];

export function PaymentMethodScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: job } = useJob(jobId);

  const [selected, setSelected] = useState<PaymentMethodId>('jazzcash');
  const [accountInput, setAccountInput] = useState('');

  const selectedMethod = METHODS.find((m) => m.id === selected);

  const handleContinue = () => {
    navigation.navigate('EscrowConfirm', { jobId, method: selected });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Price & Summary Header */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: colors.white,
              borderRadius: radii.lg,
              borderColor: colors.border,
              padding: spacing.lg,
            },
            shadows.sm,
          ]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, marginRight: spacing.md }}>
              <Text style={{ color: colors.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Payable Amount (Escrow Protected)
              </Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontFamily: typography.headingWeights.bold,
                  fontSize: 28,
                  marginTop: 2,
                }}
              >
                Rs {job?.agreedPrice != null ? job.agreedPrice.toLocaleString() : '---'}
              </Text>
            </View>
            <View
              style={[
                styles.escrowPill,
                { backgroundColor: colors.brandBlueLight, borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 5 },
              ]}
            >
              <ShieldCheck size={14} color={colors.brandBlueDark} />
              <Text style={{ color: colors.brandBlueDark, fontWeight: '700', fontSize: 11, marginLeft: 4 }}>
                100% Escrow
              </Text>
            </View>
          </View>

          {job?.description && (
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: spacing.xs }} numberOfLines={1}>
              For: {job.description}
            </Text>
          )}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontFamily: typography.headingWeights.bold,
              fontSize: typography.size.md,
              marginTop: spacing.xl,
              marginBottom: spacing.sm,
            },
          ]}
        >
          Select Payment Method
        </Text>

        {/* Method Selection List */}
        <View style={{ gap: spacing.sm }}>
          {METHODS.map((method) => {
            const isSelected = selected === method.id;
            const Icon = method.icon;

            return (
              <Pressable
                key={method.id}
                onPress={() => setSelected(method.id)}
                style={[
                  styles.methodCard,
                  {
                    borderColor: isSelected ? colors.brandBlue : colors.border,
                    borderRadius: radii.lg,
                    padding: spacing.md,
                    backgroundColor: isSelected ? '#F0F9FF' : colors.white,
                  },
                  isSelected ? shadows.sm : null,
                ]}
              >
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: isSelected ? colors.brandBlueLight : '#F3F4F6',
                      borderRadius: radii.md,
                    },
                  ]}
                >
                  <Icon size={22} color={isSelected ? colors.brandBlueDark : colors.textSecondary} />
                </View>

                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontFamily: typography.headingWeights.semibold,
                        fontSize: 15,
                      }}
                    >
                      {method.label}
                    </Text>
                    {method.badge && (
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor: method.badgeColor ? `${method.badgeColor}18` : '#E5E7EB',
                            borderRadius: radii.full,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: method.badgeColor || colors.textSecondary,
                            fontWeight: '700',
                            fontSize: 10,
                          }}
                        >
                          {method.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                    {method.subtitle}
                  </Text>
                </View>

                {isSelected ? (
                  <CheckCircle2 size={22} color={colors.brandBlue} />
                ) : (
                  <Circle size={22} color={colors.border} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Dynamic Account Input Field */}
        {selectedMethod?.inputPlaceholder && (
          <View
            style={[
              styles.accountBox,
              {
                backgroundColor: colors.white,
                borderRadius: radii.lg,
                borderColor: colors.border,
                padding: spacing.md,
                marginTop: spacing.md,
              },
              shadows.sm,
            ]}
          >
            <Text style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 13, marginBottom: 6 }}>
              {selectedMethod.inputLabel}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: colors.border,
                  borderRadius: radii.md,
                  backgroundColor: '#F9FAFB',
                  paddingHorizontal: spacing.md,
                  paddingVertical: 10,
                  fontSize: 14,
                  color: colors.textPrimary,
                },
              ]}
              placeholder={selectedMethod.inputPlaceholder}
              placeholderTextColor={colors.textSecondary}
              value={accountInput}
              onChangeText={setAccountInput}
              keyboardType={selectedMethod.id === 'card' ? 'number-pad' : 'phone-pad'}
            />
            <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 6 }}>
              You will receive an OTP or push prompt to authorize payment.
            </Text>
          </View>
        )}

        {/* SBP Trust & Security Banner */}
        <View
          style={[
            styles.trustBanner,
            {
              backgroundColor: '#F8FAFC',
              borderRadius: radii.md,
              borderColor: colors.border,
              padding: spacing.md,
              marginTop: spacing.lg,
            },
          ]}
        >
          <Lock size={16} color={colors.textSecondary} />
          <Text style={{ color: colors.textSecondary, fontSize: 12, flex: 1, marginLeft: 8, lineHeight: 17 }}>
            Protected by State Bank of Pakistan regulated payment gateways. Funds are held in escrow and never released without your approval.
          </Text>
        </View>

        {/* Action Button */}
        <View style={{ marginTop: spacing.xl, marginBottom: spacing.xl }}>
          <Button
            label="Proceed to Escrow Guarantee"
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  summaryCard: {
    borderWidth: 1,
  },
  escrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    letterSpacing: 0.2,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  iconCircle: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  accountBox: {
    borderWidth: 1,
  },
  textInput: {
    borderWidth: 1,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
