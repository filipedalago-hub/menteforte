import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gamificationEngine } from '../lib/gamificationEngine';
import { type UserProgress, type XPAction } from '../utils/gamificationSystem';

interface GamificationState {
  progress: UserProgress | null;
  loading: boolean;
  error: string | null;
  pendingActions: number;
}

export function useOptimizedGamification() {
  const { user } = useAuth();
  const [state, setState] = useState<GamificationState>({
    progress: null,
    loading: true,
    error: null,
    pendingActions: 0,
  });

  const loadProgress = useCallback(async () => {
    if (!user) {
      setState({
        progress: null,
        loading: false,
        error: null,
        pendingActions: 0,
      });
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const cached = gamificationEngine.getCachedProgress(user.id);
      if (cached) {
        setState({
          progress: cached,
          loading: false,
          error: null,
          pendingActions: cached.pendingActions || 0,
        });
      }

      const progress = await gamificationEngine.refreshProgress(user.id);

      if (progress) {
        setState({
          progress,
          loading: false,
          error: null,
          pendingActions: gamificationEngine.getPendingActionsCount(),
        });
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar progresso',
      }));
    }
  }, [user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const performAction = useCallback(
    async (action: XPAction, metadata?: any) => {
      if (!user) return false;

      const result = await gamificationEngine.performAction(user.id, action, metadata);

      if (result.success) {
        await loadProgress();
      }

      return result.success;
    },
    [user, loadProgress]
  );

  const performDailyCheckin = useCallback(async () => {
    if (!user) return null;

    const result = await gamificationEngine.performDailyCheckin(user.id);

    if (result.success) {
      await loadProgress();
    }

    return result;
  }, [user, loadProgress]);

  const memoizedProgress = useMemo(() => state.progress, [state.progress]);

  return {
    progress: memoizedProgress,
    loading: state.loading,
    error: state.error,
    pendingActions: state.pendingActions,
    performAction,
    performDailyCheckin,
    refresh: loadProgress,
  };
}
