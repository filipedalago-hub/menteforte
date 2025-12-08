import { useEffect, useState } from 'react';
import { Sparkles, Heart, Brain, Lightbulb } from 'lucide-react';
import { EmotionalMessage } from '../lib/emotionalIntelligence';

interface EmotionalFeedbackProps {
  message: EmotionalMessage;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  duration?: number;
}

const toneIcons = {
  celebrating: Sparkles,
  encouraging: Heart,
  empathetic: Heart,
  wise: Brain,
  gentle: Heart,
  motivating: Lightbulb
};

const toneColors = {
  celebrating: 'from-accent-gold to-accent-orange',
  encouraging: 'from-primary to-primary-dark',
  empathetic: 'from-secondary-mint to-secondary-purple',
  wise: 'from-secondary-purple to-primary-dark',
  gentle: 'from-secondary-mint to-primary',
  motivating: 'from-accent-gold to-primary'
};

export function EmotionalFeedback({
  message,
  onDismiss,
  autoDismiss = true,
  duration = 8000
}: EmotionalFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const Icon = toneIcons[message.tone];
  const colorClass = toneColors[message.tone];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    if (autoDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  };

  if (!isVisible && !isLeaving) return null;

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4
        transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${colorClass}`} />

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`
              flex-shrink-0 w-12 h-12 rounded-xl
              bg-gradient-to-br ${colorClass}
              flex items-center justify-center
            `}>
              <Icon className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-gray-800 leading-relaxed">
                {message.text}
              </p>
            </div>

            {onDismiss && (
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fechar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
