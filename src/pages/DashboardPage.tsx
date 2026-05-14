import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, Users, BrainCircuit, RefreshCw, ClipboardList, Database, Zap, Gauge, ExternalLink } from 'lucide-react';
import { cn } from '../utils';
import { getSystemStatsApi } from '../services/api';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const chartData = [
  { name: 'Mon', volume: 120 }, { name: 'Tue', volume: 180 }, { name: 'Wed', volume: 140 },
  { name: 'Thu', volume: 210 }, { name: 'Fri', volume: 280 }, { name: 'Sat', volume: 190 }, { name: 'Sun', volume: 230 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const fetchStats = async () => { try { setStats(await getSystemStatsApi()); } catch(e) {} };
  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
            <span className="text-xs text-white/35 font-bold uppercase tracking-widest">Live Data Stream</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">System Telemetry</h2>
          <p className="text-white/40 font-medium">Real-time clinical network performance and usage metrics.</p>
        </div>
        <div className="hidden md:flex gap-3">
          <button className="btn-ghost !py-2.5 !px-5 !text-xs !rounded-xl !font-semibold">Export Report</button>
          <button onClick={fetchStats} className="btn-primary !py-2.5 !px-5 !text-xs !rounded-xl !font-semibold flex items-center gap-2">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardList} label="Total Queries (24h)" value={stats?.total_checks?.toLocaleString() || '0'} trend="+12.5% vs yesterday" color="blue" />
        <StatCard icon={AlertTriangle} label="High Risk Detections" value={stats?.high_risk_cases?.toLocaleString() || '0'} trend="2.3% of total" badge="Critical" color="rose" />
        <StatCard icon={Users} label="Active Terminals" value={stats?.active_users?.toLocaleString() || '0'} trend="+4.1% this week" color="violet" />
        <StatCard icon={BrainCircuit} label="AI Assurance Score" value={`${stats?.ai_accuracy || 0}%`} trend="Target: 99.5%" color="emerald" progress={stats?.ai_accuracy || 0} />
      </div>

      {/* Chart + Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Network Throughput</h3>
            <select className="text-xs font-bold text-white/50 bg-white/5 border border-white/8 rounded-xl px-3 py-2 outline-none focus:border-blue-500/50 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(8,13,24,0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' }} itemStyle={{ color: '#60a5fa', fontWeight: 700 }} cursor={{ stroke: 'rgba(59,130,246,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" dot={false} activeDot={{ r: 6, fill: '#3b82f6', stroke: 'rgba(59,130,246,0.3)', strokeWidth: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 tracking-tight">System Diagnostics</h3>
          <div className="space-y-6 flex-1">
            <HealthItem icon={Database} label="Neural Engine" status="Optimal" progress={100} color="from-emerald-500 to-emerald-400" glow="rgba(16,185,129,0.6)" />
            <HealthItem icon={Zap} label="API Gateway" status={`${stats?.uptime || '99.99%'}`} progress={99.9} color="from-blue-500 to-blue-400" glow="rgba(59,130,246,0.6)" />
            <HealthItem icon={Gauge} label="Avg. Latency" status="142ms" progress={25} color="from-violet-500 to-violet-400" glow="rgba(139,92,246,0.6)" />
            <div className="mt-auto pt-4 border-t border-white/6">
              <div className="flex items-center justify-center gap-2.5 badge badge-emerald !py-2 !px-4 !rounded-xl w-full">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
                All systems fully operational
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table + Drugs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-white/6">
            <h3 className="text-lg font-bold text-white tracking-tight">Recent High-Risk Triggers</h3>
            <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">View Log</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  {['Compound Interaction','Threat Level','Time Code','AI Confidence',''].map(h => (
                    <th key={h} className="py-3 px-5 text-[10px] font-bold text-white/25 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.recent_high_risk?.map((item: any, i: number) => (
                  <TableRow key={i} title={item.title} desc={item.desc} severity={item.severity} time={new Date(item.time).toLocaleTimeString()} confidence={item.confidence} />
                ))}
                {!stats?.recent_high_risk?.length && (
                  <tr><td colSpan={5} className="text-center py-16 text-white/25 font-medium text-sm">No recent high risk cases logged.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compound Freq */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Compound Frequency</h3>
          <div className="space-y-5">
            {stats?.top_drugs?.map((item: any, i: number) => (
              <DrugBar key={i} label={item.label} count={item.count} progress={item.progress} />
            ))}
            {!stats?.top_drugs?.length && (
              <p className="text-white/25 text-sm text-center py-8 font-medium">Awaiting query data streams.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const colorMap: any = {
  blue:    { icon: 'text-blue-400',   bg: 'rgba(59,130,246,0.1)',  grad: 'from-blue-500 to-blue-400',   glow: 'rgba(59,130,246,0.5)' },
  rose:    { icon: 'text-rose-400',   bg: 'rgba(244,63,94,0.1)',   grad: 'from-rose-500 to-rose-400',   glow: 'rgba(244,63,94,0.5)' },
  violet:  { icon: 'text-violet-400', bg: 'rgba(139,92,246,0.1)',  grad: 'from-violet-500 to-violet-400',glow: 'rgba(139,92,246,0.5)' },
  emerald: { icon: 'text-emerald-400',bg: 'rgba(16,185,129,0.1)',  grad: 'from-emerald-500 to-emerald-400',glow:'rgba(16,185,129,0.5)' },
};

function StatCard({ icon: Icon, label, value, trend, badge, color, progress }: any) {
  const c = colorMap[color];
  return (
    <div className="glass-card p-6 flex flex-col gap-5 cursor-pointer group relative overflow-hidden">
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" style={{ background: c.glow, filter: 'blur(20px)' }} />
      <div className="flex justify-between items-start">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', c.icon)} style={{ background: c.bg }}>
          <Icon size={21} strokeWidth={1.75} />
        </div>
        {badge && <span className="badge badge-rose">{badge}</span>}
      </div>
      <div>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">{label}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight mb-2">{value}</h3>
        {progress !== undefined && (
          <div className="h-1.5 w-full bg-white/6 rounded-full overflow-hidden mb-2">
            <div className={cn('h-full rounded-full bg-gradient-to-r', c.grad)} style={{ width: `${progress}%`, boxShadow: `0 0 8px ${c.glow}` }} />
          </div>
        )}
        <p className="text-xs text-white/30 font-medium flex items-center gap-1">
          {trend.includes('+') && <TrendingUp size={12} className="text-emerald-400" />}
          {trend}
        </p>
      </div>
    </div>
  );
}

function HealthItem({ icon: Icon, label, status, progress, color, glow }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-sm font-semibold text-white/60 flex items-center gap-2.5">
          <Icon size={16} className="text-white/25" /> {label}
        </span>
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)' }}>{status}</span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000', color)} style={{ width: `${progress}%`, boxShadow: `0 0 8px ${glow}` }} />
      </div>
    </div>
  );
}

