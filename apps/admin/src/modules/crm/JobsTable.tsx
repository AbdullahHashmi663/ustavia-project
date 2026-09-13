import { useState } from 'react';
import type { Job, JobStatus } from '@ustavia/shared';
import { JOB_STATUSES } from '@ustavia/shared';

import { JobStatusPill } from '../../components/StatusPill';
import { useAdminStore } from '../../store/adminStore';

import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function JobsTable() {
  const jobs = useAdminStore((state) => state.jobs);
  const customers = useAdminStore((state) => state.customers);
  const mazdoors = useAdminStore((state) => state.mazdoors);
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');

  const rows = jobs.filter((job) => filter === 'all' || job.status === filter);

  const chipClass = (active: boolean) =>
    cn(
      'rounded-full border px-3 py-1 text-xs',
      active
        ? 'border-brand-blue bg-brand-blue text-white'
        : 'border-border bg-white text-text-secondary hover:border-brand-blue-light hover:text-brand-blue-dark',
    );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button className={chipClass(filter === 'all')} onClick={() => setFilter('all')}>
          All ({jobs.length})
        </button>
        {JOB_STATUSES.map((status) => (
          <button key={status} className={chipClass(filter === status)} onClick={() => setFilter(status)}>
            {status.replace('_', ' ')} ({jobs.filter((j) => j.status === status).length})
          </button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Mazdoor</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((job: Job) => {
            const customer = customers.find((c) => c.id === job.customerId);
            const mazdoor = mazdoors.find((m) => m.id === job.mazdoorId);
            return (
              <TableRow key={job.id}>
                <TableCell className="max-w-xs truncate">{job.description}</TableCell>
                <TableCell>
                  <JobStatusPill status={job.status} />
                </TableCell>
                <TableCell>{customer?.phone ?? '—'}</TableCell>
                <TableCell>{mazdoor?.phone ?? '—'}</TableCell>
                <TableCell>{job.agreedPrice ? `Rs ${job.agreedPrice.toLocaleString()}` : '—'}</TableCell>
              </TableRow>
            );
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-text-muted">
                No jobs match this filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
