import { supabase } from './supabase';
import { errorTracking } from './errorTracking';

export interface League {
  id: string;
  name: string;
  tier: number;
  iconName: string;
  minMembers: number;
  maxMembers: number;
  promotionThreshold: number;
  demotionThreshold: number;
}

export interface LeagueMember {
  userId: string;
  displayName: string;
  weekXp: number;
  rank: number;
  promoted: boolean;
  demoted: boolean;
}

export interface UserLeagueData {
  league: League;
  rank: number;
  weekXp: number;
  members: LeagueMember[];
}

function getCurrentWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

export async function getUserLeague(userId: string): Promise<UserLeagueData | null> {
  try {
    const weekStart = getCurrentWeekStart();

    const { data: profile } = await supabase
      .from('profiles')
      .select('current_league_id, week_xp')
      .eq('id', userId)
      .single();

    if (!profile || !profile.current_league_id) {
      await assignUserToLeague(userId);
      return getUserLeague(userId);
    }

    const { data: league } = await supabase
      .from('leagues')
      .select('*')
      .eq('id', profile.current_league_id)
      .single();

    if (!league) return null;

    const { data: leagueMembers } = await supabase
      .from('league_members')
      .select(`
        user_id,
        week_xp,
        rank,
        promoted,
        demoted
      `)
      .eq('league_id', league.id)
      .eq('week_start', weekStart)
      .order('week_xp', { ascending: false })
      .limit(50);

    const membersWithNames = await Promise.all(
      (leagueMembers || []).map(async (member, index) => {
        const { data: memberProfile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', member.user_id)
          .single();

        return {
          userId: member.user_id,
          displayName: memberProfile?.display_name || 'Usuário',
          weekXp: member.week_xp,
          rank: index + 1,
          promoted: member.promoted || false,
          demoted: member.demoted || false,
        };
      })
    );

    const userRank = membersWithNames.findIndex(m => m.userId === userId) + 1;

    return {
      league: {
        id: league.id,
        name: league.name,
        tier: league.tier,
        iconName: league.icon_name || 'Award',
        minMembers: league.min_members,
        maxMembers: league.max_members,
        promotionThreshold: league.promotion_threshold,
        demotionThreshold: league.demotion_threshold,
      },
      rank: userRank || 0,
      weekXp: profile.week_xp || 0,
      members: membersWithNames,
    };
  } catch (error) {
    errorTracking.captureException(error, { context: 'getUserLeague', userId });
    return null;
  }
}

export async function assignUserToLeague(userId: string): Promise<boolean> {
  try {
    const { data: leagues } = await supabase
      .from('leagues')
      .select('*')
      .order('tier', { ascending: true });

    if (!leagues || leagues.length === 0) return false;

    const bronzeLeague = leagues[0];

    const { error } = await supabase
      .from('profiles')
      .update({ current_league_id: bronzeLeague.id })
      .eq('id', userId);

    if (error) throw error;

    const weekStart = getCurrentWeekStart();

    await supabase
      .from('league_members')
      .insert({
        league_id: bronzeLeague.id,
        user_id: userId,
        week_start: weekStart,
        week_xp: 0,
      });

    return true;
  } catch (error) {
    errorTracking.captureException(error, { context: 'assignUserToLeague', userId });
    return false;
  }
}

export async function addWeekXP(userId: string, xpAmount: number): Promise<boolean> {
  try {
    const weekStart = getCurrentWeekStart();

    const { data: profile } = await supabase
      .from('profiles')
      .select('week_xp, current_league_id')
      .eq('id', userId)
      .single();

    if (!profile) return false;

    const newWeekXp = (profile.week_xp || 0) + xpAmount;

    await supabase
      .from('profiles')
      .update({ week_xp: newWeekXp })
      .eq('id', userId);

    if (profile.current_league_id) {
      const { data: existing } = await supabase
        .from('league_members')
        .select('id')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('league_members')
          .update({ week_xp: newWeekXp })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('league_members')
          .insert({
            league_id: profile.current_league_id,
            user_id: userId,
            week_start: weekStart,
            week_xp: newWeekXp,
          });
      }
    }

    return true;
  } catch (error) {
    errorTracking.captureException(error, { context: 'addWeekXP', userId });
    return false;
  }
}

export async function promoteUser(userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_league_id')
      .eq('id', userId)
      .single();

    if (!profile || !profile.current_league_id) return false;

    const { data: currentLeague } = await supabase
      .from('leagues')
      .select('tier')
      .eq('id', profile.current_league_id)
      .single();

    if (!currentLeague) return false;

    const { data: nextLeague } = await supabase
      .from('leagues')
      .select('id')
      .eq('tier', currentLeague.tier + 1)
      .maybeSingle();

    if (!nextLeague) return false;

    await supabase
      .from('profiles')
      .update({ current_league_id: nextLeague.id })
      .eq('id', userId);

    return true;
  } catch (error) {
    errorTracking.captureException(error, { context: 'promoteUser', userId });
    return false;
  }
}

export async function demoteUser(userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_league_id')
      .eq('id', userId)
      .single();

    if (!profile || !profile.current_league_id) return false;

    const { data: currentLeague } = await supabase
      .from('leagues')
      .select('tier')
      .eq('id', profile.current_league_id)
      .single();

    if (!currentLeague || currentLeague.tier <= 1) return false;

    const { data: prevLeague } = await supabase
      .from('leagues')
      .select('id')
      .eq('tier', currentLeague.tier - 1)
      .maybeSingle();

    if (!prevLeague) return false;

    await supabase
      .from('profiles')
      .update({ current_league_id: prevLeague.id })
      .eq('id', userId);

    return true;
  } catch (error) {
    errorTracking.captureException(error, { context: 'demoteUser', userId });
    return false;
  }
}

export function getLeagueColor(tier: number): string {
  const colors: Record<number, string> = {
    1: '#CD7F32', // Bronze
    2: '#C0C0C0', // Silver
    3: '#FFD700', // Gold
    4: '#E5E4E2', // Platinum
    5: '#B9F2FF', // Diamond
    6: '#9333EA', // Master
    7: '#F59E0B', // Legendary
  };
  return colors[tier] || '#94A3B8';
}