function TableRow({ title, desc, severity, time, confidence }: any) {
  const s = severity === 'High'
    ? 'bg-rose-500/12 text-rose-400 border-rose-500/25'
    : 'bg-amber-500/12 text-amber-400 border-amber-500/25';
  return (
    <tr className="border-b border-white/4 hover:bg-white/4 transition-colors group cursor-pointer">
      <td className="py-4 px-5">
        <div className="font-semibold text-white/80 text-sm truncate max-w-[180px]">{title}</div>
        <div className="text-[11px] text-white/30 mt-0.5 truncate max-w-[180px]">{desc}</div>
      </td>
      <td className="py-4 px-5">
        <span className={cn('badge text-[9px] !py-1 !px-2.5 border', s)}>{severity}</span>
      </td>
      <td className="py-4 px-5 text-[11px] font-mono text-white/30 uppercase">{time}</td>
      <td className="py-4 px-5">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-white/60 w-8">{confidence}%</span>
          <div className="flex-1 max-w-[60px] bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full" style={{ width: `${confidence}%` }} />
          </div>
        </div>
      </td>
      <td className="py-4 px-5 text-right">
        <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-blue-500 opacity-0 group-hover:opacity-100 transition-all border border-white/8 hover:border-blue-400 ml-auto">
          <ExternalLink size={14} />
        </button>
      </td>
    </tr>
  );
}

function DrugBar({ label, count, progress }: any) {
  return (
    <div className="group">
      <div className="flex justify-between text-xs mb-2">
        <span className="font-semibold text-white/60 group-hover:text-blue-400 transition-colors uppercase tracking-wider text-[11px]">{label}</span>
        <span className="font-bold text-white/30">{count}</span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000" style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(59,130,246,0.5)' }} />
      </div>
    </div>
  );
}
