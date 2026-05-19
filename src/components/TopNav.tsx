import React, { useState } from 'react';
import { Bell, Search, LogOut, Settings, Activity, ChevronDown, Sparkles, Command } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../utils';
import { useAuth } from '../contexts/AuthContext';

export default function TopNav() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className={cn(
      "fixed top-0 z-50 flex justify-between items-center px-6 h-18 transition-all duration-300",
      "w-full lg:w-[calc(100%-18rem)] lg:ml-72"
    )}
      style={{ height: '72px', background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Left */}
      <div className="flex items-center gap-6">
        <button className="lg:hidden p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all">
          <Activity size={22} />
        </button>

        {/* Top nav links (hidden on smaller screens) */}
        <nav className="hidden md:flex items-center gap-1 h-full">
          {[
            { path: '/dashboard', label: 'Overview' },
            { path: '/checker',   label: 'Smart Check', badge: <Sparkles size={11} className="text-teal-400" /> },
            { path: '/history',   label: 'History' },
          ].map(item => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative',
                isActive ? 'text-white bg-white/8' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              )}>
              {item.label}
              {item.badge}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="relative hidden sm:flex items-center group">
          <Search size={15} className="absolute left-3.5 text-white/25 group-focus-within:text-teal-400 transition-colors pointer-events-none" />
          <input type="text" placeholder="Search medications..."
            className="input-premium !rounded-xl !py-2.5 !pl-9 !pr-4 !text-sm w-52 focus:w-64 transition-all duration-300 !bg-white/4" />
          <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
            <Command size={10} className="text-white/20" />
            <span className="text-[10px] text-white/20 font-bold">K</span>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded-xl transition-all border border-transparent hover:border-white/8">
            <Bell size={18} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-[#050810] glow-rose" />
          </button>
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)}
            className={cn('flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 rounded-2xl border transition-all',
              showDropdown ? 'bg-white/8 border-white/12' : 'border-transparent hover:bg-white/5 hover:border-white/8')}>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-400/40 glow-teal shrink-0">
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=128&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-sm font-bold text-white/90">{user?.username || 'Dr. E. Vance'}</span>
              <span className="text-[10px] text-teal-400/80 font-bold uppercase tracking-wider mt-0.5">{user?.role || 'Clinician'}</span>
            </div>
            <ChevronDown size={13} className={cn('text-white/30 transition-transform duration-200', showDropdown && 'rotate-180')} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 glass-card !rounded-2xl !p-2 z-50 border-white/12 animate-fade-up"
              style={{ background: 'rgba(8,13,24,0.95)', backdropFilter: 'blur(24px)' }}>
              <div className="px-3 py-3 mb-1 border-b border-white/8">
                <p className="text-sm font-bold text-white">{user?.username}</p>
                <p className="text-xs text-white/35 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/6 rounded-xl transition-all font-medium">
                  <Settings size={16} className="text-white/30" /> System Settings
                </button>
              </div>
              <div className="pt-1 border-t border-white/8">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-bold">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
