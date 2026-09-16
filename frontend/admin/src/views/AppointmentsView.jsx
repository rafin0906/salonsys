import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const FALLBACK_PACKAGES = [
  { name: 'Hair Cut & Beard Trim', actual_price: 1500, discount_price: 990 },
  { name: 'Executive Grooming', actual_price: 1200, discount_price: 800 },
  { name: 'Basic Hair Cut', actual_price: 750, discount_price: 500 },
  { name: 'Beard Treatment', actual_price: 850, discount_price: 650 },
  { name: 'Royal Hair Spa', actual_price: 2400, discount_price: 1800 },
];

const FALLBACK_BARBERS = [
  { name: 'Hasan Ali', branch: 'Rajshahi', role: 'Chair 01 · Senior Stylist' },
  { name: 'Rahim Khan', branch: 'Dhanmondi', role: 'Chair 03 · Master Barber' },
  { name: 'Karim Uddin', branch: 'Banani', role: 'Chair 02 · Grooming Spec.' },
];

export default function AppointmentsView({ activeBranch = 'All Sanctuaries' }) {
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState(FALLBACK_BARBERS);
  const [packages, setPackages] = useState(FALLBACK_PACKAGES);

  const [customerName, setCustomerName] = useState('Rahim Ahmed');
  const [customerContact, setCustomerContact] = useState('01712345678');
  const [selectedBarber, setSelectedBarber] = useState('Hasan Ali');
  const [selectedPackage, setSelectedPackage] = useState(FALLBACK_PACKAGES[0]);
  const [tableFilter, setTableFilter] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [apts, bList, pList] = await Promise.all([
        api.getAppointments(activeBranch),
        api.getBarbers(activeBranch),
        api.getPackages(),
      ]);
      if (apts && apts.length) setAppointments(apts);
      if (bList && bList.length) {
        setBarbers(bList);
        setSelectedBarber(bList[0].name);
      }
      if (pList && pList.length) {
        setPackages(pList);
        setSelectedPackage(pList[0]);
      }
    } catch (e) {
      console.warn('Backend offline or loading, using active session state:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeBranch]);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    const priceVal = selectedPackage.discount_price || selectedPackage.actual_price || 990;
    const barberObj = barbers.find((b) => b.name === selectedBarber) || barbers[0];

    const payload = {
      customer: customerName.trim() || 'Walk-in Guest',
      contact: customerContact.trim() || '01700000000',
      package: selectedPackage.name,
      price: priceVal,
      assigned_to: barberObj.name,
      branch: `${barberObj.branch} Atelier`,
      scheduled_time: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmed',
    };

    setLoading(true);
    try {
      const created = await api.createAppointment(payload);
      setAppointments([created, ...appointments]);
    } catch {
      // Local fallback if backend unavailable
      const localId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
      setAppointments([{ id: localId, ...payload }, ...appointments]);
    } finally {
      setLoading(false);
      setToastMessage(`Appointment created for ${payload.customer} with ${payload.assigned_to}`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleStatusUpdate = async (apt) => {
    const nextStatus =
      apt.status === 'Confirmed'
        ? 'In-Service'
        : apt.status === 'In-Service'
        ? 'Completed'
        : 'Confirmed';

    try {
      await api.updateAppointmentStatus(apt.id, nextStatus);
    } catch (e) {
      console.warn('Status update API error, updating locally:', e);
    }

    setAppointments(
      appointments.map((a) => (a.id === apt.id ? { ...a, status: nextStatus } : a))
    );
  };

  const filteredAppointments = appointments.filter((apt) => {
    const q = tableFilter.toLowerCase();
    return (
      (apt.customer && apt.customer.toLowerCase().includes(q)) ||
      (apt.package && apt.package.toLowerCase().includes(q)) ||
      (apt.assigned_to && apt.assigned_to.toLowerCase().includes(q)) ||
      (apt.id && apt.id.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-space-xl pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-on-primary-container px-5 py-3 rounded-[2px] border border-primary/40 shadow-xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span className="font-label-lg uppercase tracking-wider text-[12px]">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-space-xs">
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Appointments
        </h1>
        <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
          Atelier Scheduling & Session Records · {activeBranch}
        </span>
      </div>

      {/* New Appointment Create Card */}
      <section className="bg-surface-container-low border border-outline-variant/40 rounded p-space-lg flex flex-col gap-space-lg">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
          <span className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            New Appointment Create
          </span>
          <span className="font-label-sm text-label-sm font-mono text-on-surface-variant">
            Live Booking Engine
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Customer Lookup Panel */}
          <div className="lg:col-span-5 flex flex-col gap-space-md p-space-md bg-surface-container-lowest border border-outline-variant/40 rounded">
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase">
                Customer Name
              </label>
              <input
                className="w-full h-10 px-3 bg-surface-container text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:border-primary focus:outline-none transition-colors rounded-[2px]"
                placeholder="Search customer (e.g. Rahim Ahmed)"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-space-xs pt-space-xs border-t border-outline-variant/30">
              <div className="grid grid-cols-3 gap-1 py-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Contact:
                </span>
                <input
                  className="col-span-2 bg-transparent text-on-surface font-mono text-body-md border-b border-outline-variant/30 focus:border-primary focus:outline-none"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  placeholder="017XXXXXXXX"
                />
              </div>
              <div className="grid grid-cols-3 gap-1 py-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Sanctuary:
                </span>
                <span className="font-body-md text-body-md text-primary col-span-2">
                  {activeBranch}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 py-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Session Type:
                </span>
                <span className="font-body-md text-body-md text-on-surface col-span-2">
                  1 : 1 Private Reservation
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Barber Selection */}
          <div className="lg:col-span-7 flex flex-col gap-space-sm p-space-md bg-surface-container-lowest border border-outline-variant/40 rounded">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase">
              Assigned To (Available Chairs)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
              {barbers.slice(0, 3).map((barber) => {
                const isSelected = selectedBarber === barber.name;
                return (
                  <div
                    key={barber.name}
                    onClick={() => setSelectedBarber(barber.name)}
                    className={`barber-card cursor-pointer p-space-md rounded-[2px] transition-all ${
                      isSelected
                        ? 'bg-surface-container border border-primary text-on-surface shadow-sm'
                        : 'bg-surface-container/50 border border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:border-outline'
                    }`}
                  >
                    <div className="font-body-lg text-body-lg font-medium text-on-surface">
                      {barber.name}
                    </div>
                    <div className="font-label-sm text-label-sm text-primary uppercase mt-1">
                      {barber.branch} Atelier
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                      {barber.role || 'Senior Stylist'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Package & Action Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-end pt-space-sm border-t border-outline-variant/30">
          <div className="md:col-span-5 flex flex-col gap-space-xs">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="package-select">
              Package
            </label>
            <select
              id="package-select"
              className="w-full h-10 px-3 bg-surface-container text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:border-primary focus:outline-none rounded-[2px]"
              value={selectedPackage.name}
              onChange={(e) => {
                const found = packages.find((p) => p.name === e.target.value);
                if (found) setSelectedPackage(found);
              }}
            >
              {packages.map((pkg) => (
                <option key={pkg.name} value={pkg.name}>
                  {pkg.name} — ৳{(pkg.discount_price || pkg.actual_price || 990).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex flex-col gap-space-xs">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase">
              Price
            </label>
            <input
              className="w-full h-10 px-3 bg-surface-container text-primary font-mono text-body-md border border-outline-variant/40 cursor-not-allowed focus:outline-none font-medium rounded-[2px]"
              readOnly
              type="text"
              value={`৳${(selectedPackage.discount_price || selectedPackage.actual_price || 990).toLocaleString()}`}
            />
          </div>

          <div className="md:col-span-4">
            <button
              onClick={handleCreateAppointment}
              disabled={loading}
              className="w-full h-10 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-lg text-label-lg uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer rounded-[2px] font-medium disabled:opacity-50"
              type="button"
            >
              {loading ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </div>
      </section>

      {/* Appointment History Table */}
      <section className="bg-surface-container-low border border-outline-variant/40 rounded p-space-lg flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-outline-variant/30 pb-space-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              All Appointment History
            </h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Real-time Database Records ({appointments.length})
            </span>
          </div>
          <div className="w-full sm:w-72">
            <input
              className="w-full h-10 px-3 bg-surface-container text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:border-primary focus:outline-none placeholder:text-on-surface-variant/60 rounded-[2px]"
              placeholder="Search records..."
              type="text"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest">
                <th className="py-space-sm px-space-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-space-sm px-space-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Package
                </th>
                <th className="py-space-sm px-space-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Barber / Suite
                </th>
                <th className="py-space-sm px-space-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Schedule
                </th>
                <th className="py-space-sm px-space-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Price
                </th>
                <th className="py-space-sm px-space-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="py-space-sm px-space-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-md">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant font-label-md uppercase">
                    No matching appointment records found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-surface-container transition-colors">
                    <td className="py-3 px-space-md">
                      <div className="font-medium text-on-surface">{apt.customer}</div>
                      <div className="font-mono text-body-sm text-on-surface-variant">{apt.contact || '—'}</div>
                    </td>
                    <td className="py-3 px-space-md text-on-surface">{apt.package}</td>
                    <td className="py-3 px-space-md">
                      <div className="text-on-surface font-medium">{apt.assigned_to}</div>
                      <div className="font-label-sm text-[10px] text-primary uppercase">{apt.branch}</div>
                    </td>
                    <td className="py-3 px-space-md font-mono text-body-sm text-on-surface-variant">
                      {apt.scheduled_time || 'Today'}
                    </td>
                    <td className="py-3 px-space-md font-mono font-medium text-primary">
                      ৳{Number(apt.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-space-md">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-[2px] font-label-sm uppercase tracking-wider text-[10px] border ${
                          apt.status === 'In-Service'
                            ? 'bg-tertiary-container/20 text-tertiary border-tertiary/40'
                            : apt.status === 'Confirmed'
                            ? 'bg-primary-container/20 text-primary border-primary/40'
                            : 'bg-surface-container-highest text-secondary border-outline-variant/40'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-right">
                      <button
                        onClick={() => handleStatusUpdate(apt)}
                        className="text-primary hover:text-on-surface font-label-md uppercase tracking-wider px-2 py-1 transition-colors cursor-pointer"
                        type="button"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
