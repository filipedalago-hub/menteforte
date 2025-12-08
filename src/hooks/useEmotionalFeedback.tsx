import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  EmotionalIntelligenceEngine,
  EmotionalMessage,
  UserContext
} from '../lib/emotionalIntelligence';
import { MoodData } from '../components/MoodTracker';

interface Profile {
  id: string;
  xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_sessions: number;
  total_time_minutes: number;
}

export function useEmotionalFeedback(userId: string | undefined) {
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showDailyInsight, setShowDailyInsight] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<EmotionalMessage | null>(null);
  const [dailyInsight, setDailyInsight] = useState<EmotionalMessage | null>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [sessionStartTime] = useState(Date.now());

  const loadUserContext = useCallback(async () => {
    if (!userId) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!profile) return;

      const { data: behaviorPattern } = await supabase
        .from('user_behavior_patterns')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: recentMilestones } = await supabase
        .from('achievement_milestones')
        .select('milestone_type')
        .eq('user_id', userId)
        .order('achieved_at', { ascending: false })
        .limit(5);

      const daysSinceLastSession = calculateDaysSinceLastSession(profile.last_activity_date);

      const context: UserContext = {
        streak: profile.current_streak,
        timeOfDay: EmotionalIntelligenceEngine.getTimeOfDay(),
        completionRate: behaviorPattern?.completion_rate || 0,
        totalSessions: profile.total_sessions,
        daysSinceLastSession,
        recentMilestones: recentMilestones?.map(m => m.milestone_type) || [],
        cognitiveStyle: behaviorPattern?.cognitive_style || 'descobrindo',
        consistencyScore: behaviorPattern?.consistency_score || 0
      };

      setUserContext(context);

      const shouldShowMoodTracker = await checkIfShouldShowMoodTracker(userId);
      if (shouldShowMoodTracker) {
        setShowMoodTracker(true);
      } else {
        showWelcomeMessage(context);
      }

      const shouldShowInsight = await checkIfShouldShowDailyInsight(userId);
      if (shouldShowInsight) {
        const insight = EmotionalIntelligenceEngine.getDailyInsight(context);
        setDailyInsight(insight);
        setShowDailyInsight(true);

        await supabase.from('daily_insights').insert({
          user_id: userId,
          insight_text: insight.text,
          insight_type: insight.type,
          context_tags: [insight.tone]
        });
      }
    } catch (error) {
      console.error('Error loading user context:', error);
    }
  }, [userId]);

  useEffect(() => {
    loadUserContext();
  }, [loadUserContext]);

  const showWelcomeMessage = (context: UserContext) => {
    const message = EmotionalIntelligenceEngine.getContextualMessage(context);
    setCurrentMessage(message);
    setTimeout(() => setCurrentMessage(null), 8000);
  };

  const handleMoodSubmit = async (moodData: MoodData) => {
    if (!userId || !userContext) return;

    try {
      await supabase.from('user_mood_tracking').insert({
        user_id: userId,
        mood_score: moodData.moodScore,
        mood_label: moodData.moodLabel,
        energy_level: moodData.energyLevel,
        time_of_day: userContext.timeOfDay,
        notes: moodData.notes
      });

      const updatedContext = {
        ...userContext,
        moodScore: moodData.moodScore,
        energyLevel: moodData.energyLevel
      };

      setUserContext(updatedContext);
      setShowMoodTracker(false);

      const moodMessage = EmotionalIntelligenceEngine.getMoodBasedMessage(updatedContext);
      if (moodMessage) {
        setCurrentMessage(moodMessage);
        setTimeout(() => setCurrentMessage(null), 8000);
      } else {
        showWelcomeMessage(updatedContext);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const trackSessionEnd = async () => {
    if (!userId) return;

    const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    const durationMinutes = Math.floor(durationSeconds / 60);

    try {
      await supabase.from('user_session_log').insert({
        user_id: userId,
        session_start: new Date(sessionStartTime).toISOString(),
        session_end: new Date().toISOString(),
        duration_seconds: durationSeconds
      });

      await updateBehaviorPatterns(userId);

      const feedbackMessage = EmotionalIntelligenceEngine.getSessionFeedback(durationMinutes);
      setCurrentMessage(feedbackMessage);
    } catch (error) {
      console.error('Error tracking session end:', error);
    }
  };

  const showProgressMessage = (totalExercises: number) => {
    if (!userContext) return;

    const message = EmotionalIntelligenceEngine.getProgressMessage(totalExercises);
    if (message) {
      setCurrentMessage(message);
      setTimeout(() => setCurrentMessage(null), 8000);
    }
  };

  const showStreakMessage = () => {
    if (!userContext) return;

    const message = EmotionalIntelligenceEngine.getStreakMessage(userContext);
    if (message) {
      setCurrentMessage(message);
      setTimeout(() => setCurrentMessage(null), 8000);
    }
  };

  return {
    showMoodTracker,
    showDailyInsight,
    currentMessage,
    dailyInsight,
    userContext,
    handleMoodSubmit,
    setShowMoodTracker,
    setShowDailyInsight,
    trackSessionEnd,
    showProgressMessage,
    showStreakMessage,
    dismissMessage: () => setCurrentMessage(null)
  };
}

async function checkIfShouldShowMoodTracker(userId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('user_mood_tracking')
    .select('id')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  return !data;
}

async function checkIfShouldShowDailyInsight(userId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('daily_insights')
    .select('id')
    .eq('user_id', userId)
    .gte('delivered_at', today)
    .maybeSingle();

  return !data;
}

function calculateDaysSinceLastSession(lastActivityDate: string | null): number | undefined {
  if (!lastActivityDate) return undefined;

  const last = new Date(lastActivityDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

async function updateBehaviorPatterns(userId: string): Promise<void> {
  try {
    const { data: sessions } = await supabase
      .from('user_session_log')
      .select('duration_seconds, exercises_completed')
      .eq('user_id', userId)
      .order('session_start', { ascending: false })
      .limit(30);

    if (!sessions || sessions.length === 0) return;

    const avgDuration = Math.floor(
      sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length / 60
    );

    const { data: progress } = await supabase
      .from('user_exercise_progress')
      .select('completed')
      .eq('user_id', userId);

    const totalExercises = progress?.length || 0;
    const completedExercises = progress?.filter(p => p.completed).length || 0;
    const completionRate = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, total_sessions, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) return;

    const daysSinceStart = Math.ceil(
      (Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    const consistencyScore = EmotionalIntelligenceEngine.calculateConsistencyScore(
      profile.current_streak,
      profile.longest_streak,
      profile.total_sessions,
      daysSinceStart
    );

    const cognitiveStyle = EmotionalIntelligenceEngine.determineCognitiveStyle(
      completionRate / 100,
      avgDuration,
      0
    );

    await supabase.from('user_behavior_patterns').upsert({
      user_id: userId,
      average_session_duration: avgDuration,
      completion_rate: completionRate,
      consistency_score: consistencyScore,
      cognitive_style: cognitiveStyle,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating behavior patterns:', error);
  }
}
