import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Pill, BarChart3, History, Settings, HelpCircle, LogOut, Bell, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',    path: '/dashboard', badge: null },
  { icon: Pill,            label: 'Drug Checker', path: '/checker',   badge: 'AI' },
  { icon: BarChart3,       label: 'Reports',      path: '/reports',   badge: null },
  { icon: History,         label: 'History',      path: '/history',   badge: null },
  { icon: Bell,            label: 'Alerts',       path: '/alerts',    badge: '3' },
  { icon: Settings,        label: 'Settings',     path: '/settings',  badge: null },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 hidden lg:flex flex-col z-40 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080d18 0%, #050810 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      
      {/* Subtle ambient */}
      <div className="absolute top-0 left-0 w-full h-64 pointer-events-none">
        <div className="absolute top-[-40px] left-[-40px] w-48 h-48 bg-teal-600/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="px-6 pt-7 pb-2 relative z-10">
        <div className="flex items-center gap-3 px-2 mb-1 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center glow-teal shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none mb-0.5">PharmAI</h1>
            <p className="text-[10px] text-teal-400/80 font-bold uppercase tracking-[0.2em]">Console Alpha</p>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="mx-6 my-4 h-px bg-white/5" />

      {/* Nav */}
      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
        <p className="px-3 py-1 text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] mb-2">Main Menu</p>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) => cn('nav-item', isActive && 'active')}>
            {({ isActive }) => (
              <>
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.75}
                  className={cn('shrink-0 transition-colors duration-300', isActive ? 'text-teal-400' : 'text-white/35')} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-md', item.badge === 'AI' ? 'badge badge-emerald !text-[9px] !py-0.5 !px-1.5' : 'badge badge-rose !text-[9px] !py-0.5 !px-1.5')}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Separator */}
      <div className="mx-6 my-4 h-px bg-white/5" />

      {/* Upgrade CTA */}
      <div className="px-4 pb-2 relative z-10">
        <div className="rounded-2xl p-4 mb-3 relative overflow-hidden cursor-pointer group"
          style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.15), rgba(14,165,233,0.1))', border: '1px solid rgba(13,148,136,0.2)' }}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(14,165,233,0.15))' }} />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center glow-teal shrink-0">
              <Zap size={15} fill="white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Upgrade to Pro</p>
              <p className="text-[10px] text-white/40 font-medium">Unlock all AI features</p>
            </div>
          </div>
        </div>

        {/* User card */}
        {user && (
          <div className="rounded-2xl p-3.5 mb-3 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-teal-400/40 shrink-0 glow-teal">
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate leading-tight">{user.username || 'Dr. E. Vance'}</p>
              <p className="text-[10px] text-teal-400/80 font-bold uppercase tracking-wider">{user.role || 'Lead Analyst'}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          <button className="nav-item !text-white/35 hover:!text-white/70 !py-2.5">
            <HelpCircle size={17} strokeWidth={1.75} className="shrink-0 text-white/25" />
            Support Center
          </button>
          <button onClick={handleLogout} className="nav-item !text-rose-400/60 hover:!text-rose-400 hover:!bg-rose-500/10 !py-2.5">
            <LogOut size={17} strokeWidth={1.75} className="shrink-0 text-rose-400/40" />
            Disconnect
          </button>
        </div>
      </div>
      <div className="pb-4" />
    </aside>
  );
}
