import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useAutosave } from '../../hooks/useAutosave';

type GratitudeListExerciseProps = {
  content: {
    prompt?: string;
    minItems?: number;
  };
  initialAnswer?: string[];
  onSave: (answer: string[]) => void;
  onComplete: () => void;
};

export function GratitudeListExercise({
  content,
  initialAnswer = [],
  onSave,
  onComplete,
}: GratitudeListExerciseProps) {
  const minItems = content.minItems || 3;
  const promptText = content.prompt || 'Liste coisas pelas quais voce e grato';

  const [items, setItems] = useState<string[]>(initialAnswer.length > 0 ? initialAnswer : ['']);
  const [saveIndicator, setSaveIndicator] = useState('');

  const triggerAutosave = useAutosave(() => {
    const filledItems = items.filter(item => item.trim());
    if (filledItems.length > 0) {
      onSave(filledItems);
      setSaveIndicator('Salvo');
      setTimeout(() => setSaveIndicator(''), 2000);
    }
  });

  useEffect(() => {
    const filledItems = items.filter(item => item.trim());
    if (filledItems.length > 0) {
      setSaveIndicator('Salvando...');
      triggerAutosave();
    }
  }, [items]);

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const filledItems = items.filter(item => item.trim());
  const canComplete = filledItems.length >= minItems;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-soft-white">{promptText}</h3>
        <p className="text-sm md:text-base text-soft-gray">
          Liste pelo menos {minItems} {minItems === 1 ? 'item' : 'itens'}.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center font-semibold text-primary text-sm">
              {index + 1}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder="Digite algo pelo qual voce e grato..."
              className="input-dark flex-1"
            />
            {items.length > 1 && (
              <button
                onClick={() => handleRemoveItem(index)}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-soft-muted hover:text-red-400 transition-colors"
                aria-label="Remover item"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 px-4 py-2 text-primary hover:text-neon-cyan font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar item
        </button>
      </div>

      {saveIndicator && (
        <p className="text-sm text-soft-muted" role="status" aria-live="polite">
          {saveIndicator}
        </p>
      )}

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
