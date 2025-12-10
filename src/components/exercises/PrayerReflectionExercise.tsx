import { useState, useEffect } from 'react';
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
      alert('Por favor, escreva pelo menos 20 caracteres para completar sua reflexao.');
      return;
    }
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3 text-neon-cyan">Momento de Reflexao Espiritual</h3>
        <p className="text-soft-gray leading-relaxed whitespace-pre-line">{content.guidance}</p>
      </div>

      <div>
        <label htmlFor="reflection" className="block text-lg font-semibold mb-3 text-soft-white">
          {content.reflectionPrompt}
        </label>
        <textarea
          id="reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Escreva sua reflexao pessoal aqui..."
          className="input-dark w-full min-h-[200px] resize-none"
        />
        {saveIndicator && (
          <p className="text-sm text-soft-muted mt-2" role="status" aria-live="polite">
            {saveIndicator}
          </p>
        )}
      </div>

      <button
        onClick={handleComplete}
        disabled={reflection.trim().length < 20}
        className="btn-primary w-full md:w-auto"
      >
        Concluir Exercicio
      </button>
    </div>
  );
}
