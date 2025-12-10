import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_sessions: number;
  total_time_minutes: number;
  created_at: string;
  updated_at: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
};

export type Trilha = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_name: string;
  order_index: number;
  created_at: string;
};

export type Pilar = {
  id: string;
  trilha_id: string;
  slug: string;
  name: string;
  description: string;
  order_index: number;
  created_at: string;
};

export type Exercise = {
  id: string;
  pilar_id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  content: any;
  xp_reward: number;
  order_index: number;
  created_at: string;
};

export type UserExerciseProgress = {
  id: string;
  user_id: string;
  exercise_id: string;
  completed: boolean;
  answer_data: any;
  completed_at: string | null;
  last_updated: string;
};
