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
  { name: 'Contraindicated', value: 342, color: '#f43f5e' }, // Rose 500
  { name: 'Major', value: 854, color: '#f59e0b' }, // Amber 500
  { name: 'Moderate', value: 2104, color: '#3b82f6' }, // Blue 500
  { name: 'Low', value: 5841, color: '#10b981' }, // Emerald 500
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
    <div className="flex flex-col gap-8 pb-12 font-sans bg-[#f8fafc]/50 -m-4 sm:-m-8 p-4 sm:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">Analytics Dashboard</h2>
          <p className="text-slate-500 font-medium text-sm">System performance and clinical interaction metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 font-medium rounded-full px-5 py-2 hover:bg-slate-50 transition-colors shadow-sm text-sm flex items-center gap-2">
              <Download size={16} />
              Export
          </button>
          <button onClick={fetchStats} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full px-5 py-2 hover:opacity-90 transition-opacity shadow-sm shadow-blue-500/20 text-sm flex items-center gap-2">
              <RefreshCw size={16} />
              Refresh
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          trend="-2.1% from yesterday" 
          trendUp={false}
          icon={AlertTriangle} 
          color="rose"
        />
        <StatCard 
          title="Daily Users" 
          value={stats?.active_users?.toLocaleString() || "2,841"} 
          trend="+5.4% this week" 
          trendUp={true}
          icon={Users} 
          color="violet"
        />
        <StatCard 
          title="AI Accuracy" 
          value={`${stats?.ai_accuracy || 99.8}%`} 
          trend="Target: 99.5%" 
          trendUp={true}
          icon={BrainCircuit} 
          color="emerald"
        />
      </div>

      {/* 2. ANALYTICS CHARTS - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interaction Trends */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-lg font-bold text-slate-800">Interaction Analysis Trends</h3>
               <p className="text-xs text-slate-500">Volume of AI interaction checks over the last 7 days.</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="interactions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInteractions)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Risk Distribution</h3>
            <p className="text-xs text-slate-500">Severity classification across all queries.</p>
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
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">9.1k</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs font-semibold text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ANALYTICS CHARTS - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Searched Drugs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Most Queried Drugs</h3>
             <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
          </div>
          <div className="space-y-5">
            {stats?.top_drugs?.map((item: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-700 font-bold">{item.label}</span>
                  <span className="text-slate-500 font-medium">{item.count} queries</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
            {!stats?.top_drugs?.length && (
              <div className="py-8 text-center text-slate-400 text-sm">No drugs queried yet. Wait for incoming RAG requests.</div>
            )}
          </div>
        </div>

        {/* Emergency Alerts Graph */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
           <div className="flex justify-between items-center mb-6">
              <div>
                 <h3 className="text-lg font-bold text-slate-800">Emergency Alert Volume</h3>
                 <p className="text-xs text-slate-500">Contraindicated interactions detected over time.</p>
              </div>
           </div>
           <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="alerts" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: RECENT ANALYSIS TABLE & USER ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Analysis Queries</h3>
            <button className="text-blue-600 font-semibold text-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 px-2">Drugs Checked</th>
                  <th className="pb-3 px-2">Severity</th>
                  <th className="pb-3 px-2">Timestamp</th>
                  <th className="pb-3 px-2">Confidence</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats?.recent_high_risk?.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2">
                       <span className="font-semibold text-slate-800">{item.title}</span>
                    </td>
                    <td className="py-3 px-2 flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", item.severity === 'High' ? 'bg-rose-500' : 'bg-amber-500')}></div>
                      <span className="font-semibold text-slate-700">{item.severity} Risk</span>
                    </td>
                    <td className="py-3 px-2 text-slate-500">{item.time}</td>
                    <td className="py-3 px-2">
                       <div className="flex items-center gap-2">
                         <span className="font-bold text-slate-700">{item.confidence}%</span>
                         <div className="w-12 bg-slate-100 rounded-full h-1.5">
                           <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${item.confidence}%` }}></div>
                         </div>
                       </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Complete</span>
                    </td>
                  </tr>
                ))}
                {!stats?.recent_high_risk?.length && (
                   <tr>
                     <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                        No recent interaction queries to display.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">User Activity</h3>
          <div className="space-y-6">
            {userActivity.map((activity, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== userActivity.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-slate-100"></div>
                )}
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs ring-4 ring-white z-10 shrink-0">
                  {activity.avatar}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-bold text-slate-800">{activity.user}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{activity.action}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
                    <Clock size={12} /> {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: AI SYSTEM STATUS & ALERT CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI SYSTEM STATUS */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">AI System Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <StatusCard icon={Database} label="Pinecone Vector DB" status="Operational" latency="24ms" active={true} />
             <StatusCard icon={BrainCircuit} label="LLM Inference (GPT-4 Turbo)" status="Operational" latency="1.2s" active={true} />
             <StatusCard icon={Server} label="FastAPI Backend" status={`${stats?.uptime || "99.99%"} Uptime`} latency="45ms" active={true} />
             <StatusCard icon={Zap} label="RAG Retrieval Engine" status="Optimal" latency="112ms" active={true} />
          </div>
        </div>

        {/* ALERT CENTER */}
        <div className="bg-rose-50 rounded-2xl shadow-sm border border-rose-100 p-6">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
               <BellRing size={20} />
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-800">Alert Center</h3>
               <p className="text-xs text-rose-600/80 font-medium tracking-wide">EMERGENCY REPORTS</p>
             </div>
           </div>
           
           <div className="space-y-3">
             <AlertItem title="Multiple Contraindications" desc="3 high-risk alerts in last 10 mins" time="Just now" />
             <AlertItem title="API Rate Limit Warning" desc="Pinecone DB 80% capacity" time="1h ago" type="warn" />
             <AlertItem title="System Updated" desc="New clinical guidelines loaded" time="3h ago" type="info" />
           </div>
           
           <button className="w-full mt-6 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-bold shadow-sm hover:bg-rose-50 transition-colors">
             View All Alerts
           </button>
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function StatCard({ title, value, trend, trendUp, icon: Icon, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", colorMap[color])}>
          <Icon size={24} />
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full", trendUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
          {trendUp ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
          {trend}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-slate-500">{title}</p>
    </div>
  );
}

function StatusCard({ icon: Icon, label, status, latency, active }: any) {
  return (
    <div className="border border-slate-100 rounded-xl p-4 flex items-center justify-between hover:border-slate-200 transition-colors bg-slate-50/50">
      <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm">
           <Icon size={18} />
         </div>
         <div>
           <p className="text-sm font-bold text-slate-800">{label}</p>
           <p className="text-xs text-slate-500 mt-0.5">{status}</p>
         </div>
      </div>
      <div className="text-right">
        <div className="flex justify-end mb-1">
          {active ? (
            <CheckCircle2 size={16} className="text-emerald-500" />
          ) : (
            <AlertCircle size={16} className="text-rose-500" />
          )}
        </div>
        <span className="text-xs font-bold text-slate-400">{latency} run</span>
      </div>
    </div>
  );
}

function AlertItem({ title, desc, time, type = "error" }: any) {
  return (
    <div className="bg-white rounded-xl p-3 border border-rose-100/50 flex gap-3 shadow-sm">
      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ 
        backgroundColor: type === 'error' ? '#f43f5e' : type === 'warn' ? '#f59e0b' : '#3b82f6' 
      }}></div>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">{time}</p>
      </div>
    </div>
  );
}
