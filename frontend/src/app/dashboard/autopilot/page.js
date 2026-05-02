'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, CheckCircle2, DollarSign, Megaphone, UtensilsCrossed, Users, Package, Loader2 } from 'lucide-react';

const API = 'http://localhost:5000/api';

const iconMap = {
  pricing: DollarSign,
  marketing: Megaphone,
  menu: UtensilsCrossed,
  staffing: Users,
  inventory: Package,
};

const colorMap = {
  pricing: 'text-emerald-400 bg-emerald-500/10',
  marketing: 'text-sky-400 bg-sky-500/10',
  menu: 'text-amber-400 bg-amber-500/10',
  staffing: 'text-purple-400 bg-purple-500/10',
  inventory: 'text-red-400 bg-red-500/10',
};

export default function AutopilotPage() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const runAutopilot = async () => {
    setRunning(true);
    setResult(null);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const res = await fetch(`${API}/ai/autopilot`, { method: 'POST' });
      const data = await res.json();
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setResult(data);
        setRunning(false);
      }, 500);
    } catch {
      clearInterval(interval);
      setRunning(false);
      alert('Autopilot failed. Ensure backend is running.');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Zap className="text-amber-400" /> Restaurant Autopilot
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">One-click AI optimization across pricing, marketing, menu, staffing, and inventory.</p>
      </div>

      {/* Main Autopilot Panel */}
      <div className="glass-card p-8 mb-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/10">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/25">
            <Zap size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Optimize My Business</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            The AI will analyze your entire restaurant operation and execute optimizations across all systems simultaneously.
          </p>
          
          {!running && !result && (
            <motion.button 
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={runAutopilot}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold text-base hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
            >
              <Play size={20} /> Launch Autopilot
            </motion.button>
          )}

          {running && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-indigo-400">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm font-medium">AI Optimization in progress...</span>
              </div>
              <div className="w-full h-2 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">{Math.round(progress)}% complete</div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Summary Bar */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass-card p-5 text-center">
                <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Status</div>
                <div className="text-base font-bold text-emerald-400 flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> {result.status}
                </div>
              </div>
              <div className="glass-card p-5 text-center">
                <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Actions Executed</div>
                <div className="text-2xl font-bold text-white">{result.actionsExecuted}</div>
              </div>
              <div className="glass-card p-5 text-center">
                <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Est. Weekly Impact</div>
                <div className="text-base font-bold text-indigo-400">{result.estimatedWeeklyImpact}</div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="space-y-3">
              {result.actions.map((action, i) => {
                const Icon = iconMap[action.type] || Zap;
                const colors = colorMap[action.type] || 'text-white bg-white/10';
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                    className="glass-card p-5 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{action.action}</div>
                      <div className="text-xs text-[var(--color-text-secondary)] capitalize">{action.type} optimization</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-emerald-400">{action.impact}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Next Run */}
            <div className="mt-6 text-center">
              <p className="text-xs text-[var(--color-text-secondary)]">Next autopilot cycle in: <span className="text-white font-medium">{result.nextRunIn}</span></p>
              <button onClick={() => { setResult(null); }} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Run Again</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
