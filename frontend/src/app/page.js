'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, Zap, TrendingUp, Users, Bot, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[60%] bg-purple-600/8 rounded-full blur-[100px]" style={{ animationDelay: '2s', animationDuration: '8s' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Brain size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider text-white">PLATEFORM AI</h1>
            <p className="text-[9px] text-[var(--color-text-secondary)] tracking-[0.25em]">SMART RESTAURANT OS</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/customer" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">Customer Portal</Link>
          <Link href="/dashboard" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">Admin Dashboard</Link>
          <Link href="/dashboard" className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pt-20 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles size={14} /> AI-Powered Restaurant Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Your Restaurant,<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">On Autopilot.</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Plateform AI is not just a management system — it&apos;s an intelligent operating system that predicts demand, optimizes pricing, retains customers, and runs your restaurant while you sleep.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
              Launch Dashboard <ArrowRight size={18} />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 border border-[var(--color-border-bright)] text-white px-8 py-3.5 rounded-xl font-medium text-base hover:bg-white/5 transition-all">
              See Features
            </a>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Revenue Boost', value: '+34%', desc: 'Average increase' },
            { label: 'AI Decisions', value: '12K+', desc: 'Made daily' },
            { label: 'Churn Reduced', value: '-28%', desc: 'Customer retention' },
            { label: 'Waste Cut', value: '-40%', desc: 'Inventory optimization' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-5 text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-sm font-medium text-white mt-1">{stat.label}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">{stat.desc}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-8 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-3">Intelligent Modules</h2>
          <p className="text-[var(--color-text-secondary)]">Every tool a restaurant needs, powered by AI.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Bot, title: 'AI Chef Recommender', desc: 'Personalized dish suggestions based on customer mood, diet, and spending patterns.', color: 'indigo' },
            { icon: TrendingUp, title: 'Dynamic Pricing AI', desc: 'Real-time price optimization based on demand curves, competition, and profit margins.', color: 'emerald' },
            { icon: Users, title: 'Customer Digital Twin', desc: 'Behavioral profiles, churn prediction, and automated retention campaigns.', color: 'sky' },
            { icon: Zap, title: 'Autopilot Mode', desc: 'One-click business optimization: pricing, marketing, staffing, and inventory.', color: 'amber' },
            { icon: Brain, title: 'Demand Prediction', desc: 'Predict busy hours, staff requirements, and ingredient needs days in advance.', color: 'purple' },
            { icon: ShieldCheck, title: 'Feedback Intelligence', desc: 'Sentiment analysis on reviews with AI-generated response suggestions.', color: 'pink' },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-4`}>
                <feature.icon size={20} className={`text-${feature.color}-400`} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--color-border)] py-8 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">&copy; 2026 Plateform AI. Built for the future of dining.</p>
      </footer>
    </div>
  );
}
