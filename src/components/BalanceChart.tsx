import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useBank } from '../context/BankContext';

export const BalanceChart: React.FC = () => {
  const { formatMoney, transactions } = useBank();
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const timeframeDays = { '7D': 7, '30D': 30, '90D': 90, '1Y': 365 };
  const cutoff = Date.now() - timeframeDays[timeframe] * 24 * 60 * 60 * 1000;
  const points = transactions
    .filter((transaction) => {
      const timestamp = Date.parse(transaction.date);
      return Number.isFinite(timestamp) && timestamp >= cutoff;
    })
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    .map((transaction) => ({
      label: new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      balance: Number(transaction.balanceAfter) || 0,
      inflow: transaction.type === 'credit' ? Number(transaction.amount) || 0 : 0,
      outflow: transaction.type === 'debit' ? Number(transaction.amount) || 0 : 0,
    }));

  if (points.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-sm text-white">
        <h3 className="text-sm font-bold">Savings Balance Trajectory (INR)</h3>
        <p className="text-xs text-slate-400 mt-2">No balance history available.</p>
      </div>
    );
  }

  const minBalance = Math.min(...points.map((p) => p.balance)) * 0.95;
  const maxBalance = Math.max(...points.map((p) => p.balance)) * 1.05;
  const range = maxBalance - minBalance || 1;

  const width = 600;
  const height = 180;
  const padding = 25;

  const getCoordinates = (index: number, val: number) => {
    const x = padding + (index / (points.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - minBalance) / range) * (height - 2 * padding);
    return { x, y };
  };

  const polylinePoints = points
    .map((p, i) => {
      const { x, y } = getCoordinates(i, p.balance);
      return `${x},${y}`;
    })
    .join(' ');

  const currentHovered = hoveredPointIndex !== null ? points[hoveredPointIndex] : points[points.length - 1];

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-sm text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-white">
              Savings Balance Trajectory (INR)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Closing ledger balance trend over time
          </p>
        </div>

        {/* Timeframe selector buttons */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800 self-start sm:self-auto">
          {(['7D', '30D', '90D', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setHoveredPointIndex(null);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Hover Info Header */}
      <div className="my-4 flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            {currentHovered.label} Closing Balance
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-0.5">
            {formatMoney(currentHovered.balance)}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span>Inflows: +{formatMoney(currentHovered.inflow)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
            <span>Outflows: -{formatMoney(currentHovered.outflow)}</span>
          </div>
        </div>
      </div>

      {/* SVG Simple Minimalist Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-40 sm:h-48 overflow-visible"
        >
          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = padding + ratio * (height - 2 * padding);
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeOpacity="0.4"
              />
            );
          })}

          {/* Line stroke */}
          <polyline
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Data Points */}
          {points.map((p, i) => {
            const { x, y } = getCoordinates(i, p.balance);
            const isHovered = hoveredPointIndex === i;
            return (
              <g key={i} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="14"
                  fill="transparent"
                  onMouseEnter={() => setHoveredPointIndex(i)}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? '5' : '3.5'}
                  fill="#0f172a"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between px-5 -mt-2 text-[10px] font-mono text-slate-400">
          {points.map((p, i) => (
            <span
              key={i}
              className={`cursor-pointer transition-colors ${
                hoveredPointIndex === i ? 'text-white font-bold' : ''
              }`}
              onClick={() => setHoveredPointIndex(i)}
            >
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
