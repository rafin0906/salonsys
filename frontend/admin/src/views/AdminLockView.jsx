import React, { useState } from 'react';
import { api } from '../services/api';

export default function AdminLockView({ onUnlock }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Try backend authentication
      await api.verifyPasscode(passcode);
      sessionStorage.setItem('atelier_admin_auth', 'true');
      onUnlock();
    } catch {
      // Fallback check against env or default passcode
      const expected = import.meta.env.VITE_ADMIN_PASSCODE || 'atelier2026';
      if (passcode === expected) {
        sessionStorage.setItem('atelier_admin_auth', 'true');
        onUnlock();
      } else {
        setError('Incorrect security passcode. Access denied.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-6 text-on-surface">
      <div className="w-full max-w-md bg-surface-container-low border border-outline-variant/40 p-8 rounded-[2px] shadow-2xl flex flex-col items-center text-center">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/assets/double-a-logo.png"
            alt="Double A Hair Studio Logo"
            className="w-24 h-auto object-contain mb-2 filter drop-shadow-md"
          />
          <span className="font-serif italic text-primary text-xs tracking-wider">
            "we'll be there for you"
          </span>
        </div>

        <span className="font-label-sm uppercase tracking-[0.2em] text-primary block mb-1">
          Operational Security
        </span>
        <h1 className="font-headline-md text-2xl text-on-surface mb-2 font-normal">
          Double A Hair Studio — Admin Desk
        </h1>
        <p className="font-body-sm text-on-surface-variant mb-6 leading-relaxed">
          Enter master security passcode to access salon appointments, financial ledgers, and barber roster.
        </p>

        {error && (
          <div className="w-full mb-4 p-3 bg-error-container/20 border border-error/40 text-error rounded-[2px] text-body-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-label-sm text-[11px] uppercase tracking-wider text-outline">
              Master Passcode
            </label>
            <input
              type="password"
              placeholder="Enter security passcode"
              className="w-full h-11 px-3.5 bg-surface-container text-on-surface font-body-md border border-outline-variant/50 focus:border-primary focus:outline-none rounded-[2px] transition-colors"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-md uppercase tracking-[0.14em] rounded-[2px] transition-all cursor-pointer font-medium mt-2 shadow-sm disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Unlock Admin Desk →'}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-outline-variant/30 w-full flex items-center justify-between text-body-sm text-outline">
          <span className="font-label-sm uppercase tracking-wider text-[11px] text-outline">
            Double A Hair Studio
          </span>
          <span className="font-label-sm uppercase text-[10px] text-primary">
            Protected Admin Session
          </span>
        </div>
      </div>
    </div>
  );
}
