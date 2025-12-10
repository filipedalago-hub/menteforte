import { useState, useEffect } from 'react';
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
      alert('Por favor, escreva uma breve reflexao sobre a experiencia.');
      return;
    }
    onComplete();
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-soft-white">Atencao Focada</h3>
        <p className="text-sm md:text-base text-soft-gray">{content.instruction}</p>
      </div>

      <div className="bg-gradient-to-br from-primary/20 to-neon-blue/20 p-6 md:p-12 rounded-xl border border-primary/30">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-5xl md:text-6xl font-bold text-soft-white">
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={timeLeft === 0}
            className="btn-primary relative z-20 w-full max-w-xs flex items-center justify-center gap-2"
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
        <div>
          <label htmlFor="reflection" className="label-dark">
            Como foi sua experiencia de foco?
          </label>
          <textarea
            id="reflection"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Descreva como se sentiu durante o exercicio de atencao focada..."
            className="input-dark w-full min-h-[120px] resize-none"
          />
          {saveIndicator && (
            <p className="text-sm text-soft-muted mt-2" role="status" aria-live="polite">
              {saveIndicator}
            </p>
          )}
        </div>
      )}

      {timerCompleted && (
        <div>
          <button
            onClick={handleComplete}
            disabled={reflection.trim().length < 10}
            className="btn-neon w-full md:w-auto"
          >
            Concluir Exercicio
          </button>
        </div>
      )}
    </div>
  );
}
