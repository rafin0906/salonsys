import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BookingModal from './components/BookingModal';
import { webApi } from './services/api';

const BRANCHES = [
  {
    id: 'rajshahi',
    name: 'Double A Hair Studio — Rajshahi',
    city: 'Rajshahi',
    status: 'Flagship Sanctuary',
    address: 'Alupatti Luxury Quarter, Ghoramara, Rajshahi 6000',
    contact: '+880 1711-223344',
    hours: '09:30 AM – 08:30 PM (Daily)',
    suites: '04 Private Suites',
    mapUrl: 'https://maps.google.com/maps?q=Alupatti,Rajshahi,Bangladesh&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
  {
    id: 'dhanmondi',
    name: 'Double A Hair Studio — Dhanmondi',
    city: 'Dhaka',
    status: 'Prime Atelier',
    address: 'Road 8/A, Satmasjid Road, Dhanmondi, Dhaka 1209',
    contact: '+880 1822-334455',
    hours: '10:00 AM – 09:00 PM (Daily)',
    suites: '03 Private Suites',
    mapUrl: 'https://maps.google.com/maps?q=Satmasjid+Road,Dhanmondi,Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
  {
    id: 'banani',
    name: 'Double A Hair Studio — Banani',
    city: 'Dhaka',
    status: 'Upcoming Reserve',
    address: 'Road 11, Block D, Banani, Dhaka 1213',
    contact: '+880 1933-445566',
    hours: 'Opening Soon (Spring 2026)',
    suites: '04 Reserve Suites',
    mapUrl: 'https://maps.google.com/maps?q=Road+11,Banani,Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
];

export default function App() {
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    webApi.getPackages().then((data) => {
      if (data && data.length) setPackages(data);
    });
  }, []);

  const handleBookPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsBookingOpen(true);
  };

  return (
    <div className="w-full bg-surface-container-lowest min-h-screen text-on-surface selection:bg-primary selection:text-on-primary">
      {/* Client Header Navbar */}
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Hero Section */}
      <section id="hero" className="relative w-full overflow-hidden bg-surface-container-lowest">
        <div className="relative w-full min-h-[88vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1]"
              src="/assets/stylist-session.jpg"
              alt="Double A Hair Studio Master Stylist"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/85 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-surface-container-lowest/60"></div>
          </div>

          <div className="relative z-10 w-full px-6 md:px-12 py-16">
            <div className="max-w-2xl flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-block w-8 h-[1px] bg-primary"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-primary">
                  Double A Hair Studio
                </span>
              </div>

              <h1 className="font-display-lg text-4xl md:text-6xl text-on-surface font-normal tracking-tight leading-tight">
                Crafted with<br />
                <span className="italic font-headline-md text-3xl md:text-5xl text-primary">
                  precision & care.
                </span>
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                Modern grooming, classic attention to detail. An unhurried personal haircut experience tailored to the individual.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span className="font-serif italic text-primary text-base">
                  "we'll be there for you"
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-8 py-3.5 bg-primary text-on-primary font-label-md text-label-md tracking-[0.14em] uppercase rounded-[2px] transition-all hover:bg-primary-fixed-dim cursor-pointer font-medium shadow-lg"
                >
                  Reserve Session
                </button>
                <a
                  href="#studio"
                  className="px-7 py-3.5 bg-transparent border border-outline-variant/80 text-on-surface font-label-md text-label-md tracking-[0.12em] uppercase rounded-[2px] transition-colors hover:bg-surface-container-low"
                >
                  Explore Studio
                </a>
              </div>

              <div className="mt-8 pt-4 border-t border-outline-variant/30 w-full max-w-xl flex flex-wrap items-center justify-between gap-y-2 text-outline text-label-sm font-label-sm tracking-[0.16em] uppercase">
                <span>45m Standard Session</span>
                <span className="text-outline-variant">•</span>
                <span>1 : 1 Private Chair Care</span>
                <span className="text-outline-variant">•</span>
                <span>Calm Luxury Sanctuary</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 01 / The Studio */}
      <section id="studio" className="w-full bg-surface-container-lowest px-6 md:px-12 py-20 border-t border-outline-variant/40">
        <div className="flex flex-col gap-12">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <span className="font-label-sm uppercase tracking-[0.2em] text-primary">01 / The Studio</span>
            <span className="font-label-sm uppercase tracking-widest text-outline">Architectural Cadence</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 flex flex-col gap-5">
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface leading-snug">
                Quiet focus.<br />Bespoke luxury experience.
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Conceived as an architectural retreat from urban noise, Double A Hair Studio operates on strict reservations. We reject high-volume turnover in favor of undivided concentration, artisanal precision, and quiet hospitality.
              </p>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Our bespoke suites feature gold-veined marble workstations, custom oval LED grooming mirrors, and tailored ergonomic chairs to give you an unhurried, royal retreat.
              </p>

              <div className="mt-2 border-t border-outline-variant/30 pt-4 flex flex-col divide-y divide-outline-variant/20 font-body-sm">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="font-label-sm uppercase tracking-[0.14em] text-outline">Aesthetic Standard</span>
                  <span className="text-on-surface font-medium">Italian Calacatta Marble & Patinated Gold</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="font-label-sm uppercase tracking-[0.14em] text-outline">Grooming Mirrors</span>
                  <span className="text-on-surface font-medium">Illuminated Halo LED with Double A Monogram</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="font-label-sm uppercase tracking-[0.14em] text-outline">Consultation</span>
                  <span className="text-on-surface font-medium">Cranial Profile & Beard Growth Analysis</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col gap-2">
              <div className="relative w-full aspect-[4/3] bg-surface-container border border-outline-variant/40 overflow-hidden rounded-[2px] shadow-2xl group">
                <img
                  className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05] group-hover:scale-102 transition-transform duration-700"
                  src="/assets/studio-interior.jpg"
                  alt="Double A Hair Studio Interior Suite"
                />
              </div>
              <div className="flex justify-between items-center px-1 pt-1">
                <span className="font-label-sm uppercase tracking-widest text-outline">
                  Double A Hair Studio — Main Lounge
                </span>
                <span className="font-label-sm uppercase tracking-widest text-primary">
                  Sanctuary Suite
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Gallery & Craftsmanship */}
      <section className="w-full bg-surface-container-low px-6 md:px-12 py-16 border-t border-outline-variant/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden border border-outline-variant/40 shadow-lg">
            <img
              src="/assets/stylist-session.jpg"
              alt="Artisan Styling Session"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div>
                <span className="font-label-sm text-primary uppercase tracking-widest block">Master Stylist</span>
                <h4 className="font-headline-sm text-white text-lg">Single-Client Precision Grooming</h4>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-4 md:p-8">
            <span className="font-label-sm uppercase tracking-[0.2em] text-primary">Atelier Artistry</span>
            <h3 className="font-headline-lg text-3xl text-on-surface">
              Where Steel Meets Hair with Absolute Finesse
            </h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Every haircut is treated as an architectural sculpture. We respect your natural follicle pattern, facial angles, and grooming routine to create timeless silhouettes.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <img src="/assets/double-a-logo.png" alt="Brand Logo" className="h-14 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="font-headline-sm text-sm uppercase text-on-surface font-medium">Double A Guarantee</span>
                <span className="font-serif italic text-primary text-xs">"we'll be there for you"</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 / Curated Service Packages */}
      <section id="packages" className="w-full bg-surface-container-lowest px-6 md:px-12 py-20 border-t border-outline-variant/40">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <span className="font-label-sm uppercase tracking-[0.2em] text-primary">02 / Curated Menu</span>
            <span className="font-label-sm uppercase tracking-widest text-outline">Service Packages</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id || pkg.name}
                className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-[2px] flex flex-col justify-between gap-6 hover:border-primary/50 transition-all group"
              >
                <div>
                  <div className="flex items-baseline justify-between pb-3 border-b border-outline-variant/20">
                    <span className="font-label-sm text-primary uppercase font-mono tracking-widest">
                      PACKAGE {pkg.package_number || '01'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-outline line-through text-body-sm font-mono">
                        ৳{(pkg.actual_price || 1500).toLocaleString()}
                      </span>
                      <span className="font-headline-sm text-xl text-primary font-mono font-medium">
                        ৳{(pkg.discount_price || 990).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-headline-sm text-xl text-on-surface mt-3 group-hover:text-primary transition-colors">
                    {pkg.name}
                  </h3>

                  <ul className="mt-4 flex flex-col gap-2">
                    {(pkg.services || []).map((s, idx) => (
                      <li key={idx} className="font-body-sm text-on-surface-variant flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary/70 inline-block"></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleBookPackage(pkg)}
                  className="w-full py-2.5 bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface border border-outline-variant/40 hover:border-primary font-label-sm uppercase tracking-[0.14em] rounded-[2px] transition-all cursor-pointer font-medium"
                >
                  Reserve Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 / About & Google Maps Branch Sanctuaries */}
      <section id="about" className="w-full bg-surface-container-low px-6 md:px-12 py-20 border-t border-outline-variant/40">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <span className="font-label-sm uppercase tracking-[0.2em] text-primary">03 / About & Locations</span>
            <span className="font-label-sm uppercase tracking-widest text-outline">Regional Sanctuaries</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Branch Selector */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <h2 className="font-headline-lg text-3xl text-on-surface">
                Our Sanctuaries
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Double A Hair Studio welcomes patrons across Rajshahi and Dhaka (Dhanmondi), with our upcoming reserve suite in Banani. Select a location below to view details and live map directions.
              </p>

              <div className="flex flex-col gap-3 mt-2">
                {BRANCHES.map((b) => {
                  const isSelected = selectedBranch.id === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBranch(b)}
                      className={`p-5 rounded-[2px] border cursor-pointer transition-all flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-surface-container-lowest border-primary shadow-md'
                          : 'bg-surface-container-lowest/60 border-outline-variant/30 hover:border-outline hover:bg-surface-container-lowest'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-headline-sm text-base text-on-surface font-medium">
                          {b.name}
                        </span>
                        <span
                          className={`font-label-sm text-[10px] uppercase px-2 py-0.5 rounded-[2px] border ${
                            isSelected
                              ? 'bg-primary-container text-on-primary-container border-primary/50'
                              : 'bg-surface-container text-on-surface-variant border-outline-variant/40'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <p className="font-body-sm text-on-surface-variant">{b.address}</p>
                      <div className="flex items-center justify-between text-body-sm pt-2 border-t border-outline-variant/20 text-outline">
                        <span>{b.suites}</span>
                        <span className="font-mono text-primary text-[12px]">{b.hours}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Interactive Google Maps Frame */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="relative w-full aspect-[16/10] bg-surface-container-lowest border border-outline-variant/40 rounded-[2px] overflow-hidden">
                <iframe
                  title={`Google Maps - ${selectedBranch.name}`}
                  src={selectedBranch.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(95%)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-[2px] flex flex-wrap items-center justify-between gap-3 text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  <span className="text-on-surface font-medium">{selectedBranch.address}</span>
                </div>
                <div className="flex items-center gap-2 text-primary font-mono">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>{selectedBranch.contact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-outline text-label-sm uppercase tracking-wider">
        <div className="flex items-center gap-3">
          <img src="/assets/double-a-logo.png" alt="Logo" className="h-6 w-auto opacity-70" />
          <span>© 2026 Double A Hair Studio. "we'll be there for you"</span>
        </div>
        <a href="#hero" className="hover:text-primary transition-colors">
          Back to Top ↑
        </a>
      </footer>

      {/* Live Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPackage={selectedPackage}
      />
    </div>
  );
}
