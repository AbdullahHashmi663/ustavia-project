import { Siren } from 'lucide-react';

import { useAdminStore } from '../../store/adminStore';

import { Button } from '@/components/ui/button';

export function SosMonitor() {
  const jobs = useAdminStore((state) => state.jobs);
  const sosActiveJobIds = useAdminStore((state) => state.sosActiveJobIds);
  const acknowledgeSos = useAdminStore((state) => state.acknowledgeSos);

  const activeJobs = jobs.filter((job) => sosActiveJobIds.includes(job.id));

  if (activeJobs.length === 0) {
    return <p className="text-text-muted">No active SOS alerts.</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {activeJobs.map((job) => (
        <div
          key={job.id}
          className="flex items-center justify-between rounded-lg border border-danger bg-danger-light px-4 py-3.5"
        >
          <div className="flex items-center gap-2.5">
            <Siren className="size-5 shrink-0 text-danger" />
            <strong className="text-danger">SOS — {job.description}</strong>
          </div>
          <Button variant="danger" size="sm" className="border-danger bg-danger text-white hover:bg-danger/90" onClick={() => acknowledgeSos(job.id)}>
            Acknowledge
          </Button>
        </div>
      ))}
    </div>
  );
}
