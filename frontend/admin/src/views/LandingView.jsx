import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BRANCHES = [
  {
    id: 'rajshahi',
    name: 'Rajshahi Atelier',
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
    name: 'Dhanmondi Atelier',
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
    name: 'Banani Atelier',
    city: 'Dhaka',
    status: 'Upcoming Reserve',
    address: 'Road 11, Block D, Banani, Dhaka 1213',
    contact: '+880 1933-445566',
    hours: 'Opening Soon (Spring 2026)',
    suites: '04 Reserve Suites',
    mapUrl: 'https://maps.google.com/maps?q=Road+11,Banani,Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
];

export default function LandingView() {
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);

  return (
    <div className="w-full bg-surface-container-lowest min-h-screen text-on-surface">
      {/* Studio Header with 3 Navbar Links: Home, The Studio, About */}
      <header className="sticky top-0 left-0 w-full z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/40">
        <div className="h-20 w-full px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-primary rounded-full inline-block"></span>
            <span className="font-headline-md text-headline-md tracking-widest uppercase text-on-surface select-none">
              ATELIER BARBER
            </span>
          </div>

            <nav className="flex items-center gap-8">
              <a
                href="#hero"
                className="font-label-lg uppercase tracking-wider text-primary border-b border-primary pb-1 transition-colors"
              >
                Home
              </a>
              <a
                href="#studio"
                className="font-label-lg uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors pb-1 border-b border-transparent"
              >
                The Studio
              </a>
              <a
                href="#about"
                className="font-label-lg uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors pb-1 border-b border-transparent"
              >
                About
              </a>
            </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative w-full overflow-hidden bg-surface-container-lowest">
        <div className="relative w-full min-h-[85vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover object-center filter grayscale-[30%] brightness-[0.55] contrast-[1.15]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN_d__TR69975EZglAA1YiHHqywxW9oMwnE699Qdelb-hsj9JN-vG9ytwnrQq-J7CQYIlw9uUhA1jNFeDTpTdXbbUniGopbPCbbcomqWg2n-brgZsmxG2CYErXvRb7LdNu2Nzbx25RzQomQ9pSdkm1sRJZyr_eMhCm46z0fKtaqTnGxXUmwyNWylGJbqe4j0FIySCPJKmxKwPJ990Efp5YZUGAp2QYriWbVFDMuYqz9n0yZuqRgsIFbw"
              alt="Atelier Master Barber"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-surface-container-lowest/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-surface-container-lowest/60"></div>
          </div>

          <div className="relative z-10 w-full px-6 md:px-12 py-16">
            <div className="max-w-2xl flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 h-[1px] bg-primary"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-primary">
                  Atelier Grooming Studio
                </span>
              </div>

              <h1 className="font-display-lg text-4xl md:text-6xl text-on-surface font-normal tracking-tight leading-tight">
                Crafted with<br />
                <span className="italic font-headline-md text-3xl md:text-5xl text-primary">precision.</span>
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                Modern grooming, classic attention to detail. An unhurried personal haircut experience tailored to the individual.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <a
                  href="#about"
                  className="px-7 py-3.5 bg-primary text-on-primary font-label-md text-label-md tracking-[0.12em] uppercase rounded-[2px] transition-colors hover:bg-primary-fixed-dim cursor-pointer font-medium"
                >
                  Locate A Sanctuary
                </a>
                <a
                  href="#studio"
                  className="px-7 py-3.5 bg-transparent border border-outline-variant/80 text-on-surface font-label-md text-label-md tracking-[0.12em] uppercase rounded-[2px] transition-colors hover:bg-surface-container-low"
                >
                  Our Philosophy
                </a>
              </div>

              <div className="mt-8 pt-4 border-t border-outline-variant/30 w-full max-w-xl flex flex-wrap items-center justify-between gap-y-2 text-outline text-label-sm font-label-sm tracking-[0.16em] uppercase">
                <span>45m Standard Session</span>
                <span className="text-outline-variant">•</span>
                <span>1 : 1 Private Chair Care</span>
                <span className="text-outline-variant">•</span>
                <span>02 Active Sanctuaries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Studio Philosophy */}
      <section id="studio" className="w-full bg-surface-container-lowest px-6 md:px-12 py-20 border-t border-outline-variant/40">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <span className="font-label-sm uppercase tracking-[0.2em] text-primary">01 / The Studio</span>
            <span className="font-label-sm uppercase tracking-widest text-outline">Architectural Cadence</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <h2 className="font-headline-lg text-3xl text-on-surface leading-snug">
                Quiet focus.<br />Unhurried cadence.
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Conceived as an architectural retreat from urban noise, Atelier operates on strict single-client reservations. We reject high-volume turnover in favor of undivided concentration, artisanal precision, and quiet hospitality.
              </p>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Every session begins with a cranial profile reading and structural consultation. Natural cowlicks, follicle direction, facial balance, and lifestyle maintenance are synthesized before steel meets hair.
              </p>

              <div className="mt-4 border-t border-outline-variant/30 pt-4 flex flex-col divide-y divide-outline-variant/20 font-body-sm">
                <div className="py-2 flex justify-between">
                  <span className="font-label-sm uppercase tracking-[0.14em] text-outline">Aesthetic Standard</span>
                  <span className="text-on-surface">Matte Concrete & Patinated Brass</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-label-sm uppercase tracking-[0.14em] text-outline">Chair Space</span>
                  <span className="text-on-surface">Individual Private Suites</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-label-sm uppercase tracking-[0.14em] text-outline">Consultation</span>
                  <span className="text-on-surface">Cranial Profile & Growth Analysis</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col gap-2">
              <div className="relative w-full aspect-[4/3] bg-surface-container border border-outline-variant/40 overflow-hidden rounded-[2px]">
                <img
                  className="w-full h-full object-cover filter contrast-[1.05]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA90wYx40ulL1Nkj7Li3FqyMzsz8eOuXyyBmFyQLtUkXDtP9M_rWJBDhtsHDIsPJhElUabetMMeoLljUz4--n1x1ciGgbgNyAIAMUnx80N0n-u0yAmgSEYeRrBOiIg3Xogp9bCPnvVg28cGuL-kCsDNsgE27HpEp155jVZo3ztLJi3Fqw3YcKKzvEFFpIlOKQD6L3g5iCmhER5AHRX6rg4PhZ-zjk686oLdNrnJe_30gORqh2kb68V-PA"
                  alt="Studio Private Suite"
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="font-label-sm uppercase tracking-widest text-outline">Studio Suite — Banani Chair One</span>
                <span className="font-label-sm uppercase tracking-widest text-primary">Private Reserve</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Google Maps Location Section */}
      <section id="about" className="w-full bg-surface-container-low px-6 md:px-12 py-20 border-t border-outline-variant/40">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <span className="font-label-sm uppercase tracking-[0.2em] text-primary">02 / About & Locations</span>
            <span className="font-label-sm uppercase tracking-widest text-outline">Regional Presence</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Branch Cards Selector */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <h2 className="font-headline-lg text-3xl text-on-surface">
                Our Sanctuaries
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                We currently welcome patrons across two active branches—Rajshahi and Dhaka (Dhanmondi)—with our third upcoming suite in Banani. Select a location below to view details and live map directions.
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
        <span>© 2026 Atelier Barber Studio. All Rights Reserved.</span>
        <div className="flex items-center gap-6">
          <a href="#hero" className="hover:text-on-surface transition-colors">
            Back to Top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
