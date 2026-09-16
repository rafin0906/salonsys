import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AppointmentsView from './views/AppointmentsView';
import BusinessSummaryView from './views/BusinessSummaryView';
import CustomerDataView from './views/CustomerDataView';
import BarbersDataView from './views/BarbersDataView';
import PackagesView from './views/PackagesView';
import AdminLockView from './views/AdminLockView';

export default function App() {
  const [activeView, setActiveView] = useState('appointments');
  const [activeBranch, setActiveBranch] = useState('All Sanctuaries');
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('atelier_admin_auth') === 'true'
  );

  if (!isAuthenticated) {
    return <AdminLockView onUnlock={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('atelier_admin_auth');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Fixed Admin Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="pl-[240px] w-full min-h-screen flex flex-col">
        {/* Top Operational Bar */}
        <header className="h-16 w-full px-space-xl bg-surface-container-lowest/80 backdrop-blur-xs border-b border-outline-variant/30 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <span className="font-label-sm uppercase tracking-widest text-outline">Sanctuary:</span>
            <select
              value={activeBranch}
              onChange={(e) => setActiveBranch(e.target.value)}
              className="h-8 px-2.5 bg-surface-container border border-outline-variant/40 rounded-[2px] text-on-surface font-body-sm focus:outline-none focus:border-primary cursor-pointer text-[13px]"
            >
              <option value="All Sanctuaries">All Sanctuaries (Rajshahi & Dhanmondi)</option>
              <option value="Rajshahi Atelier">Rajshahi Atelier</option>
              <option value="Dhanmondi Atelier">Dhanmondi Atelier</option>
              <option value="Banani Atelier">Banani Atelier</option>
            </select>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline">
                Connected to Supabase API
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-surface-container border border-outline-variant/40 hover:border-error/50 hover:text-error text-on-surface-variant text-[11px] uppercase font-label-sm rounded-[2px] transition-colors cursor-pointer"
              title="Lock Admin Desk"
              type="button"
            >
              Lock Desk
            </button>
          </div>
        </header>

        {/* View Routing */}
        <main className="flex-1 w-full p-space-xl max-w-7xl mx-auto">
          {activeView === 'appointments' && <AppointmentsView activeBranch={activeBranch} />}
          {activeView === 'summary' && <BusinessSummaryView activeBranch={activeBranch} />}
          {activeView === 'customers' && <CustomerDataView />}
          {activeView === 'barbers' && <BarbersDataView activeBranch={activeBranch} />}
          {activeView === 'packages' && <PackagesView />}
          {activeView === 'settings' && (
            <div className="bg-surface-container-low border border-outline-variant/40 p-space-lg rounded-[2px] max-w-2xl">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                System Preferences & Database
              </h2>
              <p className="font-body-sm text-on-surface-variant mb-6">
                Connected to FastAPI backend on <code className="text-primary font-mono">http://localhost:8000</code> and Supabase PostgreSQL.
              </p>
              <div className="flex flex-col gap-4 divide-y divide-outline-variant/20 font-body-sm">
                <div className="pt-2 flex justify-between items-center">
                  <span>Database Engine</span>
                  <span className="font-mono text-primary font-medium">Supabase PostgreSQL 17.6 / SQLAlchemy</span>
                </div>
                <div className="pt-3 flex justify-between items-center">
                  <span>Operating Currency</span>
                  <span className="font-mono text-primary">BDT (৳)</span>
                </div>
                <div className="pt-3 flex justify-between items-center">
                  <span>Theme Preset</span>
                  <span className="text-on-surface font-medium">Atelier Dark Minimalist</span>
                </div>
                <div className="pt-3 flex justify-between items-center">
                  <span>Security</span>
                  <span className="text-emerald-400 font-medium">Passcode Protection Active</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
