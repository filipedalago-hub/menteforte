import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/Logo';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || !displayName) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password, displayName);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 bg-gradient-to-b from-neon-cyan/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="absolute top-4 left-4">
        <Link to="/" className="inline-flex items-center gap-2 text-soft-gray hover:text-soft-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <Logo size="lg" />
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-soft-white">Comece sua jornada</h1>
          <p className="text-soft-gray">Crie sua conta e transforme sua mente</p>
        </div>

        <div className="card-dark">
          {error && (
            <div
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="displayName" className="label-dark">
                Nome
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input-dark w-full"
                placeholder="Seu nome"
                disabled={loading}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="label-dark">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark w-full"
                placeholder="seu@email.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-dark">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark w-full"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="new-password"
              />
              <p className="mt-2 text-sm text-soft-muted">Minimo de 6 caracteres</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-soft-gray">
              Ja tem uma conta?{' '}
              <Link to="/login" className="text-neon-cyan font-semibold hover:text-primary transition-colors">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
