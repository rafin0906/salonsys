import React, { useState } from 'react';

const INITIAL_PACKAGES = [
  {
    num: '01',
    title: 'Signature Atelier Cut & Beard Sculpt',
    actualPrice: 1500,
    discountPrice: 990,
    services: ['Bespoke Scissor Cut', 'Beard Trim & Hot Towel', 'Head Acupressure Massage', 'Cologne & Tonic Finish'],
    sessionsBooked: 84,
  },
  {
    num: '02',
    title: 'Executive Grooming Routine',
    actualPrice: 1200,
    discountPrice: 800,
    services: ['Hair Cut & Styling', 'Deep Cleansing Hair Wash', 'Invigorating Mini-Facial', 'Botanical Beard Oil'],
    sessionsBooked: 62,
  },
  {
    num: '03',
    title: 'Essential Maintenance Clean',
    actualPrice: 750,
    discountPrice: 500,
    services: ['Basic Precision Hair Cut', 'Straight Razor Neck Clean', 'Classic Cologne Splash'],
    sessionsBooked: 110,
  },
  {
    num: '04',
    title: 'Royal Hair Spa & Scalp Therapy',
    actualPrice: 2400,
    discountPrice: 1800,
    services: ['Artisanal Cranial Scrub', 'Organic Steam Hair Mask', 'Precision Shears Hair Cut', 'Neck & Shoulder Release'],
    sessionsBooked: 45,
  },
];

export default function PackagesView() {
  const [packages, setPackages] = useState(INITIAL_PACKAGES);

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
          onClick={() => alert('Add Package drawer')}
          className="px-5 py-2.5 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-lg text-label-lg uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-2 cursor-pointer font-medium self-start sm:self-auto shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Package
        </button>
      </div>

      {/* Package Cards List */}
      <div className="flex flex-col gap-space-md">
        {packages.map((pkg) => (
          <div
            key={pkg.num}
            className="bg-surface-container-low border border-outline-variant/40 p-6 rounded-[2px] flex flex-col gap-space-md hover:bg-surface-container/60 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="font-label-md text-label-md text-primary font-mono tracking-widest">
                  {pkg.num}
                </span>
                <span className="text-outline-variant">|</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-wide">
                  PACKAGE {pkg.num} — {pkg.title}
                </h2>
              </div>
              <button
                onClick={() => alert(`Editing package ${pkg.num}`)}
                className="px-space-md py-1 border border-outline-variant/40 hover:border-outline text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm uppercase tracking-wider transition-colors cursor-pointer rounded-[2px]"
                type="button"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs border-t border-outline-variant/30">
              <div>
                <span className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-space-xs">
                  Included Services
                </span>
                <ul className="flex flex-col gap-1.5">
                  {pkg.services.map((s, idx) => (
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
                    ৳{pkg.actualPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-baseline gap-space-md">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-medium">
                    Discount Price
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary font-mono font-medium">
                    ৳{pkg.discountPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
