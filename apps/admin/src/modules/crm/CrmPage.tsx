import { useAdminStore } from '../../store/adminStore';
import { JobsTable } from './JobsTable';
import { SosMonitor } from './SosMonitor';
import { VerificationKanban } from './VerificationKanban';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/** Active/completed jobs, verification queue, SOS monitor — see ARCHITECTURE.md §3. */
export function CrmPage() {
  const sosCount = useAdminStore((state) => state.sosActiveJobIds.length);

  return (
    <section>
      <h2 className="mb-5 text-xl">CRM</h2>
      <Tabs defaultValue="jobs">
        <TabsList>
          <TabsTrigger value="jobs">Job monitoring</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="sos">SOS monitor{sosCount > 0 ? ` (${sosCount})` : ''}</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs">
          <JobsTable />
        </TabsContent>
        <TabsContent value="verification">
          <VerificationKanban />
        </TabsContent>
        <TabsContent value="sos">
          <SosMonitor />
        </TabsContent>
      </Tabs>
    </section>
  );
}
