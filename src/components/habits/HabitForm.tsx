import { useState } from 'react';
import { X } from 'lucide-react';
import { CreateHabitInput, HabitCategory, HabitFrequency } from '../../types/habits';

interface HabitFormProps {
  onSubmit: (habit: CreateHabitInput) => void;
  onCancel: () => void;
}

const categories: { value: HabitCategory; label: string }[] = [
  { value: 'health', label: 'Saúde' },
  { value: 'spiritual', label: 'Espiritual' },
  { value: 'personal', label: 'Pessoal' },
  { value: 'professional', label: 'Profissional' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'relationships', label: 'Relacionamentos' },
];

const frequencies: { value: HabitFrequency; label: string }[] = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'custom', label: 'Personalizado' },
];

const colorOptions = [
  { value: 'cyan', label: 'Ciano', class: 'bg-neon-cyan' },
  { value: 'blue', label: 'Azul', class: 'bg-blue-400' },
  { value: 'green', label: 'Verde', class: 'bg-green-400' },
  { value: 'purple', label: 'Roxo', class: 'bg-purple-400' },
  { value: 'pink', label: 'Rosa', class: 'bg-pink-400' },
  { value: 'yellow', label: 'Amarelo', class: 'bg-yellow-400' },
];

export function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  const [formData, setFormData] = useState<CreateHabitInput>({
    title: '',
    description: '',
    category: 'personal',
    frequency: 'daily',
    frequency_target: 1,
    color: 'cyan',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-dark max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-soft-white">Novo Hábito</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-titanium/20 text-soft-gray hover:text-soft-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-soft-white mb-2">
              Nome do Hábito *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-dark w-full"
              placeholder="Ex: Meditar, Exercitar, Ler, Acordar cedo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-soft-white mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-dark w-full min-h-[80px]"
              placeholder="Descreva seu hábito com mais detalhes..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-soft-white mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as HabitCategory })}
                className="input-dark w-full"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-soft-white mb-2">
                Frequência
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as HabitFrequency })}
                className="input-dark w-full"
              >
                {frequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.frequency !== 'daily' && (
            <div>
              <label className="block text-sm font-medium text-soft-white mb-2">
                Meta de Frequência
              </label>
              <input
                type="number"
                value={formData.frequency_target}
                onChange={(e) => setFormData({ ...formData, frequency_target: parseInt(e.target.value) || 1 })}
                className="input-dark w-full"
                min="1"
                max="7"
                placeholder="Quantas vezes?"
              />
              <p className="text-xs text-soft-gray mt-1">
                {formData.frequency === 'weekly' ? 'Quantas vezes por semana?' : 'Quantas vezes no período?'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-soft-white mb-2">
              Cor do Hábito
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`h-10 rounded-lg border-2 transition-all ${color.class} ${
                    formData.color === color.value
                      ? 'border-soft-white scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Criar Hábito
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
