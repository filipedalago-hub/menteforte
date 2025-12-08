/*
  # Initial Database Schema for Mental Training App

  ## Overview
  This migration creates the complete database structure for a gamified mental training application
  with three learning paths (trilhas), user progress tracking, and gamification features.

  ## 1. New Tables

  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `display_name` (text)
  - `avatar_url` (text, nullable)
  - `xp` (integer, default 0)
  - `level` (integer, default 1)
  - `current_streak` (integer, default 0)
  - `longest_streak` (integer, default 0)
  - `last_activity_date` (date, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `badges`
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `description` (text)
  - `icon_name` (text)
  - `requirement_type` (text)
  - `requirement_value` (integer)
  - `created_at` (timestamptz)

  ### `user_badges`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `badge_id` (uuid, references badges)
  - `earned_at` (timestamptz)

  ### `trilhas`
  - `id` (uuid, primary key)
  - `slug` (text, unique)
  - `name` (text)
  - `description` (text)
  - `icon_name` (text)
  - `order_index` (integer)
  - `created_at` (timestamptz)

  ### `pilares`
  - `id` (uuid, primary key)
  - `trilha_id` (uuid, references trilhas)
  - `slug` (text)
  - `name` (text)
  - `description` (text)
  - `order_index` (integer)
  - `created_at` (timestamptz)

  ### `exercises`
  - `id` (uuid, primary key)
  - `pilar_id` (uuid, references pilares)
  - `slug` (text)
  - `title` (text)
  - `description` (text)
  - `type` (text)
  - `content` (jsonb)
  - `xp_reward` (integer, default 10)
  - `order_index` (integer)
  - `created_at` (timestamptz)

  ### `user_exercise_progress`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `exercise_id` (uuid, references exercises)
  - `completed` (boolean, default false)
  - `answer_data` (jsonb)
  - `completed_at` (timestamptz, nullable)
  - `last_updated` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Profiles: Users can read/update their own profile
  - Badges: Public read, no write
  - User_badges: Users can read their own badges
  - Trilhas/Pilares/Exercises: Public read, no write
  - User_exercise_progress: Users can read/write their own progress

  ## 3. Important Notes
  - All UUIDs use gen_random_uuid()
  - Foreign keys ensure referential integrity
  - Timestamps use timestamptz for timezone support
  - JSONB fields allow flexible content storage
  - Unique constraints prevent duplicates
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are publicly readable"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create trilhas table
CREATE TABLE IF NOT EXISTS trilhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trilhas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trilhas are publicly readable"
  ON trilhas FOR SELECT
  TO authenticated
  USING (true);

-- Create pilares table
CREATE TABLE IF NOT EXISTS pilares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trilha_id uuid NOT NULL REFERENCES trilhas(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trilha_id, slug)
);

ALTER TABLE pilares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pilares are publicly readable"
  ON pilares FOR SELECT
  TO authenticated
  USING (true);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pilar_id uuid NOT NULL REFERENCES pilares(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  xp_reward integer DEFAULT 10,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(pilar_id, slug)
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are publicly readable"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- Create user_exercise_progress table
CREATE TABLE IF NOT EXISTS user_exercise_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  answer_data jsonb DEFAULT '{}',
  completed_at timestamptz,
  last_updated timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_exercise_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_exercise_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_exercise_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_pilares_trilha_id ON pilares(trilha_id);
CREATE INDEX IF NOT EXISTS idx_exercises_pilar_id ON exercises(pilar_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_exercise_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_exercise_id ON user_exercise_progress(exercise_id);