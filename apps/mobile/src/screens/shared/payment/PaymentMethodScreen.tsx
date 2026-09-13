import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Banknote, CheckCircle2, Circle, CreditCard, Smartphone } from 'lucide-react-native';

import { Button } from '../../../components/Button';
import type { AppStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'PaymentMethod'>;

const METHODS = [
  { id: 'jazzcash', label: 'JazzCash', icon: Smartphone },
  { id: 'easypaisa', label: 'Easypaisa', icon: Smartphone },
  { id: 'nayapay', label: 'NayaPay', icon: Smartphone },
  { id: 'card', label: 'Debit / Credit Card', icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
] as const;

/** customer.pdf §10.1 Payment Method Selection Screen, adapted (no "Mazdoor Wallet" row — customers don't hold a wallet in this model). */
export function PaymentMethodScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [selected, setSelected] = useState<(typeof METHODS)[number]['id'] | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        Select Payment Method
      </Text>

      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        {METHODS.map(({ id, label, icon: Icon }) => {
          const isSelected = selected === id;
          return (
            <Pressable
              key={id}
              onPress={() => setSelected(id)}
              style={[
                styles.row,
                {
                  borderColor: isSelected ? colors.brandBlue : colors.border,
                  borderRadius: radii.md,
                  padding: spacing.md,
                  backgroundColor: isSelected ? colors.brandBlueLight : colors.white,
                },
              ]}
            >
              <Icon size={20} color={colors.textSecondary} />
              <Text style={{ color: colors.textPrimary, flex: 1, fontFamily: typography.headingWeights.semibold }}>{label}</Text>
              {isSelected ? (
                <CheckCircle2 size={20} color={colors.brandBlue} />
              ) : (
                <Circle size={20} color={colors.border} />
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Button
          label="Continue"
          disabled={!selected}
          onPress={() => selected && navigation.navigate('EscrowConfirm', { jobId, method: selected })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: {},
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1 },
});
