import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package,CheckCircle, Eye, ShoppingBag, Heart, Newspaper, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MainLayout from '../layouts/MainLayout';
import { formatFCFA, formatDate } from '../utils/formatPrice';

const MonEspace: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [necrologies, setNecrologies] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      fetchPublications(session.user.id);
    };
    checkUser();
  }, [navigate]);

  const fetchPublications = async (userId: string) => {
    try {
      const [annoncesRes, necroRes, articlesRes] = await Promise.all([
        supabase.from('annonces').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('necrologies').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('articles').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ]);
      setAnnonces(annoncesRes.data || []);
      setNecrologies(necroRes.data || []);
      setArticles(articlesRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const StatCard = ({ title, count, icon: Icon, color }: any) => (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-dark">{count}</p>
          <p className="text-sm text-muted">{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <MainLayout><div className="text-center py-20">Chargement...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-dark">Mon Espace</h1>
            <p className="text-muted">Bienvenue, {user?.phone}</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/publier"
              className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-dark transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nouvelle publication
            </a>
            <button
              onClick={handleLogout}
              className="bg-gray-100 text-dark px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Annonces" count={annonces.length} icon={ShoppingBag} color="bg-orange-500" />
          <StatCard title="Avis de décès" count={necrologies.length} icon={Heart} color="bg-purple-500" />
          <StatCard title="Articles boostés" count={articles.length} icon={Newspaper} color="bg-green-500" />
          <StatCard title="Total publications" count={annonces.length + necrologies.length + articles.length} icon={Package} color="bg-primary" />
        </div>

        {/* Liste des publications */}
        <div className="space-y-8">
          {/* Annonces */}
          {annonces.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" /> Mes Petites Annonces
              </h2>
              <div className="space-y-3">
                {annonces.map((annonce) => (
                  <div key={annonce.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {annonce.images?.[0] && (
                        <img src={annonce.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      )}
                      <div>
                        <h3 className="font-semibold text-dark">{annonce.titre}</h3>
                        <p className="text-sm text-muted">{annonce.prix ? formatFCFA(annonce.prix) : 'Gratuit'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${annonce.est_premium ? 'bg-secondary/20 text-secondary' : 'bg-gray-100'}`}>
                            {annonce.est_premium ? 'Premium' : 'Standard'}
                          </span>
                          <span className="text-xs text-muted flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {annonce.vues || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">Expire le {formatDate(annonce.expires_at)}</p>
                      <span className="text-success text-sm flex items-center gap-1 justify-end">
                        <CheckCircle className="w-4 h-4" /> Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Avis de décès */}
          {necrologies.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" /> Mes Avis de Décès
              </h2>
              <div className="space-y-3">
                {necrologies.map((item) => (
                  <div key={item.id} className="bg-card rounded-xl p-4 border border-border">
                    <h3 className="font-semibold text-dark">{item.nom_defunt}</h3>
                    <p className="text-sm text-muted">Famille {item.famille}</p>
                    <p className="text-xs text-muted mt-1">Expire le {formatDate(item.expires_at)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Articles */}
          {articles.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary" /> Mes Articles Boostés
              </h2>
              <div className="space-y-3">
                {articles.map((item) => (
                  <div key={item.id} className="bg-card rounded-xl p-4 border border-border">
                    <h3 className="font-semibold text-dark">{item.titre}</h3>
                    <p className="text-sm text-muted line-clamp-2">{item.contenu}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                      <span>Boost: {formatFCFA(item.montant_boost)}</span>
                      <span>Expire: {formatDate(item.expires_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {annonces.length === 0 && necrologies.length === 0 && articles.length === 0 && (
            <div className="text-center py-16 bg-background rounded-3xl">
              <Package className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">Aucune publication</h3>
              <p className="text-muted mb-6">Commencez par publier votre première annonce</p>
              <a href="/publier" className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-dark transition-colors inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /> Publier maintenant
              </a>
            </div>
          )}
        </div>

        {/* Acheter un pack supplémentaire */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-display font-bold text-dark mb-2">Besoin de plus de visibilité ?</h3>
          <p className="text-muted mb-6">Achetez un pack supplémentaire pour booster vos publications existantes.</p>
          <a href="/packs" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-dark transition-colors inline-flex items-center gap-2">
            <Package className="w-5 h-5" /> Voir les packs disponibles
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default MonEspace;