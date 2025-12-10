import { supabase } from '../lib/supabase';
import { Goal, CreateGoalInput, UpdateGoalInput } from '../types/goals';

export async function fetchGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createGoal(userId: string, input: CreateGoalInput): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      ...input,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGoal(goalId: string, input: UpdateGoalInput): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', goalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGoal(goalId: string): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  if (error) throw error;
}

export async function completeGoal(goalId: string): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', goalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGoalProgress(goalId: string, currentValue: number): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .update({
      current_value: currentValue,
      updated_at: new Date().toISOString(),
    })
    .eq('id', goalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
