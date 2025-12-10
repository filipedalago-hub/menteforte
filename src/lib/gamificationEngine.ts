import { supabase } from './supabase';
import { storage, actionLog } from './storage';
import { analytics } from './analytics';
import { errorTracking } from './errorTracking';
import {
  awardXP,
  updateStreak,
  checkAndAwardBadges,
  getUserProgress,
  type XPAction,
  type UserProgress,
} from '../utils/gamificationSystem';

const DEBOUNCE_WINDOW = 5000;
const SYNC_QUEUE_KEY = 'gamification_sync_queue';

interface PendingAction {
  id: string;
  action: XPAction;
  userId: string;
  timestamp: number;
  metadata?: any;
}

class GamificationEngine {
  private syncInProgress = false;
  private pendingActions: Map<string, PendingAction> = new Map();

  constructor() {
    this.loadPendingActions();
    this.setupPeriodicSync();
  }

  private loadPendingActions(): void {
    const queue = storage.get<PendingAction[]>(SYNC_QUEUE_KEY) || [];
    queue.forEach((action) => {
      this.pendingActions.set(action.id, action);
    });
  }

  private savePendingActions(): void {
    storage.set(SYNC_QUEUE_KEY, Array.from(this.pendingActions.values()));
  }

  private setupPeriodicSync(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.syncPendingActions();
      }, 30000);

      window.addEventListener('online', () => {
        this.syncPendingActions();
      });
    }
  }

  async performAction(
    userId: string,
    action: XPAction,
    metadata?: any
  ): Promise<{ success: boolean; deferred: boolean }> {
    try {
      const actionKey = `${action}_${userId}`;

      if (actionLog.hasActionInTimeWindow(actionKey, userId, DEBOUNCE_WINDOW)) {
        return { success: false, deferred: false };
      }

      actionLog.log(actionKey, userId, metadata);

      if (!navigator.onLine) {
        const pendingAction: PendingAction = {
          id: `${Date.now()}_${Math.random()}`,
          action,
          userId,
          timestamp: Date.now(),
          metadata,
        };

        this.pendingActions.set(pendingAction.id, pendingAction);
        this.savePendingActions();

        this.updateLocalCache(userId, action);

        return { success: true, deferred: true };
      }

      await this.executeAction(userId, action, metadata);

      analytics.xpGained(0, action);

      return { success: true, deferred: false };
    } catch (error) {
      errorTracking.captureException(error, {
        action,
        userId,
        metadata,
      });

      return { success: false, deferred: false };
    }
  }

  private async executeAction(
    userId: string,
    action: XPAction,
    metadata?: any
  ): Promise<void> {
    const result = await awardXP(userId, action);

    if (result.leveledUp) {
      analytics.levelUp(result.newLevel, result.newXp);
    }

    const progress = await getUserProgress(userId);
    const badges = await checkAndAwardBadges(userId, progress);

    badges.forEach((badge) => {
      analytics.badgeEarned(badge.id, badge.name, badge.rarity);
    });

    this.updateCache(userId, progress);
  }

  private updateLocalCache(userId: string, action: XPAction): void {
    const cached = this.getCachedProgress(userId);
    if (cached) {
      storage.set(`progress_${userId}`, {
        ...cached,
        pendingActions: (cached.pendingActions || 0) + 1,
      });
    }
  }

  private async syncPendingActions(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine || this.pendingActions.size === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      const actions = Array.from(this.pendingActions.values()).sort(
        (a, b) => a.timestamp - b.timestamp
      );

      for (const action of actions) {
        try {
          await this.executeAction(action.userId, action.action, action.metadata);
          this.pendingActions.delete(action.id);
        } catch (error) {
          errorTracking.captureException(error, {
            context: 'syncPendingActions',
            action,
          });
        }
      }

      this.savePendingActions();
    } finally {
      this.syncInProgress = false;
    }
  }

  async performDailyCheckin(userId: string): Promise<{
    success: boolean;
    streak: number;
    isNewRecord: boolean;
  }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastCheckin = storage.get<string>(`last_checkin_${userId}`);

      if (lastCheckin === today) {
        return { success: false, streak: 0, isNewRecord: false };
      }

      const streakResult = await updateStreak(userId);

      await this.performAction(userId, 'daily_checkin');

      storage.set(`last_checkin_${userId}`, today);

      analytics.dailyCheckin();

      if (streakResult.currentStreak === 7 ||
          streakResult.currentStreak === 30 ||
          streakResult.currentStreak === 100) {
        analytics.streakMilestone(streakResult.currentStreak);
      }

      return {
        success: true,
        streak: streakResult.currentStreak,
        isNewRecord: streakResult.isNewRecord,
      };
    } catch (error) {
      errorTracking.captureException(error, { context: 'dailyCheckin', userId });
      return { success: false, streak: 0, isNewRecord: false };
    }
  }

  getCachedProgress(userId: string): (UserProgress & { pendingActions?: number }) | null {
    return storage.get<UserProgress & { pendingActions?: number }>(`progress_${userId}`);
  }

  private updateCache(userId: string, progress: UserProgress): void {
    storage.set(`progress_${userId}`, progress);
  }

  async refreshProgress(userId: string): Promise<UserProgress | null> {
    try {
      const progress = await getUserProgress(userId);
      this.updateCache(userId, progress);
      return progress;
    } catch (error) {
      errorTracking.captureException(error, { context: 'refreshProgress', userId });
      return null;
    }
  }

  getPendingActionsCount(): number {
    return this.pendingActions.size;
  }
}

export const gamificationEngine = new GamificationEngine();
