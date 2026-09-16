import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus, MapPin, ShieldCheck, Sparkles, X } from 'lucide-react-native';

import { useCreateJob } from '../../api/hooks';
import { ApiError } from '../../api/client';
import { Button } from '../../components/Button';
import type { AppStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';

const MAX_PHOTOS = 4;
const QUICK_SERVICES = [
  'Tap or Pipe Leakage',
  'Ceiling Fan Repair',
  'Switchboard Fitting',
  'Door Lock Repair',
  'Room Paint Touchup',
  'AC Water Leaking',
  'Geyser Gas Leak / Service',
  'Drain Blockage Cleaning',
  'Furniture Assembly',
  'Washing Machine Motor',
  'Circuit Breaker Tripping',
  'Window Glass Replacement',
];

export function PostJobScreen() {
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const createJob = useCreateJob();
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const addPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => [...prev, result.assets[0].uri].slice(0, MAX_PHOTOS));
    }
  };

  const removePhoto = (uri: string) => setPhotos((prev) => prev.filter((p) => p !== uri));

  const handlePost = async () => {
    if (!description.trim()) return;
    setError(null);
    try {
      const job = await createJob.mutateAsync({
        description: description.trim(),
        location: { latitude: 24.86 + (Math.random() - 0.5) * 0.05, longitude: 67.0 + (Math.random() - 0.5) * 0.05 },
      });
      setDescription('');
      setPhotos([]);
      navigation.navigate('JobDetail', { jobId: job.id });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not post this job. Check your connection and try again.');
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
        <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 24 }]}>
          Post a Job Request
        </Text>
        <Text style={{ color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg, lineHeight: 20 }}>
          Describe what you need fixed. Verified nearby Mazdoors will submit competitive quotes.
        </Text>

        {/* Quick Service Suggestions */}
        <View style={styles.suggestionsHeader}>
          <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold }]}>
            Quick Suggestions
          </Text>
          <Text style={[styles.swipeHint, { color: colors.textMuted }]}>
            Scroll for more →
          </Text>
        </View>

        <View style={{ width: '100%', marginHorizontal: -spacing.xl, marginBottom: spacing.lg }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            directionalLockEnabled
            contentContainerStyle={[styles.quickStrip, { paddingHorizontal: spacing.xl, paddingVertical: 4 }]}
          >
            {QUICK_SERVICES.map((service) => {
              const isSelected = description === service;
              return (
                <Pressable
                  key={service}
                  onPress={() => setDescription(isSelected ? '' : service)}
                  style={({ pressed }) => [
                    styles.serviceChip,
                    {
                      backgroundColor: isSelected ? colors.brandBlue : colors.white,
                      borderColor: isSelected ? colors.brandBlue : colors.borderSubtle,
                      borderRadius: radii.full,
                      opacity: pressed ? 0.85 : 1,
                    },
                    isSelected ? shadows.glowBlue : shadows.sm,
                  ]}
                >
                  <Sparkles size={13} color={isSelected ? colors.white : colors.brandBlue} />
                  <Text
                    style={{
                      color: isSelected ? colors.white : colors.textPrimary,
                      fontSize: 13,
                      fontFamily: isSelected ? typography.headingWeights.bold : typography.headingWeights.semibold,
                    }}
                  >
                    {service}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Description Textarea Card */}
        <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, marginBottom: spacing.xs }]}>
          Job Details
        </Text>
        <View
          style={[
            styles.textAreaBox,
            focused && shadows.sm,
            {
              backgroundColor: colors.white,
              borderColor: focused ? colors.brandBlue : colors.border,
              borderRadius: radii.lg,
              borderWidth: 1.5,
              padding: spacing.md,
            },
          ]}
        >
          <TextInput
            style={[styles.textArea, { color: colors.textPrimary }]}
            placeholder="Describe the task, problem, or installation in detail..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <View style={styles.charCountRow}>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>
              {description.length} characters
            </Text>
          </View>
        </View>

        {/* Photo Upload Gallery */}
        <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, marginTop: spacing.lg, marginBottom: spacing.xs }]}>
          Attach Photos (Optional)
        </Text>
        <View style={styles.photoRow}>
          {photos.map((uri) => (
            <View key={uri} style={[styles.photoTile, { borderRadius: radii.md }, shadows.sm]}>
              <Image source={{ uri }} style={styles.photoImage} resizeMode="cover" />
              <Pressable
                onPress={() => removePhoto(uri)}
                accessibilityLabel="Remove photo"
                style={[styles.removeBadge, { backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: radii.full }]}
              >
                <X size={12} color={colors.white} />
              </Pressable>
            </View>
          ))}

          {photos.length < MAX_PHOTOS && (
            <Pressable
              onPress={addPhoto}
              style={[
                styles.photoTile,
                styles.addTile,
                {
                  borderColor: colors.brandBlue,
                  backgroundColor: colors.white,
                  borderRadius: radii.md,
                },
              ]}
            >
              <ImagePlus size={22} color={colors.brandBlue} strokeWidth={2} />
              <Text style={{ color: colors.brandBlue, fontSize: 12, fontFamily: typography.headingWeights.semibold, marginTop: 4 }}>
                Add Photo
              </Text>
            </Pressable>
          )}
        </View>

        {/* Privacy Assurance Box */}
        <View
          style={[
            styles.privacyCard,
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
            Your exact address remains confidential. Mazdoors only see your general neighborhood until you accept a quote.
          </Text>
        </View>

        {error && (
          <View style={[styles.errorBox, { backgroundColor: colors.dangerLight, borderRadius: radii.md, marginTop: spacing.md }]}>
            <Text style={{ color: colors.danger, fontSize: 13, textAlign: 'center' }}>{error}</Text>
          </View>
        )}

        <View style={{ marginTop: spacing.xl }}>
          <Button
            label="Post Job Now"
            variant="trust"
            loading={createJob.isPending}
            disabled={!description.trim()}
            onPress={handlePost}
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
    paddingVertical: 20,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 560,
  },
  heading: {},
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  swipeHint: {
    fontSize: 11,
  },
  sectionLabel: {
    fontSize: 13,
  },
  quickStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
  },
  textAreaBox: {
    minHeight: 120,
    justifyContent: 'space-between',
  },
  textArea: {
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 85,
  },
  charCountRow: {
    alignItems: 'flex-end',
  },
  photoRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  photoTile: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  addTile: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  removeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorBox: {
    padding: 12,
  },
});
