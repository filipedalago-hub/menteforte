import React, { useState, useEffect } from 'react';
import { useAutosave } from '../../hooks/useAutosave';

type ReflectionExerciseProps = {
  content: {
    question?: string;
    prompt?: string;
    placeholder?: string;
  };
  initialAnswer?: string;
  onSave: (answer: string) => void;
  onComplete: () => void;
};

export function ReflectionExercise({
  content,
  initialAnswer = '',
  onSave,
  onComplete,
}: ReflectionExerciseProps) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [saveIndicator, setSaveIndicator] = useState('');

  const triggerAutosave = useAutosave(() => {
    onSave(answer);
    setSaveIndicator('Salvo');
    setTimeout(() => setSaveIndicator(''), 2000);
  });

  useEffect(() => {
    if (answer !== initialAnswer && answer.length > 0) {
      setSaveIndicator('Salvando...');
      triggerAutosave();
    }
  }, [answer]);

  const handleComplete = () => {
    if (answer.trim().length < 20) {
      alert('Por favor, escreva pelo menos 20 caracteres para completar o exercício.');
      return;
    }
    onComplete();
  };

  const questionText = content.question || content.prompt || 'Reflita sobre sua experiência';
  const placeholderText = content.placeholder || 'Escreva sua reflexão aqui...';

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="px-4 md:px-0">
        <h3 className="text-lg md:text-xl font-semibold mb-4 responsive-text">{questionText}</h3>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={placeholderText}
          className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm md:text-base"
          aria-label="Resposta da reflexão"
        />
        {saveIndicator && (
          <p className="text-sm text-gray-500 mt-2" role="status" aria-live="polite">
            {saveIndicator}
          </p>
        )}
      </div>

      <div className="px-4 md:px-0">
        <button
          onClick={handleComplete}
          disabled={answer.trim().length < 20}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Concluir Exercício
        </button>
      </div>
    </div>
  );
}
