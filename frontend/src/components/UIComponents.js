'use client';
import { motion } from 'framer-motion';

export function KPICard({ title, value, change, icon: Icon, color = 'accent' }) {
  const colorMap = {
    accent: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400',
    success: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    warning: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
    info: 'from-sky-500/20 to-sky-500/5 border-sky-500/20 text-sky-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card p-5 bg-gradient-to-br ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">{title}</span>
        {Icon && <Icon size={18} className="opacity-50" />}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {change !== undefined && (
        <div className={`text-xs mt-1 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
        </div>
      )}
    </motion.div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    preparing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    delivered: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    occupied: 'bg-red-500/10 text-red-400 border-red-500/20',
    reserved: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    increase: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    decrease: 'bg-red-500/10 text-red-400 border-red-500/20',
    hold: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    positive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    negative: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${styles[status] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
