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

import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';

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
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
