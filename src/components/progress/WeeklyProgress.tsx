import { Check, X } from 'lucide-react';

interface WeeklyProgressProps {
  completionDates: string[];
}

export function WeeklyProgress({ completionDates }: WeeklyProgressProps) {
  const today = new Date();
  const weekDays = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    weekDays.push(date);
  }

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const isCompleted = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return completionDates.includes(dateStr);
  };

  return (
    <div className="flex gap-2 justify-between">
      {weekDays.map((date, index) => {
        const completed = isCompleted(date);
        const isToday = date.toDateString() === today.toDateString();

        return (
          <div key={index} className="flex flex-col items-center gap-1">
            <span className={`text-xs ${isToday ? 'text-neon-cyan font-bold' : 'text-soft-gray'}`}>
              {dayNames[date.getDay()]}
            </span>
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                completed
                  ? 'bg-green-400/20 border-2 border-green-400/50'
                  : 'bg-titanium/20 border border-titanium/30'
              } ${isToday ? 'ring-2 ring-neon-cyan/50' : ''}`}
            >
              {completed ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <X className="w-5 h-5 text-titanium" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
