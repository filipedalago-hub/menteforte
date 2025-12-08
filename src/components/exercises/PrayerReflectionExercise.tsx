import React, { useState, useEffect } from 'react';
import { useAutosave } from '../../hooks/useAutosave';

type PrayerReflectionExerciseProps = {
  content: {
    guidance: string;
    reflectionPrompt: string;
  };
  initialAnswer?: string;
  onSave: (answer: string) => void;
  onComplete: () => void;
};

export function PrayerReflectionExercise({
  content,
  initialAnswer = '',
  onSave,
  onComplete,
}: PrayerReflectionExerciseProps) {
  const [reflection, setReflection] = useState(initialAnswer);
  const [saveIndicator, setSaveIndicator] = useState('');

  const triggerAutosave = useAutosave(() => {
    onSave(reflection);
    setSaveIndicator('Salvo');
    setTimeout(() => setSaveIndicator(''), 2000);
  });

  useEffect(() => {
    if (reflection !== initialAnswer) {
      setSaveIndicator('Salvando...');
      triggerAutosave();
    }
  }, [reflection]);

  const handleComplete = () => {
    if (reflection.trim().length < 20) {
      alert('Por favor, escreva pelo menos 20 caracteres para completar sua reflexão.');
      return;
    }
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-900">Momento de Reflexão Espiritual</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content.guidance}</p>
      </div>

      <div>
        <label htmlFor="reflection" className="block text-lg font-semibold mb-3">
          {content.reflectionPrompt}
        </label>
        <textarea
          id="reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Escreva sua reflexão pessoal aqui..."
          className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        {saveIndicator && (
          <p className="text-sm text-gray-500 mt-2" role="status" aria-live="polite">
            {saveIndicator}
          </p>
        )}
      </div>

      <button
        onClick={handleComplete}
        disabled={reflection.trim().length < 20}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Concluir Exercício
      </button>
    </div>
  );
}
