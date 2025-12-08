/*
  # Seed Exercise Content

  ## Overview
  This migration populates the exercises table with actual exercise content for all three trilhas.
  Each exercise has a specific type and content structure based on the exercise requirements.

  ## Exercise Types Included
  - reflection: Open-ended reflective questions
  - multiple_choice: Quiz-style questions with feedback
  - rating_scale: Self-assessment scales
  - checklist: Multi-item selection exercises
  - focused_attention: Timed attention exercises
  - breathing: Guided breathing exercises
  - gratitude_list: Gratitude journaling
  - prayer_reflection: Spiritual reflection exercises
  - moral_assessment: Moral self-evaluation

  ## Content Structure
  All exercises are organized by trilha → pilar → exercise, with 3-5 exercises per pilar.
*/

-- Fundamentos Mentais: Autoconhecimento
INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'valores-pessoais', 'Identificando Seus Valores', 'Descubra o que realmente importa para você', 'reflection',
'{"question": "Quais são os três valores mais importantes na sua vida? Por que eles são tão significativos para você?", "placeholder": "Ex: Família, crescimento pessoal, integridade..."}'::jsonb,
15, 1
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'fundamentos-mentais' AND p.slug = 'autoconhecimento'
ON CONFLICT (pilar_id, slug) DO NOTHING;

INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'forcas-fraquezas', 'Conhecendo Suas Forças', 'Identifique suas principais forças e áreas de melhoria', 'checklist',
'{"title": "Marque suas principais forças:", "items": [{"id": "comunicacao", "text": "Comunicação efetiva"}, {"id": "empatia", "text": "Empatia e compreensão"}, {"id": "organizacao", "text": "Organização"}, {"id": "criatividade", "text": "Criatividade"}, {"id": "lideranca", "text": "Liderança"}], "minRequired": 2}'::jsonb,
10, 2
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'fundamentos-mentais' AND p.slug = 'autoconhecimento'
ON CONFLICT (pilar_id, slug) DO NOTHING;

INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'historia-pessoal', 'Sua História Molda Você', 'Reflita sobre experiências que te moldaram', 'reflection',
'{"question": "Descreva uma experiência significativa que mudou sua perspectiva de vida. O que você aprendeu?", "placeholder": "Pense em momentos marcantes..."}'::jsonb,
15, 3
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'fundamentos-mentais' AND p.slug = 'autoconhecimento'
ON CONFLICT (pilar_id, slug) DO NOTHING;

-- Fundamentos Mentais: Inteligência Emocional
INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'reconhecer-emocoes', 'Reconhecendo Emoções', 'Aprenda a identificar suas emoções com precisão', 'multiple_choice',
'{"question": "Quando você se sente sobrecarregado, qual é geralmente sua primeira reação?", "options": [{"id": "a", "text": "Procuro me isolar e processar sozinho"}, {"id": "b", "text": "Busco conversar com alguém de confiança"}, {"id": "c", "text": "Tento ignorar e seguir em frente"}, {"id": "d", "text": "Escrevo ou expresso de forma criativa"}], "correctId": "b", "explanation": "Compartilhar com pessoas de confiança é uma das formas mais saudáveis de processar emoções difíceis."}'::jsonb,
10, 1
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'fundamentos-mentais' AND p.slug = 'inteligencia-emocional'
ON CONFLICT (pilar_id, slug) DO NOTHING;

INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'empatia-pratica', 'Praticando Empatia', 'Desenvolva sua capacidade de entender os outros', 'reflection',
'{"question": "Pense em alguém com quem você teve um conflito recentemente. Tente descrever a situação da perspectiva dessa pessoa.", "placeholder": "Como essa pessoa pode ter se sentido?"}'::jsonb,
15, 2
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'fundamentos-mentais' AND p.slug = 'inteligencia-emocional'
ON CONFLICT (pilar_id, slug) DO NOTHING;

INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'regulacao-emocional', 'Regulando Suas Emoções', 'Avalie como você gerencia diferentes emoções', 'rating_scale',
'{"questions": [{"id": "raiva", "text": "Consigo lidar com raiva de forma saudável"}, {"id": "tristeza", "text": "Permito-me sentir e processar tristeza"}, {"id": "ansiedade", "text": "Gerencio bem a ansiedade"}, {"id": "alegria", "text": "Consigo expressar alegria livremente"}], "minLabel": "Discordo", "maxLabel": "Concordo"}'::jsonb,
10, 3
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'fundamentos-mentais' AND p.slug = 'inteligencia-emocional'
ON CONFLICT (pilar_id, slug) DO NOTHING;

-- Treino da Mente: Desbloqueio Mental
INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'atencao-focada', 'Foco Profundo', 'Pratique atenção focada em uma tarefa simples', 'focused_attention',
'{"instruction": "Este exercício ajudará você a desenvolver foco profundo.", "durationMinutes": 5, "task": "Concentre-se apenas na sua respiração. Quando sua mente divagar, gentilmente traga-a de volta."}'::jsonb,
20, 1
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'treino-da-mente' AND p.slug = 'desbloqueio-mental'
ON CONFLICT (pilar_id, slug) DO NOTHING;

INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'crencas-limitantes', 'Identificando Crenças Limitantes', 'Reconheça padrões mentais que te limitam', 'checklist',
'{"title": "Marque as crenças que você já teve:", "items": [{"id": "1", "text": "Não sou bom o suficiente"}, {"id": "2", "text": "Nunca vou conseguir"}, {"id": "3", "text": "Os outros são melhores que eu"}, {"id": "4", "text": "Não mereço sucesso"}, {"id": "5", "text": "É tarde demais para mudar"}], "minRequired": 1}'::jsonb,
15, 2
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'treino-da-mente' AND p.slug = 'desbloqueio-mental'
ON CONFLICT (pilar_id, slug) DO NOTHING;

INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'ressignificacao', 'Ressignificando Experiências', 'Transforme interpretações negativas', 'reflection',
'{"question": "Pense em uma situação que você considera um fracasso. Como você poderia ressignificá-la como uma oportunidade de aprendizado?", "placeholder": "Descreva a situação e sua nova perspectiva..."}'::jsonb,
15, 3
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'treino-da-mente' AND p.slug = 'desbloqueio-mental'
ON CONFLICT (pilar_id, slug) DO NOTHING;

-- Treino da Mente: Resiliência Emocional
INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'respiracao-resiliente', 'Respiração para Resiliência', 'Pratique respiração para fortalecer resiliência emocional', 'breathing',
'{"instruction": "A respiração consciente fortalece sua resiliência emocional.", "cycles": 5, "inhaleSeconds": 4, "holdSeconds": 4, "exhaleSeconds": 6}'::jsonb,
20, 1
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'treino-da-mente' AND p.slug = 'resiliencia-emocional'
ON CONFLICT (pilar_id, slug) DO NOTHING;

INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'superando-desafios', 'Superando Adversidades', 'Reflita sobre sua capacidade de superar desafios', 'reflection',
'{"question": "Descreva um momento difícil que você superou. Que recursos internos você descobriu em si mesmo?", "placeholder": "Pense em sua força interior..."}'::jsonb,
15, 2
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'treino-da-mente' AND p.slug = 'resiliencia-emocional'
ON CONFLICT (pilar_id, slug) DO NOTHING;

-- Propósito e Deus: Propósito de Vida
INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'proposito-central', 'Descobrindo Seu Propósito', 'Explore profundamente seu propósito de vida', 'reflection',
'{"question": "O que você sente que nasceu para fazer? O que faz seu coração bater mais forte?", "placeholder": "Seja honesto e profundo em sua resposta..."}'::jsonb,
20, 1
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'proposito-e-deus' AND p.slug = 'proposito-vida'
ON CONFLICT (pilar_id, slug) DO NOTHING;

INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'legado', 'Seu Legado', 'Reflita sobre o legado que deseja deixar', 'reflection',
'{"question": "Como você gostaria de ser lembrado? Que impacto deseja ter no mundo?", "placeholder": "Pense no seu legado..."}'::jsonb,
15, 2
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'proposito-e-deus' AND p.slug = 'proposito-vida'
ON CONFLICT (pilar_id, slug) DO NOTHING;

-- Propósito e Deus: Conexão com Deus
INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'oracao-reflexiva', 'Momento de Oração e Reflexão', 'Conecte-se espiritualmente através da reflexão', 'prayer_reflection',
'{"guidance": "Reserve alguns minutos de silêncio. Aquiete sua mente e seu coração.\n\nSe você tem uma prática de oração, use este momento para se conectar com Deus.\n\nSe não, simplesmente medite sobre aquilo que é maior que você, sobre o mistério da existência e o propósito da vida.", "reflectionPrompt": "O que você sentiu ou percebeu durante este momento de reflexão?"}'::jsonb,
20, 1
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'proposito-e-deus' AND p.slug = 'conexao-deus'
ON CONFLICT (pilar_id, slug) DO NOTHING;

-- Propósito e Deus: Gratidão e Serviço
INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'gratidao-diaria', 'Cultivando Gratidão', 'Liste as coisas pelas quais você é grato hoje', 'gratitude_list',
'{"prompt": "Pelo que você é grato hoje?", "minItems": 5}'::jsonb,
15, 1
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'proposito-e-deus' AND p.slug = 'gratidao-servico'
ON CONFLICT (pilar_id, slug) DO NOTHING;

INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'servir-outros', 'Vivendo Para Servir', 'Reflita sobre como você pode servir aos outros', 'reflection',
'{"question": "De que formas práticas você pode servir e ajudar outras pessoas esta semana?", "placeholder": "Pense em ações concretas de serviço..."}'::jsonb,
15, 2
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'proposito-e-deus' AND p.slug = 'gratidao-servico'
ON CONFLICT (pilar_id, slug) DO NOTHING;

-- Propósito e Deus: Alinhamento Moral
INSERT INTO exercises (pilar_id, slug, title, description, type, content, xp_reward, order_index)
SELECT p.id, 'autoavaliacao-moral', 'Autoavaliação Moral e Espiritual', 'Avalie seu alinhamento moral e espiritual', 'moral_assessment',
'{"areas": [{"id": "integridade", "name": "Integridade - Vivo de acordo com meus valores"}, {"id": "honestidade", "name": "Honestidade - Sou verdadeiro comigo e com os outros"}, {"id": "compaixao", "name": "Compaixão - Demonstro amor e cuidado"}, {"id": "humildade", "name": "Humildade - Reconheço minhas limitações"}], "commitmentPrompt": "Com base em sua autoavaliação, que compromisso você faz consigo mesmo para crescer moralmente e espiritualmente?"}'::jsonb,
20, 1
FROM pilares p
JOIN trilhas t ON p.trilha_id = t.id
WHERE t.slug = 'proposito-e-deus' AND p.slug = 'alinhamento-moral'
ON CONFLICT (pilar_id, slug) DO NOTHING;