import React, { useState, useEffect } from 'react';
import { FileText, Mic, AlertTriangle, Ban, BrainCircuit, CheckCircle2, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { checkInteractionsApi, getHistoryApi } from '../services/api';
import { AnalysisResult, Severity } from '../types';
import { cn } from '../utils';
import { toast } from 'sonner';
import { Skeleton } from '../components/ui/Skeleton';

export default function DrugCheckerPage() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [recentChecks, setRecentChecks] = useState<any[]>([]);

  useEffect(() => { getHistoryApi().then(d => setRecentChecks(d.slice(0, 5))); }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true); setResult(null);
    const toastId = toast.loading('Initiating AI protocol...');
    try {
      const data = await checkInteractionsApi(inputText);
      setResult(data);
      if (data.highRiskAlerts > 0) toast.error(`Found ${data.highRiskAlerts} critical anomalies!`, { id: toastId });
      else toast.success('Analysis Complete: Payload clear.', { id: toastId });
      getHistoryApi().then(d => setRecentChecks(d.slice(0, 5)));
    } catch {
      toast.error('System failure. Please check network uplink.', { id: toastId });
    } finally { setIsAnalyzing(false); }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          Pharmacological <span className="text-gradient text-gradient-blue">Analysis Engine</span>
        </h2>
        <p className="text-white/40 text-lg font-medium">Input biological payloads for deep contraindication screening.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Input Card */}
          <div className="glass-card p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/6 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-blue-500/10 transition-colors duration-1000 pointer-events-none" />
            <div className="flex justify-between items-center mb-6 border-b border-white/6 pb-5 relative z-10">
              <h3 className="text-base font-bold text-white flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass-card !rounded-xl !p-0 flex items-center justify-center text-blue-400">
                  <FileText size={17} strokeWidth={2} />
                </div>
                Data Payload
              </h3>
              <button className="btn-ghost !py-2 !px-4 !text-xs !rounded-xl flex items-center gap-2">
                <Mic size={14} /> <span className="hidden sm:inline">Voice Link</span>
              </button>
            </div>
            <div className="relative mb-6 z-10">
              <textarea
                className={cn(
                  'w-full rounded-2xl p-5 min-h-[180px] resize-none outline-none text-base text-white/80 leading-relaxed transition-all duration-300',
                  'border border-white/8 focus:border-blue-500/40 focus:ring-2',
                  isAnalyzing && 'opacity-40 pointer-events-none'
                )}
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  fontFamily: '"JetBrains Mono", monospace',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.2) inset',
                  '--tw-ring-color': 'rgba(59,130,246,0.15)',
                } as any}
                placeholder={'// Enter chemical sequences or plain-text medication regimens...\n// Example: Lisinopril 20mg, Warfarin 5mg, Ibuprofen...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                {inputText.length} bytes
              </div>
            </div>
            <div className="flex justify-end z-10 relative">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="btn-primary !rounded-2xl disabled:opacity-40 disabled:hover:transform-none disabled:cursor-not-allowed"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} fill="currentColor" />}
                {isAnalyzing ? 'Processing Sequences...' : 'Initialize Scan'}
              </button>
            </div>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div key="skel" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-3xl !bg-white/4 border border-white/6" />)}
                </div>
                <Skeleton className="h-48 rounded-3xl !bg-white/4 border border-white/6" />
              </motion.div>
            )}
            {result && !isAnalyzing && (
              <motion.div key="result" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} className="flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatItem label="Entities"      value={result.totalDrugs}         color="blue" />
                  <StatItem label="Anomalies"     value={result.interactionsFound}   color="violet" />
                  <StatItem label="Critical"      value={result.highRiskAlerts}      color="rose" />
                  <StatItem label="Safe Pathways" value={result.safeCombinations}    color="emerald" />
                </div>
                {/* Results list */}
                <div className="glass-card overflow-hidden">
                  <div className="p-5 border-b border-white/6 flex justify-between items-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <h3 className="text-base font-bold text-white">Intelligence Report</h3>
                    <span className="badge badge-blue">{result.interactions.length} Logs</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {result.interactions.map((interaction, i) => (
                      <InteractionItem key={i} interaction={interaction} index={i} />
                    ))}
                    {result.interactions.length === 0 && (
                      <div className="p-16 text-center flex flex-col items-center">
                        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20 glow-emerald">
                          <CheckCircle2 size={40} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Green Protocols Established</h4>
                        <p className="text-white/35 font-medium max-w-xs leading-relaxed text-sm">No hostile interactions classified.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Neural Core */}
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-transparent" />
            <div className="flex items-center gap-4 mb-6 border-b border-white/6 pb-5">
              <div className="w-12 h-12 rounded-2xl glass-card !rounded-xl !p-0 flex items-center justify-center text-blue-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/15 blur-lg" />
                <BrainCircuit size={24} strokeWidth={1.5} className="relative z-10" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Neural Core</h3>
                <p className="text-[10px] text-blue-400/70 font-bold uppercase tracking-widest mt-0.5">Generative Model</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {result?.clinicalInsights.map((insight, i) => (
                <div key={i} className="p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <h4 className={cn('text-xs font-bold flex items-start gap-2.5 mb-2 uppercase tracking-wide',
                    insight.severity==='error' ? 'text-rose-400' : insight.severity==='warning' ? 'text-amber-400' : 'text-emerald-400')}>
                    <span className={cn('w-2 h-2 rounded-sm shrink-0 mt-0.5',
                      insight.severity==='error' ? 'bg-rose-500' : insight.severity==='warning' ? 'bg-amber-500' : 'bg-emerald-500')}
                      style={{ boxShadow: insight.severity==='error' ? '0 0 8px rgba(244,63,94,0.8)' : insight.severity==='warning' ? '0 0 8px rgba(245,158,11,0.8)' : '0 0 8px rgba(16,185,129,0.8)' }} />
                    {insight.title}
                  </h4>
                  <p className="text-sm text-white/50 leading-relaxed pl-4">{insight.description}</p>
                </div>
              )) || (
                <div className="border border-white/5 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[160px]">
                  <div className="w-8 h-8 border-2 border-white/15 border-t-blue-400 rounded-full animate-spin mb-4" />
                  <span className="text-white/25 font-mono text-xs uppercase tracking-widest">Awaiting Payload</span>
                </div>
              )}
            </div>
          </div>

          {/* Terminal log */}
          <div className="glass-card p-5 sm:p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Terminal Log</h3>
              <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest">Access DB</button>
            </div>
            <div className="flex flex-col gap-1">
              {recentChecks.map((check, i) => {
                const color = check.maxSeverity==='CONTRAINDICATED' ? 'bg-rose-500' :
                  check.maxSeverity==='MAJOR' ? 'bg-amber-500' :
                  check.maxSeverity==='MODERATE' ? 'bg-blue-500' : 'bg-emerald-500';
                return (
                  <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/4 transition-all cursor-pointer group border border-transparent hover:border-white/6">
                    <div className={cn('w-2 h-2 rounded-full shrink-0', color)} />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold text-white/70 truncate">{check.drugs.join(', ')}</p>
                      <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mt-0.5">
                        {new Date(check.timestamp).toLocaleTimeString([],{timeStyle:'short'})} · {check.issueCount > 0 ? `ERR:${check.issueCount}` : 'SAFE'}
                      </p>
                    </div>
                    <ExternalLink size={13} className="text-white/20 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                );
              })}
              {!recentChecks.length && <p className="text-white/20 text-xs font-mono uppercase tracking-widest text-center py-6">No registry entries.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color }: any) {
  const map: any = {
    blue:    { bg: 'rgba(59,130,246,0.08)',  text: 'text-blue-400',   border: 'rgba(59,130,246,0.2)',  glow: 'rgba(59,130,246,0.3)' },
    violet:  { bg: 'rgba(139,92,246,0.08)',  text: 'text-violet-400', border: 'rgba(139,92,246,0.2)',  glow: 'rgba(139,92,246,0.3)' },
    rose:    { bg: 'rgba(244,63,94,0.08)',   text: 'text-rose-400',   border: 'rgba(244,63,94,0.2)',   glow: 'rgba(244,63,94,0.3)' },
    emerald: { bg: 'rgba(16,185,129,0.08)',  text: 'text-emerald-400',border: 'rgba(16,185,129,0.2)',  glow: 'rgba(16,185,129,0.3)' },
  };
  const c = map[color];
  return (
    <div className="rounded-3xl p-5 flex flex-col gap-4 border hover:scale-[1.02] transition-all duration-300 cursor-default"
      style={{ background: c.bg, borderColor: c.border, boxShadow: `0 0 20px ${c.glow}` }}>
      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
      <span className={cn('text-4xl font-bold tracking-tighter', c.text)}>{value}</span>
    </div>
  );
}

