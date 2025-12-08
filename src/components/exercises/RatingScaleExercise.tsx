import React, { useState, useEffect } from 'react';
import { useAutosave } from '../../hooks/useAutosave';

type RatingScaleExerciseProps = {
  content: {
    questions?: { id: string; text: string }[];
    question?: string;
    minLabel?: string;
    maxLabel?: string;
    min?: number;
    max?: number;
  };
  initialAnswer?: Record<string, number> | number;
  onSave: (answer: Record<string, number> | number) => void;
  onComplete: () => void;
};

export function RatingScaleExercise({
  content,
  initialAnswer = {},
  onSave,
  onComplete,
}: RatingScaleExerciseProps) {
  const questions = content.questions || (content.question ? [{ id: 'single', text: content.question }] : []);
  const minLabel = content.minLabel || 'Baixo';
  const maxLabel = content.maxLabel || 'Alto';
  const maxValue = content.max || 5;

  const [ratings, setRatings] = useState<Record<string, number>>(
    typeof initialAnswer === 'number' ? { single: initialAnswer } : initialAnswer
  );
  const [saveIndicator, setSaveIndicator] = useState('');

  const triggerAutosave = useAutosave(() => {
    onSave(questions.length === 1 ? (ratings.single || 0) : ratings);
    setSaveIndicator('Salvo');
    setTimeout(() => setSaveIndicator(''), 2000);
  });

  useEffect(() => {
    if (Object.keys(ratings).length > 0) {
      setSaveIndicator('Salvando...');
      triggerAutosave();
    }
  }, [ratings]);

  const handleRating = (questionId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: value }));
  };

  const allQuestionsAnswered = questions.every((q) => ratings[q.id] !== undefined);

  const handleComplete = () => {
    if (!allQuestionsAnswered) {
      alert('Por favor, responda todas as questões.');
      return;
    }
    onComplete();
  };

  const scaleValues = Array.from({ length: maxValue }, (_, i) => i + 1);

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      {questions.map((question) => (
        <div key={question.id} className="space-y-3 px-4 md:px-0">
          <h3 className="text-lg md:text-xl font-semibold responsive-text">{question.text}</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm md:text-base text-gray-600 sm:w-20 text-center sm:text-left">{minLabel}</span>
            <div className="flex gap-2 flex-1 justify-center flex-wrap">
              {scaleValues.map((value) => (
                <button
                  key={value}
                  onClick={() => handleRating(question.id, value)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 font-semibold transition-all ${
                    ratings[question.id] === value
                      ? 'bg-blue-600 text-white border-blue-600 scale-110'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                  aria-label={`Avaliar ${value} de ${maxValue}`}
                  aria-pressed={ratings[question.id] === value}
                >
                  {value}
                </button>
              ))}
            </div>
            <span className="text-sm md:text-base text-gray-600 sm:w-20 text-center sm:text-right">{maxLabel}</span>
          </div>
        </div>
      ))}

      {saveIndicator && (
        <p className="text-sm text-gray-500 px-4 md:px-0" role="status" aria-live="polite">
          {saveIndicator}
        </p>
      )}

      <div className="px-4 md:px-0">
        <button
          onClick={handleComplete}
          disabled={!allQuestionsAnswered}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Concluir Exercício
        </button>
      </div>
    </div>
  );
}
