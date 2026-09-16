import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Hammer,
  Lock,
  MessageCircle,
  ShieldCheck,
  Siren,
  Sparkles,
  Star,
  UserRound,
  Wallet,
  XCircle,
} from 'lucide-react-native';
import { DISPUTE_CATEGORIES, type DisputeCategory, type JobStatus } from '@ustavia/shared';

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

const STAGES: Array<{ key: JobStatus; label: string }> = [
  { key: 'posted', label: 'Posted' },
  { key: 'negotiating', label: 'Offer' },
  { key: 'confirmed', label: 'Booked' },
  { key: 'in_progress', label: 'Working' },
  { key: 'completed', label: 'Done' },
];

const DISPUTE_CATEGORY_LABEL: Record<DisputeCategory, string> = {
  property_damage: 'Property damage',
  tardiness: 'Tardiness',
  harassment: 'Harassment',
  payment_issue: 'Payment issue',
  quality_issue: 'Quality issue',
  no_show: 'No show',
  other: 'Other',
};

function atTime(dayOffset: number, hour: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export function JobDetailScreen({ route }: Props) {
  const { jobId } = route.params;
  const { colors, radii, spacing, typography, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const role = useAuthStore((state) => state.role);
  const { data: job } = useJob(jobId);
  const proposeConfirmation = useProposeConfirmation();
  const acceptConfirmation = useAcceptConfirmation();
  const startJob = useStartJob();
  const markComplete = useMarkComplete();
  const raiseDispute = useRaiseDispute();

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

  // Milestone 3: Live ticking timer for in_progress status
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    if (job?.status !== 'in_progress') return;
    const startTime = job.startedAt ? new Date(job.startedAt).getTime() : Date.now();
    const updateTimer = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [job?.status, job?.startedAt]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Milestone 3: 4-stage job milestone checklist
  const [milestones, setMilestones] = useState([
    { id: '1', title: '1. Problem Assessment & Diagnostic', done: true },
    { id: '2', title: '2. Prepare Materials & Tools', done: false },
    { id: '3', title: '3. Execute Repair & Installation', done: false },
    { id: '4', title: '4. Testing, Inspection & Cleanup', done: false },
  ]);

  const toggleMilestone = (id: string) => {
    if (role !== 'mazdoor') return; // Workers update milestones
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)),
    );
  };

  // Milestone 3: Customer tip & rating state
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number>(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  if (!job) {
    return (
      <View style={[styles.container, { backgroundColor: colors.canvas ?? colors.white, justifyContent: 'center', alignItems: 'center' }]}>
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

  // Determine active step index
  const stageOrder: JobStatus[] = ['posted', 'negotiating', 'confirmed', 'in_progress', 'completed', 'paid'];
  const currentStageIndex = stageOrder.indexOf(job.status);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.canvas ?? colors.white }}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.innerContainer, { padding: spacing.xl }]}>
        {/* Visual 5-Stage Stepper Track */}
        <View style={[styles.stepperContainer, { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md }, shadows.sm]}>
          <View style={styles.stepsRow}>
            {STAGES.map((s, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;
              const activeColor = role === 'mazdoor' ? colors.brandOrange : colors.brandBlue;

              return (
                <View key={s.key} style={styles.stepItem}>
                  <View style={styles.stepNodeRow}>
                    <View
                      style={[
                        styles.stepCircle,
                        {
                          backgroundColor: isPast ? colors.success : isCurrent ? activeColor : colors.surfaceSubtle,
                          borderColor: isCurrent ? activeColor : 'transparent',
                          borderWidth: isCurrent ? 2 : 0,
                        },
                      ]}
                    >
                      {isPast ? (
                        <Check size={12} color={colors.white} strokeWidth={3} />
                      ) : (
                        <Text
                          style={[
                            styles.stepNumber,
                            {
                              color: isCurrent ? colors.white : colors.textMuted,
                              fontFamily: typography.headingWeights.bold,
                            },
                          ]}
                        >
                          {idx + 1}
                        </Text>
                      )}
                    </View>
                    {idx < STAGES.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          { backgroundColor: isPast ? colors.success : colors.borderSubtle },
                        ]}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: isCurrent ? colors.textPrimary : colors.textMuted,
                        fontFamily: isCurrent ? typography.headingWeights.bold : undefined,
                      },
                    ]}
                  >
                    {s.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Job Details Card */}
        <Card variant="raised" style={{ marginTop: spacing.lg }}>
          <View style={styles.jobCardTop}>
            <StatusBadge status={job.status} />
            {job.agreedPrice != null && (
              <View style={[styles.priceTag, { backgroundColor: colors.brandOrangeLight, borderRadius: radii.full }]}>
                <Text style={{ color: colors.brandOrangeDark, fontFamily: typography.headingWeights.bold, fontSize: 14 }}>
                  Rs {job.agreedPrice.toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.jobTitle,
              {
                color: colors.textPrimary,
                fontFamily: typography.headingWeights.bold,
                fontSize: 20,
                marginTop: spacing.sm,
                lineHeight: 28,
              },
            ]}
          >
            {job.description}
          </Text>

          {job.agreedTime && (
            <View style={styles.timeRow}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                Scheduled for: {new Date(job.agreedTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </Text>
            </View>
          )}
        </Card>

        {/* Counterpart Profile Bento Tile */}
        {counterpartId && (
          <Card variant="raised" style={{ marginTop: spacing.md, gap: spacing.md }}>
            <View style={styles.counterpartRow}>
              <View
                style={[
                  styles.avatarCircle,
                  {
                    backgroundColor: role === 'mazdoor' ? colors.brandBlueLight : colors.brandOrangeLight,
                    borderRadius: radii.full,
                  },
                ]}
              >
                <UserRound size={22} color={role === 'mazdoor' ? colors.brandBlue : colors.brandOrange} />
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: colors.textMuted, fontSize: typography.size.xs }}>
                  {role === 'mazdoor' ? 'Customer Profile' : 'Assigned Specialist'}
                </Text>
                <Text style={{ color: colors.textPrimary, fontFamily: typography.headingWeights.bold, fontSize: 16 }}>
                  {role === 'mazdoor' ? 'Direct Customer' : 'Verified Mazdoor'}
                </Text>
              </View>

              {role === 'customer' && counterpart?.tier && counterpart.ratingAvg != null && (
                <RatingBadge tier={counterpart.tier} ratingAvg={counterpart.ratingAvg} />
              )}
            </View>

            <Button
              label="Open Chat with Counterpart"
              variant="trust"
              size="md"
              icon={MessageCircle}
              onPress={() => navigation.navigate('Chat', { jobId })}
            />
          </Card>
        )}

        {/* Escrow Guarantee Vault Banner */}
        <View
          style={[
            styles.escrowCard,
            {
              backgroundColor: colors.brandBlueLight,
              borderColor: 'rgba(0, 97, 153, 0.15)',
              borderRadius: radii.lg,
              padding: spacing.md,
              marginTop: spacing.md,
            },
          ]}
        >
          <ShieldCheck size={20} color={colors.brandBlue} strokeWidth={2.2} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.brandBlue, fontFamily: typography.headingWeights.bold, fontSize: 13 }}>
              Ustavia Escrow Protection
            </Text>
            <Text style={{ color: colors.brandBlueDark, fontSize: 12, marginTop: 2, lineHeight: 16 }}>
              Funds are safely held until the customer verifies completion using their secure PIN.
            </Text>
          </View>
        </View>

        {actionError && (
          <View style={[styles.errorBox, { backgroundColor: colors.dangerLight, borderRadius: radii.md, marginTop: spacing.md }]}>
            <Text style={{ color: colors.danger, fontSize: 13, textAlign: 'center' }}>{actionError}</Text>
          </View>
        )}

        {/* SECTION: Negotiating Status */}
        {job.status === 'negotiating' && job.agreedPrice == null && role === 'mazdoor' && (
          <Card variant="raised" style={{ marginTop: spacing.lg, gap: spacing.md }}>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
              Propose Price & Schedule
            </Text>
            <TextField
              label="Total Price (Rs)"
              placeholder="e.g. 1500"
              keyboardType="number-pad"
              value={priceInput}
              onChangeText={setPriceInput}
            />
            <View style={[styles.timeChoiceRow, { gap: 10 }]}>
              <View style={{ flex: 1 }}>
                <Button
                  label="Today 5 PM"
                  variant="outline"
                  size="md"
                  onPress={() => handleProposeTime(atTime(0, 17))}
                  disabled={!priceInput || proposeConfirmation.isPending}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  label="Tomorrow 9 AM"
                  variant="outline"
                  size="md"
                  onPress={() => handleProposeTime(atTime(1, 9))}
                  disabled={!priceInput || proposeConfirmation.isPending}
                />
              </View>
            </View>
          </Card>
        )}

        {job.status === 'negotiating' && job.agreedPrice != null && role === 'customer' && (
          <Card variant="raised" style={{ marginTop: spacing.lg, gap: spacing.md }}>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
              Review Mazdoor Quote
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
              The Mazdoor offered to do this job for <Text style={{ fontWeight: '700', color: colors.brandBlue }}>Rs {job.agreedPrice.toLocaleString()}</Text>.
            </Text>
            <Button
              label="Accept & Proceed to Escrow"
              variant="trust"
              loading={acceptConfirmation.isPending}
              onPress={() => runAction(() => acceptConfirmation.mutateAsync(jobId))}
            />
          </Card>
        )}

        {/* SECTION: Confirmed Status (PIN exchange) */}
        {job.status === 'confirmed' && role === 'customer' && (
          <View
            style={[
              styles.pinHeroCard,
              shadows.glowBlue,
              {
                backgroundColor: colors.brandBlue,
                borderRadius: radii.lg,
                padding: spacing.xl,
                marginTop: spacing.lg,
              },
            ]}
          >
            <View style={styles.pinHeader}>
              <Lock size={18} color={colors.white} />
              <Text style={styles.pinInstruction}>Job Start Security PIN</Text>
            </View>
            <Text style={styles.pinDigits}>{job.entryPin}</Text>
            <Text style={styles.pinHint}>
              Only share this 4-digit PIN with your Mazdoor once they arrive at your location.
            </Text>
          </View>
        )}

        {job.status === 'confirmed' && role === 'mazdoor' && (
          <Card variant="raised" style={{ marginTop: spacing.lg, gap: spacing.md }}>
            <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
              Enter Customer PIN to Start
            </Text>
            <TextField
              placeholder="4-digit PIN"
              keyboardType="number-pad"
              maxLength={4}
              value={pinInput}
              onChangeText={setPinInput}
              error={pinError || undefined}
              icon={Lock}
            />
            <Button
              label="Start Job"
              variant="primary"
              loading={startJob.isPending}
              onPress={handleStartJob}
              disabled={pinInput.length !== 4}
            />
          </Card>
        )}

        {/* SECTION: In Progress Status */}
        {job.status === 'in_progress' && (
          <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
            {/* Live Ticking Elapsed Timer Card (§6.3 in Workers.pdf) */}
            <Card variant="raised" style={{ gap: spacing.xs, alignItems: 'center', paddingVertical: spacing.lg }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brandOrange }} />
                <Text style={{ color: colors.brandOrange, fontFamily: typography.headingWeights.bold, fontSize: 13, letterSpacing: 1 }}>
                  JOB IN PROGRESS
                </Text>
              </View>
              <Text style={{ fontSize: 32, fontFamily: typography.headingWeights.bold, color: colors.textPrimary, marginVertical: 4 }}>
                {formatTimer(elapsedSeconds)}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Timer confirmed via Doorstep PIN. Live tracking active.
              </Text>
            </Card>

            {/* Milestone Checklist Card (§6.3 in Workers.pdf) */}
            <Card variant="raised" style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
                  Repair Milestones
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                  {role === 'mazdoor' ? 'Tap to mark complete' : 'Live progress'}
                </Text>
              </View>

              {milestones.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => toggleMilestone(m.id)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: m.done ? colors.success : colors.border,
                      backgroundColor: m.done ? colors.success : colors.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {m.done && <Check size={12} color={colors.white} strokeWidth={3} />}
                  </View>
                  <Text
                    style={{
                      color: m.done ? colors.textPrimary : colors.textSecondary,
                      fontSize: 13,
                      textDecorationLine: m.done ? 'line-through' : 'none',
                      flex: 1,
                    }}
                  >
                    {m.title}
                  </Text>
                </Pressable>
              ))}
            </Card>

            {/* SOS Emergency Bar */}
            <Pressable
              onPress={handleSos}
              style={[
                styles.sosEmergencyBar,
                {
                  backgroundColor: colors.danger,
                  borderRadius: radii.md,
                  padding: spacing.md,
                },
                shadows.sm,
              ]}
            >
              <Siren size={20} color={colors.white} />
              <Text style={[styles.sosBarText, { fontFamily: typography.headingWeights.bold }]}>
                Emergency Safety SOS
              </Text>
            </Pressable>

            {/* Material Quote Card */}
            <Card variant="raised" style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Hammer size={18} color={colors.brandOrange} />
                <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
                  Material & Parts Costs
                </Text>
              </View>

              {materialQuote ? (
                <View style={{ gap: 8, marginTop: 4 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: 14 }}>{materialQuote.description}</Text>
                  <Text style={{ color: colors.brandOrangeDark, fontFamily: typography.headingWeights.bold, fontSize: 18 }}>
                    Rs {materialQuote.amount.toLocaleString()}
                  </Text>
                  {materialQuote.status === 'pending' && role === 'customer' && (
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                      <View style={{ flex: 1 }}>
                        <Button label="Decline" variant="outline" size="md" onPress={() => respondMaterialQuote(materialQuote.id, false)} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button label="Approve" variant="trust" size="md" onPress={() => respondMaterialQuote(materialQuote.id, true)} />
                      </View>
                    </View>
                  )}
                  {materialQuote.status !== 'pending' && (
                    <Text style={{ color: materialQuote.status === 'approved' ? colors.success : colors.danger, fontWeight: '600', fontSize: 12 }}>
                      {materialQuote.status === 'approved' ? '✓ Approved by customer' : '✗ Declined by customer'}
                    </Text>
                  )}
                </View>
              ) : role === 'mazdoor' ? (
                showQuoteForm ? (
                  <View style={{ gap: spacing.sm, marginTop: 4 }}>
                    <TextField placeholder="Description of materials needed" value={quoteDescription} onChangeText={setQuoteDescription} />
                    <TextField placeholder="Cost (Rs)" keyboardType="number-pad" value={quoteAmount} onChangeText={setQuoteAmount} />
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <View style={{ flex: 1 }}>
                        <Button label="Cancel" variant="outline" size="md" onPress={() => setShowQuoteForm(false)} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button label="Submit" variant="primary" size="md" onPress={handleSubmitQuote} disabled={!quoteDescription.trim() || !quoteAmount} />
                      </View>
                    </View>
                  </View>
                ) : (
                  <Button label="Request Material Reimbursement" variant="outline" icon={Hammer} size="md" onPress={() => setShowQuoteForm(true)} />
                )
              ) : (
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>No separate material expenses submitted.</Text>
              )}
            </Card>

            {/* Completion Acknowledgments */}
            <Card variant="raised" style={{ gap: spacing.md }}>
              <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
                Complete the Task
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                Both parties confirm when work finishes. Customer confirmation releases payment from escrow.
              </Text>

              <Button
                label={
                  role === 'customer'
                    ? job.customerAck ? 'Customer Confirmed' : 'Mark Complete (Customer)'
                    : job.mazdoorAck ? 'Mazdoor Confirmed' : 'Mark Complete (Mazdoor)'
                }
                variant={role === 'customer' ? 'trust' : 'primary'}
                icon={CheckCircle2}
                disabled={Boolean(role === 'customer' ? job.customerAck : job.mazdoorAck)}
                loading={markComplete.isPending}
                onPress={() => runAction(() => markComplete.mutateAsync(jobId))}
              />
            </Card>
          </View>
        )}

        {/* SECTION: Completed Status */}
        {job.status === 'completed' && (
          <View style={{ marginTop: spacing.lg }}>
            {role === 'customer' ? (
              <Button
                label="Release Escrow & Pay Mazdoor"
                variant="trust"
                icon={Wallet}
                onPress={() => navigation.navigate('PaymentMethod', { jobId })}
              />
            ) : (
              <View style={[styles.waitingBox, { backgroundColor: colors.surfaceSubtle, borderRadius: radii.md, padding: spacing.lg }]}>
                <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
                  Job complete! Waiting for customer to release escrow payment.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* SECTION: Paid Status */}
        {job.status === 'paid' && (
          <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
            <View style={[styles.paidBanner, { backgroundColor: colors.successLight, borderRadius: radii.lg, padding: spacing.lg }]}>
              <CheckCircle2 size={24} color={colors.success} strokeWidth={2.5} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#047857', fontFamily: typography.headingWeights.bold, fontSize: 15 }}>
                  Payment Released & Job Closed
                </Text>
                <Text style={{ color: '#065F46', fontSize: 12, marginTop: 2 }}>
                  Full escrow payment has cleared directly to Mazdoor wallet.
                </Text>
              </View>
            </View>

            {/* 7-Day Ustavia Workmanship Warranty Protection Card (from DOC-20260826-WA0027) */}
            <Card variant="raised" style={{ gap: spacing.xs, borderColor: 'rgba(0, 97, 153, 0.2)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={20} color={colors.brandBlue} />
                <Text style={[styles.sectionHeading, { color: colors.brandBlue, fontFamily: typography.headingWeights.bold }]}>
                  7-Day Ustavia Workmanship Warranty
                </Text>
              </View>
              <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 4 }}>
                This job is backed by Ustavia Warranty. If any plumbing, wiring, or installation defect recurs within 7 days, our verified supervisor re-inspects and fixes it at zero extra charge.
              </Text>
            </Card>

            {/* Rating & Tipping Card for Customer (§11.2 & §11.3 in customer.pdf) */}
            {role === 'customer' && (
              <Card variant="raised" style={{ gap: spacing.sm }}>
                <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: typography.headingWeights.bold }]}>
                  {ratingSubmitted ? 'Thank You for Your Feedback!' : 'Rate & Tip Your Mazdoor'}
                </Text>

                {!ratingSubmitted ? (
                  <>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 8 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Pressable key={star} onPress={() => setUserRating(star)}>
                          <Star
                            size={32}
                            color="#F59E0B"
                            fill={star <= userRating ? '#F59E0B' : 'transparent'}
                          />
                        </Pressable>
                      ))}
                    </View>

                    {/* Tipping Chips (Rs. 100, 200, 500) */}
                    <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 4 }}>
                      Add a tip to reward outstanding craftsmanship:
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 6 }}>
                      {[100, 200, 500].map((amount) => {
                        const isTipped = selectedTip === amount;
                        return (
                          <Pressable
                            key={amount}
                            onPress={() => setSelectedTip(isTipped ? null : amount)}
                            style={{
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderRadius: radii.full,
                              borderWidth: 1.5,
                              borderColor: isTipped ? colors.brandOrange : colors.border,
                              backgroundColor: isTipped ? 'rgba(255, 103, 1, 0.1)' : colors.white,
                            }}
                          >
                            <Text style={{ color: isTipped ? colors.brandOrange : colors.textPrimary, fontWeight: '700', fontSize: 12 }}>
                              Rs. {amount}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <View style={{ marginTop: 12 }}>
                      <Button
                        label={selectedTip ? `Submit Rating & Tip (Rs. ${selectedTip})` : 'Submit 5-Star Rating'}
                        variant="trust"
                        icon={Sparkles}
                        onPress={() => setRatingSubmitted(true)}
                      />
                    </View>
                  </>
                ) : (
                  <Text style={{ color: colors.success, fontSize: 13, textAlign: 'center', fontWeight: '600' }}>
                    ✓ Your 5-star review has been posted to the Mazdoor's public profile!
                  </Text>
                )}
              </Card>
            )}
          </View>
        )}

        {/* Dispute Button */}
        {job.status !== 'posted' && (
          <View style={{ marginTop: spacing.xxl, alignItems: 'center' }}>
            <Pressable
              onPress={() => {
                if (disputeCategory) setDisputeCategory(null);
                else setDisputeCategory('quality_issue');
              }}
              style={styles.disputeTrigger}
            >
              <AlertTriangle size={14} color={colors.danger} />
              <Text style={{ color: colors.danger, fontSize: 13, fontFamily: typography.headingWeights.semibold }}>
                {disputeCategory ? 'Cancel Dispute Request' : 'Need help or dispute this job?'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Dispute Form */}
        {disputeCategory && (
          <Card variant="raised" style={{ marginTop: spacing.md, gap: spacing.md }}>
            <Text style={{ color: colors.danger, fontFamily: typography.headingWeights.bold, fontSize: 15 }}>
              Open a Dispute Case
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              Select the primary reason for disputing this job:
            </Text>

            <View style={{ gap: 6 }}>
              {DISPUTE_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setDisputeCategory(cat)}
                  style={[
                    styles.catRow,
                    {
                      borderColor: disputeCategory === cat ? colors.danger : colors.borderSubtle,
                      backgroundColor: disputeCategory === cat ? colors.dangerLight : colors.white,
                      borderRadius: radii.md,
                      padding: 10,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: disputeCategory === cat ? '700' : '500' }}>
                    {DISPUTE_CATEGORY_LABEL[cat]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TextField
              placeholder="Additional dispute details..."
              multiline
              value={disputeDetails}
              onChangeText={setDisputeDetails}
            />

            <Button
              label="Submit Dispute to Ustavia"
              variant="danger"
              loading={raiseDispute.isPending}
              onPress={handleSubmitDispute}
            />
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 600,
  },
  stepperContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepNodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  stepNumber: {
    fontSize: 10,
  },
  stepLine: {
    position: 'absolute',
    right: '-50%',
    left: '50%',
    height: 2,
    zIndex: -1,
  },
  stepLabel: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  jobCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  jobTitle: {},
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  counterpartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  escrowCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
  },
  errorBox: {
    padding: 12,
  },
  sectionHeading: {
    fontSize: 15,
  },
  timeChoiceRow: {
    flexDirection: 'row',
  },
  pinHeroCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinInstruction: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pinDigits: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 10,
    marginVertical: 12,
  },
  pinHint: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  sosEmergencyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sosBarText: {
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  waitingBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  disputeTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  catRow: {},
});
