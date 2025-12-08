import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Lock } from 'lucide-react';
import { supabase, Trilha, Pilar } from '../lib/supabase';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CardSkeleton } from '../components/Skeleton';
import { ProgressBar } from '../components/ProgressBar';

export function TrilhaPage() {
  const { trilhaSlug } = useParams<{ trilhaSlug: string }>();
  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [pilares, setPilares] = useState<Pilar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!trilhaSlug) return;

      const trilhaRes = await supabase
        .from('trilhas')
        .select('*')
        .eq('slug', trilhaSlug)
        .maybeSingle();

      if (trilhaRes.data) {
        setTrilha(trilhaRes.data);

        const pilaresRes = await supabase
          .from('pilares')
          .select('*')
          .eq('trilha_id', trilhaRes.data.id)
          .order('order_index');

        if (pilaresRes.data) setPilares(pilaresRes.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [trilhaSlug]);

  if (loading) {
    return (
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="grid md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!trilha) {
    return <div>Trilha não encontrada</div>;
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Início', path: '/app' },
          { label: trilha.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{trilha.name}</h1>
        <p className="text-gray-600 text-lg">{trilha.description}</p>
      </div>

      <div className="mb-8">
        <ProgressBar percentage={0} label="Progresso Geral" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {pilares.map((pilar, index) => {
          const isLocked = false;

          return (
            <Link
              key={pilar.id}
              to={isLocked ? '#' : `/app/trilha/${trilhaSlug}/${pilar.slug}`}
              className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${
                isLocked
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:shadow-md hover:border-blue-300 transition-all group'
              }`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                  {index + 1}
                </div>
                {isLocked && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                {pilar.name}
              </h3>
              <p className="text-gray-600 mb-4">{pilar.description}</p>

              {!isLocked && (
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  Começar
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
