'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, StatusBadge } from '../../../components/UIComponents';
import { UtensilsCrossed, Flame, TrendingUp } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch(`${API}/menu`)
      .then(r => r.json())
      .then(d => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(items.map(i => i.category))];
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  if (loading) return <div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-60 rounded-2xl" />)}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <UtensilsCrossed className="text-amber-400" /> Menu Intelligence
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">AI-analyzed performance data for every dish on your menu.</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${filter === cat ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-border-bright)]'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5 hover:border-indigo-500/30 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                <span className="text-xs text-[var(--color-text-secondary)]">{item.category}</span>
              </div>
              <span className="text-lg font-bold text-indigo-400">${item.price}</span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">{item.description}</p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--color-border)]">
              <div className="text-center">
                <div className="text-xs text-[var(--color-text-secondary)]">Orders</div>
                <div className="text-sm font-bold text-white flex items-center justify-center gap-1">
                  {item.orders_30d} <Flame size={12} className={item.orders_30d > 250 ? 'text-amber-400' : 'text-transparent'} />
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[var(--color-text-secondary)]">Popularity</div>
                <div className="text-sm font-bold text-emerald-400">{item.popularity}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[var(--color-text-secondary)]">Margin</div>
                <div className="text-sm font-bold text-sky-400">{((item.price - item.cost) / item.price * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* Popularity Bar */}
            <div className="mt-3 h-1 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${item.popularity}%` }} transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
