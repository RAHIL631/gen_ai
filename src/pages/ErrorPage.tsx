import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-error/5 via-transparent to-transparent opacity-50"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-12 text-center relative z-10"
      >
        <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <AlertCircle size={40} />
        </div>
        
        <h1 className="text-4xl font-bold text-on-surface mb-4 tracking-tight">404</h1>
        <h2 className="text-xl font-semibold text-on-surface mb-4">Page Not Found</h2>
        <p className="text-on-surface-variant mb-10 leading-relaxed">
          The clinical module you're looking for doesn't exist or has been moved to another diagnostic sector.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-3.5 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3.5 bg-surface-container-high text-primary rounded-full font-bold hover:bg-primary-container/10 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Return Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
