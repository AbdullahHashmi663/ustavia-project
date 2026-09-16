import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Briefcase, Check, Home, MapPin, Plus, X } from 'lucide-react-native';

import { useTheme } from '../theme/ThemeProvider';

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  city: string;
  isDefault?: boolean;
}

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    address: 'House 42, Street 8, Sector Y, DHA Phase 5',
    city: 'Lahore',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    address: 'Office 304, Mall 1, Main Boulevard, Gulberg III',
    city: 'Lahore',
  },
  {
    id: 'addr-3',
    label: 'Other',
    address: 'Apartment 5B, Askari 11, Bedian Road',
    city: 'Lahore',
  },
];

interface AddressSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
  selectedId: string;
  onSelectAddress: (address: SavedAddress) => void;
  onAddNewAddress?: () => void;
}

export function AddressSwitcherModal({
  visible,
  onClose,
  selectedId,
  onSelectAddress,
  onAddNewAddress,
}: AddressSwitcherModalProps) {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const [addresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);

  const getIcon = (label: SavedAddress['label']) => {
    switch (label) {
      case 'Home':
        return <Home size={18} color={colors.brandBlue} />;
      case 'Work':
        return <Briefcase size={18} color={colors.brandOrange} />;
      default:
        return <MapPin size={18} color={colors.brandBlue} />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.white,
              borderTopLeftRadius: radii.xl,
              borderTopRightRadius: radii.xl,
              padding: spacing.xl,
            },
            shadows.lg,
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <View
            style={[
              styles.handle,
              { backgroundColor: colors.borderSubtle, borderRadius: radii.full },
            ]}
          />

          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.textPrimary,
                    fontFamily: typography.headingWeights.bold,
                  },
                ]}
              >
                Select Address
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.textSecondary, marginTop: 2 },
                ]}
              >
                Nearby workers will be shown for this location
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full },
              ]}
              accessibilityLabel="Close address switcher"
            >
              <X size={18} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Address List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {addresses.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    onSelectAddress(item);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.addressCard,
                    {
                      backgroundColor: isSelected
                        ? 'rgba(0, 97, 153, 0.05)'
                        : colors.white,
                      borderColor: isSelected
                        ? colors.brandBlue
                        : colors.borderSubtle,
                      borderRadius: radii.lg,
                      padding: spacing.md,
                      marginBottom: spacing.sm,
                      opacity: pressed ? 0.85 : 1,
                    },
                    isSelected && shadows.sm,
                  ]}
                >
                  <View style={styles.leftRow}>
                    <View
                      style={[
                        styles.iconBadge,
                        {
                          backgroundColor:
                            item.label === 'Work'
                              ? 'rgba(255, 103, 1, 0.1)'
                              : 'rgba(0, 97, 153, 0.1)',
                          borderRadius: radii.full,
                        },
                      ]}
                    >
                      {getIcon(item.label)}
                    </View>
                    <View style={styles.textColumn}>
                      <View style={styles.labelBadgeRow}>
                        <Text
                          style={[
                            styles.labelText,
                            {
                              color: colors.textPrimary,
                              fontFamily: typography.headingWeights.bold,
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                        {item.isDefault && (
                          <View
                            style={[
                              styles.defaultPill,
                              {
                                backgroundColor: 'rgba(0, 97, 153, 0.12)',
                                borderRadius: radii.sm,
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color: colors.brandBlue,
                                fontSize: 10,
                                fontWeight: '700',
                              }}
                            >
                              DEFAULT
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.addressText,
                          { color: colors.textSecondary },
                        ]}
                        numberOfLines={2}
                      >
                        {item.address}
                      </Text>
                      <Text
                        style={[
                          styles.cityText,
                          { color: colors.textMuted, marginTop: 2 },
                        ]}
                      >
                        {item.city}
                      </Text>
                    </View>
                  </View>

                  {/* Radio Indicator */}
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected
                          ? colors.brandBlue
                          : colors.border,
                        backgroundColor: isSelected
                          ? colors.brandBlue
                          : colors.white,
                        borderRadius: radii.full,
                      },
                    ]}
                  >
                    {isSelected && <Check size={12} color={colors.white} strokeWidth={3} />}
                  </View>
                </Pressable>
              );
            })}

            {/* Add New Address Button */}
            <Pressable
              onPress={() => {
                onClose();
                onAddNewAddress?.();
              }}
              style={({ pressed }) => [
                styles.addCard,
                {
                  borderColor: colors.brandBlue,
                  backgroundColor: colors.surfaceSubtle,
                  borderRadius: radii.lg,
                  padding: spacing.md,
                  marginTop: spacing.xs,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.addIconBadge,
                  {
                    backgroundColor: colors.brandBlue,
                    borderRadius: radii.full,
                  },
                ]}
              >
                <Plus size={16} color={colors.white} strokeWidth={2.5} />
              </View>
              <Text
                style={[
                  styles.addText,
                  {
                    color: colors.brandBlue,
                    fontFamily: typography.headingWeights.bold,
                  },
                ]}
              >
                + Add New Address
              </Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '65%',
    width: '100%',
  },
  handle: {
    width: 36,
    height: 4,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    marginBottom: 16,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  labelBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  labelText: {
    fontSize: 14,
  },
  defaultPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  addressText: {
    fontSize: 12,
    lineHeight: 16,
  },
  cityText: {
    fontSize: 11,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 10,
  },
  addIconBadge: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 14,
  },
});
