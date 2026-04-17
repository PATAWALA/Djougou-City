import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Crown,
  DollarSign,
  Calendar,
  ArrowUp,
  PieChart,
  Download,
} from 'lucide-react';
import Header from '../components/Header';
import { STATS_DEMO, PRICES, FOLLOWERS } from '../utils/constants';
import { formatFCFA, formatNombre } from '../utils/formatPrice';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('avril');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const stats = {
    ...STATS_DEMO,
    revenusParSource: {
      sponsors: 75000,
      annonces: 25000,
      necrologie: 20000,
      premium: 4000,
      boosts: 15000
    },
    evolution: {
      sponsors: 23,
      annonces: 15,
      necrologie: 8,
      premium: 45,
      total: 28
    }
  };

  const totalRevenus = Object.values(stats.revenusParSource).reduce((a, b) => a + b, 0);

  const transactions = [
    { id: 1, type: 'Sponsor', client: 'Restaurant La Terrasse', montant: 25000, date: '2026-04-15', statut: 'complete' },
    { id: 2, type: 'Annonce Premium', client: 'Moto Bajaj', montant: 1000, date: '2026-04-14', statut: 'complete' },
    { id: 3, type: 'Necrologie', client: 'Famille Akotegnon', montant: 1000, date: '2026-04-13', statut: 'complete' },
    { id: 4, type: 'Boost Article', client: 'Sante Djougou', montant: 3000, date: '2026-04-12', statut: 'complete' },
    { id: 5, type: 'Premium', client: 'Garage Specialiste', montant: 500, date: '2026-04-10', statut: 'complete' }
  ];

  const potentiel = {
    avec1pourcent: FOLLOWERS * 0.01,
    revenuSponsors: (FOLLOWERS * 0.01) * PRICES.SPONSOR,
    revenuAnnonces: (FOLLOWERS * 0.01) * PRICES.ANNONCE,
    revenuPremium: (FOLLOWERS * 0.01) * PRICES.PREMIUM
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tete */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-dark flex items-center gap-2">
              Tableau de Bord
              <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Admin</span>
            </h1>
            <p className="text-muted mt-1">Vue d'ensemble des revenus et performances</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 rounded-full border border-border bg-card text-dark"
            >
              <option value="avril">Avril 2026</option>
              <option value="mars">Mars 2026</option>
              <option value="fevrier">Fevrier 2026</option>
            </select>
            <button className="p-2 rounded-full border border-border bg-card hover:bg-background transition-colors">
              <Download className="w-5 h-5 text-dark" />
            </button>
          </div>
        </div>

        {/* KPI Principaux */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6">
            <DollarSign className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90">Revenu total</p>
            <p className="text-3xl font-display font-bold">{formatFCFA(totalRevenus)}</p>
            <p className="text-xs mt-2 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> +{stats.evolution.total}% vs mois dernier
            </p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <Users className="w-8 h-8 mb-3 text-blue-500" />
            <p className="text-sm text-muted">Sponsors actifs</p>
            <p className="text-3xl font-display font-bold text-dark">{stats.sponsorsActifs}</p>
            <p className="text-xs text-success mt-2">+{stats.evolution.sponsors}%</p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <ShoppingBag className="w-8 h-8 mb-3 text-orange-500" />
            <p className="text-sm text-muted">Annonces actives</p>
            <p className="text-3xl font-display font-bold text-dark">{stats.annoncesActives}</p>
            <p className="text-xs text-success mt-2">+{stats.evolution.annonces}%</p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <Crown className="w-8 h-8 mb-3 text-secondary" />
            <p className="text-sm text-muted">Abonnes Premium</p>
            <p className="text-3xl font-display font-bold text-dark">{stats.premiumAbonnes}</p>
            <p className="text-xs text-success mt-2">+{stats.evolution.premium}%</p>
          </div>
        </div>

        {/* Graphiques et details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Repartition des revenus */}
          <div className="lg:col-span-2 bg-card rounded-3xl p-6 shadow-lg border border-border">
            <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Repartition des revenus
            </h3>
            
            <div className="space-y-4">
              {Object.entries(stats.revenusParSource).map(([source, montant]) => (
                <div key={source}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="capitalize">{source}</span>
                    <span className="font-semibold">{formatFCFA(montant)}</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(montant / totalRevenus) * 100}%` }}
                      className={`h-full rounded-full ${
                        source === 'sponsors' ? 'bg-blue-500' :
                        source === 'annonces' ? 'bg-orange-500' :
                        source === 'necrologie' ? 'bg-purple-500' :
                        source === 'premium' ? 'bg-secondary' : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-background rounded-xl">
              <p className="text-sm font-semibold text-dark mb-2">Total: {formatFCFA(totalRevenus)}</p>
              <p className="text-xs text-muted">Objectif mensuel: {formatFCFA(stats.objectifMensuel)} ({Math.round((totalRevenus / stats.objectifMensuel) * 100)}% atteint)</p>
            </div>
          </div>
          
          {/* Potentiel */}
          <div className="bg-gradient-to-br from-dark to-gray-900 text-white rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              Potentiel maximum
            </h3>
            
            <p className="text-sm text-gray-400 mb-4">
              Avec {FOLLOWERS.toLocaleString()} followers, voici le potentiel theorique si 1% convertit :
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-2xl font-bold">{formatNombre(potentiel.avec1pourcent)} personnes</p>
                <p className="text-xs text-gray-400">1% de conversion</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sponsors</span>
                  <span className="font-bold text-blue-400">{formatFCFA(potentiel.revenuSponsors)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annonces</span>
                  <span className="font-bold text-orange-400">{formatFCFA(potentiel.revenuAnnonces)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium</span>
                  <span className="font-bold text-secondary">{formatFCFA(potentiel.revenuPremium)}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/20">
                <div className="flex justify-between">
                  <span className="font-bold">Total potentiel</span>
                  <span className="font-bold text-secondary text-xl">
                    {formatFCFA(potentiel.revenuSponsors + potentiel.revenuAnnonces + potentiel.revenuPremium)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">/ mois avec seulement 1% d'engagement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions recentes */}
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border mb-8">
          <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Transactions recentes
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Montant</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Statut</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        t.type === 'Sponsor' ? 'bg-blue-100 text-blue-700' :
                        t.type.includes('Annonce') ? 'bg-orange-100 text-orange-700' :
                        t.type === 'Necrologie' ? 'bg-purple-100 text-purple-700' :
                        t.type.includes('Boost') ? 'bg-green-100 text-green-700' :
                        'bg-secondary/20 text-secondary'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dark">{t.client}</td>
                    <td className="py-3 px-4 font-semibold text-success">{formatFCFA(t.montant)}</td>
                    <td className="py-3 px-4 text-muted">{new Date(t.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4">
                      <span className="text-success text-xs bg-success/10 px-2 py-1 rounded-full">
                        Complete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resume */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-success/10 rounded-3xl p-6 border border-success/30">
            <h4 className="font-bold text-dark mb-2">Ce mois-ci</h4>
            <p className="text-3xl font-display font-bold text-success">{formatFCFA(totalRevenus)}</p>
            <p className="text-sm text-muted mt-2">Revenus deja generes en Avril 2026</p>
          </div>
          
          <div className="bg-primary/10 rounded-3xl p-6 border border-primary/30">
            <h4 className="font-bold text-dark mb-2">Prochaine etape</h4>
            <p className="text-xl font-bold text-primary">
              Atteindre {formatFCFA(250000)} / mois
            </p>
            <p className="text-sm text-muted mt-2">
              Il manque {formatFCFA(250000 - totalRevenus)} pour atteindre l'objectif
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;