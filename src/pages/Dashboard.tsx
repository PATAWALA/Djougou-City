import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Heart,
  Trash2,
  BarChart3,
  Newspaper,
  Settings,
  LogOut,
  DollarSign,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Zap,
  ChevronRight,
  Menu,
  X,
  Bell,
  User,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatFCFA, formatNombre } from '../utils/formatPrice';
import { annoncesData as staticAnnonces } from '../data/annonces';
import { actualitesData as staticActualites } from '../data/actualites';
import { necrologiesData as staticNecrologies } from '../data/necrologies';
import type { Annonce, Actualite, Necrologie } from '../types';

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

// Types pour les onglets
type TabType = 'overview' | 'users' | 'annonces' | 'actualites' | 'necrologies' | 'settings';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
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

  // Données dynamiques
  const [users, setUsers] = useState<any[]>([]);
  const [annonces, setAnnonces] = useState<Annonce[]>(staticAnnonces);
  const [actualites, setActualites] = useState<Actualite[]>(staticActualites);
  const [necrologies, setNecrologies] = useState<Necrologie[]>(staticNecrologies);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // État du formulaire d'édition du profil admin
  const [editProfile, setEditProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // État pour ajouter un admin
  const [newAdmin, setNewAdmin] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin',
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

  // Chargement initial
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Vérifier session et rôle admin
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = '/auth';
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profile || profile.role !== 'admin') {
          window.location.href = '/';
          return;
        }
        setAdminProfile(profile);
        setEditProfile({
          full_name: profile.full_name || '',
          email: profile.email || session.user.email,
          phone: profile.phone || '',
          password: '',
          confirmPassword: '',
        });

        // Récupération des statistiques
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: annoncesCount } = await supabase.from('annonces').select('*', { count: 'exact', head: true }).gt('expires_at', new Date().toISOString());
        const { count: articlesCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
        setStats(prev => ({
          ...prev,
          utilisateurs: usersCount || 47,
          annoncesActives: annoncesCount || 12,
          articlesBoostes: articlesCount || 3,
        }));

        // Récupération des listes
        const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (usersData) setUsers(usersData);

        const { data: annoncesData } = await supabase.from('annonces').select('*').order('created_at', { ascending: false });
        if (annoncesData && annoncesData.length > 0) setAnnonces(annoncesData);

        const { data: actualitesData } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
        if (actualitesData && actualitesData.length > 0) setActualites(actualitesData);

        const { data: necrologiesData } = await supabase.from('necrologies').select('*').order('created_at', { ascending: false });
        if (necrologiesData && necrologiesData.length > 0) setNecrologies(necrologiesData);

      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Mise à jour du profil admin
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (editProfile.password && editProfile.password !== editProfile.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }
    try {
      const updates: any = {
        full_name: editProfile.full_name,
        phone: editProfile.phone,
      };
      await supabase.from('profiles').update(updates).eq('id', adminProfile.id);

      if (editProfile.password) {
        await supabase.auth.updateUser({ password: editProfile.password });
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      setEditProfile(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  // Ajouter un administrateur
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      // 1. Créer l'utilisateur dans auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password,
        options: { data: { full_name: newAdmin.full_name, phone: newAdmin.phone } },
      });
      if (authError) throw authError;

      if (authData.user) {
        // 2. Mettre à jour le rôle dans profiles
        await supabase.from('profiles').update({ role: 'admin' }).eq('id', authData.user.id);
        setMessage({ type: 'success', text: 'Administrateur ajouté avec succès' });
        setNewAdmin({ full_name: '', email: '', phone: '', password: '', role: 'admin' });
        // Recharger la liste des utilisateurs
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (data) setUsers(data);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  // Supprimer un élément (annonce, actualité, nécrologie)
  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Confirmer la suppression ?')) return;
    try {
      await supabase.from(table).delete().eq('id', id);
      // Mettre à jour l'état local
      if (table === 'annonces') setAnnonces(prev => prev.filter(a => a.id !== id));
      if (table === 'articles') setActualites(prev => prev.filter(a => a.id !== id));
      if (table === 'necrologies') setNecrologies(prev => prev.filter(n => n.id !== id));
      setMessage({ type: 'success', text: 'Élément supprimé' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  // Navigation sidebar
  const navItems = [
    { icon: LayoutDashboard, label: 'Vue d\'ensemble', tab: 'overview' as TabType },
    { icon: Users, label: 'Utilisateurs', tab: 'users' as TabType },
    { icon: ShoppingBag, label: 'Annonces', tab: 'annonces' as TabType },
    { icon: Newspaper, label: 'Actualités', tab: 'actualites' as TabType },
    { icon: Heart, label: 'Nécrologie', tab: 'necrologies' as TabType },
    { icon: Settings, label: 'Paramètres', tab: 'settings' as TabType },
  ];

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
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.tab
                  ? 'bg-primary text-white shadow-md'
                  : 'text-dark hover:bg-background'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
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

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1"><X className="w-6 h-6" /></button>
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">D</div>
                <span className="text-xl font-display font-bold text-dark">DjougouCity</span>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setActiveTab(item.tab); setSidebarOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium ${activeTab === item.tab ? 'bg-primary text-white' : 'text-dark hover:bg-background'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
            <button onClick={handleLogout} className="mt-8 flex items-center gap-3 w-full px-4 py-3 rounded-xl text-primary hover:bg-red-50">
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </motion.aside>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-background"><Menu className="w-6 h-6" /></button>
              <h2 className="text-lg font-semibold text-dark">{navItems.find(i => i.tab === activeTab)?.label}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-background relative"><Bell className="w-5 h-5" /><span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span></button>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">A</div>
                <span className="text-sm font-medium">{adminProfile?.full_name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-8">
          <AnimatePresence mode="wait">
            {loading && activeTab === 'overview' ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted">Chargement du tableau de bord...</p>
                </div>
              </div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Message de feedback */}
                {message && (
                  <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                    <button onClick={() => setMessage(null)} className="ml-auto"><X className="w-4 h-4" /></button>
                  </div>
                )}

                {/* VUE D'ENSEMBLE */}
                {activeTab === 'overview' && (
                  <>
                    <div className="mb-8">
                      <h1 className="text-3xl font-display font-bold text-dark">Bonjour, {adminProfile?.full_name || 'Administrateur'} 👋</h1>
                      <p className="text-muted mt-1">Voici les performances de DjougouCity.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                      <StatCard title="Revenu total" value={formatFCFA(stats.totalRevenus)} icon={DollarSign} trend={{ value: stats.evolution.revenus, positive: true }} color="bg-primary" />
                      <StatCard title="Utilisateurs" value={stats.utilisateurs.toString()} icon={Users} trend={{ value: stats.evolution.utilisateurs, positive: true }} color="bg-blue-500" />
                      <StatCard title="Annonces actives" value={stats.annoncesActives.toString()} icon={ShoppingBag} trend={{ value: Math.abs(stats.evolution.annonces), positive: false }} color="bg-orange-500" />
                      <StatCard title="Vues totales" value={formatNombre(stats.vuesTotales)} icon={Eye} trend={{ value: stats.evolution.vues, positive: true }} color="bg-green-500" />
                    </div>

                    {/* Graphique + Actions rapides */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                      <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-bold text-dark flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />Évolution des revenus</h3>
                          <select className="text-sm border border-border rounded-full px-3 py-1.5 bg-background"><option>Avril 2026</option></select>
                        </div>
                        <div className="flex items-end justify-between h-48">
                          {revenusParMois.map((item) => (
                            <div key={item.mois} className="flex flex-col items-center gap-2 w-16">
                              <motion.div initial={{ height: 0 }} animate={{ height: `${(item.montant / maxRevenu) * 100}%` }} className="w-10 bg-primary rounded-t-lg" style={{ minHeight: 20 }} />
                              <span className="text-xs font-medium text-dark">{item.mois}</span>
                              <span className="text-xs text-muted">{formatFCFA(item.montant)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 p-4 bg-background rounded-xl">
                          <div className="flex justify-between"><span>Total 2026</span><span className="font-bold text-success">{formatFCFA(424500)}</span></div>
                          <div className="flex justify-between mt-2"><span>Objectif annuel</span><span>{formatFCFA(1000000)}</span></div>
                          <div className="w-full h-2 bg-gray-200 rounded-full mt-3"><div className="w-[42%] h-full bg-primary rounded-full"></div></div>
                        </div>
                      </div>

                      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                        <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-secondary" />Actions rapides</h3>
                        <div className="space-y-3">
                          <Link to="/publier" className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20 hover:bg-primary/10 transition-all group">
                            <div className="p-2 bg-primary rounded-full text-white"><Plus className="w-4 h-4" /></div>
                            <div className="flex-1"><p className="font-semibold text-dark">Publier une annonce</p><p className="text-xs text-muted">Aidez un utilisateur</p></div>
                            <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Transactions récentes */}
                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="text-lg font-bold text-dark flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />Dernières transactions</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-background/50"><tr className="text-left text-xs font-semibold text-muted uppercase tracking-wider"><th className="px-6 py-3">Type</th><th className="px-6 py-3">Client</th><th className="px-6 py-3">Montant</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Statut</th></tr></thead>
                          <tbody className="divide-y divide-border">
                            {transactions.map((t) => (
                              <tr key={t.id} className="hover:bg-background/30">
                                <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.type.includes('Sponsor') ? 'bg-blue-100 text-blue-700' : t.type.includes('Annonce') ? 'bg-orange-100 text-orange-700' : t.type.includes('Nécrologie') ? 'bg-purple-100 text-purple-700' : t.type.includes('Boost') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{t.type}</span></td>
                                <td className="px-6 py-4 text-sm text-dark">{t.client}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-success">{formatFCFA(t.montant)}</td>
                                <td className="px-6 py-4 text-sm text-muted">{new Date(t.date).toLocaleDateString('fr-FR')}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${t.statut === 'Complété' ? 'bg-success/10 text-success' : 'bg-yellow-100 text-yellow-700'}`}>{t.statut}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* GESTION DES UTILISATEURS */}
                {activeTab === 'users' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-dark mb-4">Liste des utilisateurs</h2>
                      <div className="bg-card rounded-2xl border border-border overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-background/50"><tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Nom</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Téléphone</th><th className="px-6 py-3">Rôle</th><th className="px-6 py-3">Inscrit le</th></tr></thead>
                          <tbody className="divide-y divide-border">
                            {users.map((user) => (
                              <tr key={user.id} className="hover:bg-background/30">
                                <td className="px-6 py-4">{user.full_name || '-'}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.phone || '-'}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700'}`}>{user.role}</span></td>
                                <td className="px-6 py-4 text-sm text-muted">{new Date(user.created_at).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl p-6 border border-border">
                      <h3 className="text-lg font-bold text-dark mb-4">Ajouter un administrateur</h3>
                      <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nom complet" value={newAdmin.full_name} onChange={e => setNewAdmin({...newAdmin, full_name: e.target.value})} className="px-4 py-2 rounded-xl border border-border bg-background" required />
                        <input type="email" placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} className="px-4 py-2 rounded-xl border border-border bg-background" required />
                        <input type="tel" placeholder="Téléphone" value={newAdmin.phone} onChange={e => setNewAdmin({...newAdmin, phone: e.target.value})} className="px-4 py-2 rounded-xl border border-border bg-background" />
                        <input type="password" placeholder="Mot de passe" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} className="px-4 py-2 rounded-xl border border-border bg-background" required minLength={6} />
                        <button type="submit" className="md:col-span-2 bg-primary text-white py-3 rounded-full font-bold hover:bg-dark transition">Ajouter l'administrateur</button>
                      </form>
                    </div>
                  </div>
                )}

                {/* GESTION DES ANNONCES */}
                {activeTab === 'annonces' && (
                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-4">Annonces ({annonces.length})</h2>
                    <div className="bg-card rounded-2xl border border-border overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-background/50"><tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Titre</th><th className="px-6 py-3">Catégorie</th><th className="px-6 py-3">Prix</th><th className="px-6 py-3">Contact</th><th className="px-6 py-3">Actions</th></tr></thead>
                        <tbody className="divide-y divide-border">
                          {annonces.map((a) => (
                            <tr key={a.id} className="hover:bg-background/30">
                              <td className="px-6 py-4 font-medium">{a.titre}</td>
                              <td className="px-6 py-4">{a.categorie}</td>
                              <td className="px-6 py-4">{a.prix ? formatFCFA(a.prix) : '-'}</td>
                              <td className="px-6 py-4">{a.contact}</td>
                              <td className="px-6 py-4"><button onClick={() => handleDelete('annonces', a.id)} className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* GESTION DES ACTUALITÉS */}
                {activeTab === 'actualites' && (
                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-4">Actualités ({actualites.length})</h2>
                    <div className="bg-card rounded-2xl border border-border overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-background/50"><tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Titre</th><th className="px-6 py-3">Auteur</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Actions</th></tr></thead>
                        <tbody className="divide-y divide-border">
                          {actualites.map((a) => (
                            <tr key={a.id} className="hover:bg-background/30">
                              <td className="px-6 py-4 font-medium">{a.titre}</td>
                              <td className="px-6 py-4">{a.auteur}</td>
                              <td className="px-6 py-4">{new Date(a.datePublication).toLocaleDateString()}</td>
                              <td className="px-6 py-4"><button onClick={() => handleDelete('articles', a.id)} className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* GESTION DES NÉCROLOGIES */}
                {activeTab === 'necrologies' && (
                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-4">Avis de décès ({necrologies.length})</h2>
                    <div className="bg-card rounded-2xl border border-border overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-background/50"><tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Défunt</th><th className="px-6 py-3">Famille</th><th className="px-6 py-3">Enterrement</th><th className="px-6 py-3">Actions</th></tr></thead>
                        <tbody className="divide-y divide-border">
                          {necrologies.map((n) => (
                            <tr key={n.id} className="hover:bg-background/30">
                              <td className="px-6 py-4 font-medium">{n.nomDefunt}</td>
                              <td className="px-6 py-4">{n.famille}</td>
                              <td className="px-6 py-4">{n.dateEnterrement}</td>
                              <td className="px-6 py-4"><button onClick={() => handleDelete('necrologies', n.id)} className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* PARAMÈTRES */}
                {activeTab === 'settings' && (
                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold text-dark mb-6">Paramètres du compte administrateur</h2>
                    <form onSubmit={handleUpdateProfile} className="bg-card rounded-2xl p-6 border border-border space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1"><User className="inline w-4 h-4 mr-1" />Nom complet</label>
                        <input type="text" value={editProfile.full_name} onChange={e => setEditProfile({...editProfile, full_name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-background" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1"><Mail className="inline w-4 h-4 mr-1" />Email</label>
                        <input type="email" value={editProfile.email} disabled className="w-full px-4 py-2 rounded-xl border border-border bg-gray-100 text-muted" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1"><Phone className="inline w-4 h-4 mr-1" />Téléphone</label>
                        <input type="tel" value={editProfile.phone} onChange={e => setEditProfile({...editProfile, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-border bg-background" />
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="font-medium text-dark mb-2">Changer le mot de passe (optionnel)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="password" placeholder="Nouveau mot de passe" value={editProfile.password} onChange={e => setEditProfile({...editProfile, password: e.target.value})} className="px-4 py-2 rounded-xl border border-border bg-background" minLength={6} />
                          <input type="password" placeholder="Confirmer" value={editProfile.confirmPassword} onChange={e => setEditProfile({...editProfile, confirmPassword: e.target.value})} className="px-4 py-2 rounded-xl border border-border bg-background" minLength={6} />
                        </div>
                      </div>
                      <button type="submit" className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-dark transition">Enregistrer les modifications</button>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;