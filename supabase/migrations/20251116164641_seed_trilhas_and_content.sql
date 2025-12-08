/*
  # Seed Content for Mental Training App

  ## Overview
  Seeds the database with all three trilhas (learning paths), their pilares (pillars),
  and exercises with complete content definitions.

  ## Content Structure

  ### Trilha 1: Fundamentos Mentais
  - Autoconhecimento
  - Inteligência Emocional
  - Mentalidade de Crescimento
  - Foco e Concentração
  - Gestão de Tempo

  ### Trilha 2: Treinamento da Mente
  - Desbloqueio Mental
  - Resiliência Emocional
  - Clareza de Decisão
  - Autodomínio e Controle Interno
  - Reprogramação de Crenças

  ### Trilha 3: Propósito, Espiritualidade e Deus
  - Propósito de Vida
  - Identidade e Chamado
  - Conexão com Deus
  - Gratidão e Serviço
  - Vida Intencional
  - Alinhamento Moral e Espiritual

  ## Exercise Types Implemented
  - reflection: Reflective writing exercises
  - multiple_choice: Multiple choice questions
  - rating_scale: Scale-based assessments
  - checklist: Checkbox-based exercises
  - focused_attention: Timed attention exercises
  - breathing: Guided breathing exercises
  - gratitude_list: Gratitude journaling
  - prayer_reflection: Spiritual reflection
  - moral_assessment: Moral self-evaluation
*/

-- Insert Trilhas
INSERT INTO trilhas (slug, name, description, icon_name, order_index) VALUES
('fundamentos-mentais', 'Fundamentos Mentais', 'Construa uma base sólida para seu desenvolvimento mental e emocional', 'Brain', 1),
('treino-da-mente', 'Treinamento da Mente', 'Desenvolva neuro-hábitos para desbloquear todo o potencial da sua mente', 'Zap', 2),
('proposito-e-deus', 'Propósito, Espiritualidade e Deus', 'Encontre seu propósito e aprofunde sua conexão espiritual', 'Sparkles', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert Pilares for Fundamentos Mentais
INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'autoconhecimento', 'Autoconhecimento', 'Descubra quem você realmente é e o que te move', 1
FROM trilhas t WHERE t.slug = 'fundamentos-mentais'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'inteligencia-emocional', 'Inteligência Emocional', 'Aprenda a reconhecer e gerenciar suas emoções', 2
FROM trilhas t WHERE t.slug = 'fundamentos-mentais'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'mentalidade-crescimento', 'Mentalidade de Crescimento', 'Desenvolva uma mentalidade que abraça desafios', 3
FROM trilhas t WHERE t.slug = 'fundamentos-mentais'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'foco-concentracao', 'Foco e Concentração', 'Domine sua atenção e elimine distrações', 4
FROM trilhas t WHERE t.slug = 'fundamentos-mentais'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'gestao-tempo', 'Gestão de Tempo', 'Use seu tempo de forma intencional e produtiva', 5
FROM trilhas t WHERE t.slug = 'fundamentos-mentais'
ON CONFLICT (trilha_id, slug) DO NOTHING;

-- Insert Pilares for Treino da Mente
INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'desbloqueio-mental', 'Desbloqueio Mental', 'Liberte-se de padrões mentais limitantes', 1
FROM trilhas t WHERE t.slug = 'treino-da-mente'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'resiliencia-emocional', 'Resiliência Emocional', 'Fortaleça sua capacidade de superar adversidades', 2
FROM trilhas t WHERE t.slug = 'treino-da-mente'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'clareza-decisao', 'Clareza de Decisão', 'Tome decisões com confiança e clareza mental', 3
FROM trilhas t WHERE t.slug = 'treino-da-mente'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'autodominio', 'Autodomínio e Controle Interno', 'Desenvolva controle sobre seus impulsos e reações', 4
FROM trilhas t WHERE t.slug = 'treino-da-mente'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'reprogramacao-crencas', 'Reprogramação de Crenças', 'Identifique e transforme crenças limitantes', 5
FROM trilhas t WHERE t.slug = 'treino-da-mente'
ON CONFLICT (trilha_id, slug) DO NOTHING;

-- Insert Pilares for Propósito e Deus
INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'proposito-vida', 'Propósito de Vida', 'Descubra o que você nasceu para fazer', 1
FROM trilhas t WHERE t.slug = 'proposito-e-deus'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'identidade-chamado', 'Identidade e Chamado', 'Entenda sua identidade única e seu chamado no mundo', 2
FROM trilhas t WHERE t.slug = 'proposito-e-deus'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'conexao-deus', 'Conexão com Deus', 'Aprofunde sua relação espiritual', 3
FROM trilhas t WHERE t.slug = 'proposito-e-deus'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'gratidao-servico', 'Gratidão e Serviço', 'Cultive gratidão e viva uma vida de serviço', 4
FROM trilhas t WHERE t.slug = 'proposito-e-deus'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'vida-intencional', 'Vida Intencional', 'Viva cada dia com propósito e intenção', 5
FROM trilhas t WHERE t.slug = 'proposito-e-deus'
ON CONFLICT (trilha_id, slug) DO NOTHING;

INSERT INTO pilares (trilha_id, slug, name, description, order_index)
SELECT t.id, 'alinhamento-moral', 'Alinhamento Moral e Espiritual', 'Alinhe suas ações com seus valores mais profundos', 6
FROM trilhas t WHERE t.slug = 'proposito-e-deus'
ON CONFLICT (trilha_id, slug) DO NOTHING;

-- Insert sample badges
INSERT INTO badges (name, description, icon_name, requirement_type, requirement_value) VALUES
('Primeiro Passo', 'Complete seu primeiro exercício', 'Award', 'exercises_completed', 1),
('Explorador', 'Complete 10 exercícios', 'Compass', 'exercises_completed', 10),
('Dedicado', 'Mantenha 7 dias de sequência', 'Flame', 'streak', 7),
('Mestre Mental', 'Complete 50 exercícios', 'Crown', 'exercises_completed', 50),
('Fogo Constante', 'Mantenha 30 dias de sequência', 'Zap', 'streak', 30)
ON CONFLICT (name) DO NOTHING;