import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Settings, HelpCircle, LogOut, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';
import { LivesDisplay } from './gamification/LivesDisplay';
import { AnimatedXPBar } from './gamification/AnimatedXPBar';
import { AnimatedRoutes } from './AnimatedRoutes';

export function AppLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;


  return (
    <div className="min-h-screen bg-dark no-scroll-x">
      <nav className="bg-dark-lighter border-b border-titanium/30 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <Link to="/app" className="flex items-center">
              <Logo size="sm" />
            </Link>

            {profile && (
              <div className="flex items-center gap-3">
                <LivesDisplay />
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              <Link
                to="/app"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive('/app')
                    ? 'bg-primary/20 text-neon-cyan font-medium border border-primary/30'
                    : 'text-soft-gray hover:bg-titanium/50 hover:text-soft-white'
                }`}
              >
                <Home className="w-5 h-5" />
                Inicio
              </Link>

              <Link
                to="/app/goals"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive('/app/goals')
                    ? 'bg-primary/20 text-neon-cyan font-medium border border-primary/30'
                    : 'text-soft-gray hover:bg-titanium/50 hover:text-soft-white'
                }`}
              >
                <Target className="w-5 h-5" />
                Metas e Hábitos
              </Link>

              <Link
                to="/app/progress"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive('/app/progress')
                    ? 'bg-primary/20 text-neon-cyan font-medium border border-primary/30'
                    : 'text-soft-gray hover:bg-titanium/50 hover:text-soft-white'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                Progresso
              </Link>

              <Link
                to="/app/profile"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive('/app/profile')
                    ? 'bg-primary/20 text-neon-cyan font-medium border border-primary/30'
                    : 'text-soft-gray hover:bg-titanium/50 hover:text-soft-white'
                }`}
              >
                <User className="w-5 h-5" />
                Perfil
              </Link>

              <Link
                to="/app/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive('/app/settings')
                    ? 'bg-primary/20 text-neon-cyan font-medium border border-primary/30'
                    : 'text-soft-gray hover:bg-titanium/50 hover:text-soft-white'
                }`}
              >
                <Settings className="w-5 h-5" />
                Configuracoes
              </Link>

              <Link
                to="/app/help"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive('/app/help')
                    ? 'bg-primary/20 text-neon-cyan font-medium border border-primary/30'
                    : 'text-soft-gray hover:bg-titanium/50 hover:text-soft-white'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                Ajuda
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-soft-gray hover:bg-titanium/50 hover:text-soft-white transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <AnimatedRoutes>
              <Outlet />
            </AnimatedRoutes>
          </main>
        </div>
      </div>
    </div>
  );
}
