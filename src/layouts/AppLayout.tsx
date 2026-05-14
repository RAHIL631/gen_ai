import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import { Toaster } from 'sonner';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(160deg, #030712 0%, #050a18 50%, #030712 100%)' }}>
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-72 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/4 rounded-full blur-[100px]" />
        <div className="fixed inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '150px 150px',
          }}
        />
      </div>

      <Toaster
        position="top-right"
        expand={false}
        richColors
        theme="dark"
        toastOptions={{
          style: { background: 'rgba(8,13,24,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', color: 'white', borderRadius: '16px' }
        }}
      />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopNav />
        <main className="flex-1 lg:ml-72" style={{ paddingTop: '72px' }}>
          <div className="p-6 md:p-8 max-w-[1440px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
