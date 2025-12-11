/*
  # Gamification System - Duolingo Style

  1. New Tables
    - `user_lives`
      - User hearts/lives system
      - Lives regenerate over time
      - Track used lives and regeneration
    
    - `user_leagues`
      - Weekly leagues (Bronze, Silver, Gold, etc.)
      - Automatic promotion/demotion
      - XP tracking per week
    
    - `league_members`
      - Users in each league
      - Weekly XP scores
      - Ranking positions
    
    - `streak_protection`
      - Streak freeze items
      - Protection from losing streak
      - Purchase/earn history
    
    - `daily_challenges`
      - Daily missions/quests
      - Completion tracking
      - Rewards
    
    - `challenge_completions`
      - User progress on challenges
      - Completion dates
      - Rewards claimed
    
    - `notifications`
      - Push notification queue
      - Delivery status
      - Engagement tracking

  2. Modifications to existing tables
    - Add `lives` column to profiles
    - Add `lives_last_regenerated_at` to profiles
    - Add `streak_freezes` to profiles
    - Add `current_league_id` to profiles

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- User Lives System
CREATE TABLE IF NOT EXISTS user_lives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_lives int DEFAULT 5 NOT NULL,
  max_lives int DEFAULT 5 NOT NULL,
  last_life_used_at timestamptz,
  last_regenerated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Leagues System
CREATE TABLE IF NOT EXISTS leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier int NOT NULL,
  icon_name text,
  min_members int DEFAULT 10,
  max_members int DEFAULT 50,
  promotion_threshold int DEFAULT 10,
  demotion_threshold int DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- League Members (Weekly)
CREATE TABLE IF NOT EXISTS league_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id uuid REFERENCES leagues(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start date NOT NULL,
  week_xp int DEFAULT 0 NOT NULL,
  rank int,
  promoted boolean DEFAULT false,
  demoted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Streak Protection
CREATE TABLE IF NOT EXISTS streak_protection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  freezes_available int DEFAULT 0 NOT NULL,
  freezes_used int DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Daily Challenges
CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL,
  requirement_value int NOT NULL,
  xp_reward int NOT NULL,
  icon_name text,
  difficulty text DEFAULT 'easy',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Challenge Completions
CREATE TABLE IF NOT EXISTS challenge_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES daily_challenges(id) ON DELETE CASCADE NOT NULL,
  completed_at date NOT NULL,
  progress int DEFAULT 0,
  is_completed boolean DEFAULT false,
  reward_claimed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id, completed_at)
);

-- Notifications Queue
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  notification_type text NOT NULL,
  priority text DEFAULT 'normal',
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  read_at timestamptz,
  clicked_at timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'current_lives'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_lives int DEFAULT 5;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'max_lives'
  ) THEN
    ALTER TABLE profiles ADD COLUMN max_lives int DEFAULT 5;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'lives_last_regenerated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN lives_last_regenerated_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'streak_freezes'
  ) THEN
    ALTER TABLE profiles ADD COLUMN streak_freezes int DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'current_league_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_league_id uuid REFERENCES leagues(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'week_xp'
  ) THEN
    ALTER TABLE profiles ADD COLUMN week_xp int DEFAULT 0;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_lives ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_protection ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- user_lives policies
CREATE POLICY "Users can view own lives"
  ON user_lives FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own lives"
  ON user_lives FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own lives"
  ON user_lives FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- leagues policies (public read)
CREATE POLICY "Anyone can view leagues"
  ON leagues FOR SELECT
  TO authenticated
  USING (true);

-- league_members policies
CREATE POLICY "Users can view league members"
  ON league_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own league membership"
  ON league_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own league stats"
  ON league_members FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- streak_protection policies
CREATE POLICY "Users can view own streak protection"
  ON streak_protection FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streak protection"
  ON streak_protection FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak protection"
  ON streak_protection FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- daily_challenges policies (public read)
CREATE POLICY "Users can view active challenges"
  ON daily_challenges FOR SELECT
  TO authenticated
  USING (is_active = true);

-- challenge_completions policies
CREATE POLICY "Users can view own completions"
  ON challenge_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON challenge_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completions"
  ON challenge_completions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default leagues
INSERT INTO leagues (name, tier, icon_name, min_members, max_members, promotion_threshold, demotion_threshold)
VALUES
  ('Bronze', 1, 'Award', 10, 50, 10, 40),
  ('Prata', 2, 'Medal', 10, 50, 10, 40),
  ('Ouro', 3, 'Trophy', 10, 50, 10, 40),
  ('Platina', 4, 'Crown', 10, 50, 10, 40),
  ('Diamante', 5, 'Gem', 10, 50, 10, 40),
  ('Mestre', 6, 'Star', 10, 30, 5, 25),
  ('Lendário', 7, 'Zap', 10, 20, 3, 17)
ON CONFLICT DO NOTHING;

-- Insert sample daily challenges
INSERT INTO daily_challenges (title, description, challenge_type, requirement_value, xp_reward, icon_name, difficulty)
VALUES
  ('Missão Diária', 'Complete 3 exercícios hoje', 'exercises_completed', 3, 50, 'Target', 'easy'),
  ('Mestre da Consistência', 'Complete 5 missões sem erros', 'perfect_missions', 5, 100, 'Award', 'medium'),
  ('Explorador', 'Visite 2 trilhas diferentes', 'trilhas_explored', 2, 30, 'Map', 'easy'),
  ('Foco Total', 'Pratique meditação por 10 minutos', 'meditation_time', 10, 75, 'Brain', 'medium'),
  ('Guerreiro Mental', 'Complete 10 exercícios hoje', 'exercises_completed', 10, 200, 'Sword', 'hard')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_lives_user_id ON user_lives(user_id);
CREATE INDEX IF NOT EXISTS idx_league_members_user_week ON league_members(user_id, week_start);
CREATE INDEX IF NOT EXISTS idx_league_members_league_week ON league_members(league_id, week_start);
CREATE INDEX IF NOT EXISTS idx_challenge_completions_user_date ON challenge_completions(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_scheduled ON notifications(user_id, scheduled_for) WHERE sent_at IS NULL;

-- Function to regenerate lives automatically
CREATE OR REPLACE FUNCTION regenerate_lives()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET
    current_lives = LEAST(
      current_lives + FLOOR(EXTRACT(EPOCH FROM (NOW() - lives_last_regenerated_at)) / 1800)::int,
      max_lives
    ),
    lives_last_regenerated_at = CASE
      WHEN current_lives < max_lives THEN NOW()
      ELSE lives_last_regenerated_at
    END
  WHERE current_lives < max_lives;
END;
$$ LANGUAGE plpgsql;

-- Function to reset weekly league scores
CREATE OR REPLACE FUNCTION reset_weekly_leagues()
RETURNS void AS $$
DECLARE
  current_week_start date;
BEGIN
  current_week_start := date_trunc('week', CURRENT_DATE)::date;
  
  -- Archive previous week
  UPDATE league_members
  SET
    promoted = (rank <= (SELECT promotion_threshold FROM leagues WHERE id = league_id)),
    demoted = (rank > (SELECT max_members - demotion_threshold FROM leagues WHERE id = league_id))
  WHERE week_start < current_week_start AND promoted IS NULL;
  
  -- Reset week_xp in profiles
  UPDATE profiles SET week_xp = 0;
END;
$$ LANGUAGE plpgsql;
