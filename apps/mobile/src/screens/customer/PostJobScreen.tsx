import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus, X } from 'lucide-react-native';

import { Button } from '../../components/Button';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

const MAX_PHOTOS = 4;

export function PostJobScreen() {
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const userId = useAuthStore((state) => state.userId);
  const postJob = useJobsStore((state) => state.postJob);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const addPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => [...prev, result.assets[0].uri].slice(0, MAX_PHOTOS));
    }
  };

  const removePhoto = (uri: string) => setPhotos((prev) => prev.filter((p) => p !== uri));

  const handlePost = () => {
    if (!userId || !description.trim()) return;
    const job = postJob({ customerId: userId, description: description.trim() });
    setDescription('');
    setPhotos([]);
    navigation.navigate('JobDetail', { jobId: job.id });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.xl }]}>
        Post a Job
      </Text>
      <Text style={{ color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg }}>
        Nearby Mazdoors will see this by area only — your exact address stays private until you confirm one.
      </Text>

      <TextInput
        style={[styles.textArea, { borderColor: colors.border, color: colors.textPrimary, borderRadius: radii.md }]}
        placeholder="What do you need done?"
        placeholderTextColor={colors.textMuted}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Photos (optional)</Text>
      <View style={styles.photoRow}>
        {photos.map((uri) => (
          <View key={uri} style={[styles.photoTile, { borderRadius: radii.md }]}>
            <Image source={{ uri }} style={styles.photoImage} />
            <Pressable
              onPress={() => removePhoto(uri)}
              accessibilityLabel="Remove photo"
              style={[styles.removeBadge, { backgroundColor: colors.textPrimary, borderRadius: radii.full }]}
            >
              <X size={12} color={colors.white} />
            </Pressable>
          </View>
        ))}
        {photos.length < MAX_PHOTOS && (
          <Pressable
            onPress={addPhoto}
            style={[styles.photoTile, styles.addTile, { borderColor: colors.brandBlue, borderRadius: radii.md }]}
          >
            <ImagePlus size={20} color={colors.brandBlue} />
            <Text style={{ color: colors.brandBlue, fontSize: 11, marginTop: 2 }}>Add</Text>
          </Pressable>
        )}
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Button label="Post Job" variant="trust" disabled={!description.trim()} onPress={handlePost} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  heading: {},
  textArea: { borderWidth: 1, padding: 14, fontSize: 15, textAlignVertical: 'top', minHeight: 100 },
  label: { fontSize: 13, marginTop: 16, marginBottom: 8 },
  photoRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  photoTile: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photoImage: { width: '100%', height: '100%' },
  addTile: { borderWidth: 1, borderStyle: 'dashed' },
  removeBadge: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
});
