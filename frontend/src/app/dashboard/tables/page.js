'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, StatusBadge } from '../../../components/UIComponents';
import { CalendarCheck } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '', guests: 2 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/booking/tables`).then(r => r.json()),
      fetch(`${API}/booking`).then(r => r.json()),
    ]).then(([t, b]) => {
      setTables(t);
      setBookings(b);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selected) return alert('Please select a table');
    try {
      const res = await fetch(`${API}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, table_id: selected.id, section: selected.section }),
      });
      if (res.ok) {
        const booking = await res.json();
        setBookings(prev => [...prev, booking]);
        setTables(prev => prev.map(t => t.id === selected.id ? { ...t, status: 'reserved' } : t));
        setSelected(null);
        setFormData({ name: '', email: '', date: '', time: '', guests: 2 });
        alert('Table booked successfully!');
      }
    } catch {
      alert('Booking failed.');
    }
  };

  const sections = ['VIP', 'Main', 'Patio'];
  const statusColors = {
    available: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30',
    occupied: 'bg-red-500/20 border-red-500/40 text-red-400 cursor-not-allowed opacity-60',
    reserved: 'bg-amber-500/20 border-amber-500/40 text-amber-400 cursor-not-allowed opacity-60',
  };

  if (loading) return <div className="skeleton h-96 rounded-2xl" />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <CalendarCheck className="text-indigo-400" /> AI Table Manager
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Interactive floor plan with intelligent table allocation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Floor Plan */}
        <div className="lg:col-span-3 glass-card p-6">
          <SectionHeader title="Restaurant Floor Plan" />
          {sections.map(section => (
            <div key={section} className="mb-6">
              <div className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-3 border-b border-[var(--color-border)] pb-2">{section} Section</div>
              <div className="flex flex-wrap gap-3">
                {tables.filter(t => t.section === section).map(table => (
                  <motion.button key={table.id} whileHover={{ scale: table.status === 'available' ? 1.1 : 1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => table.status === 'available' && setSelected(table)}
                    disabled={table.status !== 'available'}
                    className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${statusColors[table.status]} ${selected?.id === table.id ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[var(--color-bg-primary)]' : ''}`}
                  >
                    <span className="text-base font-bold">{table.id}</span>
                    <span className="text-[10px] opacity-70">{table.seats} seats</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-4 mt-4">
            {Object.entries({ available: 'emerald', occupied: 'red', reserved: 'amber' }).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                <div className={`w-3 h-3 rounded bg-${color}-500/30 border border-${color}-500/50`} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2 glass-card p-6">
          <SectionHeader title="Book a Table" />
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Selected Table</label>
              <input readOnly value={selected ? `${selected.section} — ${selected.id} (${selected.seats} seats)` : ''} placeholder="Click a table on the floor plan" className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-white p-2.5 rounded-xl text-sm outline-none" />
            </div>
            {['name', 'email'].map(field => (
              <div key={field}>
                <label className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">{field}</label>
                <input type={field === 'email' ? 'email' : 'text'} required value={formData[field]} onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-white p-2.5 rounded-xl text-sm outline-none focus:border-indigo-500/50" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-white p-2.5 rounded-xl text-sm outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">Time</label>
                <input type="time" required value={formData.time} onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-white p-2.5 rounded-xl text-sm outline-none focus:border-indigo-500/50" />
              </div>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
              Confirm Reservation
            </button>
          </form>

          {/* Recent bookings */}
          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Recent Bookings</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {bookings.slice(0, 5).map((b, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-[var(--color-border)] last:border-0">
                  <div>
                    <div className="text-white font-medium">{b.name}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{b.table_id} · {b.date} {b.time}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
