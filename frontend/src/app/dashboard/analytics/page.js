'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SectionHeader, KPICard } from '../../../components/UIComponents';
import { TrendingUp, Clock, Users, DollarSign } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [traffic, setTraffic] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/analytics/overview`).then(r => r.json()),
      fetch(`${API}/analytics/traffic`).then(r => r.json()),
    ]).then(([overview, trafficData]) => {
      setData(overview);
      setTraffic(trafficData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}</div>;
  if (!data) return <div className="text-red-400">Failed to load analytics.</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="text-indigo-400" /> Smart Analytics
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">AI-powered insights into your restaurant&apos;s performance.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard title="Revenue" value={`$${data.kpis.totalRevenue.toLocaleString()}`} change={12.5} icon={DollarSign} color="accent" />
        <KPICard title="Avg Order" value={`$${data.kpis.avgOrderValue}`} change={3.2} icon={TrendingUp} color="success" />
        <KPICard title="Customers" value={data.kpis.activeCustomers} change={5.1} icon={Users} color="info" />
        <KPICard title="Satisfaction" value={`${data.kpis.satisfaction}/5`} change={2.0} icon={Clock} color="warning" />
      </div>

      {/* Revenue Chart */}
      <div className="glass-card p-6 mb-6">
        <SectionHeader title="Revenue Trend" subtitle="30-day daily breakdown" />
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.revenueTrend}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
              <YAxis stroke="#555" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#revGrad2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="glass-card p-6">
        <SectionHeader title="Hourly Guest Traffic" subtitle="Today's predicted traffic pattern" />
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={traffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
              <XAxis dataKey="hour" stroke="#555" tick={{ fontSize: 10 }} />
              <YAxis stroke="#555" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="guests" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
