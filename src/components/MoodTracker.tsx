import { useState } from 'react';
import { Smile, Meh, Frown, Battery, BatteryMedium, BatteryLow } from 'lucide-react';

interface MoodTrackerProps {
  onSubmit: (data: MoodData) => void;
  onSkip?: () => void;
  context?: 'session_start' | 'session_end';
}

export interface MoodData {
  moodScore: number;
  moodLabel: string;
  energyLevel: number;
  notes?: string;
}

const moods = [
  { score: 1, label: 'Difícil', emoji: '😔', color: 'bg-red-500' },
  { score: 2, label: 'Pesado', emoji: '😕', color: 'bg-orange-500' },
  { score: 3, label: 'Ok', emoji: '😐', color: 'bg-yellow-500' },
  { score: 4, label: 'Bem', emoji: '🙂', color: 'bg-emerald-500' },
  { score: 5, label: 'Ótimo', emoji: '😊', color: 'bg-green-500' }
];

const energyLevels = [
  { level: 1, label: 'Exausto', icon: BatteryLow, color: 'text-red-500' },
  { level: 2, label: 'Cansado', icon: BatteryLow, color: 'text-orange-500' },
  { level: 3, label: 'Normal', icon: BatteryMedium, color: 'text-yellow-500' },
  { level: 4, label: 'Energizado', icon: Battery, color: 'text-emerald-500' },
  { level: 5, label: 'Vibrante', icon: Battery, color: 'text-green-500' }
];

export function MoodTracker({ onSubmit, onSkip, context = 'session_start' }: MoodTrackerProps) {
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'mood' | 'energy' | 'notes'>('mood');

  const handleMoodSelect = (score: number) => {
    setMoodScore(score);
    setStep('energy');
  };

  const handleEnergySelect = (level: number) => {
    setEnergyLevel(level);
    setStep('notes');
  };

  const handleSubmit = () => {
    if (moodScore && energyLevel) {
      const selectedMood = moods.find(m => m.score === moodScore);
      onSubmit({
        moodScore,
        moodLabel: selectedMood?.label || 'Ok',
        energyLevel,
        notes: notes.trim() || undefined
      });
    }
  };

  const getTitle = () => {
    if (context === 'session_end') {
      return 'Como você está se sentindo agora?';
    }
    return 'Como você está hoje?';
  };

  const getSubtitle = () => {
    if (step === 'mood') return 'Isso me ajuda a entender você melhor';
    if (step === 'energy') return 'E seu nível de energia?';
    return 'Quer compartilhar algo? (opcional)';
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-lg p-8 animate-scaleIn">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
            {getTitle()}
          </h3>
          <p className="text-gray-700 text-lg font-medium leading-relaxed">
            {getSubtitle()}
          </p>
        </div>

        {step === 'mood' && (
          <div className="space-y-4">
            {moods.map((mood) => (
              <button
                key={mood.score}
                onClick={() => handleMoodSelect(mood.score)}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all
                  hover:scale-105 hover:shadow-md
                  ${moodScore === mood.score
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="font-medium text-gray-900">{mood.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'energy' && (
          <div className="space-y-4">
            {energyLevels.map((energy) => {
              const Icon = energy.icon;
              return (
                <button
                  key={energy.level}
                  onClick={() => handleEnergySelect(energy.level)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all
                    hover:scale-105 hover:shadow-md
                    ${energyLevel === energy.level
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <Icon className={`w-8 h-8 ${energy.color}`} />
                    <span className="font-medium text-gray-900">{energy.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 'notes' && (
          <div className="space-y-6">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="O que está na sua mente agora?"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition"
              >
                Continuar
              </button>

              {notes.trim() === '' && (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Pular
                </button>
              )}
            </div>
          </div>
        )}

        {step !== 'notes' && onSkip && (
          <div className="mt-6 text-center">
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Pular agora
            </button>
          </div>
        )}

        {(step === 'energy' || step === 'notes') && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setStep(step === 'energy' ? 'mood' : 'energy')}
              className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
