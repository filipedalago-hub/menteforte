import { useState, useEffect } from 'react';
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
        <h3 className="text-lg font-semibold mb-4 text-soft-white">Autoavalie como voce esta em cada area:</h3>
        <p className="text-sm text-soft-gray mb-6">1 = Preciso melhorar muito | 5 = Estou muito bem</p>

        <div className="space-y-6">
          {content.areas.map((area) => (
            <div key={area.id} className="space-y-3">
              <h4 className="font-semibold text-soft-white">{area.name}</h4>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRating(area.id, value)}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 font-semibold transition-all ${
                      ratings[area.id] === value
                        ? 'bg-primary text-dark border-primary scale-110 shadow-glow-sm'
                        : 'bg-dark-lighter text-soft-gray border-titanium/30 hover:border-primary'
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
        <label htmlFor="commitment" className="block text-lg font-semibold mb-3 text-soft-white">
          {content.commitmentPrompt}
        </label>
        <textarea
          id="commitment"
          value={commitment}
          onChange={(e) => setCommitment(e.target.value)}
          placeholder="Escreva seu compromisso pessoal..."
          className="input-dark w-full min-h-[150px] resize-none"
        />
        {saveIndicator && (
          <p className="text-sm text-soft-muted mt-2" role="status" aria-live="polite">
            {saveIndicator}
          </p>
        )}
      </div>

      <button
        onClick={onComplete}
        disabled={!canComplete}
        className="btn-primary w-full md:w-auto"
      >
        Concluir Exercicio
      </button>
    </div>
  );
}
