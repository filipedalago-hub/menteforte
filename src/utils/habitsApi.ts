import { supabase } from '../lib/supabase';
import { Habit, HabitCompletion, CreateHabitInput, UpdateHabitInput, HabitWithStats } from '../types/habits';

export async function fetchHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchHabitsWithStats(userId: string): Promise<HabitWithStats[]> {
  const habits = await fetchHabits(userId);
  const today = new Date().toISOString().split('T')[0];

  const habitsWithStats = await Promise.all(
    habits.map(async (habit) => {
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('completion_date')
        .eq('habit_id', habit.id)
        .order('completion_date', { ascending: false });

      const totalCompletions = completions?.length || 0;
      const isCompletedToday = completions?.some((c) => c.completion_date === today) || false;

      const streaks = calculateStreaks(completions?.map((c) => c.completion_date) || []);

      const daysSinceStart = Math.floor(
        (new Date().getTime() - new Date(habit.start_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      const completionRate = daysSinceStart > 0 ? (totalCompletions / daysSinceStart) * 100 : 0;

      return {
        ...habit,
        current_streak: streaks.current,
        longest_streak: streaks.longest,
        total_completions: totalCompletions,
        completion_rate: Math.min(100, Math.round(completionRate)),
        is_completed_today: isCompletedToday,
      };
    })
  );

  return habitsWithStats;
}

export async function createHabit(userId: string, input: CreateHabitInput): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: userId,
      ...input,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHabit(habitId: string, input: UpdateHabitInput): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', habitId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHabit(habitId: string): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId);

  if (error) throw error;
}

export async function completeHabit(
  userId: string,
  habitId: string,
  notes?: string
): Promise<HabitCompletion> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('habit_completions')
    .insert({
      user_id: userId,
      habit_id: habitId,
      completion_date: today,
      notes,
      xp_earned: 5,
    })
    .select()
    .single();

  if (error) throw error;

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', userId)
    .single();

  if (profile) {
    await supabase
      .from('profiles')
      .update({ xp: profile.xp + 5 })
      .eq('id', userId);
  }

  return data;
}

export async function uncompleteHabit(habitId: string, date?: string): Promise<void> {
  const completionDate = date || new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('habit_completions')
    .delete()
    .eq('habit_id', habitId)
    .eq('completion_date', completionDate);

  if (error) throw error;
}

export async function fetchHabitCompletions(
  habitId: string,
  startDate: string,
  endDate: string
): Promise<HabitCompletion[]> {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .gte('completion_date', startDate)
    .lte('completion_date', endDate)
    .order('completion_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

function calculateStreaks(dates: string[]): { current: number; longest: number } {
  if (!dates || dates.length === 0) {
    return { current: 0, longest: 0 };
  }

  const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = new Date().toISOString().split('T')[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);

    const currentDateStr = currentDate.toISOString().split('T')[0];
    const expectedDateStr = expectedDate.toISOString().split('T')[0];

    if (currentDateStr === expectedDateStr) {
      tempStreak++;
      if (i === 0 || sortedDates[0] === today) {
        currentStreak = tempStreak;
      }
    } else {
      break;
    }
  }

  tempStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.floor(
      (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
}
