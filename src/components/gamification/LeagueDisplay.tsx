import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserLeague, UserLeagueData, getLeagueColor } from '../../lib/leagueSystem';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';

export function LeagueDisplay() {
  const { user } = useAuth();
  const [leagueData, setLeagueData] = useState<UserLeagueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLeague = async () => {
      setLoading(true);
      const data = await getUserLeague(user.id);
      setLeagueData(data);
      setLoading(false);
    };

    fetchLeague();
  }, [user]);

  if (loading || !leagueData) return null;

  const leagueColor = getLeagueColor(leagueData.league.tier);
  const isTopTen = leagueData.rank <= leagueData.league.promotionThreshold;
  const isBottomTen = leagueData.rank > leagueData.league.maxMembers - leagueData.league.demotionThreshold;

  return (
    <Card variant="glass" padding="lg" className="overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: `${leagueColor}20`,
              border: `2px solid ${leagueColor}40`,
            }}
          >
            <Trophy className="w-6 h-6" style={{ color: leagueColor }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-soft-white">Liga {leagueData.league.name}</h3>
            <p className="text-sm text-soft-muted">Posição #{leagueData.rank}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{leagueData.weekXp}</div>
          <div className="text-xs text-soft-muted">XP esta semana</div>
        </div>
      </div>

      {isTopTen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2"
        >
          <TrendingUp className="w-5 h-5 text-green-400" />
          <p className="text-sm text-green-400 font-medium">
            Zona de promoção! Continue assim para subir de liga!
          </p>
        </motion.div>
      )}

      {isBottomTen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2"
        >
          <TrendingDown className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-400 font-medium">
            Zona de rebaixamento! Ganhe mais XP para se manter na liga!
          </p>
        </motion.div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {leagueData.members.slice(0, 20).map((member, index) => (
          <motion.div
            key={member.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-lg ${
              member.userId === user?.id
                ? 'bg-primary/20 border border-primary/40'
                : 'bg-dark-lighter/50 hover:bg-dark-lighter/80'
            } transition-all`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  member.rank === 1
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900'
                    : member.rank === 2
                    ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900'
                    : member.rank === 3
                    ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900'
                    : 'bg-titanium text-soft-white'
                }`}
              >
                {member.rank}
              </div>
              <div>
                <div className="font-medium text-soft-white">{member.displayName}</div>
                {member.userId === user?.id && (
                  <div className="text-xs text-primary">Você</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-soft-white">{member.weekXp} XP</div>
              </div>
              {member.rank <= leagueData.league.promotionThreshold && (
                <TrendingUp className="w-4 h-4 text-green-400" />
              )}
              {member.rank > leagueData.league.maxMembers - leagueData.league.demotionThreshold && (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-titanium/30 text-center">
        <p className="text-xs text-soft-muted">
          A liga reinicia toda segunda-feira. Continue ativo para conquistar mais XP!
        </p>
      </div>
    </Card>
  );
}
