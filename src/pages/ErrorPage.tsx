import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#080c14' }}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-rose-500/5 blur-[100px]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-10 text-center relative z-10"
      >
        <div className="w-20 h-20 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
          <AlertCircle size={36} />
        </div>
        
        <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-white mb-4">Module Not Found</h2>
        <p className="text-white/40 mb-8 leading-relaxed font-medium text-sm">
          The clinical diagnostic module you're looking for doesn't exist or has been moved to another secure sector.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="btn-primary w-full justify-center !rounded-xl !py-3 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn-ghost w-full justify-center !rounded-xl !py-3 flex items-center gap-2"
          >
            <Home size={16} />
            Return Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
