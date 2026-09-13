import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AlertTriangle,
  CheckCircle2,
  Hammer,
  Lock,
  MessageCircle,
  Siren,
  UserRound,
  Wallet,
  XCircle,
} from 'lucide-react-native';
import { DISPUTE_CATEGORIES, type DisputeCategory } from '@ustavia/shared';

import {
  useAcceptConfirmation,
  useJob,
  useMarkComplete,
  usePublicProfile,
  useProposeConfirmation,
  useRaiseDispute,
  useStartJob,
} from '../../api/hooks';
import { ApiError } from '../../api/client';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { RatingBadge } from '../../components/RatingBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { TextField } from '../../components/TextField';
import type { AppStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth';
import { useJobsStore } from '../../store/jobs';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'JobDetail'>;

const DISPUTE_CATEGORY_LABEL: Record<DisputeCategory, string> = {
  property_damage: 'Property damage',
  tardiness: 'Tardiness',
  harassment: 'Harassment',
  payment_issue: 'Payment issue',
  quality_issue: 'Quality issue',
  no_show: 'No show',
  other: 'Other',
};

export function JobDetailScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const role = useAuthStore((state) => state.role);

  const { data: job } = useJob(jobId);
  const proposeConfirmation = useProposeConfirmation();
  const acceptConfirmation = useAcceptConfirmation();
  const startJob = useStartJob();
  const markComplete = useMarkComplete();
  const raiseDispute = useRaiseDispute();

  // Material quotes and SOS toggling have no backend endpoint yet — still
  // the local mock store, deliberately (PLANNING.md's execution log).
  const toggleSos = useJobsStore((state) => state.toggleSos);
  const materialQuote = useJobsStore((state) => state.materialQuotes.find((q) => q.id === job?.materialQuoteId));
  const proposeMaterialQuote = useJobsStore((state) => state.proposeMaterialQuote);
  const respondMaterialQuote = useJobsStore((state) => state.respondMaterialQuote);

  const counterpartId = job ? (role === 'mazdoor' ? job.customerId : job.mazdoorId) : null;
  const { data: counterpart } = usePublicProfile(counterpartId);

  const [priceInput, setPriceInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [disputeCategory, setDisputeCategory] = useState<DisputeCategory | null>(null);
  const [disputeDetails, setDisputeDetails] = useState('');
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteDescription, setQuoteDescription] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  if (!job) {
    return (
      <View style={[styles.container, { backgroundColor: colors.white }]}>
        <Text style={{ color: colors.textSecondary }}>This job no longer exists.</Text>
      </View>
    );
  }

  const runAction = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.');
    }
  };

  const handleProposeTime = (time: Date) => {
    const price = Number(priceInput);
    if (!price || price <= 0) return;
    runAction(() => proposeConfirmation.mutateAsync({ id: jobId, price, time }));
  };

  const handleStartJob = async () => {
    setPinError('');
    try {
      await startJob.mutateAsync({ id: jobId, pin: pinInput });
    } catch (err) {
      setPinError(err instanceof ApiError ? err.message : 'Incorrect PIN — ask the customer again.');
    }
  };

  const handleSos = () => {
    toggleSos(jobId);
    navigation.navigate('Sos', { jobId });
  };

  const handleSubmitDispute = () => {
    if (!disputeCategory) return;
    runAction(() => raiseDispute.mutateAsync({ id: jobId, category: disputeCategory, details: disputeDetails.trim() || null })).then(() => {
      setDisputeCategory(null);
      setDisputeDetails('');
    });
  };

  const handleSubmitQuote = () => {
    const amount = Number(quoteAmount);
    if (!quoteDescription.trim() || !amount || amount <= 0) return;
    proposeMaterialQuote(jobId, quoteDescription.trim(), amount);
    setQuoteDescription('');
    setQuoteAmount('');
    setShowQuoteForm(false);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.white, padding: spacing.xl }]}>
      <StatusBadge status={job.status} />

      <Text
        style={[
          styles.description,
          { color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.lg, marginTop: spacing.md },
        ]}
      >
        {job.description}
      </Text>

      {/* Open Chat lives here, once, for any job with a counterpart assigned — available to both roles across
          every status (negotiating through disputed), not just mid-negotiation or in-progress. Workers.pdf §14.1:
          "Job complete: chat remains open for post-completion communication." Phone number is deliberately not
          shown — ARCHITECTURE.md §7: visible to Ustavia's backend/CRM only, never the counterparty; apps/api's
          GET /users/:id/public doesn't return one either. */}
      {counterpartId && (
        <Card variant="flat" style={{ marginTop: spacing.md, gap: spacing.sm }}>
          <View style={styles.counterpartRow}>
            <View style={[styles.avatar, { backgroundColor: colors.surface, borderRadius: radii.full }]}>
              <UserRound size={20} color={colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textMuted, fontSize: typography.size.xs }}>
                {role === 'mazdoor' ? 'Customer' : 'Mazdoor'}
              </Text>
              <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.semibold }}>
                {role === 'mazdoor' ? 'Assigned customer' : 'Assigned Mazdoor'}
              </Text>
            </View>
            {role === 'customer' && counterpart?.tier && counterpart.ratingAvg != null && (
              <RatingBadge tier={counterpart.tier} ratingAvg={counterpart.ratingAvg} />
            )}
          </View>
          <Button label="Open Chat" variant="trust" size="md" icon={MessageCircle} onPress={() => navigation.navigate('Chat', { jobId })} />
        </Card>
      )}

      {actionError && <Text style={{ color: colors.danger, marginTop: spacing.sm, fontSize: typography.size.sm }}>{actionError}</Text>}

      {job.agreedPrice != null && (
        <Text style={{ color: colors.textSecondary, marginTop: spacing.md }}>
          Agreed: Rs {job.agreedPrice.toLocaleString()}
          {job.agreedTime ? ` at ${new Date(job.agreedTime).toLocaleString()}` : ''}
        </Text>
      )}

      {/* negotiating: mazdoor proposes terms, customer accepts */}
      {job.status === 'negotiating' && job.agreedPrice == null && role === 'mazdoor' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold }]}>
            Propose price & time
          </Text>
          <TextField
            placeholder="Price (Rs)"
            keyboardType="number-pad"
            value={priceInput}
            onChangeText={setPriceInput}
          />
          <View style={[styles.rowGap, { marginTop: spacing.sm }]}>
            <View style={{ flex: 1 }}>
              <Button label="Today 5pm" onPress={() => handleProposeTime(atTime(0, 17))} disabled={!priceInput || proposeConfirmation.isPending} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label="Tomorrow 9am" onPress={() => handleProposeTime(atTime(1, 9))} disabled={!priceInput || proposeConfirmation.isPending} />
            </View>
          </View>
        </View>
      )}
      {job.status === 'negotiating' && job.agreedPrice != null && role === 'customer' && (
        <View style={styles.section}>
          <Button
            label="Accept these terms"
            loading={acceptConfirmation.isPending}
            onPress={() => runAction(() => acceptConfirmation.mutateAsync(jobId))}
          />
        </View>
      )}
      {job.status === 'negotiating' && job.agreedPrice != null && role === 'mazdoor' && (
        <Text style={{ color: colors.textMuted, marginTop: spacing.md }}>Waiting for the customer to accept.</Text>
      )}

      {/* confirmed: customer sees PIN, mazdoor enters it */}
      {job.status === 'confirmed' && role === 'customer' && (
        <View style={[styles.pinCard, { backgroundColor: colors.brandBlueLight, borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.lg }]}>
          <View style={styles.pinHeaderRow}>
            <Lock size={16} color={colors.brandBlueDark} />
            <Text style={{ color: colors.brandBlueDark }}>Share this PIN with your Mazdoor on arrival</Text>
          </View>
          <Text style={[styles.pinValue, { color: colors.brandBlueDark, fontFamily: typography.headingWeights.bold }]}>{job.entryPin}</Text>
        </View>
      )}
      {job.status === 'confirmed' && role === 'mazdoor' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold }]}>
            Enter PIN to start
          </Text>
          <TextField
            placeholder="XXXX"
            keyboardType="number-pad"
            maxLength={4}
            value={pinInput}
            onChangeText={setPinInput}
            error={pinError || undefined}
            icon={Lock}
          />
          <View style={{ marginTop: spacing.sm }}>
            <Button label="Start Job" loading={startJob.isPending} onPress={handleStartJob} disabled={pinInput.length !== 4} />
          </View>
        </View>
      )}

      {/* in_progress: SOS, chat, material quote, dual complete */}
      {job.status === 'in_progress' && (
        <View style={styles.section}>
          <Pressable
            onPress={handleSos}
            accessibilityRole="button"
            accessibilityLabel="Send SOS alert"
            style={[styles.sosButton, { backgroundColor: colors.danger, borderRadius: radii.full }]}
          >
            <Siren size={24} color={colors.white} />
            <Text style={styles.sosLabel}>SOS</Text>
          </Pressable>

          {/* Material Quote — docx Finance section: mid-job parts cost, funded separately from labor price.
              Still local-only (no backend endpoint for this yet). */}
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, marginTop: spacing.xl },
            ]}
          >
            Material quote
          </Text>
          {materialQuote ? (
            <Card variant="flat">
              <View style={styles.quoteHeaderRow}>
                <Hammer size={16} color={colors.textSecondary} />
                <Text style={{ color: colors.textPrimary, flex: 1 }}>{materialQuote.description}</Text>
              </View>
              <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: typography.size.lg }}>
                Rs {materialQuote.amount.toLocaleString()}
              </Text>
              {materialQuote.status === 'pending' && role === 'customer' && (
                <View style={[styles.rowGap, { marginTop: spacing.sm }]}>
                  <View style={{ flex: 1 }}>
                    <Button label="Decline" variant="outline" onPress={() => respondMaterialQuote(materialQuote.id, false)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button label="Approve" onPress={() => respondMaterialQuote(materialQuote.id, true)} />
                  </View>
                </View>
              )}
              {materialQuote.status === 'pending' && role === 'mazdoor' && (
                <Text style={{ color: colors.textMuted, marginTop: spacing.xs, fontSize: typography.size.sm }}>
                  Waiting for the customer to respond.
                </Text>
              )}
              {materialQuote.status !== 'pending' && (
                <View style={[styles.quoteStatusRow, { marginTop: spacing.xs }]}>
                  {materialQuote.status === 'approved' ? (
                    <CheckCircle2 size={14} color={colors.success} />
                  ) : (
                    <XCircle size={14} color={colors.danger} />
                  )}
                  <Text style={{ color: materialQuote.status === 'approved' ? colors.success : colors.danger, fontSize: typography.size.sm }}>
                    {materialQuote.status === 'approved' ? 'Approved by customer' : 'Declined by customer'}
                  </Text>
                </View>
              )}
            </Card>
          ) : role === 'mazdoor' ? (
            showQuoteForm ? (
              <View style={{ gap: spacing.sm }}>
                <TextField placeholder="What materials are needed?" value={quoteDescription} onChangeText={setQuoteDescription} />
                <TextField placeholder="Amount (Rs)" keyboardType="number-pad" value={quoteAmount} onChangeText={setQuoteAmount} />
                <View style={styles.rowGap}>
                  <View style={{ flex: 1 }}>
                    <Button label="Cancel" variant="outline" onPress={() => setShowQuoteForm(false)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button label="Send Quote" onPress={handleSubmitQuote} disabled={!quoteDescription.trim() || !quoteAmount} />
                  </View>
                </View>
              </View>
            ) : (
              <Button label="Request Material Quote" variant="outline" icon={Hammer} onPress={() => setShowQuoteForm(true)} />
            )
          ) : (
            <Text style={{ color: colors.textMuted }}>No material costs requested for this job.</Text>
          )}

          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textPrimary, fontFamily: typography.headingWeights.semibold, marginTop: spacing.xl },
            ]}
          >
            Mark complete
          </Text>
          <View style={styles.rowGap}>
            <View style={{ flex: 1 }}>
              <Button
                label={job.customerAck ? 'Customer done' : 'Mark complete (Customer)'}
                variant="trust"
                icon={job.customerAck ? CheckCircle2 : undefined}
                disabled={job.customerAck || role !== 'customer'}
                loading={markComplete.isPending}
                onPress={() => runAction(() => markComplete.mutateAsync(jobId))}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                label={job.mazdoorAck ? 'Mazdoor done' : 'Mark complete (Mazdoor)'}
                icon={job.mazdoorAck ? CheckCircle2 : undefined}
                disabled={job.mazdoorAck || role !== 'mazdoor'}
                loading={markComplete.isPending}
                onPress={() => runAction(() => markComplete.mutateAsync(jobId))}
              />
            </View>
          </View>
        </View>
      )}

      {/* completed: pay */}
      {job.status === 'completed' && (
        <View style={styles.section}>
          {role === 'customer' ? (
            <Button label="Pay Now" icon={Wallet} onPress={() => navigation.navigate('PaymentMethod', { jobId })} />
          ) : (
            <Text style={{ color: colors.textMuted }}>Waiting for the customer to pay.</Text>
          )}
        </View>
      )}

      {/* paid */}
      {job.status === 'paid' && (
        <View style={[styles.banner, { backgroundColor: colors.successLight, borderRadius: radii.md, padding: spacing.md, marginTop: spacing.xl }]}>
          <CheckCircle2 size={18} color={colors.success} />
          <Text style={{ color: colors.success, fontFamily: typography.headingWeights.semibold, flex: 1 }}>
            Payment settled — funds moved to the Mazdoor's wallet.
          </Text>
        </View>
      )}

      {/* disputed */}
      {job.status === 'disputed' && (
        <View style={{ marginTop: spacing.xl }}>
          <View style={[styles.banner, { backgroundColor: colors.dangerLight, borderRadius: radii.md, padding: spacing.md }]}>
            <AlertTriangle size={18} color={colors.danger} />
            <Text style={{ color: colors.danger, fontFamily: typography.headingWeights.semibold, flex: 1 }}>
              This job is under dispute and has been sent to Ustavia's dispute queue.
            </Text>
          </View>
          <View style={{ marginTop: spacing.sm }}>
            <Button label="View Dispute Status" variant="outline" onPress={() => navigation.navigate('DisputeDetail', { jobId })} />
          </View>
        </View>
      )}

      {/* report an issue — available mid-job or after completion */}
      {(job.status === 'in_progress' || job.status === 'completed') && (
        <View style={{ marginTop: spacing.xl }}>
          <Pressable onPress={() => setDisputeCategory((c) => (c ? null : DISPUTE_CATEGORIES[0]))} style={styles.reportRow}>
            <AlertTriangle size={14} color={colors.danger} />
            <Text style={{ color: colors.danger, textDecorationLine: 'underline' }}>Report an issue</Text>
          </Pressable>
          {disputeCategory && (
            <View style={{ marginTop: spacing.sm, gap: spacing.sm }}>
              <View style={styles.chipRow}>
                {DISPUTE_CATEGORIES.map((category) => (
                  <Pressable
                    key={category}
                    onPress={() => setDisputeCategory(category)}
                    style={[
                      styles.chip,
                      {
                        borderRadius: radii.full,
                        borderColor: colors.danger,
                        backgroundColor: disputeCategory === category ? colors.danger : 'transparent',
                      },
                    ]}
                  >
                    <Text style={{ color: disputeCategory === category ? colors.white : colors.danger, fontSize: 12 }}>
                      {DISPUTE_CATEGORY_LABEL[category]}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <TextField placeholder="Describe what happened (optional)" value={disputeDetails} onChangeText={setDisputeDetails} />
              <Button label="Submit Complaint" variant="danger" loading={raiseDispute.isPending} onPress={handleSubmitDispute} />
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function atTime(daysFromNow: number, hour: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  description: {},
  counterpartRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 15, marginBottom: 8 },
  rowGap: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  pinHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  pinCard: { alignItems: 'center' },
  pinValue: { fontSize: 32, letterSpacing: 8, marginTop: 8 },
  sosButton: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  sosLabel: { color: '#FFFFFF', fontFamily: 'Poppins_700Bold', fontSize: 9, marginTop: 2 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reportRow: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  quoteHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quoteStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
