import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Activity, BrainCircuit, Zap, AlertTriangle, Shield, Database, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#030712] min-h-screen font-sans text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[120px] animate-aurora" />
        <div className="absolute top-[40%] right-[-15%] w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[120px] animate-aurora" style={{animationDelay:'3s'}} />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full bg-cyan-500/6 blur-[100px] animate-aurora" style={{animationDelay:'6s'}} />
        <div className="dot-grid-bg absolute inset-0 opacity-40" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="glass-card !rounded-2xl px-6 py-3 flex justify-between items-center border-white/10 !bg-[#030712]/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center glow-blue">
                <Activity size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gradient text-gradient-hero">PharmAI</span>
            </div>
            <nav className="hidden md:flex gap-8 items-center">
              {['Capabilities','Architecture','Security'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-semibold text-white/40 hover:text-white/90 transition-colors uppercase tracking-widest">{item}</a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/auth')} className="btn-ghost !py-2.5 !px-5 !text-xs hidden sm:flex">Sign In</button>
              <button onClick={() => navigate('/checker')} className="btn-primary !py-2.5 !px-5 !text-xs">
                Launch Console <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-10 tracking-widest uppercase">
              <ShieldCheck size={14} />
              <span>Grade-A Cryptographic Accuracy · FDA-Compliant</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </motion.div>

          <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:0.7}}
            className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.03] tracking-tighter mb-8 max-w-5xl">
            <span className="text-gradient text-gradient-hero">Intelligent<br/>Prescribing.</span>
            <br />
            <span className="text-white/25">Absolute Precision.</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.6}}
            className="text-lg sm:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed font-medium">
            Detect critical drug conflicts instantly. Powered by deep neural networks and verified by exhaustive pharmacological databanks.
          </motion.p>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="flex flex-col sm:flex-row items-center gap-4">
            <button onClick={() => navigate('/checker')} className="btn-primary !text-sm !py-4 !px-8">
              Initialize Deep Scan <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/auth')} className="btn-ghost !text-sm !py-4 !px-8">
              Request Demo Access
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
            className="mt-20 flex flex-wrap justify-center gap-10 text-center">
            {[
              {val:'99.8%', label:'Detection Accuracy'},
              {val:'<100ms', label:'Avg. Response Time'},
              {val:'2.4M+', label:'Drug Interactions'},
              {val:'HIPAA', label:'Compliant'},
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-gradient text-gradient-blue">{s.val}</span>
                <span className="text-xs text-white/35 font-semibold uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Hero card */}
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.6,type:'spring',stiffness:80}}
            className="mt-20 w-full max-w-5xl glass-card !rounded-[2rem] p-2 border-white/10 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent pointer-events-none" />
            <div className="rounded-[1.75rem] overflow-hidden border border-white/8 relative">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2670&auto=format&fit=crop"
                alt="PharmAI Dashboard"
                className="w-full h-[420px] sm:h-[520px] object-cover mix-blend-luminosity opacity-70 group-hover:scale-[1.02] transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-violet-900/20" />
              {/* floating alert card */}
              <div className="absolute top-8 right-8 glass-card !rounded-2xl p-5 flex items-center gap-4 z-20 -rotate-2 hover:rotate-0 transition-transform duration-300 hidden md:flex">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 glow-rose">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Anomaly Detected</p>
                  <p className="text-base font-bold text-white my-0.5">Warfarin + Aspirin</p>
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">Critical Priority</p>
                </div>
              </div>
              {/* floating confidence badge */}
              <div className="absolute bottom-8 left-8 glass-card !rounded-2xl p-4 flex items-center gap-3 hidden md:flex">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 glow-emerald">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-widest">AI Confidence</p>
                  <p className="text-lg font-bold text-emerald-400">98.9%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section id="capabilities" className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <div className="badge badge-blue inline-flex mb-6"><Zap size={12} /> Capabilities</div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight text-gradient text-gradient-hero">Tactical Safety Infrastructure</h2>
            <p className="text-lg text-white/45 max-w-2xl mx-auto leading-relaxed">Algorithmic analysis engineered for ultra-low latency clinical decision support.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              {icon:Zap,title:'Kinetic Detection',desc:'Identify severe interaction vectors before they propagate through the biological system.',color:'blue'},
              {icon:AlertTriangle,title:'Risk Stratification',desc:'Dynamically categorize clinical threats from low-level noise to critical anomalies.',color:'amber'},
              {icon:BrainCircuit,title:'Generative Modeling',desc:'Extrapolate expert-level conclusions detailing the biological pathways of detected conflicts.',color:'violet'},
            ].map(f => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
          {/* Wide card */}
          <div className="glass-card !rounded-[2rem] p-10 md:p-14 border-white/10 flex flex-col md:flex-row items-center justify-between gap-10 group overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/8 blur-[100px] rounded-full group-hover:bg-blue-600/15 transition-colors duration-1000 pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 rounded-3xl glass-card !rounded-2xl text-blue-400 flex items-center justify-center shrink-0 glow-blue">
                <Shield size={40} strokeWidth={1.5} />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-3">Military-Grade Compliance</h3>
                <p className="text-white/45 leading-relaxed max-w-xl">System architecture forged in zero-trust parameters. All telemetry is scrubbed and fully encrypted locally before traversing the analysis bridge.</p>
              </div>
            </div>
            <button className="btn-ghost !text-xs !py-3 !px-6 shrink-0 relative z-10">Audit Specs</button>
          </div>
        </section>

        {/* Architecture Section */}
        <section id="architecture" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 relative">
          <div className="absolute left-1/2 -top-px -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1">
              <div className="badge badge-blue inline-flex mb-8"><Database size={12} />Core Architecture</div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">RAG Topology<br/><span className="text-gradient text-gradient-blue">Pipeline</span></h2>
              <p className="text-white/45 leading-relaxed mb-12 max-w-lg">A deterministic architecture. The engine retrieves hard pharmacological truths from vector banks before the neural net engages contextual analysis.</p>
              <div className="space-y-8">
                {[
                  {icon:Database, title:'Vector Deep Search', desc:'Iterates over millions of verified cross-references in <100ms.'},
                  {icon:BrainCircuit, title:'Generative Synthesis', desc:'Fuses raw query results into actionable clinical blueprints.'},
                ].map(item => (
                  <div key={item.title} className="flex gap-6 group/item">
                    <div className="w-14 h-14 rounded-2xl glass-card !rounded-xl !p-0 flex items-center justify-center shrink-0 text-white group-hover/item:glow-blue transition-all">
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
            {/* Terminal mockup */}
            <div className="flex-1 w-full">
              <div className="glass-card !rounded-3xl p-8 border-blue-500/15 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/8 blur-[80px] rounded-full pointer-events-none" />
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/8 relative z-10">
                  <div className="flex gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-white/25 text-xs font-mono uppercase tracking-widest">pipeline_runner.sh</span>
                </div>
                <div className="space-y-5 font-mono text-sm relative z-10">
                  {[
                    {num:'001', color:'text-emerald-400', text: <>await <span className="text-blue-400">vectorDb</span>.<span className="text-amber-400">query</span>(<span className="text-white/50">[warfarin_vec, aspirin_vec]</span>)</>},
                    {num:'002', color:'text-white/70', text: <><span className="text-rose-400">&gt; CRITICAL MATCH: HEMORRHAGING RISK</span> (conf: 0.989)</>},
                    {num:'003', color:'text-emerald-400', text: <>await <span className="text-blue-400">neuralNet</span>.<span className="text-amber-400">synthesize</span>(<span className="text-white/50">ctx, payloadData</span>)</>},
                    {num:'004', color:'text-white/30', text: <span className="animate-pulse">Compiling counter-measures...</span>},
                  ].map(line => (
                    <div key={line.num} className="flex gap-6 items-start">
                      <span className="text-white/20 shrink-0">{line.num}</span>
                      <span className={line.color}>{line.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 glass-card !rounded-2xl p-5 border-blue-500/20 relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-white font-bold text-sm">Cycle Complete · 241ms</span>
                    <span className="badge badge-emerald ml-auto">Optimal</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 w-full rounded-full glow-blue" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center glow-blue">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-gradient text-gradient-hero">PharmAI</span>
          </div>
          <p className="text-white/25 text-sm font-medium text-center">Pioneering the intersection of AI and clinical pharmacology. © 2026 PharmAI Systems Inc.</p>
          <div className="flex gap-6 text-xs font-semibold text-white/30 uppercase tracking-widest">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/70 transition-colors">HIPAA</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  const map: any = {
    blue:   { bg: 'rgba(59,130,246,0.12)',  text: 'text-blue-400',   border: 'rgba(59,130,246,0.25)',  glow: 'glow-blue' },
    amber:  { bg: 'rgba(245,158,11,0.12)',  text: 'text-amber-400',  border: 'rgba(245,158,11,0.25)',  glow: 'glow-cyan' },
    violet: { bg: 'rgba(139,92,246,0.12)',  text: 'text-violet-400', border: 'rgba(139,92,246,0.25)', glow: 'glow-violet' },
  };
  const c = map[color];
  return (
    <div className="glass-card !rounded-[2rem] p-8 md:p-10 flex flex-col gap-8 cursor-default group/card hover:border-white/14 transition-all duration-500">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${c.text} group-hover/card:scale-110 transition-transform duration-500`}
        style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-white/40 leading-relaxed font-medium text-sm">{description}</p>
      </div>
    </div>
  );
}
