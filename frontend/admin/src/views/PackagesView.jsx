import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const BLANK_PACKAGE = {
  package_number: '',
  name: '',
  actual_price: '',
  discount_price: '',
  services: '',
};

export default function PackagesView() {
  const [packages, setPackages] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(BLANK_PACKAGE);

  const loadPackages = async () => {
    try {
      const data = await api.getPackages();
      if (Array.isArray(data)) setPackages(data);
      setError('');
    } catch (e) {
      console.warn('Package API error:', e);
      setError('Could not reach the catalog service. No packages to display.');
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleAddPackage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const created = await api.createPackage({
        package_number: draft.package_number || String(packages.length + 1).padStart(2, '0'),
        name: draft.name.trim(),
        actual_price: Number(draft.actual_price),
        discount_price: Number(draft.discount_price),
        services: draft.services.split('\n').map((s) => s.trim()).filter(Boolean),
      });
      setPackages([...packages, created]);
      setIsDrawerOpen(false);
      setDraft(BLANK_PACKAGE);
    } catch {
      setError('Could not save the package. Check the backend connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, value) => setDraft({ ...draft, [key]: value });
  const inputClass =
    'h-10 px-3 bg-surface-container-lowest border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 font-body-md text-body-md rounded-[2px] focus:outline-none focus:border-primary transition-colors';
  const labelClass = 'font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider';

  return (
    <div className="flex flex-col w-full gap-space-xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-space-xs">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Menu Catalog
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Packages</h1>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-5 py-2.5 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-lg text-label-lg uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-2 cursor-pointer font-medium self-start sm:self-auto shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Package
        </button>
      </div>

      {error && (
        <div className="p-3 bg-error-container/20 border border-error/40 text-error rounded-[2px] font-body-sm text-body-sm">
          {error}
        </div>
      )}

      {/* Package Cards List */}
      <div className="flex flex-col gap-space-md">
        {packages.length === 0 && !error && (
          <div className="bg-surface-container-low border border-outline-variant/40 p-6 rounded-[2px] font-body-sm text-body-sm text-on-surface-variant">
            No packages in the catalog yet. Use New Package to add the first routine.
          </div>
        )}

        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-surface-container-low border border-outline-variant/40 p-6 rounded-[2px] flex flex-col gap-space-md hover:bg-surface-container/60 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="font-label-md text-label-md text-primary font-mono tracking-widest">
                  {pkg.package_number}
                </span>
                <span className="text-outline-variant">|</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wide">
                  PACKAGE {pkg.package_number} — {pkg.name}
                </h2>
              </div>
              {pkg.actual_price > 0 && (
                <span className="px-space-md py-1 border border-outline-variant/40 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider rounded-[2px] whitespace-nowrap">
                  {Math.round(100 - (pkg.discount_price / pkg.actual_price) * 100)}% off
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs border-t border-outline-variant/30">
              <div>
                <span className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-space-xs">
                  Included Services
                </span>
                <ul className="flex flex-col gap-1.5">
                  {(pkg.services || []).map((s, idx) => (
                    <li key={idx} className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary/70 inline-block"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-end gap-space-xs md:items-end">
                <div className="flex items-baseline gap-space-md">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                    Actual Price
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant line-through font-mono">
                    ৳{Number(pkg.actual_price).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline gap-space-md">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-medium">
                    Discount Price
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary font-mono font-medium">
                    ৳{Number(pkg.discount_price).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Package Slide-out Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end animate-fade-in backdrop-blur-xs">
          <div className="w-full max-w-[440px] bg-surface-container-low h-full border-l border-outline-variant/40 flex flex-col justify-between shadow-2xl">
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30 bg-surface-container-lowest">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-0.5">
                    Catalog Record
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wide">
                    Add New Package
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

              <form onSubmit={handleAddPackage} id="addPackageForm" className="flex flex-col gap-5 p-6">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Package Number</label>
                  <input
                    className={inputClass}
                    placeholder={String(packages.length + 1).padStart(2, '0')}
                    type="text"
                    value={draft.package_number}
                    onChange={(e) => field('package_number', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Package Name</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Royal Hair Spa & Scalp Therapy"
                    required
                    type="text"
                    value={draft.name}
                    onChange={(e) => field('name', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Actual Price</label>
                    <input
                      className={inputClass}
                      min="0"
                      placeholder="2400"
                      required
                      type="number"
                      value={draft.actual_price}
                      onChange={(e) => field('actual_price', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Discount Price</label>
                    <input
                      className={inputClass}
                      min="0"
                      placeholder="1800"
                      required
                      type="number"
                      value={draft.discount_price}
                      onChange={(e) => field('discount_price', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Included Services (one per line)</label>
                  <textarea
                    className={`${inputClass} h-32 py-2 resize-none`}
                    placeholder={'Artisanal Cranial Scrub\nOrganic Steam Hair Mask\nPrecision Shears Hair Cut'}
                    required
                    value={draft.services}
                    onChange={(e) => field('services', e.target.value)}
                  />
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
                form="addPackageForm"
                disabled={loading}
                className="px-6 py-2.5 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-lg text-label-lg rounded uppercase tracking-wider font-medium transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                type="submit"
              >
                {loading ? 'Saving...' : 'Save Package'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
