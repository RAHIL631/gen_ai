import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle, Users, BrainCircuit, RefreshCw, ClipboardList, Database, Zap, Gauge, ExternalLink, Clock, Activity } from 'lucide-react';
import { cn } from '../utils';
import { getSystemStatsApi } from '../services/api';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';

const weekData = [
  { name: 'Mon', volume: 120, alerts: 14 },
  { name: 'Tue', volume: 180, alerts: 22 },
  { name: 'Wed', volume: 140, alerts: 9  },
  { name: 'Thu', volume: 210, alerts: 31 },
  { name: 'Fri', volume: 280, alerts: 28 },
  { name: 'Sat', volume: 190, alerts: 17 },
  { name: 'Sun', volume: 230, alerts: 19 },
];

const severityData = [
  { name: 'Critical',  value: 12, color: '#f43f5e' },
  { name: 'Major',     value: 28, color: '#f59e0b' },
  { name: 'Moderate',  value: 45, color: '#38bdf8' },
  { name: 'Safe',      value: 15, color: '#10b981' },
];

const activityTimeline = [
  { time: '2m ago',  event: 'Warfarin + Aspirin flagged',       severity: 'critical', user: 'Dr. Ahmed K.' },
  { time: '8m ago',  event: 'Lisinopril combo cleared',         severity: 'safe',     user: 'Dr. Sara M.' },
  { time: '15m ago', event: 'Sildenafil interaction detected',  severity: 'major',    user: 'Dr. Patel R.' },
  { time: '23m ago', event: 'Metformin regimen verified',       severity: 'safe',     user: 'Dr. Lee J.'  },
  { time: '41m ago', event: 'Amiodarone + Digoxin flagged',     severity: 'critical', user: 'Dr. Rahul S.' },
];

