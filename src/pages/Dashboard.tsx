import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Bus,
  AlertTriangle,
  Newspaper,
  Settings,
  LogOut,
  DollarSign,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap,
  ChevronRight,
  Menu,
  X,
  Bell,
  Trash2,
  User,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Shield,
  UserPlus,
  Power,
  Search,
  Clock,
  Activity,
  PieChart,
  Target,
  Download,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatFCFA, formatNombre } from '../utils/formatPrice';
import { annoncesData as staticAnnonces } from '../data/annonces';
import { actualitesData as staticActualites } from '../data/actualites';
import { alertesData as staticAlertes } from '../data/necrologies';
import type {
  Annonce,
  Actualite,
  Alerte,
  Profile,
  DashboardStats,
} from '../types';

// Types locaux
interface Admin {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface SiteSettings {
  id: number;
  maintenance_mode: boolean;
}

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
    className="bg-card rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-border hover:shadow-md transition-all"
  >
    <div className="flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] md:text-xs text-muted mb-0.5 truncate">{title}</p>
        <p className="text-base md:text-xl lg:text-2xl font-display font-bold text-dark truncate">{value}</p>
        {trend && (
          <p className={`text-[10px] md:text-xs mt-1 flex items-center gap-0.5 ${trend.positive ? 'text-success' : 'text-primary'}`}>
            {trend.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}% vs mois dernier
          </p>
        )}
      </div>
      <div className={`p-1.5 md:p-2.5 rounded-lg md:rounded-xl ${color} shrink-0`}>
        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </div>
    </div>
  </motion.div>
);

