import { DndContext, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import { Clock } from 'lucide-react';
import { VERIFICATION_STATUSES, type Mazdoor, type VerificationStatus } from '@ustavia/shared';

import { useAdminStore } from '../../store/adminStore';

import { cn } from '@/lib/utils';

const COLUMN_LABELS: Record<VerificationStatus, string> = {
  pending: 'Pending',
  verified: 'Verified',
  rejected: 'Rejected',
};

/** Days since the record was created — a proxy for time-in-pipeline until per-column timestamps exist. Surfaced so office staff can see what's stalling in the Pending column. */
function daysSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

function KanbanCard({ mazdoor }: { mazdoor: Mazdoor }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: mazdoor.id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 10, position: 'relative' as const }
    : undefined;
  const age = daysSince(mazdoor.createdAt);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="mb-2 cursor-grab rounded-lg border border-border bg-white p-3 text-sm active:cursor-grabbing"
    >
      <div className="font-medium text-text-primary">{mazdoor.phone}</div>
      <div className="mt-1 flex items-center justify-between">
        {mazdoor.tier && <span className="text-xs text-text-muted capitalize">{mazdoor.tier}</span>}
        <span
          className={cn(
            'ml-auto flex items-center gap-1 text-xs',
            age >= 2 ? 'font-semibold text-warning' : 'text-text-muted',
          )}
        >
          <Clock className="size-3" />
          {age === 0 ? 'today' : `${age}d`}
        </span>
      </div>
    </div>
  );
}

function KanbanColumn({ status, mazdoors }: { status: VerificationStatus; mazdoors: Mazdoor[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn('min-h-52 rounded-lg bg-surface p-3', isOver && 'outline-2 outline-dashed outline-brand-blue')}
    >
      <div className="font-display mb-2.5 text-sm font-semibold text-text-secondary">
        {COLUMN_LABELS[status]} ({mazdoors.length})
      </div>
      {mazdoors.map((m) => (
        <KanbanCard key={m.id} mazdoor={m} />
      ))}
    </div>
  );
}

export function VerificationKanban() {
  const mazdoors = useAdminStore((state) => state.mazdoors);
  const setMazdoorVerification = useAdminStore((state) => state.setMazdoorVerification);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    setMazdoorVerification(String(active.id), over.id as VerificationStatus);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {VERIFICATION_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            mazdoors={mazdoors.filter((m) => m.verificationStatus === status)}
          />
        ))}
      </div>
    </DndContext>
  );
}
