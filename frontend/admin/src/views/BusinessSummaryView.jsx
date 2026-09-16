import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function BusinessSummaryView({ activeBranch = 'All Sanctuaries' }) {
  const [data, setData] = useState({
    total_customers: 126,
    today_appointments: 23,
    today_revenue: 8450,
    total_barbers: 6,
    revenue_formatted: '৳8,450',
    activity_chart: [
      { day: 'Mon', appointments: 14, bar_height: 90 },
      { day: 'Tue', appointments: 18, bar_height: 105 },
      { day: 'Wed', appointments: 12, bar_height: 75 },
      { day: 'Thu', appointments: 22, bar_height: 120 },
      { day: 'Fri', appointments: 25, bar_height: 130 },
      { day: 'Sat', appointments: 31, bar_height: 145, is_peak: true },
      { day: 'Sun', appointments: 27, bar_height: 135 },
    ],
    recent_appointments: [],
  });

  useEffect(() => {
    api.getDashboardSummary(activeBranch)
      .then((res) => {
        if (res) setData(res);
      })
      .catch((err) => console.warn('Using local summary stats:', err));
  }, [activeBranch]);

  const metrics = [
    { label: 'Total Customers', value: data.total_customers, sub: 'All-time', highlight: true },
    { label: "Today's Appointments", value: data.today_appointments, sub: 'Scheduled', highlight: false },
    { label: "Today's Revenue", value: data.revenue_formatted || `৳${data.today_revenue}`, sub: 'Gross', highlight: true },
    { label: 'Total Barbers', value: data.total_barbers, sub: 'Active Chairs', highlight: false },
  ];

  return (
    <div className="flex flex-col w-full gap-space-xl pb-16">
      {/* Page Header Area */}
      <div className="flex flex-col gap-space-xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
          Executive Atelier Overview
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Business Summary
          </h1>
          <span className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
            Fiscal Cycle · {activeBranch}
          </span>
        </div>
      </div>

      {/* Section 1: Continuous Horizontal Summary Block */}
      <section className="w-full bg-surface-container-low border border-outline-variant/40 rounded">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
          {metrics.map((m) => (
            <div key={m.label} className="p-space-lg flex flex-col justify-center gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                {m.label}
              </span>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-md text-headline-md text-on-surface font-normal">
                  {m.value}
                </span>
                <span className={`font-label-sm text-label-sm ${m.highlight ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {m.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Clean Minimalist Activity Graph */}
      <section className="w-full bg-surface-container-low border border-outline-variant/40 rounded p-space-lg flex flex-col gap-space-lg">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Customer / Appointment Activity
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              7-day volume breakdown across operating studio hours
            </p>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-0.5 bg-primary inline-block"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Appointments
              </span>
            </div>
          </div>
        </div>

        {/* Restrained SVG Line & Bar Composite Visualization */}
        <div className="w-full h-64 relative flex flex-col justify-end pt-4">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
            <defs>
              <linearGradient id="primaryFade" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#827536" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#827536" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <line stroke="#262626" strokeDasharray="2 4" strokeWidth="1" x1="0" x2="700" y1="20" y2="20" />
            <line stroke="#262626" strokeDasharray="2 4" strokeWidth="1" x1="0" x2="700" y1="70" y2="70" />
            <line stroke="#262626" strokeDasharray="2 4" strokeWidth="1" x1="0" x2="700" y1="120" y2="120" />
            <line stroke="#353534" strokeWidth="1" x1="0" x2="700" y1="170" y2="170" />

            <rect fill="#201f1f" height="90" rx="1" width="28" x="36" y="80" />
            <rect fill="#201f1f" height="105" rx="1" width="28" x="136" y="65" />
            <rect fill="#201f1f" height="75" rx="1" width="28" x="236" y="95" />
            <rect fill="#201f1f" height="120" rx="1" width="28" x="336" y="50" />
            <rect fill="#201f1f" height="130" rx="1" width="28" x="436" y="40" />
            <rect fill="#2a2a2a" height="145" rx="1" width="28" x="536" y="25" />
            <rect fill="#2a2a2a" height="135" rx="1" width="28" x="636" y="35" />

            <path d="M 50 85 L 150 70 L 250 100 L 350 55 L 450 45 L 550 30 L 650 40 L 650 170 L 50 170 Z" fill="url(#primaryFade)" />
            <path d="M 50 85 L 150 70 L 250 100 L 350 55 L 450 45 L 550 30 L 650 40" fill="none" stroke="#827536" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />

            <circle cx="50" cy="85" fill="#131313" r="3.5" stroke="#e5e2e1" strokeWidth="1.5" />
            <circle cx="150" cy="70" fill="#131313" r="3.5" stroke="#e5e2e1" strokeWidth="1.5" />
            <circle cx="250" cy="100" fill="#131313" r="3.5" stroke="#e5e2e1" strokeWidth="1.5" />
            <circle cx="350" cy="55" fill="#131313" r="3.5" stroke="#e5e2e1" strokeWidth="1.5" />
            <circle cx="450" cy="45" fill="#131313" r="3.5" stroke="#e5e2e1" strokeWidth="1.5" />
            <circle cx="550" cy="30" fill="#d7c77f" r="4" stroke="#e5e2e1" strokeWidth="1.5" />
            <circle cx="650" cy="40" fill="#131313" r="3.5" stroke="#e5e2e1" strokeWidth="1.5" />
          </svg>

          <div className="grid grid-cols-7 w-full pt-space-xs text-center border-t border-outline-variant/30">
            {data.activity_chart.map((pt) => (
              <span key={pt.day} className={`font-label-sm text-label-sm ${pt.is_peak ? 'text-primary font-medium' : 'text-on-surface-variant'}`}>
                {pt.day}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Recent Appointments Table */}
      <section className="w-full bg-surface-container-low border border-outline-variant/40 rounded flex flex-col">
        <div className="p-space-lg border-b border-outline-variant/30 flex justify-between items-baseline">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Recent Appointments</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
              Live database records
            </p>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-mono">
            Latest Active Sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body-md">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest">
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Customer</th>
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Package</th>
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Barber</th>
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Time</th>
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Price</th>
                <th className="py-space-sm px-space-lg font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {(data.recent_appointments || []).map((r, i) => (
                <tr key={i} className="hover:bg-surface-container transition-colors">
                  <td className="py-space-md px-space-lg font-medium text-on-surface">{r.customer}</td>
                  <td className="py-space-md px-space-lg text-on-surface">{r.package}</td>
                  <td className="py-space-md px-space-lg text-on-surface">{r.assigned_to}</td>
                  <td className="py-space-md px-space-lg font-mono text-body-sm text-on-surface-variant">{r.scheduled_time || 'Today'}</td>
                  <td className="py-space-md px-space-lg font-mono font-medium text-primary">৳{Number(r.price).toLocaleString()}</td>
                  <td className="py-space-md px-space-lg text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-[2px] font-label-sm uppercase tracking-wider text-[10px] border ${
                      r.status === 'In-Service'
                        ? 'bg-tertiary-container/20 text-tertiary border-tertiary/40'
                        : r.status === 'Confirmed'
                        ? 'bg-primary-container/20 text-primary border-primary/40'
                        : 'bg-surface-container-highest text-secondary border-outline-variant/40'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
