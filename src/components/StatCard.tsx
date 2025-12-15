import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { PremiumCard } from './ui/PremiumCard';
import { Caption, TitleMD } from './Typography';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string | null | undefined;
  color?: string;
  bgColor?: string;
  delay?: number;
  animate?: boolean;
  fallbackValue?: string | number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color = 'text-primary',
  bgColor = 'bg-primary/20',
  delay = 0,
  animate = true,
  fallbackValue = '0',
}: StatCardProps) {
  // PROTEÇÃO: Garantir que sempre temos um valor válido
  const getSafeValue = (): string | number => {
    // Se value é null ou undefined, usa fallback
    if (value === null || value === undefined) {
      return fallbackValue;
    }

    // Se é número, retorna formatado
    if (typeof value === 'number') {
      return value;
    }

    // Se é string, garante que não está vazia
    if (typeof value === 'string' && value.trim()) {
      return value;
    }

    // Fallback final
    return fallbackValue;
  };

  const displayValue = getSafeValue();

  const cardContent = (
    <div className="flex items-center gap-3">
      <div className={`p-3 ${bgColor} rounded-xl`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <Caption>{label}</Caption>
        <TitleMD className={color}>{displayValue}</TitleMD>
      </div>
    </div>
  );

  return (
    <PremiumCard variant="glass" padding="md" interactive={false}>
      {animate ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay, type: 'spring' }}
        >
          {cardContent}
        </motion.div>
      ) : (
        cardContent
      )}
    </PremiumCard>
  );
}
