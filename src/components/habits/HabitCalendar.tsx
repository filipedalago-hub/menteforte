import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface HabitCalendarProps {
  completionDates: string[];
}

export function HabitCalendar({ completionDates }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const isCompleted = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return completionDates.includes(dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const completed = isCompleted(day);
    const today = isToday(day);

    days.push(
      <div
        key={day}
        className={`h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
          completed
            ? 'bg-green-400/20 text-green-400 border border-green-400/30'
            : 'bg-titanium/10 text-soft-gray'
        } ${today ? 'ring-2 ring-neon-cyan/50' : ''}`}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="card-dark">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 rounded-lg hover:bg-titanium/20 text-soft-gray hover:text-soft-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-soft-white">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-titanium/20 text-soft-gray hover:text-soft-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center text-xs font-semibold text-soft-gray">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-titanium/30">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-400/20 border border-green-400/30" />
          <span className="text-xs text-soft-gray">Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-titanium/10" />
          <span className="text-xs text-soft-gray">Pendente</span>
        </div>
      </div>
    </div>
  );
}
