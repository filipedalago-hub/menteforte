import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface AchievementNotificationProps {
  title: string;
  message: string;
  icon?: string;
  onDismiss: () => void;
  duration?: number;
}

export function AchievementNotification({
  title,
  message,
  icon = '🏆',
  onDismiss,
  duration = 6000
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4"
      onClick={onDismiss}
    >
      <div
        className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-xl w-full max-w-lg p-8 text-center animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-5xl">{icon}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
            Nova Conquista
          </h3>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 leading-snug">
          {title}
        </h2>

        <p className="text-white text-lg font-medium leading-relaxed break-words">
          {message}
        </p>

        <button
          onClick={onDismiss}
          className="w-full py-3 mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
