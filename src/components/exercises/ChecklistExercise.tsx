import { useState, useEffect } from 'react';
import { useAutosave } from '../../hooks/useAutosave';
import { Check } from 'lucide-react';

type ChecklistExerciseProps = {
  content: {
    title?: string;
    items?: string[] | { id: string; text: string }[];
    minRequired?: number;
  };
  initialAnswer?: string[];
  onSave: (answer: string[]) => void;
  onComplete: () => void;
};

export function ChecklistExercise({
  content,
  initialAnswer = [],
  onSave,
  onComplete,
}: ChecklistExerciseProps) {
  const normalizedItems = (content.items || []).map((item, index) => {
    if (typeof item === 'string') {
      return { id: `item-${index}`, text: item };
    }
    return item;
  });

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set(initialAnswer));
  const [saveIndicator, setSaveIndicator] = useState('');

  const triggerAutosave = useAutosave(() => {
    onSave(Array.from(checkedItems));
    setSaveIndicator('Salvo');
    setTimeout(() => setSaveIndicator(''), 2000);
  });

  useEffect(() => {
    if (checkedItems.size > 0) {
      setSaveIndicator('Salvando...');
      triggerAutosave();
    }
  }, [checkedItems]);

  const handleToggle = (itemId: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const minRequired = content.minRequired || 1;
  const canComplete = checkedItems.size >= minRequired;
  const title = content.title || 'Complete as tarefas abaixo';

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-4 text-soft-white">{title}</h3>

        <div className="space-y-3">
          {normalizedItems.map((item) => {
            const isChecked = checkedItems.has(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  isChecked
                    ? 'border-primary bg-primary/10'
                    : 'border-titanium/30 hover:border-titanium bg-dark-lighter'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-primary border-primary'
                      : 'border-titanium bg-dark-lighter'
                  }`}
                >
                  {isChecked && <Check className="w-4 h-4 text-dark" />}
                </div>
                <span className={`font-medium text-sm md:text-base ${isChecked ? 'text-soft-white' : 'text-soft-gray'}`}>
                  {item.text}
                </span>
              </button>
            );
          })}
        </div>

        {saveIndicator && (
          <p className="text-sm text-soft-muted mt-4" role="status" aria-live="polite">
            {saveIndicator}
          </p>
        )}

        {content.minRequired && (
          <p className="text-sm text-soft-gray mt-4">
            Marque pelo menos {content.minRequired} {content.minRequired === 1 ? 'item' : 'itens'} para continuar.
          </p>
        )}
      </div>

      <div>
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className="btn-primary w-full md:w-auto"
        >
          Concluir Exercicio
        </button>
      </div>
    </div>
  );
}
