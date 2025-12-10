import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

type MultipleChoiceExerciseProps = {
  content: {
    question: string;
    options: { id: string; text: string }[] | string[];
    correctId?: string;
    explanation?: string;
  };
  initialAnswer?: string;
  onSave: (answer: string) => void;
  onComplete: () => void;
};

export function MultipleChoiceExercise({
  content,
  initialAnswer = '',
  onSave,
  onComplete,
}: MultipleChoiceExerciseProps) {
  const normalizedOptions = content.options.map((option, index) => {
    if (typeof option === 'string') {
      return { id: `option-${index}`, text: option };
    }
    return option;
  });

  const [selectedId, setSelectedId] = useState(initialAnswer);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id: string) => {
    if (submitted) return;
    setSelectedId(id);
    onSave(id);
  };

  const handleSubmit = () => {
    if (!selectedId) {
      alert('Por favor, selecione uma opcao.');
      return;
    }
    setSubmitted(true);
  };

  const handleComplete = () => {
    onComplete();
  };

  const isCorrect = content.correctId ? selectedId === content.correctId : true;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-soft-white">{content.question}</h3>
      </div>

      <div className="space-y-3">
        {normalizedOptions.map((option) => {
          const isSelected = selectedId === option.id;
          const showResult = submitted && isSelected;
          const isThisCorrect = content.correctId ? option.id === content.correctId : false;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={submitted}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? showResult
                    ? isCorrect
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                    : 'border-primary bg-primary/10'
                  : 'border-titanium/30 hover:border-titanium bg-dark-lighter'
              } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className={`font-medium text-sm md:text-base flex-1 ${
                  isSelected ? 'text-soft-white' : 'text-soft-gray'
                }`}>
                  {option.text}
                </span>
                {showResult && content.correctId && (
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                )}
                {submitted && !isSelected && isThisCorrect && (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {submitted && content.explanation && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl">
          <p className="text-sm md:text-base text-soft-gray">{content.explanation}</p>
        </div>
      )}

      <div>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedId}
            className="btn-primary w-full md:w-auto"
          >
            Verificar Resposta
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="btn-neon w-full md:w-auto"
          >
            Concluir Exercicio
          </button>
        )}
      </div>
    </div>
  );
}
