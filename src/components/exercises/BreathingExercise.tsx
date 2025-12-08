import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

type BreathingExerciseProps = {
  content: {
    instruction: string;
    cycles?: number;
    inhaleSeconds?: number;
    holdSeconds?: number;
    exhaleSeconds?: number;
    duration?: number;
  };
  onComplete: () => void;
};

export function BreathingExercise({ content, onComplete }: BreathingExerciseProps) {
  const cycles = content.cycles || 3;
  const inhaleSeconds = content.inhaleSeconds || 4;
  const holdSeconds = content.holdSeconds || 4;
  const exhaleSeconds = content.exhaleSeconds || 4;

  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(inhaleSeconds);
  const [scale, setScale] = useState(1);

  const isComplete = currentCycle >= cycles;

  useEffect(() => {
    if (!isRunning || isComplete) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const newValue = prev - 1;

        if (newValue <= 0) {
          if (phase === 'inhale') {
            setPhase('hold');
            setScale(1.5);
            return holdSeconds;
          } else if (phase === 'hold') {
            setPhase('exhale');
            setScale(0.8);
            return exhaleSeconds;
          } else {
            setCurrentCycle((c) => c + 1);
            setPhase('inhale');
            setScale(1);
            return inhaleSeconds;
          }
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, isComplete, inhaleSeconds, holdSeconds, exhaleSeconds]);

  useEffect(() => {
    if (phase === 'inhale') {
      setScale(1.5);
    } else if (phase === 'hold') {
      setScale(1.5);
    } else {
      setScale(0.8);
    }
  }, [phase]);

  const phaseLabels = {
    inhale: 'Inspire',
    hold: 'Segure',
    exhale: 'Expire',
  };

  const handleStart = () => {
    if (currentCycle === 0 && !isRunning) {
      setPhase('inhale');
      setSecondsLeft(inhaleSeconds);
      setScale(1);
    }
    setIsRunning(true);
  };

  const displayCycle = Math.min(currentCycle + 1, cycles);
  const displaySeconds = Math.max(0, secondsLeft);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="px-4 md:px-0">
        <h3 className="text-lg md:text-xl font-semibold mb-2 responsive-text">Respiração Guiada</h3>
        <p className="text-sm md:text-base text-gray-600 responsive-text">{content.instruction}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-12 rounded-xl">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-sm md:text-base text-gray-600">
              Ciclo {displayCycle} de {cycles}
            </p>
          </div>

          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 transition-transform duration-1000 ease-in-out"
              style={{ transform: `scale(${scale})` }}
            />
            <div className="relative z-10 text-center">
              <p className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">{phaseLabels[phase]}</p>
              <p className="text-4xl md:text-5xl font-bold text-white">{displaySeconds}</p>
            </div>
          </div>

          {!isComplete ? (
            <button
              onClick={() => isRunning ? setIsRunning(false) : handleStart()}
              className="relative z-20 w-full max-w-xs px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {currentCycle === 0 ? 'Começar' : 'Continuar'}
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="relative z-20 w-full max-w-xs px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Concluir Exercício
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
