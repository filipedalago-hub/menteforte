import { supabase } from './supabase';
import { errorTracking } from './errorTracking';

export interface StreakProtectionData {
  freezesAvailable: number;
  freezesUsed: number;
  canUseFreeze: boolean;
}

export async function getStreakProtection(userId: string): Promise<StreakProtectionData | null> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('streak_freezes')
      .eq('id', userId)
      .single();

    if (!profile) return null;

    const { data: protection } = await supabase
      .from('streak_protection')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!protection) {
      await supabase
        .from('streak_protection')
        .insert({
          user_id: userId,
          freezes_available: profile.streak_freezes || 0,
          freezes_used: 0,
        });

      return {
        freezesAvailable: profile.streak_freezes || 0,
        freezesUsed: 0,
        canUseFreeze: (profile.streak_freezes || 0) > 0,
      };
    }

    return {
      freezesAvailable: protection.freezes_available,
      freezesUsed: protection.freezes_used,
      canUseFreeze: protection.freezes_available > 0,
    };
  } catch (error) {
    errorTracking.captureException(error, { context: 'getStreakProtection', userId });
    return null;
  }
}

export async function useStreakFreeze(userId: string): Promise<boolean> {
  try {
    const protection = await getStreakProtection(userId);

    if (!protection || !protection.canUseFreeze) {
      return false;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, last_activity_date')
      .eq('id', userId)
      .single();

    if (!profile) return false;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = profile.last_activity_date;

    if (lastActivity === today) {
      return false;
    }

    await supabase
      .from('profiles')
      .update({
        last_activity_date: today,
        streak_freezes: protection.freezesAvailable - 1,
      })
      .eq('id', userId);

    await supabase
      .from('streak_protection')
      .update({
        freezes_available: protection.freezesAvailable - 1,
        freezes_used: protection.freezesUsed + 1,
      })
      .eq('user_id', userId);

    return true;
  } catch (error) {
    errorTracking.captureException(error, { context: 'useStreakFreeze', userId });
    return false;
  }
}

export async function earnStreakFreeze(userId: string, amount: number = 1): Promise<boolean> {
  try {
    const protection = await getStreakProtection(userId);

    if (!protection) return false;

    const newAmount = protection.freezesAvailable + amount;

    await supabase
      .from('profiles')
      .update({ streak_freezes: newAmount })
      .eq('id', userId);

    await supabase
      .from('streak_protection')
      .update({ freezes_available: newAmount })
      .eq('user_id', userId);

    return true;
  } catch (error) {
    errorTracking.captureException(error, { context: 'earnStreakFreeze', userId });
    return false;
  }
}

export async function checkStreakStatus(userId: string): Promise<{
  needsProtection: boolean;
  daysUntilLoss: number;
  canAutoProtect: boolean;
}> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, last_activity_date')
      .eq('id', userId)
      .single();

    if (!profile) {
      return { needsProtection: false, daysUntilLoss: 0, canAutoProtect: false };
    }

    const today = new Date();
    const lastActivity = profile.last_activity_date
      ? new Date(profile.last_activity_date)
      : new Date(0);

    const daysSinceLastActivity = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    const needsProtection = daysSinceLastActivity >= 1 && profile.current_streak > 0;
    const daysUntilLoss = Math.max(0, 2 - daysSinceLastActivity);

    const protection = await getStreakProtection(userId);
    const canAutoProtect = protection ? protection.canUseFreeze : false;

    return {
      needsProtection,
      daysUntilLoss,
      canAutoProtect,
    };
  } catch (error) {
    errorTracking.captureException(error, { context: 'checkStreakStatus', userId });
    return { needsProtection: false, daysUntilLoss: 0, canAutoProtect: false };
  }
}

export async function autoProtectStreak(userId: string): Promise<boolean> {
  try {
    const status = await checkStreakStatus(userId);

    if (status.needsProtection && status.canAutoProtect) {
      return await useStreakFreeze(userId);
    }

    return false;
  } catch (error) {
    errorTracking.captureException(error, { context: 'autoProtectStreak', userId });
    return false;
  }
}
