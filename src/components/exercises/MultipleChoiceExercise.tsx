import React, { useState } from 'react';
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
      alert('Por favor, selecione uma opção.');
      return;
    }
    setSubmitted(true);
  };

  const handleComplete = () => {
    onComplete();
  };

  const isCorrect = content.correctId ? selectedId === content.correctId : true;

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="px-4 md:px-0">
        <h3 className="text-lg md:text-xl font-semibold responsive-text">{content.question}</h3>
      </div>

      <div className="space-y-3 px-4 md:px-0">
        {normalizedOptions.map((option) => {
          const isSelected = selectedId === option.id;
          const showResult = submitted && isSelected;
          const isThisCorrect = content.correctId ? option.id === content.correctId : false;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={submitted}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? showResult
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-sm md:text-base responsive-text flex-1">{option.text}</span>
                {showResult && content.correctId && (
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                )}
                {submitted && !isSelected && isThisCorrect && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {submitted && content.explanation && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mx-4 md:mx-0">
          <p className="text-sm md:text-base text-gray-700 responsive-text">{content.explanation}</p>
        </div>
      )}

      <div className="px-4 md:px-0">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedId}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Verificar Resposta
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Concluir Exercício
          </button>
        )}
      </div>
    </div>
  );
}
