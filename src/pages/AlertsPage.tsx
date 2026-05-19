import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldCheck, Info, Bell, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { getAlertsApi, resolveAlertApi } from '../services/api';
import { toast } from 'sonner';
import { cn } from '../utils';

interface ClinicalAlert {
  id: number;
  severity: string;
  message: string;
  resolved: boolean;
  created_at: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<ClinicalAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await getAlertsApi();
      setAlerts(data);
    } catch {
      toast.error('Failed to load safety alerts feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id: number) => {
    const tid = toast.loading('Resolving clinical conflict...');
    try {
      await resolveAlertApi(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
      toast.success('Clinical alert successfully resolved & logged', { id: tid });
    } catch {
      toast.error('Failed to resolve alert', { id: tid });
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'active') return !a.resolved;
    if (filter === 'resolved') return a.resolved;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" style={{ boxShadow: '0 0 10px rgba(244,63,94,0.9)' }} />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping opacity-30" />
            </div>
            <span className="text-xs text-white/35 font-bold uppercase tracking-widest">Active Safety Feed</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">
            Clinical <span className="text-gradient text-gradient-blue">Alert Center</span>
          </h2>
          <p className="text-white/40 font-medium">Real-time prescription anomaly detection and clinical counter-measures.</p>
        </div>
        <button onClick={fetchAlerts} className="btn-primary !py-2.5 !px-5 !text-xs !rounded-xl !font-semibold flex items-center gap-2">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stats Summary & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 flex flex-col gap-3">
          {/* Filters Card */}
          <div className="glass-card p-5 flex flex-col gap-2">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 px-2">Feed Filter</h3>
            {[
              { id: 'active', label: 'Active Alerts', count: alerts.filter(a => !a.resolved).length },
              { id: 'resolved', label: 'Resolved Logs', count: alerts.filter(a => a.resolved).length },
              { id: 'all', label: 'All Activities', count: alerts.length },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex justify-between items-center",
                  filter === btn.id
                    ? "bg-teal-500/15 text-teal-400 border border-teal-500/25 shadow-lg shadow-teal-500/5"
                    : "text-white/50 border border-transparent hover:bg-white/5 hover:text-white"
                )}
              >
                <span>{btn.label}</span>
                <span className={cn(
                  "text-[10px] font-mono font-bold px-2 py-0.5 rounded-md",
                  filter === btn.id ? "bg-teal-500/20 text-teal-300" : "bg-white/5 text-white/30"
                )}>{btn.count}</span>
              </button>
            ))}
          </div>

          {/* Quick Warning Card */}
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-rose-500/5 blur-xl pointer-events-none" />
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Clinical Duty</h3>
            <p className="text-xs text-white/50 leading-relaxed font-medium">
              Medical professionals are advised to inspect all Critical &amp; Major alerts. Resolving an alert logs the action to the secure PostgreSQL audit ledger.
            </p>
          </div>
        </div>

        {/* Alerts Feed */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert) => {
              const isCrit = alert.severity === 'CRITICAL';
              const isWarn = alert.severity === 'WARNING';
              const color = isCrit ? 'rose' : isWarn ? 'amber' : 'teal';
              const Icon = isCrit ? AlertTriangle : isWarn ? Info : ShieldCheck;

              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "glass-card p-6 border flex gap-4 items-start relative overflow-hidden group hover:scale-[1.005] transition-all",
                    alert.resolved && "opacity-50",
                    isCrit ? "hover:border-rose-500/20" : isWarn ? "hover:border-amber-500/20" : "hover:border-teal-500/20"
                  )}
                >
                  {/* Left indicator bar */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-[4px]",
                    isCrit ? "bg-rose-500" : isWarn ? "bg-amber-500" : "bg-teal-500"
                  )} />

                  {/* Icon */}
                  <div className={cn(
                    "w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5",
                    isCrit ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                    isWarn ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    "bg-teal-500/10 text-teal-400 border-teal-500/20"
                  )}>
                    <Icon size={18} strokeWidth={2.5} />
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={cn(
                        "badge text-[9px] !py-0.5 !px-2 border uppercase",
                        isCrit ? "badge-rose border-rose-500/30" :
                        isWarn ? "badge-amber border-amber-500/30" :
                        "badge-emerald border-teal-500/30"
                      )}>{alert.severity}</span>
                      <span className="text-[10px] font-mono text-white/25">
                        {new Date(alert.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm font-semibold leading-relaxed mb-1 pr-6">
                      {alert.message}
                    </p>
                  </div>

                  {/* Resolve Button */}
                  {!alert.resolved && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="btn-ghost !p-2 rounded-xl text-teal-400 hover:text-teal-300 hover:bg-teal-500/15 border-teal-500/10 shrink-0 ml-2 self-center flex items-center gap-1.5 text-xs !font-bold"
                    >
                      <CheckCircle size={15} /> Resolve
                    </button>
                  )}
                  {alert.resolved && (
                    <div className="text-xs font-bold text-white/30 flex items-center gap-1.5 self-center shrink-0 border border-white/5 bg-white/3 px-3 py-1.5 rounded-xl">
                      <ShieldCheck size={14} className="text-teal-400" /> Resolved
                    </div>
                  )}
                </motion.div>
              );
            })}
            {filteredAlerts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card border-dashed p-16 text-center flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">No Active Alerts</h4>
                <p className="text-white/30 font-medium text-sm max-w-xs leading-relaxed">
                  Your safety feed is clear! There are no unresolved clinical warnings.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
