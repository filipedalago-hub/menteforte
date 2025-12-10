/*
  # Sistema de Metas e Hábitos - Mentes.ia

  ## Sumário
  Sistema completo de gerenciamento de metas e rastreamento de hábitos com gamificação integrada.

  ## 1. Novas Tabelas

  ### `goals` (Metas)
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key → profiles.id)
  - `title` (text) - Título da meta
  - `description` (text, nullable) - Descrição detalhada
  - `category` (text) - Categoria: 'health', 'spiritual', 'personal', 'professional', 'financial', 'relationships'
  - `target_type` (text) - Tipo de meta: 'boolean', 'numeric', 'checklist'
  - `target_value` (integer, nullable) - Valor alvo para metas numéricas
  - `current_value` (integer, default 0) - Progresso atual
  - `unit` (text, nullable) - Unidade de medida (kg, km, horas, etc)
  - `deadline` (date, nullable) - Data limite
  - `status` (text, default 'active') - Status: 'active', 'completed', 'cancelled'
  - `completed_at` (timestamptz, nullable)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `habits` (Hábitos)
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key → profiles.id)
  - `title` (text) - Título do hábito
  - `description` (text, nullable) - Descrição
  - `category` (text) - Mesmas categorias das metas
  - `frequency` (text, default 'daily') - Frequência: 'daily', 'weekly', 'custom'
  - `frequency_target` (integer, default 1) - Quantas vezes por período
  - `icon` (text, nullable) - Nome do ícone Lucide
  - `color` (text, default 'cyan') - Cor do tema
  - `active` (boolean, default true) - Hábito ativo
  - `start_date` (date, default today)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `habit_completions` (Conclusões de Hábitos)
  - `id` (uuid, primary key)
  - `habit_id` (uuid, foreign key → habits.id)
  - `user_id` (uuid, foreign key → profiles.id)
  - `completion_date` (date, default today)
  - `notes` (text, nullable)
  - `xp_earned` (integer, default 5)
  - `created_at` (timestamptz, default now())

  ## 2. Segurança (RLS)
  - Todas as tabelas têm RLS habilitado
  - Usuários autenticados só podem acessar seus próprios dados
  - Políticas separadas para SELECT, INSERT, UPDATE, DELETE

  ## 3. Índices
  - Índices em user_id para performance
  - Índice em completion_date para queries de progresso
  - Índice composto em habit_id + completion_date para tracking

  ## 4. Gamificação
  - XP por conclusão de hábito
  - Tracking de streaks através das datas
  - Sistema de categorias para análise
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'personal',
  target_type text NOT NULL DEFAULT 'boolean',
  target_value integer,
  current_value integer DEFAULT 0,
  unit text,
  deadline date,
  status text DEFAULT 'active',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('health', 'spiritual', 'personal', 'professional', 'financial', 'relationships')),
  CONSTRAINT valid_target_type CHECK (target_type IN ('boolean', 'numeric', 'checklist')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'personal',
  frequency text DEFAULT 'daily',
  frequency_target integer DEFAULT 1,
  icon text,
  color text DEFAULT 'cyan',
  active boolean DEFAULT true,
  start_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('health', 'spiritual', 'personal', 'professional', 'financial', 'relationships')),
  CONSTRAINT valid_frequency CHECK (frequency IN ('daily', 'weekly', 'custom'))
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completion_date date DEFAULT CURRENT_DATE,
  notes text,
  xp_earned integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completion_date)
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own habit completions"
  ON habit_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habit completions"
  ON habit_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit completions"
  ON habit_completions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit completions"
  ON habit_completions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_deadline ON goals(deadline);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_active ON habits(active);

CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(completion_date);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_date ON habit_completions(habit_id, completion_date);
