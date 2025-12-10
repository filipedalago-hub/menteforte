import { Link } from 'react-router-dom';
import { Target, Award, TrendingUp, Users, Sparkles, Lock, Zap, Brain } from 'lucide-react';
import { Logo } from '../components/Logo';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-dark">
      <div className="fixed inset-0 bg-gradient-to-b from-neon-cyan/5 via-transparent to-primary/5 pointer-events-none" />

      <nav className="relative z-10 border-b border-titanium/30 backdrop-blur-sm bg-dark/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-soft-gray hover:text-soft-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className="btn-primary"
              >
                Comecar Agora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-block mb-6 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full">
            <span className="text-neon-cyan text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Inteligencia Artificial + Neurociencia
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-soft-white mb-6 leading-tight">
            Transforme Sua Mente,
            <br />
            <span className="bg-gradient-special bg-clip-text text-transparent">
              Transforme Sua Vida
            </span>
          </h1>

          <p className="text-xl text-soft-gray mb-10 max-w-2xl mx-auto">
            Desenvolva habitos mentais poderosos atraves de exercicios praticos e gamificacao envolvente.
            Descubra seu proposito e alcance seu maximo potencial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="btn-neon text-lg px-8 py-4 animate-pulse-glow"
            >
              Comecar Jornada
            </Link>
            <Link
              to="/login"
              className="btn-secondary text-lg px-8 py-4"
            >
              Ja tenho conta
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-cyan mb-1">10K+</div>
              <div className="text-sm text-soft-muted">Usuarios Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">95%</div>
              <div className="text-sm text-soft-muted">Satisfacao</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-cyan mb-1">50+</div>
              <div className="text-sm text-soft-muted">Exercicios</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="card-glow group hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-glow-primary">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-soft-white">Fundamentos Mentais</h3>
            <p className="text-soft-gray leading-relaxed">
              Desenvolva autoconhecimento, inteligencia emocional e mentalidade de crescimento com IA.
            </p>
          </div>

          <div className="card-glow group hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-gradient-special rounded-xl flex items-center justify-center mb-4 shadow-glow-md">
              <Zap className="w-6 h-6 text-dark" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-soft-white">Treinamento da Mente</h3>
            <p className="text-soft-gray leading-relaxed">
              Desbloqueie todo o potencial mental atraves de neuro-habitos e exercicios avancados.
            </p>
          </div>

          <div className="card-glow group hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-glow-primary">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-soft-white">Proposito e Espiritualidade</h3>
            <p className="text-soft-gray leading-relaxed">
              Descubra seu proposito de vida e aprofunde sua conexao espiritual.
            </p>
          </div>
        </div>

        <div className="card-dark p-12 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center mb-4 text-soft-white">
              Por Que <span className="text-neon-cyan">Mentes.ia</span>?
            </h2>
            <p className="text-center text-soft-gray mb-12 max-w-2xl mx-auto">
              A plataforma mais avancada de desenvolvimento mental com tecnologia de IA
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:shadow-glow-sm transition-shadow">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-soft-white">Gamificacao Inteligente</h3>
                  <p className="text-soft-gray leading-relaxed">
                    Ganhe XP, suba de nivel, mantenha sua sequencia diaria e desbloqueie conquistas enquanto evolui.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-neon-cyan/20 rounded-xl flex items-center justify-center group-hover:shadow-glow-sm transition-shadow">
                    <TrendingUp className="w-6 h-6 text-neon-cyan" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-soft-white">Progresso Mensuravel</h3>
                  <p className="text-soft-gray leading-relaxed">
                    Acompanhe seu desenvolvimento atraves de metricas claras e visualize sua evolucao.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:shadow-glow-sm transition-shadow">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-soft-white">Exercicios Praticos</h3>
                  <p className="text-soft-gray leading-relaxed">
                    Aplique o conhecimento atraves de exercicios variados e personalizados para cada objetivo.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-neon-cyan/20 rounded-xl flex items-center justify-center group-hover:shadow-glow-sm transition-shadow">
                    <Users className="w-6 h-6 text-neon-cyan" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-soft-white">Comunidade Inspiradora</h3>
                  <p className="text-soft-gray leading-relaxed">
                    Junte-se a milhares de pessoas que estao transformando suas vidas atraves do desenvolvimento mental.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-gradient-primary rounded-2xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />

          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4 text-white">Pronto Para Comecar?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Comece sua jornada de transformacao hoje mesmo. Gratis para comecar.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary text-lg font-semibold rounded-xl hover:bg-soft-white transition-all shadow-lg hover:shadow-xl"
            >
              <Lock className="w-5 h-5" />
              Criar Conta Gratuita
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-titanium/30 bg-dark-lighter py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo size="sm" />

            <p className="text-soft-muted text-sm">
              Transformando mentes, transformando vidas.
            </p>

            <p className="text-soft-muted text-xs">
              2025 Mentes.ia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
