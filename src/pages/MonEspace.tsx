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
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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

const MonEspace: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({ annonces: 0, necrologies: 0, articles: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      await loadUserData(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const loadUserData = async (userId: string) => {
    try {
      // Récupérer le profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Récupérer les statistiques des publications
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
          {[
            { icon: BarChart3, label: 'Tableau de bord', active: true },
            { icon: ShoppingBag, label: 'Mes annonces', path: '/mon-espace/annonces' },
            { icon: Heart, label: 'Mes avis de décès', path: '/mon-espace/necrologies' },
            { icon: Newspaper, label: 'Mes articles', path: '/mon-espace/articles' },
            { icon: Settings, label: 'Paramètres', path: '/mon-espace/parametres' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path || '#'}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? 'bg-primary text-white shadow-md'
                  : 'text-dark hover:bg-background'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
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
                {['Tableau de bord', 'Mes annonces', 'Mes avis de décès', 'Mes articles', 'Paramètres'].map((item) => (
                  <Link key={item} to="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark hover:bg-background">
                    <BarChart3 className="w-5 h-5" />
                    {item}
                  </Link>
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
          {/* En-tête de bienvenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-display font-bold text-dark">
              Bonjour, <span className="text-primary">{displayName}</span> 👋
            </h1>
            <p className="text-muted mt-1">Bienvenue dans votre espace personnel.</p>
          </motion.div>

          {/* Cartes statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-dark">{stats.annonces}</p>
                  <p className="text-xs text-muted">Annonces</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-dark">{stats.necrologies}</p>
                  <p className="text-xs text-muted">Avis de décès</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Newspaper className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-dark">{stats.articles}</p>
                  <p className="text-xs text-muted">Articles boostés</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-dark">{totalPublications}</p>
                  <p className="text-xs text-muted">Total</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions rapides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-display font-bold text-dark mb-5">Que souhaitez-vous faire ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Link
                to="/publier/annonce/packs"
                className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group"
              >
                <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
                  <ShoppingBag className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">Publier une annonce</h3>
                <p className="text-muted text-sm mb-4">
                  Vendez un objet, proposez un service ou recrutez.
                </p>
                <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Commencer <ChevronRight className="w-4 h-4" />
                </span>
              </Link>

              <Link
                to="/publier/necrologie/packs"
                className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group"
              >
                <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">Avis de décès</h3>
                <p className="text-muted text-sm mb-4">
                  Annoncez un décès et les obsèques à la communauté.
                </p>
                <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Commencer <ChevronRight className="w-4 h-4" />
                </span>
              </Link>

              <Link
                to="/publier/article/packs"
                className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group"
              >
                <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
                  <Newspaper className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">Booster un article</h3>
                <p className="text-muted text-sm mb-4">
                  Donnez de la visibilité à votre actualité ou communiqué.
                </p>
                <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Commencer <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Message si aucune publication */}
          {totalPublications === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-background rounded-2xl border border-border text-center"
            >
              <Package className="w-12 h-12 text-muted mx-auto mb-3" />
              <p className="text-dark font-medium mb-1">Vous n'avez pas encore de publication</p>
              <p className="text-sm text-muted">
                Commencez dès maintenant en choisissant une action ci-dessus.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MonEspace;