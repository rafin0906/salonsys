import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function BusinessSummaryView({ activeBranch = 'All Sanctuaries' }) {
  const [data, setData] = useState({
    total_customers: 0,
    today_appointments: 0,
    today_revenue: 0,
    total_barbers: 0,
    revenue_formatted: '৳0',
    activity_chart: [],
    recent_appointments: [],
  });

  useEffect(() => {
    api.getDashboardSummary(activeBranch)
      .then((res) => {
        if (res) setData(res);
      })
      .catch((err) => console.warn('Using local summary stats:', err));
  }, [activeBranch]);

  // Plot the trailing 7 days on the 700x200 viewBox (baseline y=170, cap y=25).
  const chart = data.activity_chart?.length ? data.activity_chart : [];
  const points = chart.map((pt, i) => {
    const height = Math.max(2, Math.min(145, pt.bar_height ?? 25));
    return {
      ...pt,
      x: 50 + i * (600 / Math.max(1, chart.length - 1)),
      y: 170 - height,
      height,
    };
  });
  const linePath = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');

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

            {points.map((pt) => (
              <rect
                key={`bar-${pt.day}`}
                fill={pt.is_peak ? '#2a2a2a' : '#201f1f'}
                height={pt.height}
                rx="1"
                width="28"
                x={pt.x - 14}
                y={170 - pt.height}
              />
            ))}

            {points.length > 1 && (
              <>
                <path d={`${linePath} L ${points.at(-1).x} 170 L ${points[0].x} 170 Z`} fill="url(#primaryFade)" />
                <path d={linePath} fill="none" stroke="#827536" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </>
            )}

            {points.map((pt) => (
              <circle
                key={`dot-${pt.day}`}
                cx={pt.x}
                cy={pt.y}
                fill={pt.is_peak ? '#d7c77f' : '#131313'}
                r={pt.is_peak ? 4 : 3.5}
                stroke="#e5e2e1"
                strokeWidth="1.5"
              >
                <title>{`${pt.day}: ${pt.appointments} appointments`}</title>
              </circle>
            ))}
          </svg>

          <div className="grid grid-cols-7 w-full pt-space-xs text-center border-t border-outline-variant/30">
            {points.map((pt) => (
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
