import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { UserRole } from '@ustavia/shared';

import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/auth';
import { useTheme } from '../../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'RolePicker'>;

const ROLE_OPTIONS: Array<{ role: UserRole; title: string; description: string }> = [
  { role: 'mazdoor', title: "I'm a Mazdoor", description: 'I do jobs and get paid for my work.' },
  { role: 'customer', title: "I'm a Customer", description: 'I need to hire help for a job.' },
];

export function RolePickerScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const setRole = useAuthStore((state) => state.setRole);
  const [selected, setSelected] = useState<UserRole | null>(null);

  const accentFor = (role: UserRole) => (role === 'mazdoor' ? colors.brandOrange : colors.brandBlue);
  const tintFor = (role: UserRole) => (role === 'mazdoor' ? colors.brandOrangeLight : colors.brandBlueLight);

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Text style={[styles.heading, { color: colors.textPrimary }]}>How will you use Ustavia?</Text>
      <Text style={[styles.subheading, { color: colors.textSecondary }]}>
        This choice is permanent for this account.
      </Text>

      <View style={styles.cards}>
        {ROLE_OPTIONS.map((option) => {
          const isSelected = selected === option.role;
          return (
            <Pressable
              key={option.role}
              onPress={() => setSelected(option.role)}
              style={[
                styles.card,
                {
                  borderColor: isSelected ? accentFor(option.role) : colors.border,
                  backgroundColor: isSelected ? tintFor(option.role) : colors.white,
                },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: accentFor(option.role) }]} />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{option.title}</Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {option.description}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        label="Continue"
        disabled={!selected}
        onPress={() => {
          if (!selected) return;
          setRole(selected);
          navigation.navigate('KycUpload');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  heading: { fontFamily: 'Poppins_700Bold', fontSize: 24 },
  subheading: { fontSize: 14, marginBottom: 8 },
  cards: { gap: 12, marginBottom: 12 },
  card: { borderWidth: 2, borderRadius: 16, padding: 18, gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 999, marginBottom: 4 },
  cardTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 17 },
  cardDescription: { fontSize: 13 },
});
