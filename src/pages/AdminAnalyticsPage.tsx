import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  BrainCircuit, 
  RefreshCw,
  Database,
  Zap,
  Gauge,
  ExternalLink,
  Activity,
  Server,
  ShieldAlert,
  Clock,
  CheckCircle2,
  MoreVertical,
  Download,
  BellRing,
  AlertCircle
} from 'lucide-react';
import { cn } from '../utils';
import { getSystemStatsApi } from '../services/api';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const trendData = [
  { name: 'Mon', interactions: 420 },
  { name: 'Tue', interactions: 580 },
  { name: 'Wed', interactions: 510 },
  { name: 'Thu', interactions: 690 },
  { name: 'Fri', interactions: 820 },
  { name: 'Sat', interactions: 740 },
  { name: 'Sun', interactions: 910 },
];

const alertData = [
  { name: 'Mon', alerts: 12 },
  { name: 'Tue', alerts: 18 },
  { name: 'Wed', alerts: 15 },
  { name: 'Thu', alerts: 24 },
  { name: 'Fri', alerts: 32 },
  { name: 'Sat', alerts: 28 },
  { name: 'Sun', alerts: 35 },
];

const riskData = [
  { name: 'Contraindicated', value: 342, color: '#f43f5e' }, // Rose
  { name: 'Major', value: 854, color: '#fb7185' }, // Soft Rose
  { name: 'Moderate', value: 2104, color: '#38bdf8' }, // Sky-Blue
  { name: 'Low', value: 5841, color: '#34d399' }, // Emerald
];

