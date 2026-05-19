import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Activity, BrainCircuit, Zap, AlertTriangle, Shield, Database, CheckCircle2, Star, Lock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [simStep, setSimStep] = React.useState(1);
  const [simPair, setSimPair] = React.useState(0);
  const [isDark, setIsDark] = React.useState(true);

  const drugPairs = [
    { drugs: ['warfarin', 'aspirin'], match: 'HEMORRHAGING RISK', conf: '0.989', time: '241ms' },
    { drugs: ['lisinopril', 'aliskiren'], match: 'SEVERE HYPOTENSION', conf: '0.976', time: '189ms' },
    { drugs: ['sildenafil', 'nitroglycerin'], match: 'CRITICAL HYPOTENSION', conf: '0.999', time: '145ms' },
  ];

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  React.useEffect(() => {
    const t = setInterval(() => {
      setSimStep(p => {
        if (p >= 4) { setSimPair(x => (x + 1) % 3); return 1; }
        return p + 1;
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const features = [
    { icon: Zap,          title: 'Real-time Safety Check',    desc: 'Detect dangerous drug conflicts in under 100ms before they reach the patient.',                color: 'teal'    },
    { icon: AlertTriangle, title: 'Personalized Risk Analysis', desc: 'Assess individual patient risks by combining history, demographics, and clinical data.',       color: 'amber'   },
    { icon: BrainCircuit, title: 'Explainable AI',             desc: 'Transparent reasoning behind every recommendation with evidence-backed citations.',             color: 'violet'  },
    { icon: Lock,         title: 'HIPAA Compliant',            desc: 'End-to-end encrypted. Every patient interaction is fully private and secure.',                  color: 'sky'     },
    { icon: Globe,        title: 'Global Drug Database',       desc: '2.4M+ verified drug-drug interaction mappings from peer-reviewed sources.',                    color: 'emerald' },
    { icon: Star,         title: '99.8% Accuracy',             desc: 'Clinically validated model achieving state-of-the-art safety detection accuracy.',              color: 'rose'    },
  ];

  const colorMap: Record<string, { text: string; border: string; bg: string }> = {
    teal:    { text: 'text-teal-400',    border: 'border-teal-500/25',    bg: 'bg-teal-500/10'    },
    amber:   { text: 'text-amber-400',   border: 'border-amber-500/25',   bg: 'bg-amber-500/10'   },
    violet:  { text: 'text-violet-400',  border: 'border-violet-500/25',  bg: 'bg-violet-500/10'  },
    sky:     { text: 'text-sky-400',     border: 'border-sky-500/25',     bg: 'bg-sky-500/10'     },
    emerald: { text: 'text-emerald-400', border: 'border-emerald-500/25', bg: 'bg-emerald-500/10' },
    rose:    { text: 'text-rose-400',    border: 'border-rose-500/25',    bg: 'bg-rose-500/10'    },
  };

  return (
    <div className="min-h-screen font-sans text-white overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full animate-aurora"
          style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%)' }} />
        <div className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] rounded-full animate-aurora"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)', animationDelay: '3s' }} />
        <div className="absolute bottom-[-10%] left-[25%] w-[600px] h-[600px] rounded-full animate-aurora"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', animationDelay: '6s' }} />
        <div className="dot-grid-bg absolute inset-0 opacity-40" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card !rounded-2xl px-6 py-3 flex justify-between items-center !border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center glow-teal">
                <Activity size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gradient text-gradient-hero">PharmAI</span>
            </div>
            <nav className="hidden md:flex gap-8 items-center">
              {['Capabilities', 'Architecture', 'Security'].map(item => (
                <a key={item} href={'#' + item.toLowerCase()}
                  className="text-xs font-semibold text-white/40 hover:text-white/90 transition-colors uppercase tracking-widest">
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-8 h-8 rounded-lg glass-card !rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-colors text-base"
                title="Toggle theme"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button onClick={() => navigate('/auth')} className="btn-ghost !py-2 !px-5 !text-xs hidden sm:flex">Sign In</button>
              <button onClick={() => navigate('/checker')} className="btn-primary !py-2 !px-5 !text-xs">
                Launch Console <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-teal-400 text-xs font-bold mb-10 tracking-widest uppercase"
              style={{ background: 'rgba(13,148,136,0.1)', borderColor: 'rgba(13,148,136,0.25)' }}>
              <ShieldCheck size={14} />
              <span>Empowering Clinicians · Built for Patient Safety</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.03] tracking-tighter mb-8 max-w-5xl">
            <span className="text-gradient text-gradient-hero">Prescribe with<br />Confidence.</span>
            <br />
            <span className="text-white/20">Absolute Patient Safety.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg sm:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed font-medium">
            Ensure safe patient outcomes with every prescription. Fusing verified medical knowledge,
            advanced AI, and empathetic insights to protect patient lives.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4">
            <button onClick={() => navigate('/checker')} className="btn-primary !text-sm !py-4 !px-8">
              Run Safety Check <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/auth')} className="btn-ghost !text-sm !py-4 !px-8">
              Experience PharmAI Free
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-20 flex flex-wrap justify-center gap-12 text-center">
            {[
              { val: '99.8%', label: 'Safety Accuracy' },
              { val: '<100ms', label: 'Check Speed' },
              { val: '2.4M+', label: 'Drug Mappings' },
              { val: 'HIPAA', label: 'Compliant' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-gradient text-gradient-blue">{s.val}</span>
                <span className="text-xs text-white/35 font-semibold uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Hero Visual */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 80 }}
            className="mt-20 w-full max-w-5xl glass-card !rounded-[2rem] p-2 overflow-hidden group">
            <div className="rounded-[1.75rem] overflow-hidden border border-white/8 relative" style={{ minHeight: 360 }}>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2670&auto=format&fit=crop"
                alt="PharmAI Dashboard"
                className="w-full h-[400px] sm:h-[500px] object-cover opacity-60 group-hover:scale-[1.02] transition-transform duration-1000"
                style={{ mixBlendMode: 'luminosity' }}
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.22) 0%, rgba(14,165,233,0.12) 100%)' }} />
              {/* Floating alert */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}
                className="absolute top-8 right-8 glass-card !rounded-2xl p-5 flex items-center gap-4 z-20 hidden md:flex"
                style={{ transform: 'rotate(-2deg)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center border text-rose-400 glow-rose"
                  style={{ background: 'rgba(244,63,94,0.15)', borderColor: 'rgba(244,63,94,0.3)' }}>
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Risk Detected</p>
                  <p className="text-base font-bold text-white my-0.5">Warfarin + Aspirin</p>
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">Contraindicated</p>
                </div>
              </motion.div>
              {/* Confidence badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }}
                className="absolute bottom-8 left-8 glass-card !rounded-2xl p-4 flex items-center gap-3 hidden md:flex">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border text-emerald-400 glow-emerald"
                  style={{ background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-widest">AI Confidence</p>
                  <p className="text-lg font-bold text-emerald-400">98.9%</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── FEATURES ── */}
        <section id="capabilities" className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <div className="badge badge-blue inline-flex mb-6"><Zap size={12} /> Capabilities</div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight text-gradient text-gradient-hero">
              Patient Safety Advisory Hub
            </h2>
            <p className="text-lg text-white/45 max-w-2xl mx-auto leading-relaxed">
              Real-time safety advising engineered to keep clinical choices precise and drug administration flawless.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              return (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="glass-card p-8 flex flex-col gap-6 cursor-default group/card hover:!border-white/12 transition-all duration-500">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${c.text} ${c.border} ${c.bg} group-hover/card:scale-110 transition-transform duration-500`}>
                    <f.icon size={26} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                    <p className="text-white/40 leading-relaxed font-medium text-sm">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── ARCHITECTURE ── */}
        <section id="architecture" className="max-w-7xl mx-auto px-6 py-32 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1">
              <div className="badge badge-blue inline-flex mb-8"><Database size={12} />Core Architecture</div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                Evidence-Backed<br />
                <span className="text-gradient text-gradient-blue">Safety Pipeline</span>
              </h2>
              <p className="text-white/45 leading-relaxed mb-12 max-w-lg">
                Double-checked for absolute safety. Our engine retrieves peer-reviewed clinical proof first,
                then guides you with highly contextual medical summaries.
              </p>
              <div className="space-y-8">
                {[
                  { icon: Database,    title: 'Clinical Evidence Retrieval', desc: 'Searches thousands of peer-reviewed databases in under 100ms.' },
                  { icon: BrainCircuit, title: 'AI Safety Synthesizer',       desc: 'Translates raw diagnostic data into actionable summaries for patient care.' },
                  { icon: Shield,      title: 'HIPAA Security Layer',         desc: 'All data encrypted end-to-end with full healthcare compliance.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-6 group/item">
                    <div className="w-14 h-14 rounded-2xl glass-card !rounded-xl flex items-center justify-center shrink-0 text-white/60 group-hover/item:text-teal-400 transition-colors">
                      <item.icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-white/40 font-medium text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Terminal */}
            <div className="flex-1 w-full">
              <div className="glass-card !rounded-3xl p-8 overflow-hidden relative" style={{ borderColor: 'rgba(14,165,233,0.15)' }}>
                <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)' }} />
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/8 relative z-10">
                  <div className="flex gap-2.5">
                    {['#f43f5e', '#f59e0b', '#10b981'].map(c => (
                      <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.7 }} />
                    ))}
                  </div>
                  <span className="text-white/25 text-xs font-mono uppercase tracking-widest">pipeline_runner.sh</span>
                </div>
                <div className="space-y-5 font-mono text-sm relative z-10 min-h-[160px]">
                  {simStep >= 1 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex gap-6 items-start">
                      <span className="text-white/20 shrink-0">001</span>
                      <span className="text-emerald-400">
                        await <span className="text-blue-400">vectorDb</span>.<span className="text-amber-400">query</span>
                        (<span className="text-white/50">[{drugPairs[simPair].drugs.join(', ')}]</span>)
                      </span>
                    </motion.div>
                  )}
                  {simStep >= 2 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex gap-6 items-start">
                      <span className="text-white/20 shrink-0">002</span>
                      <span className="text-rose-400">&gt; CRITICAL: {drugPairs[simPair].match} (conf: {drugPairs[simPair].conf})</span>
                    </motion.div>
                  )}
                  {simStep >= 3 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex gap-6 items-start">
                      <span className="text-white/20 shrink-0">003</span>
                      <span className="text-emerald-400">
                        await <span className="text-blue-400">neuralNet</span>.<span className="text-amber-400">synthesize</span>
                        (<span className="text-white/50">ctx, payload</span>)
                      </span>
                    </motion.div>
                  )}
                  {simStep >= 4 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex gap-6 items-start">
                      <span className="text-white/20 shrink-0">004</span>
                      <span className="text-white/40 animate-pulse">Compiling recommendations... {drugPairs[simPair].time}</span>
                    </motion.div>
                  )}
                </div>
                <div className="mt-8 glass-card !rounded-2xl p-5 relative z-10" style={{ borderColor: 'rgba(14,165,233,0.2)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 size={16} className={simStep === 4 ? 'text-emerald-400' : 'text-blue-400 opacity-50'} />
                    <span className="text-white font-bold text-sm">
                      {simStep === 4 ? `Cycle Complete · ${drugPairs[simPair].time}` : 'Processing Pipeline...'}
                    </span>
                    <span className={'badge ml-auto ' + (simStep === 4 ? 'badge-emerald' : 'badge-blue')}>
                      {simStep === 4 ? 'Done' : 'Active'}
                    </span>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${(simStep / 4) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECURITY CTA ── */}
        <section id="security" className="max-w-7xl mx-auto px-6 py-32 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="text-center mb-16">
            <div className="badge badge-emerald inline-flex mb-6"><Shield size={12} /> Security</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
              Trust, Privacy &amp; <span className="text-gradient text-gradient-blue">Patient Integrity</span>
            </h2>
            <p className="text-white/45 max-w-2xl mx-auto leading-relaxed">
              Your patient's health data is fully secure. End-to-end encrypted, HIPAA compliant, and locally filtered.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {[
              { label: 'AES-256',  sub: 'Encryption Standard' },
              { label: 'Zero-Log', sub: 'Patient Data Policy'  },
              { label: 'SOC 2',    sub: 'Type II Certified'    },
            ].map(s => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="glass-card p-8 text-center">
                <div className="text-4xl font-bold text-gradient text-gradient-blue mb-2">{s.label}</div>
                <div className="text-white/35 text-sm font-semibold uppercase tracking-widest">{s.sub}</div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => navigate('/checker')} className="btn-primary !text-sm !py-4 !px-10">
              Start Free Safety Check <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t py-16" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-gradient text-gradient-hero">PharmAI</span>
          </div>
          <p className="text-white/25 text-sm font-medium text-center">
            Pioneering AI + clinical pharmacology. © 2026 PharmAI Systems Inc.
          </p>
          <div className="flex gap-6 text-xs font-semibold text-white/30 uppercase tracking-widest">
            {['Privacy', 'Terms', 'HIPAA'].map(l => (
              <a key={l} href="#" className="hover:text-white/70 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
