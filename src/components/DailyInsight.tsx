import { useState, useEffect } from 'react';
import { EmotionalMessage } from '../lib/emotionalIntelligence';
import { Sparkles, X } from 'lucide-react';

interface DailyInsightProps {
  isOpen: boolean;
  onClose: () => void;
  insight?: EmotionalMessage | null;
}

const DEFAULT_INSIGHTS = [
  'Cada passo que você dá hoje é uma vitória para o seu amanhã.',
  'Sua jornada de autoconhecimento está transformando você em alguém incrível.',
  'Lembre-se: o progresso não precisa ser perfeito, apenas consistente.',
  'Você está mais forte do que imagina. Continue avançando!',
  'Hoje é uma nova oportunidade para evoluir. Aproveite cada momento.',
];

export function DailyInsight({ isOpen, onClose, insight }: DailyInsightProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsAnimating(true);
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // PROTEÇÃO: Se não está aberto, não renderiza nada
  if (!isOpen) return null;

  // PROTEÇÃO: Garantir que sempre temos um texto para exibir
  const getInsightText = (): string => {
    // Se insight existe e tem texto, use-o
    if (insight && insight.text && typeof insight.text === 'string' && insight.text.trim()) {
      return insight.text;
    }

    // FALLBACK: Escolhe insight motivacional baseado no dia
    const dayIndex = new Date().getDate() % DEFAULT_INSIGHTS.length;
    return DEFAULT_INSIGHTS[dayIndex];
  };

  const insightText = getInsightText();

  // PROTEÇÃO: Se por algum motivo ainda não tem texto, usa fallback final
  const finalText = insightText || 'Continue sua jornada de evolução! Você está no caminho certo.';

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-2xl rounded-3xl shadow-xl w-full max-w-lg p-8 text-center border border-white/20 transition-transform duration-300 ${
          isAnimating ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Ícone */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-full">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Título */}
        <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
          Reflexão do Dia
        </h3>

        {/* Loading state */}
        {isLoading ? (
          <div className="py-8">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-white/20 rounded w-full mx-auto"></div>
              <div className="h-4 bg-white/20 rounded w-5/6 mx-auto"></div>
            </div>
            <p className="text-white/60 text-sm mt-4">Carregando insight...</p>
          </div>
        ) : (
          <>
            {/* Conteúdo - SEMPRE renderiza algo */}
            <p className="text-white text-lg font-medium leading-relaxed break-words min-h-[80px] flex items-center justify-center">
              {finalText}
            </p>

            {/* Botão de ação */}
            <button
              onClick={onClose}
              className="w-full py-3 mt-6 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Continuar jornada
            </button>
          </>
        )}
      </div>
    </div>
  );
}
