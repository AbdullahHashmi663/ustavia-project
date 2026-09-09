import { NavLink, Outlet } from 'react-router-dom';

import './Shell.css';

const NAV_ITEMS = [
  { to: '/crm', label: 'CRM' },
  { to: '/hrm', label: 'HRM' },
  { to: '/finance', label: 'Finance' },
];

export function Shell() {
  return (
    <div className="shell">
      <header className="shell-topnav">
        <span className="brand-mark" aria-hidden />
        <h1>Ustavia Admin</h1>
      </header>
      <aside className="shell-sidebar">
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
