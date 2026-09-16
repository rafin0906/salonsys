import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const FALLBACK_BARBERS = [
  { id: '1', name: 'Hasan Ali', branch: 'Rajshahi', contact: '01711223344', dob: '1991-10-12', joining_date: '10 Jan 2023', role: 'Senior Stylist · Chair 01' },
  { id: '2', name: 'Rahim Khan', branch: 'Dhanmondi', contact: '01822334455', dob: '1990-02-18', joining_date: '05 Jan 2023', role: 'Master Barber · Chair 03' },
  { id: '3', name: 'Karim Uddin', branch: 'Banani', contact: '01933445566', dob: '1996-09-22', joining_date: '18 Aug 2024', role: 'Grooming Spec. · Chair 02' },
  { id: '4', name: 'Tariqul Islam', branch: 'Uttara', contact: '01744556677', dob: '1993-07-11', joining_date: '12 Nov 2023', role: 'Artisan Stylist · Chair 01' },
  { id: '5', name: 'Sohel Rana', branch: 'Rajshahi', contact: '01755667788', dob: '1995-04-14', joining_date: '01 Feb 2025', role: 'Master Barber · Chair 02' },
  { id: '6', name: 'Mehedi Hasan', branch: 'Dhanmondi', contact: '01866778899', dob: '1997-08-30', joining_date: '15 Jun 2024', role: 'Grooming Spec. · Chair 04' },
];

export default function BarbersDataView({ activeBranch = 'All Sanctuaries' }) {
  const [barbers, setBarbers] = useState(FALLBACK_BARBERS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBarber, setNewBarber] = useState({
    name: '',
    contact: '',
    dob: '',
    joining_date: new Date().toISOString().split('T')[0],
    branch: 'Rajshahi',
    role: 'Senior Stylist · Chair 01',
  });

  const loadBarbers = async () => {
    try {
      const data = await api.getBarbers(activeBranch);
      if (data && data.length) setBarbers(data);
    } catch (e) {
      console.warn('Barber API error, using local state:', e);
    }
  };

  useEffect(() => {
    loadBarbers();
  }, [activeBranch]);

  const handleAddBarber = async (e) => {
    e.preventDefault();
    if (!newBarber.name) return;

    setLoading(true);
    try {
      const created = await api.createBarber(newBarber);
      setBarbers([created, ...barbers]);
    } catch {
      setBarbers([{ id: String(Date.now()), ...newBarber }, ...barbers]);
    } finally {
      setLoading(false);
      setIsDrawerOpen(false);
      setNewBarber({
        name: '',
        contact: '',
        dob: '',
        joining_date: new Date().toISOString().split('T')[0],
        branch: 'Rajshahi',
        role: 'Senior Stylist · Chair 01',
      });
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-xl pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-space-xs">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Atelier Staff Registry
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Barber's Data</h1>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-5 py-2.5 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-lg text-label-lg uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-2 cursor-pointer font-medium self-start sm:self-auto shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Barber
        </button>
      </div>

      {/* Barbers Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
        {barbers.map((b) => (
          <div
            key={b.id || b.name}
            className="bg-surface-container-low border border-outline-variant/40 p-5 rounded-[2px] flex flex-col justify-between hover:bg-surface-container transition-all group"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest block mb-0.5">
                    Barber Profile
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                    {b.name}
                  </h2>
                </div>
                <span className="px-2 py-0.5 bg-surface-container-highest border border-outline-variant/30 text-primary text-label-sm font-label-sm rounded-[2px] uppercase tracking-wider font-mono">
                  {b.branch}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 mb-6 divide-y divide-outline-variant/20 font-body-sm">
                <div className="flex justify-between items-center pt-1">
                  <span className="text-on-surface-variant">Specialty</span>
                  <span className="text-on-surface font-medium">{b.role || 'Senior Stylist'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-on-surface-variant">Contact</span>
                  <span className="text-on-surface font-mono">{b.contact}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-on-surface-variant">Date of Birth</span>
                  <span className="text-on-surface font-mono">{b.dob || '—'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-on-surface-variant">Joining Date</span>
                  <span className="text-on-surface font-mono">{b.joining_date || '01 Jan 2024'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
              <button
                onClick={() => alert(`Viewing schedule for ${b.name}`)}
                className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer px-2 py-1 uppercase tracking-wider"
                type="button"
              >
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Barber Slide-out Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end animate-fade-in backdrop-blur-xs">
          <div className="w-full max-w-[440px] bg-surface-container-low h-full border-l border-outline-variant/40 flex flex-col justify-between shadow-2xl">
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30 bg-surface-container-lowest">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-0.5">
                    Staff Record
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wide">
                    Add New Barber
                  </h3>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface p-1 transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddBarber} id="addBarberForm" className="flex flex-col gap-5 p-6">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    className="h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 font-body-md text-body-md rounded-[2px] focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g. Tariqul Islam"
                    required
                    type="text"
                    value={newBarber.name}
                    onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Contact Number
                  </label>
                  <input
                    className="h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 font-body-md text-body-md rounded-[2px] focus:outline-none focus:border-primary transition-colors"
                    placeholder="017XXXXXXXX"
                    required
                    type="tel"
                    value={newBarber.contact}
                    onChange={(e) => setNewBarber({ ...newBarber, contact: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <input
                    className="h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body-md text-body-md rounded-[2px] focus:outline-none focus:border-primary transition-colors"
                    required
                    type="date"
                    value={newBarber.dob}
                    onChange={(e) => setNewBarber({ ...newBarber, dob: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Joining Date
                  </label>
                  <input
                    className="h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body-md text-body-md rounded-[2px] focus:outline-none focus:border-primary transition-colors"
                    required
                    type="date"
                    value={newBarber.joining_date}
                    onChange={(e) => setNewBarber({ ...newBarber, joining_date: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Branch Atelier
                  </label>
                  <select
                    className="h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body-md text-body-md rounded-[2px] focus:outline-none focus:border-primary transition-colors"
                    value={newBarber.branch}
                    onChange={(e) => setNewBarber({ ...newBarber, branch: e.target.value })}
                  >
                    <option value="Rajshahi">Rajshahi Atelier</option>
                    <option value="Dhanmondi">Dhanmondi Atelier</option>
                    <option value="Banani">Banani Atelier</option>
                    <option value="Uttara">Uttara Atelier</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-outline-variant/30 bg-surface-container-lowest flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-2.5 border border-outline-variant/40 hover:border-outline text-on-surface font-label-lg text-label-lg uppercase tracking-wider rounded transition-colors cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                form="addBarberForm"
                disabled={loading}
                className="px-6 py-2.5 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-lg text-label-lg rounded uppercase tracking-wider font-medium transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                type="submit"
              >
                {loading ? 'Saving...' : 'Save Barber'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
