/*
  # Emotional Feedback & Adaptive Intelligence System

  ## Overview
  This migration adds comprehensive emotional feedback, adaptive behavior tracking,
  and spiritual intelligence features to create a deeply personalized experience.

  ## 1. New Tables

  ### `user_mood_tracking`
  Tracks daily mood and emotional state for personalized responses
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `date` (date)
  - `mood_score` (integer, 1-5)
  - `mood_label` (text)
  - `energy_level` (integer, 1-5)
  - `time_of_day` (text)
  - `session_duration_seconds` (integer)
  - `notes` (text, optional)
  - `created_at` (timestamptz)

  ### `user_behavior_patterns`
  Tracks behavioral patterns for adaptive personalization
  - `user_id` (uuid, primary key, references profiles)
  - `preferred_session_time` (text)
  - `average_session_duration` (integer)
  - `most_active_trilha_id` (uuid, references trilhas)
  - `completion_rate` (numeric)
  - `abandonment_rate` (numeric)
  - `consistency_score` (integer, 0-100)
  - `cognitive_style` (text)
  - `last_analyzed_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `daily_insights`
  Spiritual and motivational messages delivered daily
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `insight_text` (text)
  - `insight_type` (text)
  - `context_tags` (jsonb)
  - `delivered_at` (timestamptz)
  - `read` (boolean)
  - `read_at` (timestamptz, nullable)

  ### `achievement_milestones`
  Extended achievements beyond badges
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `milestone_type` (text)
  - `milestone_value` (integer)
  - `title` (text)
  - `message` (text)
  - `emotional_tone` (text)
  - `achieved_at` (timestamptz)

  ### `personalized_messages`
  Library of contextual messages for different scenarios
  - `id` (uuid, primary key)
  - `message_type` (text)
  - `context_key` (text)
  - `message_text` (text)
  - `emotional_tone` (text)
  - `trigger_conditions` (jsonb)
  - `created_at` (timestamptz)

  ### `user_session_log`
  Detailed session tracking for pattern analysis
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `session_start` (timestamptz)
  - `session_end` (timestamptz)
  - `duration_seconds` (integer)
  - `trilha_id` (uuid, references trilhas, nullable)
  - `exercises_completed` (integer)
  - `xp_earned` (integer)
  - `mood_before` (integer, nullable)
  - `mood_after` (integer, nullable)

  ## 2. Profile Extensions
  Adding new fields to profiles table for emotional intelligence

  ## 3. Security
  - Enable RLS on all new tables
  - Users can only access their own emotional data
  - Daily insights are private to each user
  - Behavioral patterns are user-specific

  ## 4. Important Notes
  - All emotional data is private and secure
  - Adaptive system learns from user behavior
  - Messages are contextually triggered
  - System respects user privacy
*/

-- Create user_mood_tracking table
CREATE TABLE IF NOT EXISTS user_mood_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  mood_score integer CHECK (mood_score >= 1 AND mood_score <= 5),
  mood_label text NOT NULL,
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 5),
  time_of_day text NOT NULL,
  session_duration_seconds integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date, created_at)
);

ALTER TABLE user_mood_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own mood tracking"
  ON user_mood_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood tracking"
  ON user_mood_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood tracking"
  ON user_mood_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_behavior_patterns table
CREATE TABLE IF NOT EXISTS user_behavior_patterns (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_session_time text DEFAULT 'evening',
  average_session_duration integer DEFAULT 0,
  most_active_trilha_id uuid REFERENCES trilhas(id),
  completion_rate numeric(5,2) DEFAULT 0.00,
  abandonment_rate numeric(5,2) DEFAULT 0.00,
  consistency_score integer DEFAULT 0 CHECK (consistency_score >= 0 AND consistency_score <= 100),
  cognitive_style text DEFAULT 'discovering',
  last_analyzed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_behavior_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own behavior patterns"
  ON user_behavior_patterns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own behavior patterns"
  ON user_behavior_patterns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own behavior patterns"
  ON user_behavior_patterns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create daily_insights table
CREATE TABLE IF NOT EXISTS daily_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_text text NOT NULL,
  insight_type text NOT NULL,
  context_tags jsonb DEFAULT '[]',
  delivered_at timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  read_at timestamptz
);

ALTER TABLE daily_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own insights"
  ON daily_insights FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights"
  ON daily_insights FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights"
  ON daily_insights FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create achievement_milestones table
CREATE TABLE IF NOT EXISTS achievement_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_type text NOT NULL,
  milestone_value integer NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  emotional_tone text NOT NULL,
  achieved_at timestamptz DEFAULT now()
);

ALTER TABLE achievement_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own milestones"
  ON achievement_milestones FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones"
  ON achievement_milestones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create personalized_messages table
CREATE TABLE IF NOT EXISTS personalized_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_type text NOT NULL,
  context_key text NOT NULL,
  message_text text NOT NULL,
  emotional_tone text NOT NULL,
  trigger_conditions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_type, context_key)
);

ALTER TABLE personalized_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages are publicly readable"
  ON personalized_messages FOR SELECT
  TO authenticated
  USING (true);

-- Create user_session_log table
CREATE TABLE IF NOT EXISTS user_session_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_start timestamptz NOT NULL DEFAULT now(),
  session_end timestamptz,
  duration_seconds integer,
  trilha_id uuid REFERENCES trilhas(id),
  exercises_completed integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  mood_before integer CHECK (mood_before >= 1 AND mood_before <= 5),
  mood_after integer CHECK (mood_after >= 1 AND mood_after <= 5)
);

ALTER TABLE user_session_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own session log"
  ON user_session_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session log"
  ON user_session_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own session log"
  ON user_session_log FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add emotional intelligence fields to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'preferred_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferred_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'life_purpose'
  ) THEN
    ALTER TABLE profiles ADD COLUMN life_purpose text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_sessions'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_sessions integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_time_minutes'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_time_minutes integer DEFAULT 0;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mood_tracking_user_date ON user_mood_tracking(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_insights_user_delivered ON daily_insights(user_id, delivered_at DESC);
CREATE INDEX IF NOT EXISTS idx_milestones_user_achieved ON achievement_milestones(user_id, achieved_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_log_user_start ON user_session_log(user_id, session_start DESC);
CREATE INDEX IF NOT EXISTS idx_personalized_messages_type_context ON personalized_messages(message_type, context_key);