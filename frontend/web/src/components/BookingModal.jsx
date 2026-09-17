import React, { useState } from 'react';
import { webApi } from '../services/api';

const MENU = [
  { name: 'Signature Atelier Cut & Beard Sculpt', price: 990 },
  { name: 'Executive Grooming Routine', price: 800 },
  { name: 'Essential Maintenance Clean', price: 500 },
  { name: 'Royal Hair Spa & Scalp Therapy', price: 1800 },
];

export default function BookingModal({ isOpen, onClose, initialPackage = null }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [branch, setBranch] = useState('Rajshahi Atelier');
  const [packageName, setPackageName] = useState(initialPackage?.name || MENU[0].name);
  const [date, setDate] = useState('Today 11:30 AM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const priceFor = (label) =>
    initialPackage?.name === label
      ? initialPackage.discount_price ?? initialPackage.actual_price
      : MENU.find((m) => m.name === label)?.price ?? 990;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    setLoading(true);
    setError('');
    const payload = {
      customer: name.trim(),
      contact: contact.trim(),
      package: packageName,
      price: priceFor(packageName),
      assigned_to: 'Assigned Master Stylist',
      branch: branch,
      scheduled_time: date,
      status: 'Confirmed',
    };

    try {
      const res = await webApi.bookAppointment(payload);
      setSuccess(res.id);
    } catch {
      setError('We could not reach the studio just now. Please call us to confirm your chair.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setSuccess(null);
    setError('');
    setName('');
    setContact('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-surface-container-low border border-outline-variant/40 rounded-[2px] p-6 md:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface p-1 transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        {success ? (
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <div>
              <span className="font-label-sm uppercase tracking-widest text-primary block mb-1">
                Reservation Confirmed
              </span>
              <h3 className="font-headline-md text-2xl text-on-surface">
                We Await Your Presence
              </h3>
              <p className="font-body-md text-on-surface-variant mt-2 max-w-sm">
                Your private chair care has been reserved at <span className="text-on-surface font-medium">{branch}</span>.
              </p>
              <div className="mt-4 p-3 bg-surface-container-lowest border border-outline-variant/30 rounded inline-block font-mono text-primary text-sm">
                Booking Reference: {success}
              </div>
            </div>

            <button
              onClick={handleDone}
              className="mt-4 px-8 py-3 bg-primary text-on-primary font-label-md uppercase tracking-wider rounded-[2px] cursor-pointer font-medium hover:bg-primary-fixed-dim transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="font-label-sm uppercase tracking-widest text-primary block mb-1">
                Private Chair Reservation
              </span>
              <h2 className="font-headline-md text-2xl text-on-surface">
                Reserve Atelier Session
              </h2>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Single-client unhurried grooming tailored to your schedule.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-error-container/20 border border-error/40 text-error rounded-[2px] font-body-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-body-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm uppercase tracking-wider text-outline text-[11px]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Iqbal"
                  className="h-10 px-3 bg-surface-container border border-outline-variant/40 rounded-[2px] text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm uppercase tracking-wider text-outline text-[11px]">
                  Contact Number / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  className="h-10 px-3 bg-surface-container border border-outline-variant/40 rounded-[2px] text-on-surface focus:outline-none focus:border-primary transition-colors font-body-md"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm uppercase tracking-wider text-outline text-[11px]">
                    Sanctuary Branch
                  </label>
                  <select
                    className="h-10 px-2.5 bg-surface-container border border-outline-variant/40 rounded-[2px] text-on-surface focus:outline-none focus:border-primary transition-colors"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    <option value="Rajshahi Atelier">Rajshahi Atelier</option>
                    <option value="Dhanmondi Atelier">Dhanmondi Atelier</option>
                    <option value="Banani Atelier">Banani Atelier</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm uppercase tracking-wider text-outline text-[11px]">
                    Preferred Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Today 04:00 PM"
                    className="h-10 px-3 bg-surface-container border border-outline-variant/40 rounded-[2px] text-on-surface focus:outline-none focus:border-primary transition-colors"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm uppercase tracking-wider text-outline text-[11px]">
                  Service Routine
                </label>
                <select
                  className="h-10 px-2.5 bg-surface-container border border-outline-variant/40 rounded-[2px] text-on-surface focus:outline-none focus:border-primary transition-colors"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                >
                  <option value="Signature Atelier Cut & Beard Sculpt">Signature Cut & Beard Sculpt — ৳990</option>
                  <option value="Executive Grooming Routine">Executive Grooming Routine — ৳800</option>
                  <option value="Essential Maintenance Clean">Essential Maintenance Clean — ৳500</option>
                  <option value="Royal Hair Spa & Scalp Therapy">Royal Hair Spa & Scalp Therapy — ৳1,800</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full h-11 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-md uppercase tracking-[0.14em] rounded-[2px] transition-all cursor-pointer font-medium shadow-sm disabled:opacity-50"
              >
                {loading ? 'Confirming...' : 'Confirm Reservation →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
