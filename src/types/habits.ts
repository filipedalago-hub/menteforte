export type HabitCategory = 'health' | 'spiritual' | 'personal' | 'professional' | 'financial' | 'relationships';
export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  frequency_target: number;
  icon?: string;
  color: string;
  active: boolean;
  start_date: string;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completion_date: string;
  notes?: string;
  xp_earned: number;
  created_at: string;
}

export interface CreateHabitInput {
  title: string;
  description?: string;
  category: HabitCategory;
  frequency?: HabitFrequency;
  frequency_target?: number;
  icon?: string;
  color?: string;
}

export interface UpdateHabitInput {
  title?: string;
  description?: string;
  category?: HabitCategory;
  frequency?: HabitFrequency;
  frequency_target?: number;
  icon?: string;
  color?: string;
  active?: boolean;
}

export interface HabitWithStats extends Habit {
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  completion_rate: number;
  is_completed_today: boolean;
}
