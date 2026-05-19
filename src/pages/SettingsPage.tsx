import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bell, Database, Shield, Zap, Plus, X, Trash2, Power, AlertTriangle } from 'lucide-react';
import { getRemindersApi, createReminderApi, toggleReminderApi, deleteReminderApi } from '../services/api';
import { toast } from 'sonner';
import { cn } from '../utils';

interface MedicationReminder {
  id: number;
  medication_name: string;
  dosage: string;
  time: string;
  frequency: string;
  active: boolean;
}

export default function SettingsPage() {
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState('Daily');

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const data = await getRemindersApi();
      setReminders(data);
    } catch {
      toast.error('Failed to load medication reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleToggle = async (id: number) => {
    try {
      const res = await toggleReminderApi(id);
      setReminders(prev => prev.map(r => r.id === id ? { ...r, active: res.active } : r));
      toast.success(res.active ? 'Reminder scheduled' : 'Reminder suspended');
    } catch {
      toast.error('Failed to toggle reminder status');
    }
  };

  const handleDelete = async (id: number) => {
    const tid = toast.loading('Deleting scheduling record...');
    try {
      await deleteReminderApi(id);
      setReminders(prev => prev.filter(r => r.id !== id));
      toast.success('Reminder removed successfully', { id: tid });
    } catch {
      toast.error('Failed to delete reminder', { id: tid });
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;
    const tid = toast.loading('Scheduling clinical reminder...');
    try {
      const newRem = await createReminderApi({
        medication_name: medName,
        dosage,
        time,
        frequency
      });
      setReminders(prev => [newRem, ...prev]);
      setShowAddForm(false);
      setMedName('');
      setDosage('');
      toast.success('Medication compliance schedule locked', { id: tid });
    } catch {
      toast.error('Failed to add compliance schedule', { id: tid });
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          System <span className="text-gradient text-gradient-blue">Control Hub</span>
        </h2>
        <p className="text-white/40 text-lg font-medium">Configure profile settings, active patient reminder compliance schedules, and system telemetry.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Clinician Profile */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-teal-500/5 blur-xl pointer-events-none" />
            <h3 className="text-base font-bold text-white flex items-center gap-3 mb-6 border-b border-white/6 pb-5">
              <div className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-teal-400">
                <User size={18} />
              </div>
              Clinician Profile
            </h3>
            
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-20 h-20 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center text-3xl font-bold text-white relative">
                DS
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-400 border-[3px] border-[#080d18]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Dr. Elizabeth Smith</h4>
                <p className="text-xs text-teal-400/80 font-bold uppercase tracking-wider mt-1">Chief Pharmacotherapist</p>
                <p className="text-[11px] text-white/30 font-mono mt-0.5">NPI: 1982736450</p>
              </div>
            </div>

            <div className="space-y-3.5 mt-4 pt-4 border-t border-white/6">
              {[
                { label: 'Hospital Affiliate', val: 'Mayo Clinic Advanced Diagnostics' },
                { label: 'Clinical Specialty', val: 'Cardiovascular Therapeutics' },
                { label: 'System Access Role', val: 'System Administrator' },
              ].map(f => (
                <div key={f.label} className="flex justify-between items-center text-xs">
                  <span className="text-white/40 font-semibold">{f.label}</span>
                  <span className="text-white/80 font-bold">{f.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry diagnostics */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-3 mb-6 border-b border-white/6 pb-5">
              <div className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-sky-400">
                <Database size={18} />
              </div>
              Platform Telemetry
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Database Uplink', val: 'SQLAlchemy / SQLite Persisted', ok: true },
                { label: 'ChromaDB Persistence', val: '2,481 Medical Vectors Indexed', ok: true },
                { label: 'PubMedBERT Embeddings', val: 'Active (pritamdeka/BioBERT-mnli)', ok: true },
                { label: 'OCR Extraction Engine', val: 'Tesseract OCR Runtime Connected', ok: true },
              ].map((t, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", t.ok ? "bg-emerald-400" : "bg-rose-500")}
                    style={{ boxShadow: t.ok ? '0 0 6px rgba(52,211,153,0.8)' : '0 0 6px rgba(244,63,94,0.8)' }} />
                  <div>
                    <p className="text-xs font-bold text-white/80 leading-none mb-1">{t.label}</p>
                    <p className="text-[10px] text-white/35 font-mono leading-tight">{t.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Reminders Scheduling System */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="glass-card p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-white/6 pb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-teal-400">
                  <Bell size={18} />
                </div>
                Adherence Scheduling Feed
              </h3>
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary !py-2 !px-4 !text-xs !rounded-xl">
                {showAddForm ? <X size={15} /> : <Plus size={15} />}
                {showAddForm ? 'Cancel' : 'Schedule Medication'}
              </button>
            </div>

            {/* Add Schedule Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form onSubmit={handleAdd} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border border-white/10 rounded-2xl p-5 flex flex-col gap-4 relative" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Medication Name</label>
                      <input type="text" required value={medName} onChange={e => setMedName(e.target.value)} placeholder="e.g. Aspirin"
                        className="bg-black/20 text-sm border border-white/8 rounded-xl p-3 outline-none text-white focus:border-teal-500/40" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Dosage Amount</label>
                      <input type="text" value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g. 81mg"
                        className="bg-black/20 text-sm border border-white/8 rounded-xl p-3 outline-none text-white focus:border-teal-500/40" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Administration Time</label>
                      <input type="time" value={time} onChange={e => setTime(e.target.value)}
                        className="bg-black/20 text-sm border border-white/8 rounded-xl p-3 outline-none text-white focus:border-teal-500/40" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Frequency Interval</label>
                      <select value={frequency} onChange={e => setFrequency(e.target.value)}
                        className="bg-black/20 text-sm border border-white/8 rounded-xl p-3 outline-none text-white/80 focus:border-teal-500/40 cursor-pointer">
                        <option value="Daily">Daily administration</option>
                        <option value="Twice Daily">Twice daily (AM/PM)</option>
                        <option value="Weekly">Weekly schedule</option>
                        <option value="As Needed (PRN)">As needed (PRN)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="btn-primary !rounded-xl !py-2.5 !px-5 !text-xs !font-bold">Lock Reminders</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* List */}
            <div className="flex flex-col gap-3">
              {reminders.map(rem => (
                <div key={rem.id} className={cn(
                  "flex items-center justify-between p-4 border rounded-2xl group hover:bg-white/3 transition-all",
                  rem.active ? "border-white/8" : "border-white/5 opacity-55"
                )}>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleToggle(rem.id)} className={cn(
                      "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors",
                      rem.active ? "bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20" : "bg-white/5 text-white/35 border-white/8 hover:bg-white/10"
                    )}>
                      <Power size={16} />
                    </button>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        {rem.medication_name} {rem.dosage && <span className="text-[10px] bg-white/5 border border-white/6 px-1.5 py-0.5 rounded text-white/50">{rem.dosage}</span>}
                      </h4>
                      <p className="text-[11px] text-white/35 font-medium mt-1">
                        ⏱️ Scheduled: {rem.time} · {rem.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "badge text-[9px] !py-0.5 !px-2 border uppercase",
                      rem.active ? "badge-emerald border-teal-500/20" : "bg-white/5 text-white/30 border-white/10"
                    )}>{rem.active ? 'ACTIVE' : 'SUSPENDED'}</span>
                    <button onClick={() => handleDelete(rem.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {reminders.length === 0 && !loading && (
                <div className="border border-white/5 border-dashed rounded-2xl p-12 text-center text-white/25 font-mono text-xs uppercase tracking-wider">
                  No adherence schedules currently locked.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
