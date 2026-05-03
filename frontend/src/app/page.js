'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChefHat, TrendingUp, Users, ShieldCheck, ArrowRight, Star, Clock, Utensils } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-950 font-sans selection:bg-amber-500/30">
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-600/30 bg-stone-900 flex items-center justify-center">
            <ChefHat size={20} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-widest text-stone-100 font-serif">PLATEFORM</h1>
            <p className="text-[10px] text-stone-500 tracking-[0.2em] uppercase">Restaurant Operations</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/customer" className="text-sm font-medium text-stone-400 hover:text-amber-400 transition-colors">Order Online</Link>
          <Link href="/customer" className="text-sm font-medium text-stone-400 hover:text-amber-400 transition-colors">Reservations</Link>
          <Link href="/dashboard" className="text-sm font-medium text-stone-400 hover:text-amber-400 transition-colors">Admin Login</Link>
          <Link href="/dashboard" className="text-sm bg-amber-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-900/20">
            Book Demo
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 border border-amber-900/50 bg-amber-900/10 text-amber-500 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-wider">
            <Star size={14} /> The New Standard in Hospitality
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-stone-100 leading-tight mb-6 font-serif">
            Elevate Your <span className="text-amber-500 italic">Service.</span><br />
            Optimize Your <span className="text-amber-500 italic">Operations.</span>
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Plateform combines elegant customer-facing interfaces with powerful back-of-house management. From dynamic table routing to intelligent inventory tracking, run your restaurant with precision.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-amber-700 transition-colors shadow-lg shadow-amber-900/20">
              Explore Dashboard <ArrowRight size={18} />
            </Link>
            <Link href="/customer" className="inline-flex items-center gap-2 border border-stone-700 text-stone-300 px-8 py-4 rounded-full font-medium text-sm hover:bg-stone-800 transition-colors">
              View Customer Portal
            </Link>
          </div>
        </motion.div>

        {/* Realistic Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Table Turnaround', value: '45m', desc: 'Average optimized time' },
            { label: 'Inventory Spoilage', value: '< 2%', desc: 'Industry-leading tracking' },
            { label: 'Guest Retention', value: '68%', desc: 'Return dining rate' },
            { label: 'Service Uptime', value: '99.9%', desc: 'Cloud reliability' },
          ].map((stat, i) => (
            <div key={i} className="bg-stone-900/50 border border-stone-800 p-6 rounded-2xl text-center">
              <div className="text-3xl font-serif text-amber-500 mb-2">{stat.value}</div>
              <div className="text-sm font-semibold text-stone-200 mb-1">{stat.label}</div>
              <div className="text-xs text-stone-500">{stat.desc}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-20 border-t border-stone-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-stone-100 mb-4 font-serif">Comprehensive Restaurant Management</h2>
          <p className="text-stone-400">Everything you need to deliver an exceptional dining experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Utensils, title: 'Menu Engineering', desc: 'Analyze dish profitability and popularity to curate the perfect seasonal offerings.' },
            { icon: Clock, title: 'Real-Time Ticketing', desc: 'Seamless communication between front-of-house and kitchen staff for faster service.' },
            { icon: Users, title: 'Guest Profiles', desc: 'Track dietary restrictions, favorite wines, and anniversary dates to personalize service.' },
            { icon: TrendingUp, title: 'Revenue Analytics', desc: 'Detailed breakdowns of category sales, peak hours, and server performance metrics.' },
            { icon: ShieldCheck, title: 'Secure Payments', desc: 'Enterprise-grade encryption for all transactions, supporting split checks and mobile pay.' },
            { icon: ChefHat, title: 'Inventory Control', desc: 'Automated stock depletion tracking tied directly to your Point of Sale recipes.' },
          ].map((feature, i) => (
            <div key={i} className="bg-stone-900 border border-stone-800 p-8 rounded-2xl group hover:border-amber-900/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center mb-6 group-hover:bg-amber-900/20 group-hover:border-amber-700/50 transition-colors">
                <feature.icon size={22} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-stone-200 mb-3 font-serif">{feature.title}</h3>
              <p className="text-sm text-stone-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-800 bg-stone-950 py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <ChefHat size={18} className="text-amber-600" />
             <span className="text-stone-300 font-serif font-bold tracking-wider">PLATEFORM</span>
          </div>
          <div className="flex gap-6 text-sm text-stone-500">
            <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Contact Sales</a>
          </div>
          <p className="text-sm text-stone-600">&copy; 2026 Plateform Hospitality Solutions.</p>
        </div>
      </footer>
    </div>
  );
}
