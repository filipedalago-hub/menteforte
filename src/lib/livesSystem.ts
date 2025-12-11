import { supabase } from './supabase';
import { errorTracking } from './errorTracking';

export interface LivesData {
  currentLives: number;
  maxLives: number;
  lastRegenerated: string;
  timeUntilNextLife: number;
}

const LIFE_REGENERATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

export async function getUserLives(userId: string): Promise<LivesData | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('current_lives, max_lives, lives_last_regenerated_at')
      .eq('id', userId)
      .single();

    if (error) throw error;

    const now = Date.now();
    const lastRegen = new Date(profile.lives_last_regenerated_at).getTime();
    const timeSinceLastRegen = now - lastRegen;
    const livesToRegenerate = Math.floor(timeSinceLastRegen / LIFE_REGENERATION_TIME);

    let currentLives = profile.current_lives;
    let lastRegenerated = profile.lives_last_regenerated_at;

    if (livesToRegenerate > 0 && currentLives < profile.max_lives) {
      currentLives = Math.min(currentLives + livesToRegenerate, profile.max_lives);
      lastRegenerated = new Date(now).toISOString();

      await supabase
        .from('profiles')
        .update({
          current_lives: currentLives,
          lives_last_regenerated_at: lastRegenerated,
        })
        .eq('id', userId);
    }

    const timeUntilNext = currentLives < profile.max_lives
      ? LIFE_REGENERATION_TIME - (now - new Date(lastRegenerated).getTime()) % LIFE_REGENERATION_TIME
      : 0;

    return {
      currentLives,
      maxLives: profile.max_lives,
      lastRegenerated,
      timeUntilNextLife: timeUntilNext,
    };
  } catch (error) {
    errorTracking.captureException(error, { context: 'getUserLives', userId });
    return null;
  }
}

export async function useLife(userId: string): Promise<{ success: boolean; livesRemaining: number }> {
  try {
    const livesData = await getUserLives(userId);

    if (!livesData || livesData.currentLives <= 0) {
      return { success: false, livesRemaining: 0 };
    }

    const newLives = livesData.currentLives - 1;

    const { error } = await supabase
      .from('profiles')
      .update({
        current_lives: newLives,
      })
      .eq('id', userId);

    if (error) throw error;

    return { success: true, livesRemaining: newLives };
  } catch (error) {
    errorTracking.captureException(error, { context: 'useLife', userId });
    return { success: false, livesRemaining: 0 };
  }
}

export async function refillLives(userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('max_lives')
      .eq('id', userId)
      .single();

    if (!profile) return false;

    const { error } = await supabase
      .from('profiles')
      .update({
        current_lives: profile.max_lives,
        lives_last_regenerated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return !error;
  } catch (error) {
    errorTracking.captureException(error, { context: 'refillLives', userId });
    return false;
  }
}

export async function earnExtraLives(userId: string, amount: number = 1): Promise<boolean> {
  try {
    const livesData = await getUserLives(userId);
    if (!livesData) return false;

    const newLives = Math.min(livesData.currentLives + amount, livesData.maxLives);

    const { error } = await supabase
      .from('profiles')
      .update({
        current_lives: newLives,
      })
      .eq('id', userId);

    return !error;
  } catch (error) {
    errorTracking.captureException(error, { context: 'earnExtraLives', userId });
    return false;
  }
}

export function formatTimeUntilNextLife(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
