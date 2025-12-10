import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { Skeleton } from './components/Skeleton';

const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const TrilhaPage = lazy(() => import('./pages/TrilhaPage').then(m => ({ default: m.TrilhaPage })));
const PilarPage = lazy(() => import('./pages/PilarPage').then(m => ({ default: m.PilarPage })));
const ExercisePage = lazy(() => import('./pages/ExercisePage').then(m => ({ default: m.ExercisePage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const HelpPage = lazy(() => import('./pages/HelpPage').then(m => ({ default: m.HelpPage })));
const GoalsPage = lazy(() => import('./pages/GoalsPage').then(m => ({ default: m.GoalsPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="max-w-4xl w-full px-4 space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="trilha/:trilhaSlug" element={<TrilhaPage />} />
              <Route path="trilha/:trilhaSlug/:pilarSlug" element={<PilarPage />} />
              <Route path="trilha/:trilhaSlug/:pilarSlug/exercicios/:exerciseSlug" element={<ExercisePage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="help" element={<HelpPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
