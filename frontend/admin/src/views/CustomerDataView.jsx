import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const FALLBACK_CUSTOMERS = [
  {
    id: 'u1',
    name: 'Tanvir Hossain',
    contact: '01898765432',
    dob: '1992-11-24',
    first_service_date: '2025-08-14',
    tier: 'Executive Member',
    total_visits: '12',
    total_spent: '৳17,400',
    preferred_barber: 'Hasan Ali',
  },
  {
    id: 'u2',
    name: 'Arifur Rahman',
    contact: '01655443322',
    dob: '1985-03-15',
    first_service_date: '2024-12-10',
    tier: 'Regular Client',
    total_visits: '8',
    total_spent: '৳8,800',
    preferred_barber: 'Rahim Khan',
  },
  {
    id: 'u3',
    name: 'Sajid Hasan',
    contact: '01911223344',
    dob: '2001-07-20',
    first_service_date: '2026-02-18',
    tier: 'Atelier Guest',
    total_visits: '4',
    total_spent: '৳7,200',
    preferred_barber: 'Karim Uddin',
  },
  {
    id: 'u4',
    name: 'Farhan Kabir',
    contact: '01755667788',
    dob: '1995-09-30',
    first_service_date: '2025-05-04',
    tier: 'Executive Member',
    total_visits: '9',
    total_spent: '৳11,500',
    preferred_barber: 'Hasan Ali',
  },
  {
    id: 'u5',
    name: 'Mahmudul Karim',
    contact: '01333444555',
    dob: '1990-12-05',
    first_service_date: '2025-10-19',
    tier: 'Regular Client',
    total_visits: '6',
    total_spent: '৳6,900',
    preferred_barber: 'Rahim Khan',
  },
];

export default function CustomerDataView() {
  const [customers, setCustomers] = useState(FALLBACK_CUSTOMERS);
  const [filter, setFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    api.getUsers()
      .then((users) => {
        if (Array.isArray(users)) setCustomers(users);
      })
      .catch((e) => console.warn('Customer API fallback:', e));
  }, []);

  const filtered = customers.filter((c) => {
    const q = filter.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.contact.includes(q);
  });

  return (
    <div className="flex flex-col w-full gap-space-xl pb-16">
      {/* Header */}
      <div className="flex flex-col gap-space-xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
          Patron Register
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Customer Data</h1>
          <span className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
            Client Ledger & Visit History
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <section className="bg-surface-container-low border border-outline-variant/40 rounded p-space-lg flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-outline-variant/30 pb-space-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">All Patrons</h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-mono">
              Total {customers.length} Registered Records
            </span>
          </div>
          <div className="w-full sm:w-72">
            <input
              className="w-full h-10 px-3 bg-surface-container text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:border-primary focus:outline-none placeholder:text-on-surface-variant/60 rounded-[2px]"
              placeholder="Filter by name or phone..."
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse font-body-md">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest">
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Contact
                </th>
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  DOB
                </th>
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  First Service
                </th>
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Visits
                </th>
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filtered.map((c) => (
                <tr key={c.id || c.name} className="hover:bg-surface-container transition-colors group">
                  <td className="py-space-md px-space-lg font-medium text-on-surface">
                    <div className="text-on-surface">{c.name}</div>
                    <div className="font-label-sm text-[10px] text-primary uppercase">{c.tier || 'Atelier Patron'}</div>
                  </td>
                  <td className="py-space-md px-space-lg text-on-surface-variant font-mono text-body-sm">
                    {c.contact}
                  </td>
                  <td className="py-space-md px-space-lg text-on-surface-variant font-mono text-body-sm">
                    {c.dob || '—'}
                  </td>
                  <td className="py-space-md px-space-lg text-on-surface-variant font-mono text-body-sm">
                    {c.first_service_date || '2026-01-01'}
                  </td>
                  <td className="py-space-md px-space-lg font-mono text-body-sm text-primary">
                    {c.total_visits || '1'} Sessions
                  </td>
                  <td className="py-space-md px-space-lg text-right">
                    <div className="flex items-center justify-end gap-space-md">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="font-label-md text-label-md text-primary hover:text-on-surface transition-colors uppercase tracking-wider cursor-pointer"
                        type="button"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Slide-out Customer Portfolio Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end animate-fade-in backdrop-blur-xs">
          <div className="w-full max-w-[460px] bg-surface-container-low h-full border-l border-outline-variant/40 flex flex-col justify-between shadow-2xl animate-slide-left">
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30 bg-surface-container-lowest">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-0.5">
                    Client Portfolio
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-normal">
                    {selectedCustomer.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-on-surface-variant hover:text-on-surface p-1 transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface-container-lowest border border-outline-variant/30 rounded">
                    <span className="font-label-sm text-on-surface-variant uppercase tracking-wider block">Total Visits</span>
                    <span className="font-headline-sm text-primary mt-1 block">{selectedCustomer.total_visits || '1'} Sessions</span>
                  </div>
                  <div className="p-3 bg-surface-container-lowest border border-outline-variant/30 rounded">
                    <span className="font-label-sm text-on-surface-variant uppercase tracking-wider block">Lifetime Spend</span>
                    <span className="font-headline-sm text-on-surface mt-1 block">{selectedCustomer.total_spent || '৳0'}</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded flex flex-col divide-y divide-outline-variant/20 font-body-sm">
                  <div className="py-2 flex justify-between">
                    <span className="text-on-surface-variant uppercase font-label-sm">Contact Number</span>
                    <span className="font-mono text-on-surface font-medium">{selectedCustomer.contact}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-on-surface-variant uppercase font-label-sm">Date of Birth</span>
                    <span className="font-mono text-on-surface">{selectedCustomer.dob || '—'}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-on-surface-variant uppercase font-label-sm">Membership Tier</span>
                    <span className="text-primary font-medium">{selectedCustomer.tier || 'Atelier Patron'}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-on-surface-variant uppercase font-label-sm">Preferred Stylist</span>
                    <span className="text-on-surface">{selectedCustomer.preferred_barber || 'Master Barber'}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-on-surface-variant uppercase font-label-sm">First Session</span>
                    <span className="font-mono text-on-surface">{selectedCustomer.first_service_date || '2026-01-01'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-outline-variant/30 bg-surface-container-lowest flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 border border-outline-variant/40 hover:border-outline text-on-surface font-label-lg text-label-lg uppercase tracking-wider rounded transition-colors cursor-pointer"
                type="button"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