function InteractionItem({ interaction, index }: { interaction: any; index: number }) {
  const sev = interaction.severity;
  const isContradicated = sev === Severity.CONTRAINDICATED;
  const isMajor = sev === Severity.MAJOR;
  const isModerate = sev === Severity.MODERATE;
  const severityStyles = isContradicated ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
    isMajor ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
    isModerate ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-white/5 text-white/50 border-white/10';
  const iconStyles = isContradicated ? 'bg-rose-500/15 text-rose-400 border-rose-500/25' :
    isMajor ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' :
    isModerate ? 'bg-blue-500/15 text-blue-400 border-blue-500/25' : 'bg-white/5 text-white/40 border-white/10';
  const leftBorder = isContradicated ? '#f43f5e' : isMajor ? '#f59e0b' : '#3b82f6';

  return (
    <div className="p-6 hover:bg-white/3 transition-colors group">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
        <div className="flex items-start gap-4">
          <span className="text-xs font-mono text-white/20 mt-3 hidden md:block">0{index+1}</span>
          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border', iconStyles)}>
            {isContradicated ? <Ban size={20} strokeWidth={2} /> : <AlertTriangle size={20} strokeWidth={2} />}
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-1 leading-tight">{interaction.drugs.join(' + ')}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-white/25 uppercase">{interaction.type}</span>
              <span className="w-1 h-1 rounded-full bg-white/15" />
              <span className="text-xs font-mono text-white/25">ID: {Math.random().toString(36).substr(2,6).toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end gap-2 pl-16 sm:pl-0 shrink-0">
          <span className={cn('badge text-[9px] border', severityStyles)}>{sev}</span>
          {interaction.confidence && (
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
              {(interaction.confidence * 100).toFixed(0)}% accuracy
            </span>
          )}
        </div>
      </div>
      <div className="ml-0 sm:ml-16 md:ml-[88px] border-l-2 pl-5 py-1" style={{ borderColor: `${leftBorder}40` }}>
        <p className="text-xs font-bold text-white/25 uppercase tracking-widest mb-2">Mechanism of Action</p>
        <p className="text-sm text-white/55 leading-relaxed mb-4">{interaction.mechanism}</p>
        <div className="inline-flex items-start gap-3 p-4 rounded-xl border border-white/8" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <span className="badge badge-blue !text-[9px] shrink-0 mt-0.5">Directive</span>
          <span className="text-sm text-white/65 font-medium leading-relaxed">{interaction.recommendation}</span>
        </div>
      </div>
    </div>
  );
}
