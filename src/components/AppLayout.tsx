import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Settings, HelpCircle, LogOut, Flame, Zap, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { xpProgress } from '../utils/gamification';
import { Logo } from './Logo';

export function AppLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const progress = profile ? xpProgress(profile.xp) : { percentage: 0 };

  return (
    <div className="min-h-screen bg-dark no-scroll-x">
      <nav className="bg-dark-lighter border-b border-titanium/30 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <Link to="/app" className="flex items-center">
              <Logo size="sm" />
            </Link>

            {profile && (
              <div className="flex items-center gap-2 md:gap-6">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full">
                    <Flame className="w-3 h-3 md:w-4 md:h-4 text-neon-cyan" />
                    <span className="font-semibold text-xs md:text-sm text-neon-cyan">{profile.current_streak}</span>
                  </div>

                  <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-primary/10 border border-primary/30 rounded-full">
                    <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    <span className="font-semibold text-xs md:text-sm text-primary">{profile.xp}</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-xs md:text-sm font-medium text-soft-white">Nv {profile.level}</span>
                    <div className="w-16 md:w-24 bg-titanium rounded-full h-2">
                      <div
                        className="bg-gradient-primary h-full rounded-full transition-all shadow-glow-sm"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
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
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
