import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Newspaper,
  Package,
  LogOut,
  ChevronRight,
  BarChart3,
  Menu,
  X,
  Settings,
  User,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  AlertCircle,
  Bus,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatFCFA } from '../utils/formatPrice';

interface Profile {
  full_name: string | null;
  email: string;
  phone?: string;
}

interface Stats {
  annonces: number;    // Départs / Annonces transport
  alertes: number;     // Alertes trafic signalées
  articles: number;    // Promos / Articles boostés
}

type TabType = 'dashboard' | 'annonces' | 'alertes' | 'articles' | 'settings';

const MonEspace: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({ annonces: 0, alertes: 0, articles: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [annonces, setAnnonces] = useState<any[]>([]);
  const [alertes, setAlertes] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  const [editProfile, setEditProfile] = useState({
    full_name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUserId(session.user.id);
      await loadAllData(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const loadAllData = async (uid: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', uid)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);
      setEditProfile({
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        password: '',
        confirmPassword: '',
      });

      const [annoncesRes, alertesRes, articlesRes] = await Promise.all([
        supabase.from('annonces').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('alertes').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('user_id', uid),
      ]);

      setStats({
        annonces: annoncesRes.count || 0,
        alertes: alertesRes.count || 0,
        articles: articlesRes.count || 0,
      });

      const [annoncesData, alertesData, articlesData] = await Promise.all([
        supabase.from('annonces').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
        supabase.from('alertes').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
        supabase.from('articles').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      ]);

      setAnnonces(annoncesData.data || []);
      setAlertes(alertesData.data || []);
      setArticles(articlesData.data || []);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!userId) return;

    if (editProfile.password && editProfile.password !== editProfile.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    try {
      const updates: Partial<Profile> = {
        full_name: editProfile.full_name,
        phone: editProfile.phone,
      };
      await supabase.from('profiles').update(updates).eq('id', userId);
      if (editProfile.password) {
        await supabase.auth.updateUser({ password: editProfile.password });
      }
      setMessage({ type: 'success', text: 'Profil mis à jour' });
      setEditProfile(prev => ({ ...prev, password: '', confirmPassword: '' }));
      const { data } = await supabase.from('profiles').select('full_name, email, phone').eq('id', userId).single();
      if (data) setProfile(data);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Confirmer la suppression ?')) return;
    try {
      await supabase.from(table).delete().eq('id', id);
      if (table === 'annonces') {
        setAnnonces(prev => prev.filter(a => a.id !== id));
        setStats(prev => ({ ...prev, annonces: prev.annonces - 1 }));
      } else if (table === 'articles') {
        setArticles(prev => prev.filter(a => a.id !== id));
        setStats(prev => ({ ...prev, articles: prev.articles - 1 }));
      } else if (table === 'alertes') {
        setAlertes(prev => prev.filter(a => a.id !== id));
        setStats(prev => ({ ...prev, alertes: prev.alertes - 1 }));
      }
      setMessage({ type: 'success', text: 'Élément supprimé' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'Utilisateur';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  const totalPublications = stats.annonces + stats.alertes + stats.articles;

  const navItems = [
    { icon: BarChart3, label: 'Tableau de bord', tab: 'dashboard' as TabType },
    { icon: Bus, label: 'Mes départs / annonces', tab: 'annonces' as TabType },
    { icon: AlertTriangle, label: 'Mes alertes trafic', tab: 'alertes' as TabType },
    { icon: Newspaper, label: 'Mes promos boostées', tab: 'articles' as TabType },
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
          <p className="text-xs text-muted mt-1">Espace transporteur</p>
        </div>

        <div className="px-4 py-2">
          <div className="bg-background rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dark truncate">{displayName}</p>
                <p className="text-xs text-muted truncate">{profile?.email}</p>
              </div>
            </div>
          </div>
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
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-dark hover:bg-red-50 hover:text-primary">
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (identique mais avec le logo CI) */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border p-6" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1"><X className="w-6 h-6" /></button>
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">CI</div>
                  <span className="text-xl font-display font-bold text-dark">CITransports</span>
                </div>
              </div>
              <div className="bg-background rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">{displayName.charAt(0).toUpperCase()}</div>
                  <div><p className="font-semibold text-dark">{displayName}</p><p className="text-xs text-muted">{profile?.email}</p></div>
                </div>
              </div>
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
      </AnimatePresence>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto">
        <header className="lg:hidden sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-background"><Menu className="w-6 h-6" /></button>
          <Link to="/" className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">CI</div><span className="font-display font-bold text-dark">CITransports</span></Link>
          <div className="w-8"></div>
        </header>

        <div className="px-4 md:px-6 py-6 md:py-8">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {message.text}
                <button onClick={() => setMessage(null)} className="ml-auto"><X className="w-4 h-4" /></button>
              </motion.div>
            )}

            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {activeTab === 'dashboard' && (
                <>
                  <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">
                      Bonjour, <span className="text-primary">{displayName}</span> 👋
                    </h1>
                    <p className="text-muted mt-1">Bienvenue dans votre espace transporteur.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl"><Bus className="w-5 h-5 text-primary" /></div>
                        <div><p className="text-2xl font-display font-bold text-dark">{stats.annonces}</p><p className="text-xs text-muted">Départs / Annonces</p></div>
                      </div>
                    </div>
                    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl"><AlertTriangle className="w-5 h-5 text-primary" /></div>
                        <div><p className="text-2xl font-display font-bold text-dark">{stats.alertes}</p><p className="text-xs text-muted">Alertes trafic</p></div>
                      </div>
                    </div>
                    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl"><Newspaper className="w-5 h-5 text-primary" /></div>
                        <div><p className="text-2xl font-display font-bold text-dark">{stats.articles}</p><p className="text-xs text-muted">Promos boostées</p></div>
                      </div>
                    </div>
                    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl"><Package className="w-5 h-5 text-primary" /></div>
                        <div><p className="text-2xl font-display font-bold text-dark">{totalPublications}</p><p className="text-xs text-muted">Total</p></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-display font-bold text-dark mb-5">Que souhaitez-vous faire ?</h2>
{/* Dans la section "Que souhaitez-vous faire ?" */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  {/* Publier une annonce transport (départ, fret, vente...) */}
  <Link to="/publier/annonce/packs?type=depart" className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group">
    <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4"><Bus className="w-7 h-7 text-primary" /></div>
    <h3 className="text-lg font-bold text-dark mb-2">Publier une annonce</h3>
    <p className="text-muted text-sm mb-4">Départ, fret, vente de véhicule, emploi...</p>
    <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2">Commencer <ChevronRight className="w-4 h-4" /></span>
  </Link>

  {/* Signaler une alerte */}
  <Link to="/publier/alerte/packs" className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group">
    <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4"><AlertTriangle className="w-7 h-7 text-primary" /></div>
    <h3 className="text-lg font-bold text-dark mb-2">Signaler une alerte</h3>
    <p className="text-muted text-sm mb-4">Partagez une info trafic.</p>
    <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2">Commencer <ChevronRight className="w-4 h-4" /></span>
  </Link>

  {/* Booster une promo */}
  <Link to="/publier/article/packs" className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group">
    <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4"><Newspaper className="w-7 h-7 text-primary" /></div>
    <h3 className="text-lg font-bold text-dark mb-2">Booster une promo</h3>
    <p className="text-muted text-sm mb-4">Donnez de la visibilité à votre offre.</p>
    <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2">Commencer <ChevronRight className="w-4 h-4" /></span>
  </Link>
</div>
                  </div>
                </>
              )}

              {/* MES ANNONCES */}
              {activeTab === 'annonces' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-4">Mes départs / annonces ({annonces.length})</h2>
                  {annonces.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border">
                      <Bus className="w-12 h-12 text-muted mx-auto mb-3" />
                      <p className="text-dark font-medium">Vous n'avez pas encore d'annonce</p>
                      <Link to="/publier/annonce/packs" className="mt-4 inline-block text-primary font-semibold hover:underline">Publier un départ</Link>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                          <thead className="bg-background/50">
                            <tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Titre</th><th className="px-6 py-3">Catégorie</th><th className="px-6 py-3">Prix</th><th className="px-6 py-3">Vues</th><th className="px-6 py-3"></th></tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {annonces.map((a) => (
                              <tr key={a.id}>
                                <td className="px-6 py-4 font-medium">{a.titre}</td>
                                <td className="px-6 py-4">{a.categorie}</td>
                                <td className="px-6 py-4">{a.prix ? formatFCFA(a.prix) : '-'}</td>
                                <td className="px-6 py-4">{a.vues || 0}</td>
                                <td className="px-6 py-4"><button onClick={() => handleDelete('annonces', a.id)} className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MES ALERTES TRAFIC */}
              {activeTab === 'alertes' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-4">Mes alertes trafic ({alertes.length})</h2>
                  {alertes.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border">
                      <AlertTriangle className="w-12 h-12 text-muted mx-auto mb-3" />
                      <p className="text-dark font-medium">Vous n'avez pas encore signalé d'alerte</p>
                      <Link to="/publier/alerte" className="mt-4 inline-block text-primary font-semibold hover:underline">Signaler une alerte</Link>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-background/50">
                            <tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Titre</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Localisation</th><th className="px-6 py-3">Active</th><th className="px-6 py-3"></th></tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {alertes.map((a) => (
                              <tr key={a.id}>
                                <td className="px-6 py-4 font-medium">{a.titre}</td>
                                <td className="px-6 py-4">{a.type}</td>
                                <td className="px-6 py-4">{a.localisation}</td>
                                <td className="px-6 py-4">{a.estActive ? '✅ Oui' : '❌ Non'}</td>
                                <td className="px-6 py-4"><button onClick={() => handleDelete('alertes', a.id)} className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MES PROMOS BOOSTÉES */}
              {activeTab === 'articles' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-4">Mes promos boostées ({articles.length})</h2>
                  {articles.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border">
                      <Newspaper className="w-12 h-12 text-muted mx-auto mb-3" />
                      <p className="text-dark font-medium">Vous n'avez pas encore boosté de promo</p>
                      <Link to="/publier/article/packs" className="mt-4 inline-block text-primary font-semibold hover:underline">Booster une promo</Link>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-background/50">
                            <tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Titre</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Likes</th><th className="px-6 py-3"></th></tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {articles.map((a) => (
                              <tr key={a.id}>
                                <td className="px-6 py-4 font-medium">{a.titre}</td>
                                <td className="px-6 py-4">{new Date(a.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{a.likes || 0}</td>
                                <td className="px-6 py-4"><button onClick={() => handleDelete('articles', a.id)} className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PARAMÈTRES */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold text-dark mb-6">Paramètres du compte</h2>
                  <form onSubmit={handleUpdateProfile} className="bg-card rounded-2xl p-6 border space-y-4">
                    <div><label className="block text-sm font-medium mb-1"><User className="inline w-4 h-4 mr-1" />Nom complet</label><input type="text" value={editProfile.full_name} onChange={e => setEditProfile({...editProfile, full_name: e.target.value})} className="w-full px-4 py-2 rounded-xl border bg-background" /></div>
                    <div><label className="block text-sm font-medium mb-1"><Mail className="inline w-4 h-4 mr-1" />Email</label><input type="email" value={profile?.email} disabled className="w-full px-4 py-2 rounded-xl border bg-gray-100 text-muted" /></div>
                    <div><label className="block text-sm font-medium mb-1"><Phone className="inline w-4 h-4 mr-1" />Téléphone</label><input type="tel" value={editProfile.phone} onChange={e => setEditProfile({...editProfile, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border bg-background" /></div>
                    <div className="border-t pt-4">
                      <p className="font-medium mb-2">Changer le mot de passe (optionnel)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="password" placeholder="Nouveau mot de passe" value={editProfile.password} onChange={e => setEditProfile({...editProfile, password: e.target.value})} className="px-4 py-2 rounded-xl border bg-background" minLength={6} />
                        <input type="password" placeholder="Confirmer" value={editProfile.confirmPassword} onChange={e => setEditProfile({...editProfile, confirmPassword: e.target.value})} className="px-4 py-2 rounded-xl border bg-background" minLength={6} />
                      </div>
                    </div>
                    <button type="submit" className="bg-primary text-white px-6 py-3 rounded-full font-bold">Enregistrer les modifications</button>
                  </form>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default MonEspace;