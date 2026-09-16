import React from 'react';

export default function Sidebar({ activeView, setActiveView, onLogout }) {
  const navItems = [
    { id: 'appointments', label: 'Appointment Section', icon: 'calendar_today' },
    { id: 'summary', label: 'Business Summary', icon: 'analytics' },
    { id: 'customers', label: 'Customer Data', icon: 'group' },
    { id: 'barbers', label: "Barber's Data", icon: 'badge' },
    { id: 'packages', label: 'Packages', icon: 'spa' },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[240px] bg-surface-container-lowest border-r border-outline-variant/40 z-40 flex flex-col justify-between p-space-lg select-none">
      <div className="flex flex-col gap-space-xl">
        <div className="pt-space-xs flex items-center gap-3">
          <img
            src="/assets/double-a-logo.png"
            alt="Double A Logo"
            className="w-9 h-9 object-contain filter drop-shadow-sm"
          />
          <div>
            <span className="font-headline-sm text-[15px] uppercase tracking-wider text-on-surface block leading-tight">
              Double A
            </span>
            <span className="font-label-sm text-[9.5px] uppercase tracking-[0.16em] text-primary block">
              Admin Ledger
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                type="button"
                className={`w-full text-left px-space-md py-2.5 rounded transition-all duration-200 flex items-center justify-between text-label-lg uppercase tracking-wider cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-medium shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-on-primary-container inline-block"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-space-xs pt-space-lg border-t border-outline-variant/40">
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveView('settings')}
            type="button"
            className={`w-full text-left px-space-md py-2 rounded font-label-lg text-label-lg transition-colors block cursor-pointer ${
              activeView === 'settings'
                ? 'bg-primary-container text-on-primary-container font-medium'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => {
              if (confirm('Lock and sign out from Double A Admin Desk?')) {
                if (onLogout) onLogout();
              }
            }}
            type="button"
            className="w-full text-left px-space-md py-2 rounded font-label-lg text-label-lg text-on-surface-variant hover:text-error transition-colors block cursor-pointer"
          >
            Lock Desk
          </button>
        </nav>
      </div>
    </aside>
  );
}
