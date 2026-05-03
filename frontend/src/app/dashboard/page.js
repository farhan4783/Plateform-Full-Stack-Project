'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { KPICard, SectionHeader, StatusBadge } from '../../components/UIComponents';
import { DollarSign, ShoppingCart, Users, Star, TrendingUp, ArrowUpRight } from 'lucide-react';

const API = 'http://localhost:5000/api';
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#38bdf8', '#ef4444'];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [analyticsRes, ordersRes, bookingsRes] = await Promise.all([
          fetch(`${API}/analytics/overview`),
          fetch(`${API}/orders`),
          fetch(`${API}/booking`)
        ]);
        const analyticsData = await analyticsRes.json();
        const ordersData = await ordersRes.json();
        const bookingsData = await bookingsRes.json();
        
        setData(analyticsData);
        setOrders(ordersData.slice(0, 8));
        setBookings(bookingsData.slice(0, 5));
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    
    load();
    const interval = setInterval(load, 5000); // Poll every 5s for live updates
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) return <DashboardSkeleton />;
  if (!data) return <div className="text-red-400 p-8">Failed to connect to backend. Is the server running on port 5000?</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Real-time overview of your restaurant operations</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full">
          <div className="pulse-dot bg-emerald-500" />
          System Online
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Revenue" value={`$${data.kpis.totalRevenue.toLocaleString()}`} change={12.5} icon={DollarSign} color="accent" />
        <KPICard title="Total Orders" value={data.kpis.totalOrders} change={8.2} icon={ShoppingCart} color="success" />
        <KPICard title="Active Customers" value={data.kpis.activeCustomers} change={5.1} icon={Users} color="info" />
        <KPICard title="Satisfaction" value={`${data.kpis.satisfaction}/5`} change={2.0} icon={Star} color="warning" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 glass-card p-6">
          <SectionHeader title="Revenue Trend" subtitle="Last 30 days" />
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueTrend}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#555" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card p-6">
          <SectionHeader title="Category Mix" />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {data.categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {data.categoryBreakdown.map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Dishes, Recent Orders, Live Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Dishes */}
        <div className="glass-card p-6">
          <SectionHeader title="Top Dishes" subtitle="30 Days" />
          <div className="space-y-3">
            {data.topDishes.slice(0,5).map((dish, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--color-text-secondary)] w-5">#{i + 1}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{dish.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{dish.orders_30d}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Orders */}
        <div className="glass-card p-6 border-indigo-500/30 border">
          <div className="flex justify-between items-center mb-4">
            <SectionHeader title="Live Orders" />
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                <div>
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    {order.customer} <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 rounded">{order.id}</span>
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] truncate w-32">{order.items.join(', ')}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">${order.total.toFixed(2)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Bookings */}
        <div className="glass-card p-6 border-purple-500/30 border">
          <div className="flex justify-between items-center mb-4">
            <SectionHeader title="Live Bookings" />
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </div>
          <div className="space-y-3">
            {bookings.slice().reverse().slice(0, 5).map((booking, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                <div>
                  <div className="text-sm font-medium text-white">{booking.name}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">{booking.date} at {booking.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-400">Table {booking.table_id}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">{booking.guests} Guests</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <div className="skeleton h-8 w-48 mb-2" />
      <div className="skeleton h-4 w-72 mb-8" />
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 skeleton h-80 rounded-2xl" />
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    </div>
  );
}
