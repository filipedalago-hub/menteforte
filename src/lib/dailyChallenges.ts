import { supabase } from './supabase';
import { errorTracking } from './errorTracking';
import { awardXP } from '../utils/gamificationSystem';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  challengeType: string;
  requirementValue: number;
  xpReward: number;
  iconName: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ChallengeProgress {
  challengeId: string;
  progress: number;
  isCompleted: boolean;
  rewardClaimed: boolean;
}

export interface ChallengeWithProgress extends DailyChallenge {
  progress: number;
  isCompleted: boolean;
  rewardClaimed: boolean;
}

export async function getDailyChallenges(userId: string): Promise<ChallengeWithProgress[]> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: challenges } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('is_active', true)
      .limit(5);

    if (!challenges) return [];

    const challengesWithProgress = await Promise.all(
      challenges.map(async (challenge) => {
        const { data: completion } = await supabase
          .from('challenge_completions')
          .select('*')
          .eq('user_id', userId)
          .eq('challenge_id', challenge.id)
          .eq('completed_at', today)
          .maybeSingle();

        return {
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          challengeType: challenge.challenge_type,
          requirementValue: challenge.requirement_value,
          xpReward: challenge.xp_reward,
          iconName: challenge.icon_name || 'Target',
          difficulty: challenge.difficulty as 'easy' | 'medium' | 'hard',
          progress: completion?.progress || 0,
          isCompleted: completion?.is_completed || false,
          rewardClaimed: completion?.reward_claimed || false,
        };
      })
    );

    return challengesWithProgress;
  } catch (error) {
    errorTracking.captureException(error, { context: 'getDailyChallenges', userId });
    return [];
  }
}

export async function updateChallengeProgress(
  userId: string,
  challengeType: string,
  amount: number = 1
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: challenges } = await supabase
      .from('daily_challenges')
      .select('id, requirement_value')
      .eq('challenge_type', challengeType)
      .eq('is_active', true);

    if (!challenges) return;

    for (const challenge of challenges) {
      const { data: existing } = await supabase
        .from('challenge_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('challenge_id', challenge.id)
        .eq('completed_at', today)
        .maybeSingle();

      if (existing) {
        const newProgress = Math.min(existing.progress + amount, challenge.requirement_value);
        const isCompleted = newProgress >= challenge.requirement_value;

        await supabase
          .from('challenge_completions')
          .update({
            progress: newProgress,
            is_completed: isCompleted,
          })
          .eq('id', existing.id);
      } else {
        const isCompleted = amount >= challenge.requirement_value;

        await supabase
          .from('challenge_completions')
          .insert({
            user_id: userId,
            challenge_id: challenge.id,
            completed_at: today,
            progress: Math.min(amount, challenge.requirement_value),
            is_completed: isCompleted,
            reward_claimed: false,
          });
      }
    }
  } catch (error) {
    errorTracking.captureException(error, {
      context: 'updateChallengeProgress',
      userId,
      challengeType,
    });
  }
}

export async function claimChallengeReward(
  userId: string,
  challengeId: string
): Promise<{ success: boolean; xpAwarded: number }> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: completion } = await supabase
      .from('challenge_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .eq('completed_at', today)
      .single();

    if (!completion || !completion.is_completed || completion.reward_claimed) {
      return { success: false, xpAwarded: 0 };
    }

    const { data: challenge } = await supabase
      .from('daily_challenges')
      .select('xp_reward')
      .eq('id', challengeId)
      .single();

    if (!challenge) return { success: false, xpAwarded: 0 };

    await supabase
      .from('challenge_completions')
      .update({ reward_claimed: true })
      .eq('id', completion.id);

    await awardXP(userId, 'daily_checkin');

    return { success: true, xpAwarded: challenge.xp_reward };
  } catch (error) {
    errorTracking.captureException(error, { context: 'claimChallengeReward', userId, challengeId });
    return { success: false, xpAwarded: 0 };
  }
}

export function getChallengeIcon(challengeType: string): string {
  const iconMap: Record<string, string> = {
    exercises_completed: 'Target',
    perfect_missions: 'Award',
    trilhas_explored: 'Map',
    meditation_time: 'Brain',
    habits_completed: 'CheckCircle',
    streak_maintained: 'Flame',
    goals_achieved: 'Trophy',
  };
  return iconMap[challengeType] || 'Star';
}

export function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): string {
  const colors = {
    easy: '#10B981',
    medium: '#F59E0B',
    hard: '#EF4444',
  };
  return colors[difficulty];
}
