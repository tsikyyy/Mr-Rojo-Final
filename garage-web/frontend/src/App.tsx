import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { PublicAtelierPage } from './pages/PublicAtelierPage';
import { DashboardPage } from './pages/DashboardPage';
import InterventionsPage from './pages/InterventionsPage';
const VoituresPage = lazy(() => import('./pages/VoituresPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/public/atelier" element={<PublicAtelierPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interventions"
            element={
              <ProtectedRoute>
                <InterventionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voitures"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Chargement...</div>}>
                  <VoituresPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Chargement...</div>}>
                  <StatisticsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