const colorMap: any = {
  blue:    { icon: 'text-teal-400',    bg: 'rgba(13,148,136,0.1)',   grad: 'from-teal-500 to-teal-400',    glow: 'rgba(13,148,136,0.4)'   },
  rose:    { icon: 'text-rose-400',    bg: 'rgba(244,63,94,0.1)',    grad: 'from-rose-500 to-rose-400',    glow: 'rgba(244,63,94,0.4)'    },
  violet:  { icon: 'text-sky-400',     bg: 'rgba(14,165,233,0.1)',   grad: 'from-sky-500 to-sky-400',      glow: 'rgba(14,165,233,0.4)'   },
  emerald: { icon: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)',   grad: 'from-emerald-500 to-emerald-400', glow: 'rgba(16,185,129,0.4)' },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [range, setRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try { setStats(await getSystemStatsApi()); } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.9)' }} />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-30" />
            </div>
            <span className="text-xs text-white/35 font-bold uppercase tracking-widest">Live Safety Activity</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">Safety Overview</h2>
          <p className="text-white/40 font-medium">Real-time patient safety checks and database insights.</p>
        </div>
        <div className="hidden md:flex gap-3">
          <select
            value={range}
            onChange={e => setRange(e.target.value)}
            className="text-xs font-bold text-white/50 bg-white/5 border border-white/8 rounded-xl px-3 py-2 outline-none focus:border-teal-500/50 cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="btn-ghost !py-2.5 !px-5 !text-xs !rounded-xl !font-semibold">Export Report</button>
          <button onClick={fetchStats} className="btn-primary !py-2.5 !px-5 !text-xs !rounded-xl !font-semibold flex items-center gap-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ClipboardList, label: 'Total Queries (24h)',   value: stats?.total_checks?.toLocaleString()  || '2,841',  trend: '+12.5% vs yesterday', color: 'blue'    },
          { icon: AlertTriangle, label: 'High Risk Detections',  value: stats?.high_risk_cases?.toLocaleString() || '147',   trend: '2.3% of total',       color: 'rose',   badge: 'Critical' },
          { icon: Users,         label: 'Active Clinicians',     value: stats?.active_users?.toLocaleString()   || '38',     trend: '+4.1% this week',     color: 'violet'  },
          { icon: BrainCircuit,  label: 'AI Safety Score',       value: `${stats?.ai_accuracy || 98}%`,                     trend: 'Target: 99.5%',       color: 'emerald', progress: stats?.ai_accuracy || 98 },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Chart + Severity Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Check Volume &amp; Alerts</h3>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-teal-400"><span className="w-2.5 h-2.5 rounded-full bg-teal-400" />Volume</span>
              <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" />Alerts</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="gVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(8,13,24,0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' }}
                  cursor={{ stroke: 'rgba(13,148,136,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#gVol)" dot={false} activeDot={{ r: 6, fill: '#0d9488', stroke: 'rgba(13,148,136,0.3)', strokeWidth: 4 }} />
                <Area type="monotone" dataKey="alerts" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#gAlerts)" dot={false} activeDot={{ r: 5, fill: '#f43f5e' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Breakdown */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Severity Overview</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  paddingAngle={4} dataKey="value">
                  {severityData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(8,13,24,0.95)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5 mt-4">
            {severityData.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-semibold text-white/55">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.name}
                </span>
                <span className="font-bold text-white/40">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table + Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Scans Table */}
        <div className="glass-card lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-white/6">
            <h3 className="text-lg font-bold text-white tracking-tight">Recent High-Risk Cases</h3>
            <button className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors uppercase tracking-widest">View Log</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  {['Medications', 'Severity', 'Time', 'AI Confidence', ''].map(h => (
                    <th key={h} className="py-3 px-5 text-[10px] font-bold text-white/25 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.recent_high_risk?.map((item: any, i: number) => {
                  const safeTime = isNaN(Date.parse(item.time)) ? item.time : new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <TableRow key={i} title={item.title} desc={item.desc} severity={item.severity}
                      time={safeTime} confidence={item.confidence} />
                  );
                })}
                {!stats?.recent_high_risk?.length && (
                  <tr><td colSpan={5} className="text-center py-16 text-white/25 font-medium text-sm">No recent high risk cases logged.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Clock size={16} className="text-white/30" />
            <h3 className="text-lg font-bold text-white tracking-tight">Activity Timeline</h3>
          </div>
          <div className="relative flex flex-col gap-0">
            <div className="timeline-line" />
            {activityTimeline.map((item, i) => {
              const dot = item.severity === 'critical' ? 'text-rose-400 border-rose-500/50' :
                item.severity === 'major' ? 'text-amber-400 border-amber-500/50' : 'text-emerald-400 border-emerald-500/50';
              return (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex gap-4 pb-5 pl-10 relative">
                  <div className={`timeline-dot ${dot} absolute left-[15px]`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white/75 leading-snug">{item.event}</p>
                    <p className="text-[11px] text-white/30 font-medium mt-1">{item.user} · {item.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Infrastructure */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">Safety Infrastructure</h3>
          <div className="flex items-center gap-2.5 badge badge-emerald !py-2 !px-4 !rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <HealthItem icon={Database} label="AI Advisor Engine" status="Optimal" progress={100} color="from-emerald-500 to-emerald-400" glow="rgba(16,185,129,0.6)" />
          <HealthItem icon={Zap}      label="Clinical Server Link" status={stats?.uptime || '99.99%'} progress={99.9} color="from-blue-500 to-blue-400" glow="rgba(59,130,246,0.6)" />
          <HealthItem icon={Gauge}    label="Avg. Response Time" status="142ms" progress={25} color="from-violet-500 to-violet-400" glow="rgba(139,92,246,0.6)" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, badge, color, progress }: any) {
  const c = colorMap[color];
  return (
    <div className="glass-card p-6 flex flex-col gap-5 cursor-pointer group relative overflow-hidden">
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
        style={{ background: c.glow, filter: 'blur(24px)' }} />
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
          <div className="confidence-bar mb-2">
            <div className="confidence-fill" style={{ width: `${progress}%` }} />
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
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider px-2 py-1 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.06)' }}>{status}</span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000', color)}
          style={{ width: `${progress}%`, boxShadow: `0 0 8px ${glow}` }} />
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
          <div className="flex-1 max-w-[60px] confidence-bar">
            <div className="confidence-fill" style={{ width: `${confidence}%` }} />
          </div>
        </div>
      </td>
      <td className="py-4 px-5 text-right">
        <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-teal-500/20 opacity-0 group-hover:opacity-100 transition-all border border-white/8 ml-auto">
          <ExternalLink size={14} />
        </button>
      </td>
    </tr>
  );
}
