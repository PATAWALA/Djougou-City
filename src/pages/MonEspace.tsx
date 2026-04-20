import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
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
  Lock,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatFCFA } from '../utils/formatPrice';

interface Profile {
  full_name: string | null;
  email: string;
  phone?: string;
}

interface Stats {
  annonces: number;
  necrologies: number;
  articles: number;
}

type TabType = 'dashboard' | 'annonces' | 'necrologies' | 'articles' | 'settings';

const MonEspace: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({ annonces: 0, necrologies: 0, articles: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Listes des publications
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [necrologies, setNecrologies] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  // État pour l'édition du profil
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
      await loadAllData(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const loadAllData = async (userId: string) => {
    try {
      // Profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);
      setEditProfile({
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        password: '',
        confirmPassword: '',
      });

      // Stats
      const [annoncesRes, necroRes, articlesRes] = await Promise.all([
        supabase.from('annonces').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('necrologies').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      ]);

      setStats({
        annonces: annoncesRes.count || 0,
        necrologies: necroRes.count || 0,
        articles: articlesRes.count || 0,
      });

      // Récupérer les publications
      const [annoncesData, necroData, articlesData] = await Promise.all([
        supabase.from('annonces').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('necrologies').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('articles').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ]);

      setAnnonces(annoncesData.data || []);
      setNecrologies(necroData.data || []);
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
    if (!profile) return;

    if (editProfile.password && editProfile.password !== editProfile.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    try {
      const updates: Partial<Profile> = {
        full_name: editProfile.full_name,
        phone: editProfile.phone,
      };
      await supabase.from('profiles').update(updates).eq('id', profile.id);
      if (editProfile.password) {
        await supabase.auth.updateUser({ password: editProfile.password });
      }
      setMessage({ type: 'success', text: 'Profil mis à jour' });
      setEditProfile(prev => ({ ...prev, password: '', confirmPassword: '' }));
      // Recharger le profil
      const { data } = await supabase.from('profiles').select('full_name, email, phone').eq('id', profile.id).single();
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
      } else if (table === 'necrologies') {
        setNecrologies(prev => prev.filter(n => n.id !== id));
        setStats(prev => ({ ...prev, necrologies: prev.necrologies - 1 }));
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

  const totalPublications = stats.annonces + stats.necrologies + stats.articles;

  const navItems = [
    { icon: BarChart3, label: 'Tableau de bord', tab: 'dashboard' as TabType },
    { icon: ShoppingBag, label: 'Mes annonces', tab: 'annonces' as TabType },
    { icon: Heart, label: 'Mes avis de décès', tab: 'necrologies' as TabType },
    { icon: Newspaper, label: 'Mes articles', tab: 'articles' as TabType },
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
          <p className="text-xs text-muted mt-1">Espace personnel</p>
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
      <AnimatePresence>
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          >
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
              <div className="bg-background rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{displayName}</p>
                    <p className="text-xs text-muted">{profile?.email}</p>
                  </div>
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
      </AnimatePresence>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Header mobile */}
        <header className="lg:hidden sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-background">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">D</div>
            <span className="font-display font-bold text-dark">DjougouCity</span>
          </Link>
          <div className="w-8"></div>
        </header>

        <div className="px-4 md:px-6 py-6 md:py-8">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}
              >
                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {message.text}
                <button onClick={() => setMessage(null)} className="ml-auto"><X className="w-4 h-4" /></button>
              </motion.div>
            )}

            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* TABLEAU DE BORD */}
              {activeTab === 'dashboard' && (
                <>
                  <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">
                      Bonjour, <span className="text-primary">{displayName}</span> 👋
                    </h1>
                    <p className="text-muted mt-1">Bienvenue dans votre espace personnel.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl"><ShoppingBag className="w-5 h-5 text-primary" /></div>
                        <div><p className="text-2xl font-display font-bold text-dark">{stats.annonces}</p><p className="text-xs text-muted">Annonces</p></div>
                      </div>
                    </div>
                    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl"><Heart className="w-5 h-5 text-primary" /></div>
                        <div><p className="text-2xl font-display font-bold text-dark">{stats.necrologies}</p><p className="text-xs text-muted">Avis de décès</p></div>
                      </div>
                    </div>
                    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl"><Newspaper className="w-5 h-5 text-primary" /></div>
                        <div><p className="text-2xl font-display font-bold text-dark">{stats.articles}</p><p className="text-xs text-muted">Articles boostés</p></div>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <Link to="/publier/annonce/packs" className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group">
                        <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4"><ShoppingBag className="w-7 h-7 text-primary" /></div>
                        <h3 className="text-lg font-bold text-dark mb-2">Publier une annonce</h3>
                        <p className="text-muted text-sm mb-4">Vendez un objet, proposez un service ou recrutez.</p>
                        <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2">Commencer <ChevronRight className="w-4 h-4" /></span>
                      </Link>
                      <Link to="/publier/necrologie/packs" className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group">
                        <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4"><Heart className="w-7 h-7 text-primary" /></div>
                        <h3 className="text-lg font-bold text-dark mb-2">Avis de décès</h3>
                        <p className="text-muted text-sm mb-4">Annoncez un décès et les obsèques à la communauté.</p>
                        <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2">Commencer <ChevronRight className="w-4 h-4" /></span>
                      </Link>
                      <Link to="/publier/article/packs" className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group">
                        <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4"><Newspaper className="w-7 h-7 text-primary" /></div>
                        <h3 className="text-lg font-bold text-dark mb-2">Booster un article</h3>
                        <p className="text-muted text-sm mb-4">Donnez de la visibilité à votre actualité ou communiqué.</p>
                        <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2">Commencer <ChevronRight className="w-4 h-4" /></span>
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {/* MES ANNONCES */}
              {activeTab === 'annonces' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-4">Mes annonces ({annonces.length})</h2>
                  {annonces.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border">
                      <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-3" />
                      <p className="text-dark font-medium">Vous n'avez pas encore d'annonce</p>
                      <Link to="/publier/annonce/packs" className="mt-4 inline-block text-primary font-semibold hover:underline">Publier une annonce</Link>
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

              {/* MES AVIS DE DÉCÈS */}
              {activeTab === 'necrologies' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-4">Mes avis de décès ({necrologies.length})</h2>
                  {necrologies.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border">
                      <Heart className="w-12 h-12 text-muted mx-auto mb-3" />
                      <p className="text-dark font-medium">Vous n'avez pas encore d'avis de décès</p>
                      <Link to="/publier/necrologie/packs" className="mt-4 inline-block text-primary font-semibold hover:underline">Publier un avis</Link>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-background/50">
                            <tr className="text-left text-xs font-semibold text-muted"><th className="px-6 py-3">Défunt</th><th className="px-6 py-3">Famille</th><th className="px-6 py-3">Enterrement</th><th className="px-6 py-3"></th></tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {necrologies.map((n) => (
                              <tr key={n.id}>
                                <td className="px-6 py-4 font-medium">{n.nom_defunt}</td>
                                <td className="px-6 py-4">{n.famille}</td>
                                <td className="px-6 py-4">{n.date_enterrement}</td>
                                <td className="px-6 py-4"><button onClick={() => handleDelete('necrologies', n.id)} className="text-primary hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MES ARTICLES */}
              {activeTab === 'articles' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-4">Mes articles boostés ({articles.length})</h2>
                  {articles.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border">
                      <Newspaper className="w-12 h-12 text-muted mx-auto mb-3" />
                      <p className="text-dark font-medium">Vous n'avez pas encore d'article boosté</p>
                      <Link to="/publier/article/packs" className="mt-4 inline-block text-primary font-semibold hover:underline">Booster un article</Link>
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