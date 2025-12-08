import React, { useState, useEffect } from 'react';
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
  const promptText = content.prompt || 'Liste coisas pelas quais você é grato';

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
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="px-4 md:px-0">
        <h3 className="text-lg md:text-xl font-semibold mb-2 responsive-text">{promptText}</h3>
        <p className="text-sm md:text-base text-gray-600">
          Liste pelo menos {minItems} {minItems === 1 ? 'item' : 'itens'}.
        </p>
      </div>

      <div className="space-y-3 px-4 md:px-0">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-700 text-sm">
              {index + 1}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder="Digite algo pelo qual você é grato..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            />
            {items.length > 1 && (
              <button
                onClick={() => handleRemoveItem(index)}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Remover item"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 md:px-0">
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar item
        </button>
      </div>

      {saveIndicator && (
        <p className="text-sm text-gray-500 px-4 md:px-0" role="status" aria-live="polite">
          {saveIndicator}
        </p>
      )}

      <div className="px-4 md:px-0">
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Concluir Exercício
        </button>
      </div>
    </div>
  );
}
