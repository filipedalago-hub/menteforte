import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Settings, HelpCircle, LogOut, Flame, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { xpProgress } from '../utils/gamification';

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
    <div className="min-h-screen bg-gray-50 no-scroll-x">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <Link to="/app" className="flex items-center gap-2 font-bold text-lg md:text-xl text-gray-900">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              <span className="hidden sm:inline">MenteForte</span>
            </Link>

            {profile && (
              <div className="flex items-center gap-2 md:gap-6">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-orange-50 rounded-full">
                    <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                    <span className="font-semibold text-xs md:text-sm text-orange-700">{profile.current_streak}</span>
                  </div>

                  <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-blue-50 rounded-full">
                    <Zap className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                    <span className="font-semibold text-xs md:text-sm text-blue-700">{profile.xp}</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-xs md:text-sm font-medium text-gray-700">Nv {profile.level}</span>
                    <div className="w-16 md:w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all"
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/app')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                Início
              </Link>

              <Link
                to="/app/profile"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/app/profile')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                Perfil
              </Link>

              <Link
                to="/app/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/app/settings')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                Configurações
              </Link>

              <Link
                to="/app/help"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/app/help')
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                Ajuda
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
