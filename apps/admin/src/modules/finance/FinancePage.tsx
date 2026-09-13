import { useState } from 'react';
import { AlertTriangle, TrendingUp, Wallet, Landmark } from 'lucide-react';
import { DISPUTE_STATUSES, type Dispute, type DisputeStatus } from '@ustavia/shared';

import { useAdminStore } from '../../store/adminStore';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DISPUTE_STATUS_TONE: Record<DisputeStatus, 'neutral' | 'info' | 'success' | 'danger'> = {
  open: 'danger',
  under_review: 'info',
  resolved: 'success',
  dismissed: 'neutral',
};

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="font-display mt-1 text-2xl font-semibold text-text-primary">{value}</p>
          {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
        </div>
        <div className="rounded-full bg-brand-orange-light p-2 text-brand-orange-dark">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function ResolveDisputeDialog({ dispute, onClose }: { dispute: Dispute; onClose: () => void }) {
  const resolveDispute = useAdminStore((state) => state.resolveDispute);
  const [status, setStatus] = useState<DisputeStatus>('resolved');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    resolveDispute(dispute.id, status, notes.trim());
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve dispute</DialogTitle>
          <DialogDescription>{dispute.category.replace('_', ' ')} — job {dispute.jobId.slice(0, 8)}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-text-secondary">
            Resolution
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DisputeStatus)}
              className="mt-1 block h-9 w-full rounded-md border border-border bg-white px-2 text-sm text-text-primary outline-none focus-visible:border-brand-blue"
            >
              {DISPUTE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-text-secondary">
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="What was decided and why..."
              className="mt-1 block w-full resize-none rounded-md border border-border bg-white px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus-visible:border-brand-blue"
            />
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="trust" onClick={handleSubmit}>
            Save resolution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Fund dashboard + dispute resolution — PLANNING.md §9 Phase 1 scope: Finance
 * gets full attention this pass (money is live at MVP launch, and access is
 * already meant to be gated to Finance Head/CEO — ARCHITECTURE.md §7).
 * TODO: enforce that role gate once apps/api `auth` exists; it's UI-only for now.
 */
export function FinancePage() {
  const walletLedger = useAdminStore((state) => state.walletLedger);
  const disputes = useAdminStore((state) => state.disputes);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const sum = (type: (typeof walletLedger)[number]['type']) =>
    walletLedger.filter((e) => e.type === type).reduce((total, e) => total + Math.abs(e.amount), 0);

  const grossPayouts = sum('job_payout');
  const platformCommission = sum('platform_commission');
  const fbrWithholding = sum('fbr_withholding');
  const openDisputes = disputes.filter((d) => d.status === 'open' || d.status === 'under_review');
  const resolvingDispute = disputes.find((d) => d.id === resolvingId) ?? null;

  return (
    <section>
      <h2 className="mb-1 text-xl">Finance</h2>
      <p className="mb-5 text-sm text-text-secondary">Fund dashboard and dispute resolution.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={TrendingUp} label="Gross job volume" value={`Rs ${grossPayouts.toLocaleString()}`} hint="All-time, mock ledger" />
        <StatCard icon={Wallet} label="Platform commission collected" value={`Rs ${platformCommission.toLocaleString()}`} />
        <StatCard icon={Landmark} label="FBR withholding reserved" value={`Rs ${fbrWithholding.toLocaleString()}`} />
      </div>

      <h3 className="font-display mt-8 mb-3 text-base font-semibold text-text-primary">Disputes</h3>
      {disputes.length === 0 ? (
        <p className="text-text-muted">No disputes on record.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {disputes.map((dispute) => (
            <Card key={dispute.id} className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {(dispute.status === 'open' || dispute.status === 'under_review') && (
                  <AlertTriangle className="size-4 shrink-0 text-danger" />
                )}
                <div>
                  <p className="font-medium text-text-primary capitalize">{dispute.category.replace('_', ' ')}</p>
                  <p className="text-xs text-text-muted">Job {dispute.jobId.slice(0, 8)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={DISPUTE_STATUS_TONE[dispute.status]}>{dispute.status.replace('_', ' ')}</Badge>
                {dispute.status !== 'resolved' && dispute.status !== 'dismissed' && (
                  <Button size="sm" variant="outline" onClick={() => setResolvingId(dispute.id)}>
                    Resolve
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      {openDisputes.length > 0 && (
        <p className="mt-2 text-xs text-text-muted">{openDisputes.length} dispute(s) awaiting review.</p>
      )}

      {resolvingDispute && <ResolveDisputeDialog dispute={resolvingDispute} onClose={() => setResolvingId(null)} />}
    </section>
  );
}
