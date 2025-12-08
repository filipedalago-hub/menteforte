import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Target, Award, TrendingUp, Users } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
              <Zap className="w-6 h-6 text-blue-600" />
              MenteForte
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transforme Sua Mente,
            <br />
            <span className="text-blue-600">Transforme Sua Vida</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Desenvolva hábitos mentais poderosos através de exercícios práticos e gamificação envolvente.
            Descubra seu propósito e alcance seu máximo potencial.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Comece Sua Jornada
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Fundamentos Mentais</h3>
            <p className="text-gray-600">
              Desenvolva autoconhecimento, inteligência emocional e mentalidade de crescimento.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Treinamento da Mente</h3>
            <p className="text-gray-600">
              Desbloqueie todo o potencial mental através de neuro-hábitos e exercícios avançados.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Propósito e Espiritualidade</h3>
            <p className="text-gray-600">
              Descubra seu propósito de vida e aprofunde sua conexão espiritual.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Por Que MenteForte?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Gamificação Inteligente</h3>
                <p className="text-gray-600">
                  Ganhe XP, suba de nível, mantenha sua sequência diária e desbloqueie conquistas enquanto evolui.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Progresso Mensurável</h3>
                <p className="text-gray-600">
                  Acompanhe seu desenvolvimento através de métricas claras e visualize sua evolução.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Exercícios Práticos</h3>
                <p className="text-gray-600">
                  Aplique o conhecimento através de exercícios variados e personalizados para cada objetivo.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Comunidade Inspiradora</h3>
                <p className="text-gray-600">
                  Junte-se a milhares de pessoas que estão transformando suas vidas através do desenvolvimento mental.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto Para Começar?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Comece sua jornada de transformação hoje mesmo. Grátis para começar.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Criar Conta Gratuita
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">MenteForte</span>
          </div>
          <p className="text-gray-400">
            Transformando mentes, transformando vidas.
          </p>
        </div>
      </footer>
    </div>
  );
}