type TabType = 'overview' | 'users' | 'admins' | 'annonces' | 'actualites' | 'alertes' | 'settings';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [loginTime] = useState<Date>(new Date());
  const [timeElapsed, setTimeElapsed] = useState<string>('');

  useEffect(() => {
    const updateElapsed = () => {
      const now = new Date();
      const diffSeconds = Math.floor((now.getTime() - loginTime.getTime()) / 1000);
      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      setTimeElapsed(`${hours}h ${minutes < 10 ? '0' : ''}${minutes}m`);
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 60000);
    return () => clearInterval(interval);
  }, [loginTime]);

  const [stats] = useState<DashboardStats>({
    totalRevenus: 175000,
    utilisateurs: 52,
    annoncesActives: 28,
    articlesBoostes: 5,
    vuesTotales: 18900,
    evolution: {
      revenus: 15.2,
      utilisateurs: 10.5,
      annonces: 5.8,
      vues: 22.1,
    },
  });

  const [users, setUsers] = useState<Profile[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [annonces, setAnnonces] = useState<Annonce[]>(staticAnnonces);
  const [actualites, setActualites] = useState<Actualite[]>(staticActualites);
  const [alertes, setAlertes] = useState<Alerte[]>(staticAlertes);
  const [adminProfile, setAdminProfile] = useState<Profile | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceConfirmText, setMaintenanceConfirmText] = useState('');

  const [editProfile, setEditProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const revenusParMois = [
    { mois: 'Jan', montant: 95000 },
    { mois: 'Fév', montant: 112000 },
    { mois: 'Mar', montant: 138000 },
    { mois: 'Avr', montant: 175000 },
  ];
  const maxRevenu = Math.max(...revenusParMois.map((r) => r.montant));

  const repartitionCategories = [
    { name: 'Départs bus', value: 45 },
    { name: 'Fret / Chargement', value: 25 },
    { name: 'Vente véhicules', value: 15 },
    { name: 'Emploi transport', value: 10 },
    { name: 'Location', value: 5 },
  ];
  const COLORS = ['#C0392B', '#F39C12', '#1E8449', '#3b82f6', '#8b5cf6'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        setCurrentAdminId(session.user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          setAdminProfile(profile as Profile);
          setEditProfile({
            full_name: profile.full_name || '',
            email: profile.email || session.user.email,
            phone: profile.phone || '',
            password: '',
            confirmPassword: '',
          });
        }

        const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (usersData) setUsers(usersData as Profile[]);

        const { data: adminsData } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
        if (adminsData) setAdmins(adminsData as Admin[]);

        const { data: annoncesData } = await supabase
          .from('annonces')
          .select('*')
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });
        if (annoncesData && annoncesData.length > 0) setAnnonces(annoncesData as Annonce[]);

        const { data: actualitesData } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
        if (actualitesData && actualitesData.length > 0) setActualites(actualitesData as Actualite[]);

        const { data: alertesData } = await supabase
          .from('alertes')
          .select('*')
          .order('created_at', { ascending: false });
        if (alertesData && alertesData.length > 0) setAlertes(alertesData as Alerte[]);

        const { data: settingsData } = await supabase.from('site_settings').select('*').maybeSingle();
        if (settingsData) {
          setSiteSettings(settingsData as SiteSettings);
        } else {
          const { data: newSettings } = await supabase
            .from('site_settings')
            .insert({ maintenance_mode: false })
            .select()
            .single();
          if (newSettings) setSiteSettings(newSettings as SiteSettings);
        }
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!adminProfile) return;

    if (editProfile.password && editProfile.password !== editProfile.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }
    try {
      const updates: Partial<Profile> = { full_name: editProfile.full_name, phone: editProfile.phone };
      await supabase.from('profiles').update(updates).eq('id', adminProfile.id);
      if (editProfile.password) {
        await supabase.auth.updateUser({ password: editProfile.password });
      }
      setMessage({ type: 'success', text: 'Profil mis à jour' });
      setEditProfile((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password,
        options: { data: { full_name: newAdmin.name, phone: newAdmin.phone } },
      });
      if (authError) throw authError;

      if (authData.user) {
        await supabase.from('admins').insert({
          id: authData.user.id,
          email: newAdmin.email,
          name: newAdmin.name,
        });
        setMessage({ type: 'success', text: 'Administrateur ajouté avec succès' });
        setNewAdmin({ name: '', email: '', phone: '', password: '' });
        const { data } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
        if (data) setAdmins(data as Admin[]);
      }
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({ type: 'error', text: err.message });
    }
  };

  const confirmDeleteAdmin = (admin: Admin) => {
    if (admin.id === currentAdminId) {
      setMessage({ type: 'error', text: 'Vous ne pouvez pas supprimer votre propre compte administrateur.' });
      return;
    }
    setAdminToDelete(admin);
    setDeleteConfirmText('');
    setShowDeleteAdminModal(true);
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    const expectedText = `OUI SUPPRIMER L'ADMIN ${adminToDelete.name}`;
    if (deleteConfirmText !== expectedText) {
      setMessage({ type: 'error', text: 'La phrase de confirmation est incorrecte.' });
      return;
    }
    try {
      await supabase.from('admins').delete().eq('id', adminToDelete.id);
      setMessage({ type: 'success', text: 'Administrateur supprimé' });
      setAdmins((prev) => prev.filter((a) => a.id !== adminToDelete.id));
      setShowDeleteAdminModal(false);
      setAdminToDelete(null);
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({ type: 'error', text: err.message });
    }
  };

  const toggleMaintenanceMode = async (enable: boolean) => {
    if (!siteSettings) return;
    try {
      await supabase.from('site_settings').update({ maintenance_mode: enable }).eq('id', siteSettings.id);
      setSiteSettings({ ...siteSettings, maintenance_mode: enable });
      setMessage({ type: 'success', text: enable ? 'Site mis en maintenance' : 'Site réactivé' });
    } catch (error: unknown) {
      const err = error as Error;
      setMessage({ type: 'error', text: err.message });
    }
    setShowMaintenanceModal(false);
    setMaintenanceConfirmText('');
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Vue d'ensemble", tab: 'overview' as TabType },
    { icon: Users, label: 'Utilisateurs', tab: 'users' as TabType },
    { icon: Shield, label: 'Administrateurs', tab: 'admins' as TabType },
    { icon: Bus, label: 'Départs / Annonces', tab: 'annonces' as TabType },
    { icon: Newspaper, label: 'Promos / Actus', tab: 'actualites' as TabType },
    { icon: AlertTriangle, label: 'Alertes trafic', tab: 'alertes' as TabType },
    { icon: Settings, label: 'Paramètres', tab: 'settings' as TabType },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-border">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">CI</div>
            <span className="text-xl font-display font-bold text-dark">CITransports</span>
          </Link>
          <p className="text-xs text-muted mt-1">Tableau de bord administrateur</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.tab ? 'bg-primary text-white shadow-md' : 'text-dark hover:bg-background'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-dark hover:bg-red-50 hover:text-primary">
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1"><X className="w-6 h-6" /></button>
            <div className="mb-8"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">CI</div><span className="text-xl font-display font-bold text-dark">CITransports</span></div></div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button key={item.label} onClick={() => { setActiveTab(item.tab); setSidebarOpen(false); }} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium ${activeTab === item.tab ? 'bg-primary text-white' : 'text-dark hover:bg-background'}`}>
                  <item.icon className="w-5 h-5" /> {item.label}
                </button>
              ))}
            </nav>
            <button onClick={handleLogout} className="mt-8 flex items-center gap-3 w-full px-4 py-3 rounded-xl text-primary hover:bg-red-50"><LogOut className="w-5 h-5" /> Déconnexion</button>
          </motion.aside>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-4 flex-1">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-background"><Menu className="w-5 h-5 md:w-6 md:h-6" /></button>
              <h2 className="text-base md:text-lg font-semibold text-dark truncate hidden sm:block">{navItems.find(i => i.tab === activeTab)?.label}</h2>
              <div className="relative flex-1 max-w-xs hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-1.5 rounded-full border border-border bg-background text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button className="p-2 rounded-full hover:bg-background relative"><Bell className="w-5 h-5" /><span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span></button>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="relative group">
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm md:text-base border-2 border-primary/20">
                    {adminProfile?.full_name?.charAt(0) || 'A'}
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">{adminProfile?.full_name?.charAt(0) || 'A'}</div>
                      <div>
                        <p className="font-semibold text-dark">{adminProfile?.full_name || 'Administrateur'}</p>
                        <p className="text-xs text-muted">{adminProfile?.email}</p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-2 mt-2 text-xs text-muted space-y-1">
                      <p className="flex items-center gap-2"><Clock className="w-3 h-3" />Connecté depuis : {loginTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="flex items-center gap-2"><Activity className="w-3 h-3" />Durée : {timeElapsed}</p>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium hidden sm:inline">{adminProfile?.full_name?.split(' ')[0] || 'Admin'}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-background text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
            </div>
          </div>
        </header>

        <div className="px-4 md:px-6 py-6 md:py-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
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
                    <div className="mb-6 md:mb-8">
                      <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">Bonjour, {adminProfile?.full_name || 'Administrateur'} 👋</h1>
                      <p className="text-muted text-sm mt-1">Voici les performances de CITransports.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
                      <StatCard title="Revenu total" value={formatFCFA(stats.totalRevenus)} icon={DollarSign} trend={{ value: stats.evolution.revenus, positive: true }} color="bg-primary" />
                      <StatCard title="Utilisateurs" value={users.length.toString()} icon={Users} trend={{ value: stats.evolution.utilisateurs, positive: true }} color="bg-blue-500" />
                      <StatCard title="Départs actifs" value={annonces.length.toString()} icon={Bus} trend={{ value: stats.evolution.annonces, positive: true }} color="bg-orange-500" />
                      <StatCard title="Vues totales" value={formatNombre(stats.vuesTotales)} icon={Eye} trend={{ value: stats.evolution.vues, positive: true }} color="bg-green-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 mb-8">
                      <div className="lg:col-span-2 bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base md:text-lg font-bold text-dark flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Évolution des revenus</h3>
                          <select className="text-xs md:text-sm border border-border rounded-full px-3 py-1.5 bg-background"><option>Avril 2026</option></select>
                        </div>
                        <div className="flex items-end justify-between h-40 md:h-48">
                          {revenusParMois.map((item) => (
                            <div key={item.mois} className="flex flex-col items-center gap-1 md:gap-2 w-12 md:w-16">
                              <motion.div initial={{ height: 0 }} animate={{ height: `${(item.montant / maxRevenu) * 100}%` }} className="w-8 md:w-10 bg-primary rounded-t-lg" style={{ minHeight: 16 }} />
                              <span className="text-xs font-medium text-dark">{item.mois}</span>
                              <span className="text-xs text-muted">{formatFCFA(item.montant)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                        <h3 className="text-base md:text-lg font-bold text-dark mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-secondary" /> Actions rapides</h3>
                        <div className="space-y-2 md:space-y-3">
                          <Link to="/publier" className="flex items-center gap-3 p-3 md:p-4 bg-primary/5 rounded-xl border border-primary/20 hover:bg-primary/10 transition-all group">
                            <div className="p-2 bg-primary rounded-full text-white"><Plus className="w-4 h-4" /></div>
                            <div className="flex-1"><p className="font-semibold text-dark text-sm">Publier un départ</p></div>
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                          <button className="w-full flex items-center gap-3 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all group">
                            <div className="p-2 bg-blue-500 rounded-full text-white"><Download className="w-4 h-4" /></div>
                            <div className="flex-1 text-left"><p className="font-semibold text-dark text-sm">Exporter les données</p></div>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 mb-8">
                      <div className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                        <h3 className="text-base md:text-lg font-bold text-dark mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-primary" /> Répartition des annonces</h3>
                        <div className="space-y-3">
                          {repartitionCategories.map((cat, idx) => (
                            <div key={cat.name}>
                              <div className="flex justify-between text-sm mb-1"><span>{cat.name}</span><span className="font-medium">{cat.value}%</span></div>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${cat.value}%` }} className={`h-full rounded-full`} style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-dark to-gray-900 text-white rounded-2xl p-4 md:p-6 shadow-sm">
                        <h3 className="text-base md:text-lg font-bold mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-secondary" /> Objectif mensuel</h3>
                        <div className="text-2xl md:text-3xl font-display font-bold text-secondary mb-2">{formatFCFA(500000)}</div>
                        <p className="text-gray-400 text-xs md:text-sm mb-4">Progression : 35% (175 000 FCFA)</p>
                        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '35%' }} className="h-full bg-secondary" /></div>
                      </div>
                      <div className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm">
                        <h3 className="text-base md:text-lg font-bold text-dark mb-3 flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Activité récente</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center"><span className="text-sm text-muted">Nouveaux départs (24h)</span><span className="font-semibold">12</span></div>
                          <div className="flex justify-between items-center"><span className="text-sm text-muted">Nouveaux utilisateurs</span><span className="font-semibold">5</span></div>
                          <div className="flex justify-between items-center"><span className="text-sm text-muted">Alertes trafic actives</span><span className="font-semibold">{alertes.filter(a => a.estActive).length}</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
                        <h3 className="text-base md:text-lg font-bold text-dark flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Dernières transactions</h3>
                        <button className="text-sm text-primary font-medium hover:underline">Voir tout</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-background/50">
                            <tr className="text-left text-xs font-semibold text-muted"><th className="px-4 md:px-6 py-3">Type</th><th className="px-4 md:px-6 py-3">Client</th><th className="px-4 md:px-6 py-3">Montant</th><th className="px-4 md:px-6 py-3">Date</th><th className="px-4 md:px-6 py-3">Statut</th></tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {[{ type: 'Sponsor', client: 'TOTAL Energies', montant: 15000, date: '2026-04-20', statut: 'Complété' },{ type: 'Départ Premium', client: 'CITransports', montant: 5000, date: '2026-04-19', statut: 'Complété' },{ type: 'Boost promo', client: 'Garage du Plateau', montant: 3000, date: '2026-04-18', statut: 'En attente' }].map((t, i) => (
                              <tr key={i}><td className="px-4 md:px-6 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type.includes('Sponsor') ? 'bg-blue-100 text-blue-700' : t.type.includes('Départ') ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>{t.type}</span></td><td className="px-4 md:px-6 py-3 text-sm text-dark">{t.client}</td><td className="px-4 md:px-6 py-3 text-sm font-semibold text-success">{formatFCFA(t.montant)}</td><td className="px-4 md:px-6 py-3 text-sm text-muted">{new Date(t.date).toLocaleDateString('fr-FR')}</td><td className="px-4 md:px-6 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${t.statut === 'Complété' ? 'bg-success/10 text-success' : 'bg-yellow-100 text-yellow-700'}`}>{t.statut}</span></td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* UTILISATEURS (inchangé) */}
                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-4">Utilisateurs ({users.length})</h2>
                    <div className="bg-card rounded-2xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-background/50"><tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Nom</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Téléphone</th><th className="px-6 py-3">Inscrit le</th></tr></thead>
                          <tbody className="divide-y divide-border">
                            {users.filter(u => !admins.some(a => a.id === u.id)).map((user) => (
                              <tr key={user.id}><td className="px-6 py-4">{user.full_name || '-'}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4">{user.phone || '-'}</td><td className="px-6 py-4 text-sm text-muted">{new Date(user.created_at).toLocaleDateString()}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ADMINISTRATEURS (inchangé) */}
                {activeTab === 'admins' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-dark mb-4">Administrateurs ({admins.length})</h2>
                      <div className="bg-card rounded-2xl border overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[600px]">
                            <thead className="bg-background/50"><tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Nom</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Ajouté le</th><th className="px-6 py-3"></th></tr></thead>
                            <tbody className="divide-y divide-border">
                              {admins.map((admin) => (
                                <tr key={admin.id}><td className="px-6 py-4">{admin.name}</td><td className="px-6 py-4">{admin.email}</td><td className="px-6 py-4 text-sm text-muted">{new Date(admin.created_at).toLocaleDateString()}</td><td className="px-6 py-4"><button onClick={() => confirmDeleteAdmin(admin)} className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="bg-card rounded-2xl p-6 border">
                      <h3 className="text-lg font-bold mb-4">Ajouter un administrateur</h3>
                      <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nom complet" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} className="px-4 py-2 rounded-xl border bg-background" required />
                        <input type="email" placeholder="Email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} className="px-4 py-2 rounded-xl border bg-background" required />
                        <input type="tel" placeholder="Téléphone" value={newAdmin.phone} onChange={e => setNewAdmin({...newAdmin, phone: e.target.value})} className="px-4 py-2 rounded-xl border bg-background" />
                        <input type="password" placeholder="Mot de passe" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} className="px-4 py-2 rounded-xl border bg-background" required minLength={6} />
                        <button type="submit" className="md:col-span-2 bg-primary text-white py-3 rounded-full font-bold flex items-center justify-center gap-2"><UserPlus className="w-4 h-4" /> Ajouter l'administrateur</button>
                      </form>
                    </div>
                  </div>
                )}

                {/* ANNONCES (Départs / Annonces) */}
                {activeTab === 'annonces' && (
                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-4">Départs & Annonces ({annonces.length})</h2>
                    <div className="bg-card rounded-2xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                          <thead className="bg-background/50">
                            <tr className="text-left text-xs font-semibold text-muted">
                              <th className="px-6 py-3">Titre</th>
                              <th className="px-6 py-3">Catégorie</th>
                              <th className="px-6 py-3">Destination</th>
                              <th className="px-6 py-3">Prix</th>
                              <th className="px-6 py-3">Contact</th>
                              <th className="px-6 py-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {annonces.map((a) => (
                              <tr key={a.id}>
                                <td className="px-6 py-4">{a.titre}</td>
                                <td className="px-6 py-4">{a.categorie}</td>
                                <td className="px-6 py-4">{a.localisation}</td>
                                <td className="px-6 py-4">{a.prix ? formatFCFA(a.prix) : 'Gratuit'}</td>
                                <td className="px-6 py-4">{a.contact}</td>
                                <td className="px-6 py-4"><button className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ACTUALITÉS (Promos / Actus) */}
                {activeTab === 'actualites' && (
                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-4">Promos & Actus ({actualites.length})</h2>
                    <div className="bg-card rounded-2xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-background/50"><tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Titre</th><th className="px-6 py-3">Auteur</th><th className="px-6 py-3">Date</th><th className="px-6 py-3"></th></tr></thead>
                          <tbody className="divide-y divide-border">
                            {actualites.map((a) => (
                              <tr key={a.id}><td className="px-6 py-4">{a.titre}</td><td className="px-6 py-4">{a.auteur}</td><td className="px-6 py-4">{new Date(a.datePublication).toLocaleDateString()}</td><td className="px-6 py-4"><button className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ALERTES TRAFIC */}
                {activeTab === 'alertes' && (
                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-4">Alertes trafic ({alertes.length})</h2>
                    <div className="bg-card rounded-2xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                          <thead className="bg-background/50">
                            <tr className="text-left text-xs font-semibold text-muted">
                              <th className="px-6 py-3">Titre</th>
                              <th className="px-6 py-3">Type</th>
                              <th className="px-6 py-3">Niveau</th>
                              <th className="px-6 py-3">Localisation</th>
                              <th className="px-6 py-3">Active</th>
                              <th className="px-6 py-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {alertes.map((a) => (
                              <tr key={a.id}>
                                <td className="px-6 py-4">{a.titre}</td>
                                <td className="px-6 py-4">{a.type}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    a.niveau === 'rouge' ? 'bg-red-100 text-red-700' :
                                    a.niveau === 'orange' ? 'bg-orange-100 text-orange-700' :
                                    a.niveau === 'jaune' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                  }`}>{a.niveau}</span>
                                </td>
                                <td className="px-6 py-4">{a.localisation}</td>
                                <td className="px-6 py-4">{a.estActive ? '✅ Oui' : '❌ Non'}</td>
                                <td className="px-6 py-4"><button className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* PARAMÈTRES (inchangé) */}
                {activeTab === 'settings' && (
                  <div className="space-y-8 max-w-2xl">
                    <div>
                      <h2 className="text-2xl font-bold text-dark mb-6">Paramètres du compte</h2>
                      <form onSubmit={handleUpdateProfile} className="bg-card rounded-2xl p-6 border space-y-4">
                        <div><label className="block text-sm font-medium mb-1"><User className="inline w-4 h-4 mr-1" />Nom complet</label><input type="text" value={editProfile.full_name} onChange={e => setEditProfile({...editProfile, full_name: e.target.value})} className="w-full px-4 py-2 rounded-xl border bg-background" /></div>
                        <div><label className="block text-sm font-medium mb-1"><Mail className="inline w-4 h-4 mr-1" />Email</label><input type="email" value={editProfile.email} disabled className="w-full px-4 py-2 rounded-xl border bg-gray-100 text-muted" /></div>
                        <div><label className="block text-sm font-medium mb-1"><Phone className="inline w-4 h-4 mr-1" />Téléphone</label><input type="tel" value={editProfile.phone} onChange={e => setEditProfile({...editProfile, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border bg-background" /></div>
                        <div className="border-t pt-4">
                          <p className="font-medium mb-2">Changer le mot de passe (optionnel)</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="password" placeholder="Nouveau mot de passe" value={editProfile.password} onChange={e => setEditProfile({...editProfile, password: e.target.value})} className="px-4 py-2 rounded-xl border bg-background" minLength={6} />
                            <input type="password" placeholder="Confirmer" value={editProfile.confirmPassword} onChange={e => setEditProfile({...editProfile, confirmPassword: e.target.value})} className="px-4 py-2 rounded-xl border bg-background" minLength={6} />
                          </div>
                        </div>
                        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-full font-bold">Enregistrer</button>
                      </form>
                    </div>
                    <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div><h3 className="text-lg font-semibold text-red-700 flex items-center gap-2"><Power size={20} className="text-red-600" /> Mode maintenance</h3><p className="text-sm text-red-600 mt-1">Activez cette option pour afficher une page de maintenance aux visiteurs. Seuls les administrateurs pourront se connecter.</p></div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${siteSettings?.maintenance_mode ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{siteSettings?.maintenance_mode ? 'Site en maintenance' : 'Site actif'}</span>
                          {!siteSettings?.maintenance_mode ? (
                            <button onClick={() => setShowMaintenanceModal(true)} className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition shadow-sm flex items-center gap-2 text-sm"><Power size={16} /> Activer la maintenance</button>
                          ) : (
                            <button onClick={() => toggleMaintenanceMode(false)} className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition shadow-sm text-sm">Réactiver le site</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* MODALS (inchangées) */}
      {showDeleteAdminModal && adminToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-xl border border-border">
            <div className="flex items-center gap-3 text-primary mb-4"><AlertTriangle size={24} /><h3 className="text-xl font-bold text-dark">Confirmation de suppression</h3></div>
            <p className="text-muted mb-4">Vous allez supprimer l'administrateur <strong>{adminToDelete.name}</strong> ({adminToDelete.email}). Cette action est irréversible.</p>
            <p className="text-sm text-dark mb-2">Tapez exactement la phrase ci-dessous pour confirmer :</p>
            <div className="bg-background p-3 rounded-lg font-mono text-sm mb-4 border border-border">OUI SUPPRIMER L'ADMIN {adminToDelete.name}</div>
            <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-border bg-background mb-4" placeholder="OUI SUPPRIMER L'ADMIN ..." />
            <div className="flex justify-end gap-3"><button onClick={() => setShowDeleteAdminModal(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-background">Annuler</button><button onClick={handleDeleteAdmin} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-dark">Confirmer</button></div>
          </div>
        </div>
      )}

      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-xl border border-border">
            <div className="flex items-center gap-3 text-red-600 mb-4"><AlertTriangle size={24} /><h3 className="text-xl font-bold text-dark">Activer le mode maintenance</h3></div>
            <p className="text-muted mb-4">Le site sera inaccessible aux visiteurs. Seuls les administrateurs pourront se connecter.</p>
            <p className="text-sm text-dark mb-2">Tapez <strong className="font-mono bg-background px-2 py-1 rounded">ACTIVER MAINTENANCE</strong> pour confirmer :</p>
            <input type="text" value={maintenanceConfirmText} onChange={(e) => setMaintenanceConfirmText(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-border bg-background mb-4" placeholder="ACTIVER MAINTENANCE" />
            <div className="flex justify-end gap-3"><button onClick={() => setShowMaintenanceModal(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-background">Annuler</button><button onClick={() => { if (maintenanceConfirmText === 'ACTIVER MAINTENANCE') toggleMaintenanceMode(true); else setMessage({ type: 'error', text: 'La phrase saisie est incorrecte.' }); }} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-dark">Activer</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;