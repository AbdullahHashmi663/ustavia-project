import { useAuthStore } from '../store/auth';
import { CustomerTabs } from './CustomerTabs';
import { MazdoorTabs } from './MazdoorTabs';

/** Switches on user.role, chosen once at signup and permanent for MVP — ARCHITECTURE.md §2.1. */
export function AppStack() {
  const role = useAuthStore((state) => state.role);

  if (role === 'mazdoor') return <MazdoorTabs />;
  return <CustomerTabs />;
}
