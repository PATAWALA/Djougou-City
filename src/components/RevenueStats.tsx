import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, Heart, Crown, Target } from 'lucide-react';
import type { RevenueStats as RevenueStatsType } from '../types';
import { formatFCFA } from '../utils/formatPrice';

interface RevenueStatsProps {
  stats: RevenueStatsType;
}

const RevenueStats: React.FC<RevenueStatsProps> = ({ stats }) => {
  const pourcentage = (stats.totalMensuel / stats.objectifMensuel) * 100;

  return (
    <div className="bg-gradient-to-br from-dark to-gray-900 text-white rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-display font-bold flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-secondary" />
          Tableau de Bord • Avril 2026
        </h3>
        <span className="bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-bold">
          Admin • La Ville De Djougou
        </span>
      </div>

      <div className="mb-8">
        <p className="text-gray-400 text-sm mb-2">Revenu Total Ce Mois</p>
        <div className="flex items-end gap-4">
          <span className="text-5xl font-display font-bold text-secondary">
            {formatFCFA(stats.totalMensuel)}
          </span>
          <span className="text-success text-lg mb-2">+23%</span>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Objectif mensuel</span>
            <span>{formatFCFA(stats.objectifMensuel)}</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${pourcentage}%` }}
              className="h-full bg-gradient-to-r from-success to-secondary rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <Users className="w-6 h-6 text-blue-400 mb-2" />
          <p className="text-2xl font-bold">{stats.sponsorsActifs}</p>
          <p className="text-xs text-gray-400">Sponsors</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <ShoppingBag className="w-6 h-6 text-orange-400 mb-2" />
          <p className="text-2xl font-bold">{stats.annoncesActives}</p>
          <p className="text-xs text-gray-400">Annonces</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <Heart className="w-6 h-6 text-purple-400 mb-2" />
          <p className="text-2xl font-bold">{stats.necrologiesMois}</p>
          <p className="text-xs text-gray-400">Nécrologie</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <Crown className="w-6 h-6 text-secondary mb-2" />
          <p className="text-2xl font-bold">{stats.premiumAbonnes}</p>
          <p className="text-xs text-gray-400">Premium</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueStats;