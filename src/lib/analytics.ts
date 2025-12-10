type AnalyticsEvent =
  | 'page_view'
  | 'user_signup'
  | 'user_login'
  | 'user_logout'
  | 'trilha_start'
  | 'trilha_complete'
  | 'pilar_start'
  | 'pilar_complete'
  | 'exercise_start'
  | 'exercise_complete'
  | 'xp_gained'
  | 'level_up'
  | 'badge_earned'
  | 'streak_milestone'
  | 'streak_broken'
  | 'goal_created'
  | 'goal_completed'
  | 'habit_created'
  | 'habit_completed'
  | 'daily_checkin';

interface AnalyticsEventData {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsService {
  private enabled: boolean;
  private userId: string | null = null;

  constructor() {
    this.enabled = import.meta.env.PROD;
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  track(event: AnalyticsEvent, data?: AnalyticsEventData) {
    if (!this.enabled) {
      console.log('[Analytics]', event, data);
      return;
    }

    try {
      const eventData = {
        event,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        ...data,
      };

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, eventData);
      }

      this.logToBackend(eventData);
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error);
    }
  }

  private async logToBackend(eventData: any) {
    try {
      if (!this.enabled) return;

    } catch (error) {
      console.error('[Analytics] Error logging to backend:', error);
    }
  }

  pageView(path: string, title?: string) {
    this.track('page_view', { path, title });
  }

  userSignup(method: string) {
    this.track('user_signup', { method });
  }

  userLogin(method: string) {
    this.track('user_login', { method });
  }

  userLogout() {
    this.track('user_logout');
  }

  trilhaStart(trilhaId: string, trilhaName: string) {
    this.track('trilha_start', { trilhaId, trilhaName });
  }

  trilhaComplete(trilhaId: string, trilhaName: string, completionTime: number) {
    this.track('trilha_complete', { trilhaId, trilhaName, completionTime });
  }

  exerciseComplete(exerciseId: string, exerciseName: string, duration: number) {
    this.track('exercise_complete', { exerciseId, exerciseName, duration });
  }

  xpGained(amount: number, source: string) {
    this.track('xp_gained', { amount, source });
  }

  levelUp(newLevel: number, totalXp: number) {
    this.track('level_up', { newLevel, totalXp });
  }

  badgeEarned(badgeId: string, badgeName: string, rarity: string) {
    this.track('badge_earned', { badgeId, badgeName, rarity });
  }

  streakMilestone(days: number) {
    this.track('streak_milestone', { days });
  }

  streakBroken(previousStreak: number) {
    this.track('streak_broken', { previousStreak });
  }

  goalCreated(goalType: string) {
    this.track('goal_created', { goalType });
  }

  goalCompleted(goalId: string, daysToComplete: number) {
    this.track('goal_completed', { goalId, daysToComplete });
  }

  habitCompleted(habitId: string, streakDays: number) {
    this.track('habit_completed', { habitId, streakDays });
  }

  dailyCheckin() {
    this.track('daily_checkin');
  }
}

export const analytics = new AnalyticsService();
