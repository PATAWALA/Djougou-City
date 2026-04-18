import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  Newspaper,
  Plus,
  Package,
  Eye,
  Clock,
  User,
  LogOut,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { supabase } from '../lib/supabase';
import { formatFCFA } from '../utils/formatPrice';

interface Profile {
  full_name: string;
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Chargement de votre espace...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalPublications = stats.annonces + stats.necrologies + stats.articles;

  return (
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* En-tête avec message de bienvenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-dark">
                Bienvenue, <span className="text-primary">{profile?.full_name || 'Utilisateur'}</span> 👋
              </h1>
              <p className="text-muted mt-1 flex items-center gap-2">
                <User className="w-4 h-4" />
                {profile?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-primary hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
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
                <p className="text-xs text-muted">Annonces publiées</p>
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
                <p className="text-xs text-muted">Total publications</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section : Que souhaitez-vous faire ? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-display font-bold text-dark mb-5 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Que souhaitez-vous faire aujourd'hui ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Publier une annonce */}
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

            {/* Publier un avis de décès */}
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

            {/* Booster un article */}
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
  );
};

export default MonEspace;