'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SectionHeader, StatusBadge } from '../../../components/UIComponents';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

const API = 'http://localhost:5000/api';
const COLORS = { positive: '#22c55e', neutral: '#94a3b8', negative: '#ef4444' };

export default function FeedbackPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/ai/sentiment`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="skeleton h-96 rounded-2xl" />;
  if (!data) return <div className="text-red-400">Failed to load feedback data.</div>;

  const pieData = [
    { name: 'Positive', value: parseFloat(data.summary.positive) },
    { name: 'Neutral', value: parseFloat(data.summary.neutral) },
    { name: 'Negative', value: parseFloat(data.summary.negative) },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="text-purple-400" /> Feedback Intelligence
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">AI-powered sentiment analysis and automated response suggestions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sentiment Pie */}
        <div className="glass-card p-6">
          <SectionHeader title="Sentiment Breakdown" />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {pieData.map((entry, i) => <Cell key={i} fill={Object.values(COLORS)[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: Object.values(COLORS)[i] }} />
                {entry.name}: {entry.value}%
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="glass-card p-6">
          <SectionHeader title="Summary" />
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">Average Rating</span>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-amber-400" fill="#f59e0b" />
                <span className="text-lg font-bold text-white">{data.summary.avgRating}</span>
                <span className="text-xs text-[var(--color-text-secondary)]">/5</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">Total Reviews</span>
              <span className="text-lg font-bold text-white">{data.feedback.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">Positive %</span>
              <span className="text-lg font-bold text-emerald-400">{data.summary.positive}%</span>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <SectionHeader title="AI Insight" />
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{data.aiInsight}</p>
          <div className="mt-4 bg-[var(--color-bg-primary)] rounded-xl p-4">
            <div className="text-xs font-semibold text-indigo-400 mb-2">Recommended Actions:</div>
            <ul className="text-xs text-[var(--color-text-secondary)] space-y-1.5">
              <li>• Monitor service speed during peak hours</li>
              <li>• Follow up with negative reviewers personally</li>
              <li>• Highlight popular dishes in marketing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]">
          <SectionHeader title="All Feedback" />
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {data.feedback.map((fb, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${fb.sentiment === 'positive' ? 'bg-emerald-500/20' : fb.sentiment === 'negative' ? 'bg-red-500/20' : 'bg-slate-500/20'}`}>
                {fb.sentiment === 'positive' ? <ThumbsUp size={14} className="text-emerald-400" /> : fb.sentiment === 'negative' ? <ThumbsDown size={14} className="text-red-400" /> : <Minus size={14} className="text-slate-400" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{fb.customer}</span>
                  <StatusBadge status={fb.sentiment} />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{fb.text}</p>
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={12} className={j < fb.rating ? 'text-amber-400' : 'text-[var(--color-border)]'} fill={j < fb.rating ? '#f59e0b' : 'transparent'} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