const userActivity = [
  { user: 'Dr. Sarah J.', action: 'Checked Warfarin + Aspirin', time: '2m ago', avatar: 'SJ' },
  { user: 'Dr. Michael C.', action: 'Exported monthly report', time: '15m ago', avatar: 'MC' },
  { user: 'System', action: 'Vector DB re-indexed', time: '1h ago', avatar: 'SYS' },
  { user: 'Pharm. Emily R.', action: 'Checked setup configuration', time: '2h ago', avatar: 'ER' },
  { user: 'Admin', action: 'Updated safety thresholds', time: '4h ago', avatar: 'AD' },
];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  
  const fetchStats = async () => {
    try {
      const data = await getSystemStatsApi();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
            <span className="text-xs text-white/35 font-bold uppercase tracking-widest font-sans">Live System Metrics</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">System Diagnostics</h2>
          <p className="text-white/40 font-medium">Real-time patient safety metrics, API latency, and clinical database health.</p>
        </div>
        <div className="hidden md:flex gap-3">
          <button className="btn-ghost !py-2.5 !px-5 !text-xs !rounded-xl !font-semibold flex items-center gap-2">
            <Download size={14} /> Export Report
          </button>
          <button onClick={fetchStats} className="btn-primary !py-2.5 !px-5 !text-xs !rounded-xl !font-semibold flex items-center gap-2">
            <RefreshCw size={14} /> Refresh Diagnostics
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Checks" 
          value={stats?.total_checks?.toLocaleString() || "14,285"} 
          trend="+12.5% this week" 
          trendUp={true}
          icon={Activity} 
          color="blue"
        />
        <StatCard 
          title="High Risk Cases" 
          value={stats?.high_risk_cases?.toLocaleString() || "342"} 
          trend="-2.1% vs yesterday" 
          trendUp={false}
          icon={AlertTriangle} 
          color="rose"
        />
        <StatCard 
          title="Daily Active Clinicians" 
          value={stats?.active_users?.toLocaleString() || "2,841"} 
          trend="+5.4% this week" 
          trendUp={true}
          icon={Users} 
          color="violet"
        />
        <StatCard 
          title="AI Safety Accuracy" 
          value={`${stats?.ai_accuracy || 99.8}%`} 
          trend="Target: 99.5%" 
          trendUp={true}
          icon={BrainCircuit} 
          color="emerald"
        />
      </div>

      {/* 2. ANALYTICS CHARTS - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interaction Trends */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-lg font-bold text-white tracking-tight">Interaction Analysis Trends</h3>
               <p className="text-xs text-white/35 font-medium">Volume of AI interaction checks over the last 7 days.</p>
            </div>
            <select className="text-xs font-bold text-white/50 bg-white/5 border border-white/8 rounded-xl px-3 py-2 outline-none focus:border-teal-500/50 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }} dx={-5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(8,13,24,0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' }} 
                  itemStyle={{ color: '#2dd4bf', fontWeight: 700 }}
                  cursor={{ stroke: 'rgba(13,148,136,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="interactions" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorInteractions)" activeDot={{ r: 6, fill: '#0d9488', stroke: 'rgba(13,148,136,0.3)', strokeWidth: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="glass-card p-6 flex flex-col">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Risk Stratification</h3>
            <p className="text-xs text-white/35 font-medium">Severity classification across clinical checks.</p>
          </div>
          <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(8,13,24,0.95)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">9,141</span>
              <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest mt-0.5">Total Cases</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4 pt-4 border-t border-white/6">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs font-semibold text-white/60">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ANALYTICS CHARTS - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Most Searched Drugs */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-white tracking-tight">Most Checked Medications</h3>
             <button className="text-white/40 hover:text-white/70"><MoreVertical size={18} /></button>
          </div>
          <div className="space-y-5">
            {stats?.top_drugs?.map((item: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5 font-medium">
                  <span className="text-white/80 font-semibold">{item.label}</span>
                  <span className="text-white/45">{item.count} queries</span>
                </div>
                <div className="w-full bg-white/5 border border-white/5 rounded-full h-2">
                  <div className="bg-gradient-to-r from-teal-500 to-sky-400 h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
            {!stats?.top_drugs?.length && (
              <div className="py-8 text-center text-white/30 text-sm font-medium">No drugs queried yet. Wait for incoming RAG requests.</div>
            )}
          </div>
        </div>

        {/* Emergency Alerts Graph */}
        <div className="glass-card p-6">
           <div className="flex justify-between items-center mb-6">
              <div>
                 <h3 className="text-lg font-bold text-white tracking-tight">Contraindicated Advisory Volume</h3>
                 <p className="text-xs text-white/35 font-medium">Contraindicated interactions detected over time.</p>
              </div>
           </div>
           <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }} dx={-5} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: 'rgba(8,13,24,0.95)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} 
                />
                <Bar dataKey="alerts" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: RECENT ANALYSIS TABLE & USER ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-white/6">
            <h3 className="text-lg font-bold text-white tracking-tight">Recent High-Risk Cases</h3>
            <button className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors uppercase tracking-widest font-sans">View Log</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-3 px-5 text-[10px] font-bold text-white/25 uppercase tracking-widest">Medications Checked</th>
                  <th className="py-3 px-5 text-[10px] font-bold text-white/25 uppercase tracking-widest">Severity</th>
                  <th className="py-3 px-5 text-[10px] font-bold text-white/25 uppercase tracking-widest">Timestamp</th>
                  <th className="py-3 px-5 text-[10px] font-bold text-white/25 uppercase tracking-widest">Confidence</th>
                  <th className="py-3 px-5 text-[10px] font-bold text-white/25 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats?.recent_high_risk?.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-3.5 px-5">
                       <span className="font-semibold text-white">{item.title}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", item.severity === 'High' ? 'bg-rose-500' : 'bg-amber-500')}></div>
                        <span className="font-semibold text-white/80">{item.severity} Risk</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-white/40">{item.time}</td>
                    <td className="py-3.5 px-5">
                       <div className="flex items-center gap-3">
                         <span className="font-bold text-teal-400">{item.confidence}%</span>
                         <div className="w-12 bg-white/5 border border-white/5 rounded-full h-1.5 overflow-hidden">
                           <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${item.confidence}%` }}></div>
                         </div>
                       </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="badge badge-emerald">Verified</span>
                    </td>
                  </tr>
                ))}
                {!stats?.recent_high_risk?.length && (
                   <tr>
                     <td colSpan={5} className="text-center py-12 text-white/25 font-medium text-sm">
                        No recent interaction queries to display.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Activity */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Active Clinician Feed</h3>
          <div className="space-y-6">
            {userActivity.map((activity, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== userActivity.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-white/5"></div>
                )}
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-teal-300 font-bold text-xs ring-4 ring-[#0b0f19] z-10 shrink-0">
                  {activity.avatar}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-bold text-white">{activity.user}</p>
                  <p className="text-sm text-white/60 mt-0.5">{activity.action}</p>
                  <p className="text-xs text-white/30 font-medium mt-1 flex items-center gap-1">
                    <Clock size={12} /> {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: AI SYSTEM STATUS & ALERT CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI SYSTEM STATUS */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 tracking-tight">AI Infrastructure Health</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <StatusCard icon={Database} label="Chroma Vector DB" status="Operational" latency="14ms" active={true} />
             <StatusCard icon={BrainCircuit} label="Local Scikit-Learn Model" status="Operational" latency="28ms" active={true} />
             <StatusCard icon={Server} label="FastAPI Server" status={`${stats?.uptime || "99.99%"} Uptime`} latency="32ms" active={true} />
             <StatusCard icon={Zap} label="RAG Advisory Synthesizer" status="Optimal" latency="95ms" active={true} />
          </div>
        </div>

        {/* ALERT CENTER */}
        <div className="glass-card !border-rose-900/30 p-6 flex flex-col relative overflow-hidden group">
           <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 bg-rose-500 filter blur-[20px]" />
           <div className="flex items-center gap-3 mb-6 relative z-10">
             <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center glow-rose">
               <BellRing size={20} />
             </div>
             <div>
               <h3 className="text-lg font-bold text-white tracking-tight">Safety Alert Feed</h3>
               <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest mt-0.5">Critical Notifications</p>
             </div>
           </div>
           
           <div className="space-y-3 flex-1 relative z-10">
             <AlertItem title="Multiple Contraindications" desc="3 high-risk advisories in last 10 mins" time="Just now" />
             <AlertItem title="Local Server Refresh" desc="FastAPI endpoint checked successfully" time="1h ago" type="warn" />
             <AlertItem title="Safety Guidelines Sync" desc="Offline clinical rules successfully indexed" time="3h ago" type="info" />
           </div>
           
           <button className="w-full mt-6 py-2.5 bg-white/5 border border-white/8 text-white hover:bg-white/10 rounded-xl text-xs font-bold shadow-sm transition-all uppercase tracking-wider font-sans">
             View All Safety Alerts
           </button>
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function StatCard({ title, value, trend, trendUp, icon: Icon, color }: any) {
  const colorMap: any = {
    blue:    { icon: 'text-teal-400',   bg: 'rgba(13,148,136,0.1)',  grad: 'from-teal-500 to-teal-400',   glow: 'rgba(13,148,136,0.4)' },
    rose:    { icon: 'text-rose-400',   bg: 'rgba(244,63,94,0.1)',   grad: 'from-rose-500 to-rose-400',   glow: 'rgba(244,63,94,0.4)' },
    violet:  { icon: 'text-sky-400', bg: 'rgba(14,165,233,0.1)',  grad: 'from-sky-500 to-sky-400',glow: 'rgba(14,165,233,0.4)' },
    emerald: { icon: 'text-emerald-400',bg: 'rgba(16,185,129,0.1)',  grad: 'from-emerald-500 to-emerald-400',glow:'rgba(16,185,129,0.4)' },
  };
  const c = colorMap[color];
  
  return (
    <div className="glass-card p-6 flex flex-col gap-5 cursor-pointer group relative overflow-hidden">
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" style={{ background: c.glow, filter: 'blur(20px)' }} />
      <div className="flex justify-between items-start">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border border-white/5", c.icon)} style={{ background: c.bg }}>
          <Icon size={21} strokeWidth={1.75} />
        </div>
        <div className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/5", trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
          {trendUp ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, label, status, latency, active }: any) {
  return (
    <div className="border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/10 transition-all bg-white/2">
      <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-teal-300 shadow-sm">
           <Icon size={18} />
         </div>
         <div>
           <p className="text-sm font-bold text-white">{label}</p>
           <p className="text-xs text-white/40 mt-0.5 font-medium">{status}</p>
         </div>
      </div>
      <div className="text-right">
        <div className="flex justify-end mb-1">
          {active ? (
            <CheckCircle2 size={16} className="text-emerald-400" />
          ) : (
            <AlertCircle size={16} className="text-rose-400" />
          )}
        </div>
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{latency}</span>
      </div>
    </div>
  );
}

function AlertItem({ title, desc, time, type = "error" }: any) {
  return (
    <div className="bg-white/2 rounded-xl p-3 border border-white/5 flex gap-3 shadow-sm hover:border-white/10 transition-colors">
      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ 
        backgroundColor: type === 'error' ? '#f43f5e' : type === 'warn' ? '#fb7185' : '#38bdf8' 
      }}></div>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-xs text-white/40 mt-0.5 font-medium">{desc}</p>
        <p className="text-[9px] text-white/25 font-bold uppercase tracking-wider mt-2">{time}</p>
      </div>
    </div>
  );
}
