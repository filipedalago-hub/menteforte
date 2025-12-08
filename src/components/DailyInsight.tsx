import { useState, useEffect } from 'react';
import { EmotionalMessage } from '../lib/emotionalIntelligence';

interface DailyInsightProps {
  insight: EmotionalMessage;
  onRead: () => void;
}

export function DailyInsight({ insight, onRead }: DailyInsightProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4"
      onClick={onRead}
    >
      <div
        className="bg-white/20 backdrop-blur-2xl rounded-3xl shadow-xl w-full max-w-lg p-8 text-center animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
          Reflexão do Dia
        </h3>

        <p className="text-white text-lg font-medium leading-relaxed break-words">
          {insight.text}
        </p>

        <button
          onClick={onRead}
          className="w-full py-3 mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          Continuar jornada
        </button>
      </div>
    </div>
  );
}
