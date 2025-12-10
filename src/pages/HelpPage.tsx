import { HelpCircle, Zap, Award, Flame, TrendingUp } from 'lucide-react';

export function HelpPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Central de Ajuda</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold">Como Funciona o MenteForte?</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            O MenteForte é uma plataforma de desenvolvimento mental que combina exercícios práticos com
            gamificação para te ajudar a desenvolver hábitos mentais poderosos. Você progride através de
            três trilhas de aprendizado, completando exercícios e desbloqueando conquistas.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-6">Sistema de Gamificação</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Pontos de Experiência (XP)</h3>
                <p className="text-gray-600 text-sm">
                  Ganhe XP ao completar exercícios. Cada exercício concede uma quantidade específica de XP
                  que contribui para seu progresso geral.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Níveis</h3>
                <p className="text-gray-600 text-sm">
                  Conforme você acumula XP, você sobe de nível. Cada novo nível é uma prova do seu compromisso
                  com o desenvolvimento pessoal.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Sequência Diária</h3>
                <p className="text-gray-600 text-sm">
                  Complete pelo menos um exercício por dia para manter sua sequência ativa. Quanto maior sua
                  sequência, maior seu compromisso com a transformação.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Conquistas</h3>
                <p className="text-gray-600 text-sm">
                  Desbloqueie conquistas especiais ao atingir marcos importantes. Cada conquista é um
                  reconhecimento do seu progresso.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">As Três Trilhas</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Fundamentos Mentais</h3>
              <p className="text-gray-600 text-sm">
                Construa uma base sólida de autoconhecimento, inteligência emocional e mentalidade de
                crescimento. Perfeita para iniciantes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Treinamento da Mente</h3>
              <p className="text-gray-600 text-sm">
                Desenvolva neuro-hábitos avançados para desbloquear todo o potencial da sua mente através
                de exercícios de atenção, resiliência e reprogramação mental.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Propósito, Espiritualidade e Deus</h3>
              <p className="text-gray-600 text-sm">
                Descubra seu propósito de vida, aprofunde sua conexão espiritual e alinhe suas ações com
                seus valores mais profundos.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">Precisa de Mais Ajuda?</h2>
          <p className="text-gray-700 mb-4">
            Se você tiver dúvidas ou precisar de suporte adicional, estamos aqui para ajudar!
          </p>
          <a
            href="mailto:suporte@menteforte.com"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Entrar em Contato
          </a>
        </div>
      </div>
    </div>
  );
}
