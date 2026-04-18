import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Heart,
  Newspaper,
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  UserPlus,
  BarChart3,
  PieChart,
  Download,
  Zap,
  ChevronRight,
  Target,
  Menu,
  X,
  Bell,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatFCFA, formatNombre } from '../utils/formatPrice';
import { FOLLOWERS } from '../utils/constants';

// Types
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted mb-1">{title}</p>
        <p className="text-2xl font-display font-bold text-dark">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trend.positive ? 'text-success' : 'text-primary'}`}>
            {trend.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}% vs mois dernier
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [stats] = React.useState({
    totalRevenus: 139500,
    utilisateurs: 47,
    annoncesActives: 12,
    articlesBoostes: 3,
    vuesTotales: 12453,
    evolution: {
      revenus: 12.5,
      utilisateurs: 8.2,
      annonces: -3.1,
      vues: 23.4,
    },
  });

  const revenusParMois = [
    { mois: 'Jan', montant: 85000 },
    { mois: 'Fév', montant: 92000 },
    { mois: 'Mar', montant: 108000 },
    { mois: 'Avr', montant: 139500 },
  ];

  const maxRevenu = Math.max(...revenusParMois.map((r) => r.montant));

  const transactions = [
    { id: 1, type: 'Sponsor', client: 'Restaurant La Terrasse', montant: 25000, date: '2026-04-15', statut: 'Complété' },
    { id: 2, type: 'Annonce Premium', client: 'Moto Bajaj', montant: 1000, date: '2026-04-14', statut: 'Complété' },
    { id: 3, type: 'Nécrologie', client: 'Famille Akotegnon', montant: 1000, date: '2026-04-13', statut: 'Complété' },
    { id: 4, type: 'Boost Article', client: 'Santé Djougou', montant: 3000, date: '2026-04-12', statut: 'En attente' },
    { id: 5, type: 'Abonnement Premium', client: 'Garage Spécialiste', montant: 500, date: '2026-04-10', statut: 'Complété' },
    { id: 6, type: 'Annonce Standard', client: 'Terrain Kilir', montant: 500, date: '2026-04-09', statut: 'Complété' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-border">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">D</div>
            <span className="text-xl font-display font-bold text-dark">DjougouCity</span>
          </Link>
          <p className="text-xs text-muted mt-1">Tableau de bord administrateur</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: 'Vue d\'ensemble', active: true },
            { icon: Users, label: 'Utilisateurs' },
            { icon: ShoppingBag, label: 'Annonces' },
            { icon: Newspaper, label: 'Actualités' },
            { icon: Heart, label: 'Nécrologie' },
            { icon: BarChart3, label: 'Statistiques' },
            { icon: Settings, label: 'Paramètres' },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? 'bg-primary text-white shadow-md'
                  : 'text-dark hover:bg-background'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-dark hover:bg-red-50 hover:text-primary transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1">
              <X className="w-6 h-6" />
            </button>
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">D</div>
                <span className="text-xl font-display font-bold text-dark">DjougouCity</span>
              </div>
            </div>
            <nav className="space-y-1">
              {['Vue d\'ensemble', 'Utilisateurs', 'Annonces', 'Actualités', 'Nécrologie', 'Statistiques', 'Paramètres'].map((item) => (
                <a key={item} href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark hover:bg-background">
                  <LayoutDashboard className="w-5 h-5" />
                  {item}
                </a>
              ))}
            </nav>
            <button onClick={handleLogout} className="mt-8 flex items-center gap-3 w-full px-4 py-3 rounded-xl text-primary hover:bg-red-50">
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </motion.aside>
        </div>
      )}

      {/* Contenu Principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-background">
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-64 pl-10 pr-4 py-2 rounded-full border border-border bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-background relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <button className="p-2 rounded-full hover:bg-background">
                <Download className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">A</div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-8">
          {/* En-tête de page */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-dark">Bonjour, Administrateur 👋</h1>
            <p className="text-muted mt-1">Voici les performances de DjougouCity pour aujourd'hui.</p>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard
              title="Revenu total"
              value={formatFCFA(stats.totalRevenus)}
              icon={DollarSign}
              trend={{ value: stats.evolution.revenus, positive: true }}
              color="bg-primary"
            />
            <StatCard
              title="Utilisateurs"
              value={stats.utilisateurs.toString()}
              icon={Users}
              trend={{ value: stats.evolution.utilisateurs, positive: true }}
              color="bg-blue-500"
            />
            <StatCard
              title="Annonces actives"
              value={stats.annoncesActives.toString()}
              icon={ShoppingBag}
              trend={{ value: Math.abs(stats.evolution.annonces), positive: false }}
              color="bg-orange-500"
            />
            <StatCard
              title="Vues totales"
              value={formatNombre(stats.vuesTotales)}
              icon={Eye}
              trend={{ value: stats.evolution.vues, positive: true }}
              color="bg-green-500"
            />
          </div>

          {/* Graphique revenus + actions rapides */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Graphique */}
            <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-dark flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Évolution des revenus
                </h3>
                <select className="text-sm border border-border rounded-full px-3 py-1.5 bg-background">
                  <option>Avril 2026</option>
                  <option>Mars 2026</option>
                  <option>Février 2026</option>
                </select>
              </div>
              <div className="flex items-end justify-between h-48">
                {revenusParMois.map((item) => (
                  <div key={item.mois} className="flex flex-col items-center gap-2 w-16">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.montant / maxRevenu) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="w-10 bg-primary rounded-t-lg"
                      style={{ minHeight: 20 }}
                    />
                    <span className="text-xs font-medium text-dark">{item.mois}</span>
                    <span className="text-xs text-muted">{formatFCFA(item.montant)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-background rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Total 2026</span>
                  <span className="font-bold text-success">{formatFCFA(424500)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted">Objectif annuel</span>
                  <span className="font-bold">{formatFCFA(1000000)}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                  <div className="w-[42%] h-full bg-primary rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                Actions rapides
              </h3>
              <div className="space-y-3">
                <Link
                  to="/publier"
                  className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20 hover:bg-primary/10 transition-all group"
                >
                  <div className="p-2 bg-primary rounded-full text-white">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark">Publier une annonce</p>
                    <p className="text-xs text-muted">Aidez un utilisateur</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/admin/utilisateurs"
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all group"
                >
                  <div className="p-2 bg-blue-500 rounded-full text-white">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark">Gérer les utilisateurs</p>
                    <p className="text-xs text-muted">Voir la liste</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/admin/transactions"
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-all group"
                >
                  <div className="p-2 bg-green-500 rounded-full text-white">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark">Transactions</p>
                    <p className="text-xs text-muted">Historique des paiements</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl">
                <p className="text-sm font-medium text-dark">💡 Astuce</p>
                <p className="text-xs text-muted mt-1">
                  Boostez une annonce pour augmenter sa visibilité de 300%
                </p>
              </div>
            </div>
          </div>

          {/* Transactions récentes */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-dark flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Dernières transactions
              </h3>
              <Link to="/admin/transactions" className="text-sm text-primary font-medium hover:underline">
                Voir tout
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background/50">
                  <tr className="text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Montant</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-background/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          t.type.includes('Sponsor') ? 'bg-blue-100 text-blue-700' :
                          t.type.includes('Annonce') ? 'bg-orange-100 text-orange-700' :
                          t.type.includes('Nécrologie') ? 'bg-purple-100 text-purple-700' :
                          t.type.includes('Boost') ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark">{t.client}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-success">{formatFCFA(t.montant)}</td>
                      <td className="px-6 py-4 text-sm text-muted">{new Date(t.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          t.statut === 'Complété' ? 'bg-success/10 text-success' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {t.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Potentiel et objectifs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gradient-to-br from-dark to-gray-900 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary" />
                Objectif mensuel
              </h3>
              <div className="text-3xl font-display font-bold text-secondary mb-1">{formatFCFA(250000)}</div>
              <p className="text-gray-400 text-sm mb-4">Progression : 56% (139 500 FCFA)</p>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '56%' }} className="h-full bg-secondary" />
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-bold text-dark mb-2">📊 Résumé d'activité</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Pages vues aujourd'hui</span>
                  <span className="font-semibold">342</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Nouveaux utilisateurs (7j)</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Taux de conversion</span>
                  <span className="font-semibold text-success">3.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;