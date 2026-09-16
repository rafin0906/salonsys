import React from 'react';

export default function Navbar({ onOpenBooking }) {
  return (
    <header className="sticky top-0 left-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/40">
      <div className="h-20 w-full px-6 md:px-12 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <img
            src="/assets/double-a-logo.png"
            alt="Double A Hair Studio Logo"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-headline-md text-lg tracking-widest uppercase text-on-surface select-none leading-tight font-medium">
              DOUBLE A
            </span>
            <span className="font-label-sm text-[9px] tracking-[0.2em] uppercase text-primary select-none">
              Hair Studio
            </span>
          </div>
        </a>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#hero"
              className="font-label-lg uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors pb-1 border-b border-transparent hover:border-primary"
            >
              Home
            </a>
            <a
              href="#studio"
              className="font-label-lg uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors pb-1 border-b border-transparent hover:border-primary"
            >
              The Studio
            </a>
            <a
              href="#packages"
              className="font-label-lg uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors pb-1 border-b border-transparent hover:border-primary"
            >
              Packages
            </a>
            <a
              href="#about"
              className="font-label-lg uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors pb-1 border-b border-transparent hover:border-primary"
            >
              About
            </a>
          </nav>

          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-sm uppercase tracking-[0.14em] rounded-[2px] transition-all cursor-pointer font-medium shadow-sm flex items-center gap-2"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Reserve Chair
          </button>
        </div>
      </div>
    </header>
  );
}
