import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, Heart, Crown } from 'lucide-react';
import { formatFCFA } from '../utils/formatPrice';

interface RevenueWidgetProps {
  revenus: {
    sponsors: number;
    annonces: number;
    necrologie: number;
    premium: number;
  };
  total: number;
}

const RevenueWidget: React.FC<RevenueWidgetProps> = ({ revenus, total }) => {
  const sources = [
    { label: 'Sponsors', montant: revenus.sponsors, icon: Users, color: 'text-blue-500' },
    { label: 'Annonces', montant: revenus.annonces, icon: ShoppingBag, color: 'text-orange-500' },
    { label: 'Nécrologie', montant: revenus.necrologie, icon: Heart, color: 'text-purple-500' },
    { label: 'Premium', montant: revenus.premium, icon: Crown, color: 'text-secondary' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-dark flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" />
          Revenus du Mois
        </h3>
        <span className="text-xs bg-success/10 text-success px-3 py-1 rounded-full font-semibold">
          +23%
        </span>
      </div>

      <div className="mb-6">
        <p className="text-3xl font-display font-bold text-dark">{formatFCFA(total)}</p>
        <p className="text-sm text-muted">Total Avril 2026</p>
      </div>

      <div className="space-y-3">
        {sources.map((source, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <source.icon className={`w-4 h-4 ${source.color}`} />
              <span className="text-sm text-muted">{source.label}</span>
            </div>
            <span className="font-semibold text-dark">{formatFCFA(source.montant)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RevenueWidget;