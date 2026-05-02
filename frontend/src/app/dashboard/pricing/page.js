'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, StatusBadge } from '../../../components/UIComponents';
import { DollarSign, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function DynamicPricingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/ai/dynamic-pricing`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>;
  if (!data) return <div className="text-red-400">Failed to load pricing data.</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <DollarSign className="text-emerald-400" /> Dynamic Pricing AI
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Real-time price optimization based on demand, competition, and profit margins.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 text-center">
          <div className="text-2xl font-bold text-emerald-400">{data.suggestions.filter(s => s.action === 'increase').length}</div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">Price Increases</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-2xl font-bold text-red-400">{data.suggestions.filter(s => s.action === 'decrease').length}</div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">Price Decreases</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-2xl font-bold text-slate-400">{data.suggestions.filter(s => s.action === 'hold').length}</div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">Hold Steady</div>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]">
          <SectionHeader title="AI Price Recommendations" subtitle={`Last updated: ${new Date(data.lastUpdated).toLocaleString()}`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Item', 'Current Price', 'AI Suggested', 'Change', 'Demand', 'Margin', 'Action', 'Reason'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.suggestions.map((item, i) => {
                const diff = item.suggestedPrice - item.currentPrice;
                const pct = ((diff / item.currentPrice) * 100).toFixed(1);
                return (
                  <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-[var(--color-border)] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">${item.currentPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">${item.suggestedPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium flex items-center gap-1 ${diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        {diff > 0 ? <ArrowUpRight size={14} /> : diff < 0 ? <ArrowDownRight size={14} /> : <Minus size={14} />}
                        {Math.abs(pct)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.demand}%` }} />
                        </div>
                        <span className="text-xs text-[var(--color-text-secondary)]">{item.demand}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{item.profitMargin}%</td>
                    <td className="px-6 py-4"><StatusBadge status={item.action} /></td>
                    <td className="px-6 py-4 text-xs text-[var(--color-text-secondary)] max-w-[200px]">{item.reason}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
