import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';

import { Shell } from './components/layout/Shell';
import { CrmPage } from './modules/crm/CrmPage';
import { FinancePage } from './modules/finance/FinancePage';
import { HrmPage } from './modules/hrm/HrmPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Navigate to="/crm" replace />} />
          <Route path="crm" element={<CrmPage />} />
          <Route path="hrm" element={<HrmPage />} />
          <Route path="finance" element={<FinancePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
