import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, Users, Wallet } from 'lucide-react';

import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/crm', label: 'CRM', icon: LayoutGrid },
  { to: '/hrm', label: 'HRM', icon: Users },
  { to: '/finance', label: 'Finance', icon: Wallet },
];

export function Shell() {
  return (
    <div className="grid min-h-svh grid-cols-[220px_1fr] grid-rows-[56px_1fr]">
      <header className="col-span-2 flex items-center gap-2 bg-brand-blue-dark px-5 text-white">
        <span className="size-2.5 rounded-full bg-brand-orange" aria-hidden />
        <h1 className="text-sm font-semibold text-white">Ustavia Admin</h1>
      </header>
      <aside className="border-r border-border bg-white p-2">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-brand-blue-light hover:text-brand-blue-dark',
                  isActive && 'bg-brand-blue-light font-semibold text-brand-blue-dark',
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
