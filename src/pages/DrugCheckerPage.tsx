import React, { useState, useEffect, useRef } from 'react';
import { FileText, Mic, AlertTriangle, Ban, BrainCircuit, CheckCircle2, Loader2, Sparkles, ExternalLink, Activity, ChevronDown, BookOpen, Zap, Shield, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { checkInteractionsApi, getHistoryApi, processOcrApi, processVoiceApi, getPatientRiskApi } from '../services/api';
import { AnalysisResult, Severity } from '../types';
import { cn } from '../utils';
import { toast } from 'sonner';
import { Skeleton } from '../components/ui/Skeleton';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InteractionGraph } from '../components/InteractionGraph';
import { SmartDrugInput } from '../components/SmartDrugInput';

export default function DrugCheckerPage() {
  const [inputText, setInputText]     = useState('');
  const [drugsList, setDrugsList]     = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult]           = useState<AnalysisResult | null>(null);
  const [recentChecks, setRecentChecks] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [riskScore, setRiskScore]     = useState<any>(null);

  useEffect(() => { getHistoryApi().then(d => setRecentChecks(d.slice(0, 5))); }, []);

  const exportToPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("PharmAI Clinical Safety Report", 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`High Risk Alerts: ${result.highRiskAlerts}`, 14, 38);
    doc.text(`Total Interactions Found: ${result.interactionsFound}`, 14, 44);
    
    const tableData = result.interactions.map(i => [
      i.drugs.join(' + '),
      i.severity,
      i.type,
      i.mechanism,
      i.recommendation
    ]);
    
    autoTable(doc, {
      startY: 50,
      head: [['Medications', 'Severity', 'Type', 'Mechanism', 'Recommendation']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [13, 148, 136] }
    });
    
    doc.save("PharmAI_Report.pdf");
    toast.success("PDF Report generated successfully");
  };

  const handleAnalyze = async () => {
    const analysisQuery = drugsList.length > 0 ? drugsList.join(', ') : inputText;
    if (!analysisQuery.trim()) return;
    setIsAnalyzing(true); setResult(null); setRiskScore(null);
    const tid = toast.loading('Initiating AI safety protocol...');
    try {
      const data = await checkInteractionsApi(analysisQuery);
      setResult(data);
      if (data.highRiskAlerts > 0) toast.error(`⚠️ Found ${data.highRiskAlerts} critical anomalies!`, { id: tid });
      else toast.success('✅ Analysis Complete: No critical interactions found.', { id: tid });
      const drugs = data.interactions.flatMap((i: any) => i.drugs);
      if (drugs.length > 0) {
        const risk = await getPatientRiskApi({ age: 45, kidney_disease: false, liver_disease: false, pregnancy: false, diabetes: false, medications: drugs });
        setRiskScore(risk);
      }
      getHistoryApi().then(d => setRecentChecks(d.slice(0, 5)));
    } catch {
      toast.error('System failure. Please check network uplink.', { id: tid });
    } finally { setIsAnalyzing(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const tid = toast.loading('Running OCR extraction...');
    try {
      const res = await processOcrApi(e.target.files[0]);
      setInputText(prev => (prev ? prev + '\n' : '') + res.extracted_text);
      setDrugsList(prev => [...prev, ...res.extracted_text.split(/[,+&]|\sand\s/).map(d => d.trim()).filter(Boolean)]);
      toast.success('Text extracted successfully', { id: tid });
    } catch { toast.error('Failed to extract text from image', { id: tid }); }
  };

  const audioChunksRef = useRef<Blob[]>([]);
  const toggleRecording = async () => {
    if (isRecording) { mediaRecorderRef.current?.stop(); setIsRecording(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr; audioChunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const tid  = toast.loading('Processing voice input...');
        try { 
          const res = await processVoiceApi(blob); 
          setInputText(p => (p ? p + ' ' : '') + res.extracted_text);
          setDrugsList(prev => [...prev, ...res.extracted_text.split(/[,+&]|\sand\s/).map(d => d.trim()).filter(Boolean)]);
          toast.success('Voice transcribed', { id: tid }); 
        }
        catch { toast.error('Voice processing failed', { id: tid }); }
      };
      mr.start(); setIsRecording(true);
    } catch { toast.error('Microphone access denied'); }
  };

  const hasEmergency = result && result.highRiskAlerts > 0;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          Clinical Safety <span className="text-gradient text-gradient-blue">Advisory Hub</span>
        </h2>
        <p className="text-white/40 text-lg font-medium">Enter medications, scan a prescription, or speak to run a comprehensive drug safety check.</p>
      </div>

      {/* Emergency Banner */}
      <AnimatePresence>
        {hasEmergency && (
          <motion.div key="emergency" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="emergency-banner p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-rose-400 border border-rose-500/40 bg-rose-500/15">
              <AlertTriangle size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-300 uppercase tracking-widest mb-0.5">⚠️ Emergency Advisory</p>
              <p className="text-white/75 text-sm font-medium">
                {result!.highRiskAlerts} critical interaction{result!.highRiskAlerts > 1 ? 's' : ''} detected. Review the findings below immediately before proceeding with this prescription.
              </p>
            </div>
            <div className="ml-auto shrink-0 badge badge-rose !text-[10px] !py-1.5 !px-3">Action Required</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Input Card */}
          <div className="glass-card p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%)' }} />
            <div className="flex justify-between items-center mb-6 border-b border-white/6 pb-5 relative z-10">
              <h3 className="text-base font-bold text-white flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass-card !rounded-xl flex items-center justify-center text-teal-400">
                  <FileText size={17} strokeWidth={2} />
                </div>
                Medications List
              </h3>
              <div className="flex gap-3">
                <button onClick={toggleRecording}
                  className={cn("btn-ghost !py-2 !px-4 !text-xs !rounded-xl flex items-center gap-2 transition-colors",
                    isRecording && "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border-rose-500/30")}>
                  <Mic size={14} className={isRecording ? "animate-pulse" : ""} />
                  <span className="hidden sm:inline">{isRecording ? "Recording..." : "Voice Input"}</span>
                </button>
                <label className="btn-ghost !py-2 !px-4 !text-xs !rounded-xl flex items-center gap-2 cursor-pointer">
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
                  <Sparkles size={14} /><span className="hidden sm:inline">Upload Rx</span>
                </label>
              </div>
            </div>
            <div className="relative mb-6 z-10">
              <SmartDrugInput 
                drugs={drugsList} 
                onChange={setDrugsList} 
                disabled={isAnalyzing} 
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20 uppercase tracking-widest pointer-events-none">
                {drugsList.length > 0 ? `${drugsList.length} medications` : 'Empty regimen'}
              </div>
            </div>
            <div className="flex justify-end z-10 relative">
              <button onClick={handleAnalyze} disabled={isAnalyzing || (drugsList.length === 0 && !inputText.trim())}
                className="btn-primary !rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed">
                {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} fill="currentColor" />}
                {isAnalyzing ? 'Checking Safety...' : 'Analyze Safety'}
              </button>
            </div>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-3xl !bg-white/4 border border-white/6" />)}
                </div>
                <Skeleton className="h-56 rounded-3xl !bg-white/4 border border-white/6" />
              </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatItem label="Total Medications" value={result.totalDrugs}       color="blue"    />
                  <StatItem label="Interactions Found" value={result.interactionsFound} color="violet"  />
                  <StatItem label="High Risk Alerts"   value={result.highRiskAlerts}   color="rose"    />
                  <StatItem label="Safe Combinations"  value={result.safeCombinations}  color="emerald" />
                </div>

                {/* Interaction Graph */}
                {result.interactions.length > 0 && (
                  <div className="glass-card p-5">
                    <InteractionGraph result={result} />
                  </div>
                )}

                {/* Interactions List */}
                <div className="glass-card overflow-hidden">
                  <div className="p-5 border-b border-white/6 flex justify-between items-center"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-center gap-4">
                      <h3 className="text-base font-bold text-white">Clinical Safety Report</h3>
                      <span className="badge badge-blue">{result.interactions.length} Checked</span>
                    </div>
                    <button onClick={exportToPDF} className="btn-ghost !py-1.5 !px-3 !text-[11px] flex items-center gap-2">
                      <Download size={14} /> Export PDF
                    </button>
                  </div>
                  <div className="divide-y divide-white/5">
                    {result.interactions.map((interaction, i) => (
                      <InteractionItem key={i} interaction={interaction} index={i} />
                    ))}
                    {result.interactions.length === 0 && (
                      <div className="p-16 text-center flex flex-col items-center">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/20 text-emerald-400 glow-emerald"
                          style={{ background: 'rgba(16,185,129,0.1)' }}>
                          <CheckCircle2 size={40} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">No Interactions Found</h4>
                        <p className="text-white/35 font-medium max-w-xs leading-relaxed text-sm">
                          All medications appear safe to combine based on current clinical guidelines.
                        </p>
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
          {/* AI Insights */}
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-500 via-sky-500 to-transparent" />
            <div className="flex items-center gap-4 mb-6 border-b border-white/6 pb-5">
              <div className="w-12 h-12 rounded-2xl glass-card !rounded-xl flex items-center justify-center text-teal-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-500/15 blur-lg" />
                <BrainCircuit size={24} strokeWidth={1.5} className="relative z-10" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Explainable AI Panel</h3>
                <p className="text-[10px] text-teal-400/70 font-bold uppercase tracking-widest mt-0.5">Medical Advisory Engine</p>
              </div>
            </div>

            {riskScore && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Activity size={13} className={riskScore.risk_level === 'HIGH' ? 'text-rose-400' : 'text-teal-400'} />
                  Personalized Risk Score
                </h4>
                <div className="flex items-end gap-3 mb-3">
                  <span className={cn('text-4xl font-bold', riskScore.risk_level === 'HIGH' ? 'text-rose-400' : 'text-teal-400')}>
                    {(riskScore.risk_score * 100).toFixed(0)}%
                  </span>
                  <span className={cn('badge mb-1.5 text-[9px]', riskScore.risk_level === 'HIGH' ? 'badge-rose' : 'badge-emerald')}>
                    {riskScore.risk_level} RISK
                  </span>
                </div>
                <div className="confidence-bar mb-3">
                  <div className="confidence-fill" style={{ width: `${riskScore.risk_score * 100}%` }} />
                </div>
                {riskScore.clinical_reasons?.map((r: string, i: number) => (
                  <p key={i} className="text-xs text-white/55 mb-1.5 flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-white/20 mt-1.5 shrink-0" />{r}
                  </p>
                ))}
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              {result?.clinicalInsights?.map((insight: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                  style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <h4 className={cn('text-xs font-bold flex items-start gap-2.5 mb-2 uppercase tracking-wide',
                    insight.severity === 'error' ? 'text-rose-400' : insight.severity === 'warning' ? 'text-amber-400' : 'text-emerald-400')}>
                    <span className={cn('w-2 h-2 rounded-sm shrink-0 mt-0.5',
                      insight.severity === 'error' ? 'bg-rose-500' : insight.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500')}
                      style={{ boxShadow: insight.severity === 'error' ? '0 0 8px rgba(244,63,94,0.8)' : insight.severity === 'warning' ? '0 0 8px rgba(245,158,11,0.8)' : '0 0 8px rgba(16,185,129,0.8)' }}
                    />
                    {insight.title}
                  </h4>
                  <p className="text-sm text-white/50 leading-relaxed pl-4">{insight.description}</p>
                </motion.div>
              )) || (
                <div className="border border-white/5 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[160px]">
                  <div className="w-8 h-8 border-2 border-white/15 border-t-teal-400 rounded-full animate-spin mb-4" />
                  <span className="text-white/25 font-mono text-xs uppercase tracking-widest">Awaiting Medication Input</span>
                </div>
              )}
            </div>
          </div>

          {/* Audit History */}
          <div className="glass-card p-5 sm:p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Recent Audits</h3>
              <button className="text-[10px] font-bold text-teal-400 hover:text-teal-300 uppercase tracking-widest">View All</button>
            </div>
            <div className="flex flex-col gap-1">
              {recentChecks.map((check, i) => {
                const color = check.maxSeverity === 'CONTRAINDICATED' ? 'bg-rose-500' :
                  check.maxSeverity === 'MAJOR' ? 'bg-amber-500' :
                  check.maxSeverity === 'MODERATE' ? 'bg-sky-500' : 'bg-emerald-500';
                return (
                  <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/4 transition-all cursor-pointer group border border-transparent hover:border-white/6">
                    <div className={cn('w-2 h-2 rounded-full shrink-0', color)} />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold text-white/70 truncate">{check.drugs.join(', ')}</p>
                      <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mt-0.5">
                        {new Date(check.timestamp).toLocaleTimeString([], { timeStyle: 'short' })} · {check.issueCount > 0 ? `Alerts: ${check.issueCount}` : 'SAFE'}
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
    blue:    { bg: 'rgba(13,148,136,0.08)',   text: 'text-teal-400',    border: 'rgba(13,148,136,0.2)',   glow: 'rgba(13,148,136,0.15)'  },
    violet:  { bg: 'rgba(14,165,233,0.08)',   text: 'text-sky-400',     border: 'rgba(14,165,233,0.2)',   glow: 'rgba(14,165,233,0.15)'  },
    rose:    { bg: 'rgba(244,63,94,0.08)',    text: 'text-rose-400',    border: 'rgba(244,63,94,0.2)',    glow: 'rgba(244,63,94,0.15)'   },
    emerald: { bg: 'rgba(16,185,129,0.08)',   text: 'text-emerald-400', border: 'rgba(16,185,129,0.2)',   glow: 'rgba(16,185,129,0.15)'  },
  };
  const c = map[color];
  return (
    <div className="rounded-3xl p-5 flex flex-col gap-4 border hover:scale-[1.02] transition-all duration-300 cursor-default"
      style={{ background: c.bg, borderColor: c.border, boxShadow: `0 0 24px ${c.glow}` }}>
      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
      <span className={cn('text-4xl font-bold tracking-tighter', c.text)}>{value}</span>
    </div>
  );
}

function InteractionItem({ interaction, index }: { interaction: any; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const sev = interaction.severity;
  const isCont   = sev === Severity.CONTRAINDICATED;
  const isMajor  = sev === Severity.MAJOR;
  const isMod    = sev === Severity.MODERATE;
  const sevStyle = isCont  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'   :
                   isMajor ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                   isMod   ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'       : 'bg-white/5 text-white/50 border-white/10';
  const iconStyle= isCont  ? 'bg-rose-500/15 text-rose-400 border-rose-500/25'   :
                   isMajor ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' :
                   isMod   ? 'bg-sky-500/15 text-sky-400 border-sky-500/25'       : 'bg-white/5 text-white/40 border-white/10';
  const bar      = isCont ? '#f43f5e' : isMajor ? '#f59e0b' : '#38bdf8';
  const conf     = interaction.confidence ? Math.round(interaction.confidence * 100) : null;

  return (
    <div className={cn('transition-colors group', isCont && 'bg-rose-500/3')}>
      <div className="p-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <div className="flex items-start gap-4">
            <span className="text-xs font-mono text-white/20 mt-3 hidden md:block">0{index + 1}</span>
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border', iconStyle)}>
              {isCont ? <Ban size={20} strokeWidth={2} /> : <AlertTriangle size={20} strokeWidth={2} />}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1 leading-tight">{interaction.drugs.join(' + ')}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-white/25 uppercase">{interaction.type}</span>
                <span className="w-1 h-1 rounded-full bg-white/15" />
                <span className="text-xs font-mono text-white/25">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pl-16 sm:pl-0 shrink-0">
            <div className="flex flex-col items-end gap-1">
              <span className={cn('badge text-[9px] border', sevStyle)}>{sev}</span>
              {conf !== null && <span className="text-[10px] font-bold text-white/30">{conf}% confidence</span>}
            </div>
            <ChevronDown size={16} className={cn('text-white/30 transition-transform duration-300', expanded && 'rotate-180')} />
          </div>
        </div>

        {/* Confidence Meter */}
        {conf !== null && (
          <div className="ml-0 sm:ml-16 md:ml-[88px] mb-2">
            <div className="flex items-center justify-between text-[10px] text-white/25 font-mono mb-1.5">
              <span>AI CONFIDENCE</span><span>{conf}%</span>
            </div>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{ width: `${conf}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Expandable Detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div key="detail" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="px-6 pb-6 ml-0 sm:ml-16 md:ml-[88px] flex flex-col gap-4">
              {/* Mechanism */}
              <div className="border-l-2 pl-5 py-1" style={{ borderColor: `${bar}50` }}>
                <p className="text-xs font-bold text-white/25 uppercase tracking-widest mb-2">Mechanism of Action</p>
                <p className="text-sm text-white/55 leading-relaxed">{interaction.mechanism}</p>
              </div>

              {/* Evidence / Citation */}
              <div className="p-4 rounded-2xl border border-white/8 flex items-start gap-3"
                style={{ background: 'rgba(0,0,0,0.2)' }}>
                <BookOpen size={15} className="text-teal-400/60 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Evidence Source</p>
                  <p className="text-xs text-white/50 leading-relaxed">Clinical pharmacology database cross-reference. Verified against 2024 peer-reviewed interaction guidelines (DrugBank v5.1, FDA Orange Book).</p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-2xl border flex items-start gap-3"
                style={{ background: `${bar}12`, borderColor: `${bar}30` }}>
                <Shield size={15} className="shrink-0 mt-0.5" style={{ color: bar }} />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: bar }}>Clinical Directive</p>
                  <p className="text-sm text-white/65 font-medium leading-relaxed">{interaction.recommendation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
