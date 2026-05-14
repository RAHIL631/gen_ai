import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Mail, Lock, EyeOff, Eye, ArrowRight, Activity, Zap, BrainCircuit, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        toast.success('Account submitted for clinical review.');
        await new Promise(r => setTimeout(r, 1000));
        await register({ email, password });
      } else {
        await login({ email, password });
        toast.success('Secure connection established.');
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Authentication sequence failed.');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row" style={{ background: 'linear-gradient(160deg, #020509 0%, #050a16 100%)' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/6 blur-[100px]" />
        <div className="dot-grid-bg absolute inset-0 opacity-30" />
      </div>

      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-violet-900/15" />

        {/* Floating icons */}
        <div className="z-10 absolute top-[18%] left-[12%] glass-card !rounded-3xl w-20 h-20 !p-0 flex items-center justify-center animate-float-slow">
          <Database className="text-blue-400" size={32} strokeWidth={1.5} />
        </div>
        <div className="z-10 absolute bottom-[22%] right-[16%] glass-card !rounded-3xl w-28 h-28 !p-0 flex items-center justify-center animate-float-medium" style={{animationDelay:'2s'}}>
          <BrainCircuit className="text-violet-400" size={44} strokeWidth={1.5} />
        </div>
        <div className="z-10 absolute top-[55%] left-[8%] glass-card !rounded-2xl w-14 h-14 !p-0 flex items-center justify-center animate-float-slow" style={{animationDelay:'4s'}}>
          <Activity className="text-cyan-400" size={24} strokeWidth={1.5} />
        </div>

        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="z-10 text-center relative px-12">
          <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 relative overflow-hidden hover:scale-105 transition-transform duration-500" style={{ boxShadow: '0 0 60px rgba(59,130,246,0.4)' }}>
            <div className="absolute inset-0 bg-white/10" />
            <Zap className="text-white relative z-10" size={52} strokeWidth={2} />
          </div>
          <h1 className="text-6xl font-bold text-white mb-5 tracking-tight">PharmAI</h1>
          <p className="text-lg text-white/40 max-w-sm mx-auto leading-relaxed font-medium">
            Clinical intelligence engine for advanced pharmacological analysis.
          </p>

          {/* Trust badges */}
          <div className="mt-12 flex flex-col gap-3">
            {[
              { label: 'HIPAA Compliant', color: 'badge-emerald' },
              { label: 'FDA Grade Accuracy', color: 'badge-blue' },
              { label: '2.4M+ Drug Database', color: 'badge-violet' },
            ].map(b => (
              <div key={b.label} className={`badge ${b.color} !py-2 !px-4 !rounded-xl self-center`}>{b.label}</div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right auth panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 min-h-screen relative z-10">
        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{duration:0.6}} className="w-full max-w-[420px]">
          <div className="glass-card !rounded-3xl p-8 sm:p-10 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-transparent" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/6 rounded-full blur-[60px] pointer-events-none" />

            {/* HIPAA badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/12 text-xs font-bold text-emerald-400 uppercase tracking-widest" style={{ background: 'rgba(8,13,24,0.95)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                <ShieldAlert size={13} /> HIPAA Encrypted
              </div>
            </div>

            <div className="text-center mb-8 mt-4 relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {isSignUp ? 'Terminal Registration' : 'System Access'}
              </h2>
              <p className="text-white/35 text-sm font-medium">
                {isSignUp ? 'Register credentials for secure enclave entry.' : 'Authenticate to establish secure connection.'}
              </p>
            </div>

            <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Clearance Ident</label>
                <div className="relative group">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="physician@hospital.org" required
                    className="input-premium !pl-11" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Security Key</label>
                <div className="relative group">
                  <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" required
                    className="input-premium !pl-11 !pr-11 tracking-widest" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                    {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="flex justify-between items-center pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="w-4 h-4 rounded-md border border-white/15 bg-white/5 relative flex items-center justify-center">
                      <input type="checkbox" className="opacity-0 absolute w-full h-full cursor-pointer peer z-10" />
                      <div className="w-2 h-2 rounded-sm bg-blue-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xs font-semibold text-white/35 group-hover:text-white/60 transition-colors">Maintain Session</span>
                  </label>
                  <a href="#" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">Recover Key</a>
                </div>
              )}

              <div className="pt-5">
                <button type="submit" disabled={isLoading}
                  className="btn-primary w-full justify-center !rounded-2xl !py-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none">
                  {isLoading ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Validating...</span>
                  ) : (
                    <>{isSignUp ? 'Generate Token' : 'Establish Link'} <ArrowRight size={17} /></>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center border-t border-white/6 pt-5 relative z-10">
              <p className="text-xs text-white/25 font-semibold">
                {isSignUp ? 'Clearance verified? ' : 'Require clearance? '}
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-blue-400 hover:text-blue-300 transition-colors ml-1 font-bold">
                  {isSignUp ? 'Authenticate' : 'Request Access'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
