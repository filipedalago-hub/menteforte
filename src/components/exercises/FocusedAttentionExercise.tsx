import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { useAutosave } from '../../hooks/useAutosave';

type FocusedAttentionExerciseProps = {
  content: {
    instruction: string;
    duration?: number;
    durationMinutes?: number;
  };
  initialAnswer?: { completed: boolean; reflection?: string };
  onSave: (answer: { completed: boolean; reflection?: string }) => void;
  onComplete: () => void;
};

export function FocusedAttentionExercise({
  content,
  initialAnswer = { completed: false },
  onSave,
  onComplete,
}: FocusedAttentionExerciseProps) {
  const durationMinutes = content.durationMinutes || (content.duration ? Math.floor(content.duration / 60) : 2);
  const totalSeconds = durationMinutes * 60;

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [reflection, setReflection] = useState(initialAnswer.reflection || '');
  const [timerCompleted, setTimerCompleted] = useState(initialAnswer.completed || false);
  const [saveIndicator, setSaveIndicator] = useState('');

  const triggerAutosave = useAutosave(() => {
    onSave({ completed: timerCompleted, reflection });
    setSaveIndicator('Salvo');
    setTimeout(() => setSaveIndicator(''), 2000);
  });

  useEffect(() => {
    if (reflection && timerCompleted) {
      setSaveIndicator('Salvando...');
      triggerAutosave();
    }
  }, [reflection, timerCompleted]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          setIsRunning(false);
          setTimerCompleted(true);
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    if (!timerCompleted) {
      alert('Por favor, complete o tempo de foco antes de finalizar.');
      return;
    }
    if (reflection.trim().length < 10) {
      alert('Por favor, escreva uma breve reflexão sobre a experiência.');
      return;
    }
    onComplete();
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="px-4 md:px-0">
        <h3 className="text-lg md:text-xl font-semibold mb-2 responsive-text">Atenção Focada</h3>
        <p className="text-sm md:text-base text-gray-600 responsive-text">{content.instruction}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-12 rounded-xl">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-5xl md:text-6xl font-bold text-blue-900">
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={timeLeft === 0}
            className="relative z-20 w-full max-w-xs px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {timeLeft === totalSeconds ? 'Iniciar' : 'Continuar'}
              </>
            )}
          </button>
        </div>
      </div>

      {timerCompleted && (
        <div className="px-4 md:px-0">
          <label htmlFor="reflection" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
            Como foi sua experiência de foco?
          </label>
          <textarea
            id="reflection"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Descreva como se sentiu durante o exercício de atenção focada..."
            className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {saveIndicator && (
            <p className="text-sm text-gray-500 mt-2" role="status" aria-live="polite">
              {saveIndicator}
            </p>
          )}
        </div>
      )}

      {timerCompleted && (
        <div className="px-4 md:px-0">
          <button
            onClick={handleComplete}
            disabled={reflection.trim().length < 10}
            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Concluir Exercício
          </button>
        </div>
      )}
    </div>
  );
}
