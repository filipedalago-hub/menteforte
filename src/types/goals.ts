export type GoalCategory = 'health' | 'spiritual' | 'personal' | 'professional' | 'financial' | 'relationships';
export type GoalTargetType = 'boolean' | 'numeric' | 'checklist';
export type GoalStatus = 'active' | 'completed' | 'cancelled';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  target_type: GoalTargetType;
  target_value?: number;
  current_value: number;
  unit?: string;
  deadline?: string;
  status: GoalStatus;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  category: GoalCategory;
  target_type: GoalTargetType;
  target_value?: number;
  unit?: string;
  deadline?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  category?: GoalCategory;
  target_value?: number;
  current_value?: number;
  unit?: string;
  deadline?: string;
  status?: GoalStatus;
}
