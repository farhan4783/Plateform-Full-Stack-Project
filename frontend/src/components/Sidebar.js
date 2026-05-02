'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, UtensilsCrossed, Brain, CalendarCheck, 
  TrendingUp, Users, Zap, Settings, ChevronLeft, ChevronRight,
  Bot, DollarSign, MessageSquare, ShieldCheck
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'AI Chef', icon: Bot, href: '/dashboard/ai-chef' },
  { label: 'Menu Intelligence', icon: UtensilsCrossed, href: '/dashboard/menu' },
  { label: 'Dynamic Pricing', icon: DollarSign, href: '/dashboard/pricing' },
  { label: 'Analytics', icon: TrendingUp, href: '/dashboard/analytics' },
  { label: 'Table Manager', icon: CalendarCheck, href: '/dashboard/tables' },
  { label: 'Customer AI', icon: Users, href: '/dashboard/customers' },
  { label: 'Feedback AI', icon: MessageSquare, href: '/dashboard/feedback' },
  { label: 'Autopilot', icon: Zap, href: '/dashboard/autopilot' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-[var(--color-border)] bg-[var(--color-bg-card)] ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-[var(--color-border)]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center flex-shrink-0">
          <Brain size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold tracking-wider text-white whitespace-nowrap">PLATEFORM AI</h1>
            <p className="text-[10px] text-[var(--color-text-secondary)] tracking-widest">SMART RESTAURANT OS</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent-light)] border border-[var(--color-accent)]/20' 
                  : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon size={18} className={`flex-shrink-0 ${isActive ? 'text-[var(--color-accent-light)]' : 'group-hover:text-white'}`} />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {isActive && !collapsed && item.label === 'Autopilot' && (
                <span className="ml-auto text-[10px] bg-[var(--color-success)]/20 text-[var(--color-success)] px-2 py-0.5 rounded-full">LIVE</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-[var(--color-border)]">
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="w-full flex items-center justify-center py-2 rounded-xl text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
