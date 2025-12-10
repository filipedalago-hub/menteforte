import { useState, useEffect } from 'react';
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
      alert('Por favor, escreva pelo menos 20 caracteres para completar o exercicio.');
      return;
    }
    onComplete();
  };

  const questionText = content.question || content.prompt || 'Reflita sobre sua experiencia';
  const placeholderText = content.placeholder || 'Escreva sua reflexao aqui...';

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-4 text-soft-white">{questionText}</h3>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={placeholderText}
          className="input-dark w-full min-h-[200px] resize-none"
          aria-label="Resposta da reflexao"
        />
        {saveIndicator && (
          <p className="text-sm text-soft-muted mt-2" role="status" aria-live="polite">
            {saveIndicator}
          </p>
        )}
      </div>

      <div>
        <button
          onClick={handleComplete}
          disabled={answer.trim().length < 20}
          className="btn-primary w-full md:w-auto"
        >
          Concluir Exercicio
        </button>
      </div>
    </div>
  );
}
