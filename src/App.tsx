import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import DrugCheckerPage from './pages/DrugCheckerPage';
import ErrorPage from './pages/ErrorPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/checker" element={<DrugCheckerPage />} />
              <Route element={<ProtectedRoute requireAdmin />}>
                <Route path="/reports" element={<AdminAnalyticsPage />} />
              </Route>
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/alerts" element={<div className="flex items-center justify-center h-64 text-on-surface-variant font-medium bg-white rounded-3xl border border-outline-variant/20 shadow-sm">Alert configuration coming soon</div>} />
              <Route path="/settings" element={<div className="flex items-center justify-center h-64 text-on-surface-variant font-medium bg-white rounded-3xl border border-outline-variant/20 shadow-sm">Settings panel coming soon</div>} />
            </Route>
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
