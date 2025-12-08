import React, { useState, useEffect } from 'react';
import { useAutosave } from '../../hooks/useAutosave';

type MoralAssessmentExerciseProps = {
  content: {
    areas: { id: string; name: string }[];
    commitmentPrompt: string;
  };
  initialAnswer?: { ratings: Record<string, number>; commitment: string };
  onSave: (answer: { ratings: Record<string, number>; commitment: string }) => void;
  onComplete: () => void;
};

export function MoralAssessmentExercise({
  content,
  initialAnswer = { ratings: {}, commitment: '' },
  onSave,
  onComplete,
}: MoralAssessmentExerciseProps) {
  const [ratings, setRatings] = useState<Record<string, number>>(initialAnswer.ratings);
  const [commitment, setCommitment] = useState(initialAnswer.commitment);
  const [saveIndicator, setSaveIndicator] = useState('');

  const triggerAutosave = useAutosave(() => {
    onSave({ ratings, commitment });
    setSaveIndicator('Salvo');
    setTimeout(() => setSaveIndicator(''), 2000);
  });

  useEffect(() => {
    if (Object.keys(ratings).length > 0 || commitment) {
      setSaveIndicator('Salvando...');
      triggerAutosave();
    }
  }, [ratings, commitment]);

  const handleRating = (areaId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [areaId]: value }));
  };

  const allAreasRated = content.areas.every((area) => ratings[area.id] !== undefined);
  const canComplete = allAreasRated && commitment.trim().length >= 20;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Autoavalie como você está em cada área:</h3>
        <p className="text-sm text-gray-600 mb-6">1 = Preciso melhorar muito | 5 = Estou muito bem</p>

        <div className="space-y-6">
          {content.areas.map((area) => (
            <div key={area.id} className="space-y-3">
              <h4 className="font-semibold text-gray-900">{area.name}</h4>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRating(area.id, value)}
                    className={`w-14 h-14 rounded-lg border-2 font-semibold transition-all ${
                      ratings[area.id] === value
                        ? 'bg-purple-600 text-white border-purple-600 scale-110'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="commitment" className="block text-lg font-semibold mb-3">
          {content.commitmentPrompt}
        </label>
        <textarea
          id="commitment"
          value={commitment}
          onChange={(e) => setCommitment(e.target.value)}
          placeholder="Escreva seu compromisso pessoal..."
          className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        {saveIndicator && (
          <p className="text-sm text-gray-500 mt-2" role="status" aria-live="polite">
            {saveIndicator}
          </p>
        )}
      </div>

      <button
        onClick={onComplete}
        disabled={!canComplete}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Concluir Exercício
      </button>
    </div>
  );
}
