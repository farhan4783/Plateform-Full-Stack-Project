'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, StatusBadge } from '../../../components/UIComponents';
import { Users, AlertTriangle, Shield, Send } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function CustomersPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/ai/churn-prediction`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>;
  if (!data) return <div className="text-red-400">Failed to load customer data.</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="text-sky-400" /> Customer Retention AI
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Predict churn, identify at-risk customers, and automate retention campaigns.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5">
          <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Retention Rate</div>
          <div className="text-3xl font-bold text-emerald-400">{data.retentionRate}%</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">At-Risk Customers</div>
          <div className="text-3xl font-bold text-red-400">{data.totalAtRisk}</div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">out of {data.totalCustomers}</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">AI Confidence</div>
          <div className="text-3xl font-bold text-indigo-400">94%</div>
        </div>
      </div>

      {/* At Risk List */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]">
          <SectionHeader title="At-Risk Customers" subtitle="Sorted by churn probability" />
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {data.atRisk.map((customer, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="p-5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${customer.riskLevel === 'critical' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
                    {customer.riskLevel === 'critical' ? <AlertTriangle size={18} className="text-red-400" /> : <Shield size={18} className="text-amber-400" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{customer.name}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{customer.email} · {customer.tier} tier · {customer.visits} visits</div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={customer.riskLevel} />
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">Churn: {(customer.churnRisk * 100).toFixed(0)}%</div>
                </div>
              </div>
              
              <div className="mt-3 flex items-center gap-3">
                {/* Risk bar */}
                <div className="flex-1 h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${customer.riskLevel === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${customer.churnRisk * 100}%` }} />
                </div>
                <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">{customer.daysSinceVisit}d ago</span>
              </div>

              <div className="mt-3 flex items-center justify-between bg-[var(--color-bg-primary)] rounded-xl p-3">
                <div className="text-xs text-[var(--color-text-secondary)]">
                  <span className="text-indigo-400 font-medium">AI Suggestion:</span> {customer.suggestedAction}
                </div>
                <button className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  <Send size={12} /> Execute
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
