import { useState } from 'react';
import { X } from 'lucide-react';
import { CreateGoalInput, GoalCategory, GoalTargetType } from '../../types/goals';

interface GoalFormProps {
  onSubmit: (goal: CreateGoalInput) => void;
  onCancel: () => void;
}

const categories: { value: GoalCategory; label: string }[] = [
  { value: 'health', label: 'Saúde' },
  { value: 'spiritual', label: 'Espiritual' },
  { value: 'personal', label: 'Pessoal' },
  { value: 'professional', label: 'Profissional' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'relationships', label: 'Relacionamentos' },
];

const targetTypes: { value: GoalTargetType; label: string }[] = [
  { value: 'boolean', label: 'Sim/Não' },
  { value: 'numeric', label: 'Numérica' },
];

export function GoalForm({ onSubmit, onCancel }: GoalFormProps) {
  const [formData, setFormData] = useState<CreateGoalInput>({
    title: '',
    description: '',
    category: 'personal',
    target_type: 'boolean',
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
          <h2 className="text-2xl font-bold text-soft-white">Nova Meta</h2>
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
              Título da Meta *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-dark w-full"
              placeholder="Ex: Perder 5kg, Ler 12 livros, Meditar diariamente"
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
              placeholder="Descreva sua meta com mais detalhes..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-soft-white mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as GoalCategory })}
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
                Tipo de Meta
              </label>
              <select
                value={formData.target_type}
                onChange={(e) => setFormData({ ...formData, target_type: e.target.value as GoalTargetType })}
                className="input-dark w-full"
              >
                {targetTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.target_type === 'numeric' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-soft-white mb-2">
                  Valor Alvo *
                </label>
                <input
                  type="number"
                  value={formData.target_value || ''}
                  onChange={(e) => setFormData({ ...formData, target_value: parseInt(e.target.value) || 0 })}
                  className="input-dark w-full"
                  placeholder="Ex: 5, 12, 100"
                  required={formData.target_type === 'numeric'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-white mb-2">
                  Unidade
                </label>
                <input
                  type="text"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="input-dark w-full"
                  placeholder="Ex: kg, livros, horas"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-soft-white mb-2">
              Prazo (Opcional)
            </label>
            <input
              type="date"
              value={formData.deadline || ''}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="input-dark w-full"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Criar Meta
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
