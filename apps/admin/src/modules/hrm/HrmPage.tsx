import type { HrmRole } from '@ustavia/shared';

import { useAdminStore } from '../../store/adminStore';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ROLE_LABEL: Record<HrmRole, string> = {
  staff: 'Staff',
  dispatcher: 'Dispatcher',
  hr: 'HR',
  finance_head: 'Finance Head',
  ceo: 'CEO',
};

/**
 * Member directory — PLANNING.md §9 Phase 1 scope: functional directory only.
 * The attendance tracker (present/absent/half-day pay cuts) and the
 * drag-and-drop emergency dispatch calendar are real, larger builds of their
 * own (Workers.pdf-adjacent office tooling) and move to Phase 2 — HRM has no
 * external user blocking launch, unlike Finance. `dispatchAssignments` and
 * `attendanceRecords` already exist in useAdminStore for that phase.
 */
export function HrmPage() {
  const members = useAdminStore((state) => state.hrmMembers);

  return (
    <section>
      <h2 className="mb-1 text-xl">HRM</h2>
      <p className="mb-5 text-sm text-text-secondary">Company member directory.</p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Monthly pay</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>
                <Badge tone="info">{ROLE_LABEL[member.role]}</Badge>
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>Rs {member.monthlyPay.toLocaleString()}</TableCell>
              <TableCell>
                <Badge tone={member.isActive ? 'success' : 'neutral'}>{member.isActive ? 'Active' : 'Inactive'}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
