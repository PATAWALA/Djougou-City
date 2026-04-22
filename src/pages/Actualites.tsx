import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  TrendingUp,
  Search,
  Calendar,
  User,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  ArrowRight,
  Zap,
  Award,
  Filter,
  X,
  Bus,
  Package,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { supabase } from '../lib/supabase';
import { actualitesData as staticActualites } from '../data/actualites';
import { PRICES, FOLLOWERS } from '../utils/constants';
import { formatFCFA, formatDate, formatNombre } from '../utils/formatPrice';
import type { Actualite } from '../types';

type CategorieId = 'toutes' | 'promos' | 'nouveautes' | 'conseils' | 'reglementation' | 'evenements';

const Actualites: React.FC = () => {
  const [selectedCategorie, setSelectedCategorie] = useState<CategorieId>('toutes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [actualites, setActualites] = useState<Actualite[]>(staticActualites);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'toutes', label: 'Toutes les offres' },
    { id: 'promos', label: 'Promos' },
    { id: 'nouveautes', label: 'Nouveautés' },
    { id: 'conseils', label: 'Conseils' },
    { id: 'reglementation', label: 'Réglementation' },
    { id: 'evenements', label: 'Événements' },
  ] as const;

  // Image de fond pour le hero – photo d'un bus en Côte d'Ivoire (libre de droits)
  const heroBackgroundImage = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&fit=crop&q=80';

  useEffect(() => {
    const fetchActualites = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) setActualites(data as Actualite[]);
      } catch (error) {
        console.error('Erreur lors du chargement des actualités:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActualites();
  }, []);

  // Simulation de catégorie basée sur le contenu (pour les données existantes)
  const getArticleCategorie = (article: Actualite): string => {
    const texte = (article.titre + ' ' + article.contenu).toLowerCase();
    if (texte.includes('promo') || texte.includes('réduction') || texte.includes('offre')) return 'promos';
    if (texte.includes('nouveau') || texte.includes('lancement') || texte.includes('ligne')) return 'nouveautes';
    if (texte.includes('conseil') || texte.includes('astuce') || texte.includes('guide')) return 'conseils';
    if (texte.includes('réglementation') || texte.includes('loi') || texte.includes('permis')) return 'reglementation';
    if (texte.includes('événement') || texte.includes('salon') || texte.includes('fête')) return 'evenements';
    return 'promos';
  };

  const filteredArticles = useMemo(() => {
    return actualites.filter((article) => {
      if (selectedCategorie !== 'toutes') {
        if (getArticleCategorie(article) !== selectedCategorie) return false;
      }
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        return (
          article.titre.toLowerCase().includes(term) ||
          article.contenu.toLowerCase().includes(term) ||
          article.auteur.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [actualites, selectedCategorie, searchTerm]);

  const boostedArticles = filteredArticles.filter((a) => a.estBoosted);
  const regularArticles = filteredArticles.filter((a) => !a.estBoosted);

  return (
    <MainLayout>
      {/* Hero avec image de fond */}
      <section
        className="relative bg-cover bg-center text-white py-20 md:py-28"
        style={{ backgroundImage: `url('${heroBackgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-secondary" />
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold">
                {actualites.length} offres et actualités ce mois
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Promos & Actus Transport
            </h1>
            <p className="text-xl text-white/90 mb-6 max-w-2xl">
              Promotions sur les billets, nouvelles lignes, conseils pratiques et actualités réglementaires
              pour les professionnels de la route en Côte d'Ivoire.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/publier/article/packs"
                className="bg-secondary text-dark px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-lg"
              >
                <Zap className="w-5 h-5" />
                Booster une offre
                <span className="bg-dark/10 px-3 py-1 rounded-full text-sm">
                  {formatFCFA(PRICES.BOOST_ARTICLE)}
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Barre de recherche et filtres */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Rechercher une offre, une actualité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2 rounded-full border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategorie(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategorie === cat.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-background text-dark hover:bg-border'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 rounded-full border border-border bg-background text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="p-2 rounded-full bg-background border border-border"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-border"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategorie(cat.id);
                        setShowMobileFilters(false);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs ${
                        selectedCategorie === cat.id ? 'bg-primary text-white' : 'bg-background'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted">Chargement des offres...</p>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Package className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">Aucune offre trouvée</h3>
            <p className="text-muted">Essayez de modifier vos critères de recherche.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategorie('toutes');
              }}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        ) : (
          <>
            {/* Article boosté vedette */}
            {boostedArticles.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 bg-secondary/20 rounded-full">
                    <Award className="w-4 h-4 text-secondary" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-dark">Offre à la une</h2>
                  <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-xs font-medium">
                    Boostée
                  </span>
                </div>

                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-3xl shadow-lg overflow-hidden border-2 border-secondary"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative h-64 lg:h-full">
                      <img
                        src={boostedArticles[0].image || 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&fit=crop'}
                        alt={boostedArticles[0].titre}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-secondary text-dark px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Boost • {formatFCFA(boostedArticles[0].montantBoost || 0)}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-sm text-muted mb-3">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" /> {boostedArticles[0].auteur}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {formatDate(boostedArticles[0].datePublication)}
                        </span>
                      </div>

                      <h3 className="text-2xl font-display font-bold text-dark mb-3">
                        {boostedArticles[0].titre}
                      </h3>

                      <p className="text-muted leading-relaxed mb-5">{boostedArticles[0].contenu}</p>

                      <div className="flex items-center gap-5 mb-5">
                        <button className="flex items-center gap-1.5 text-muted hover:text-primary transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{formatNombre(boostedArticles[0].likes)}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-muted hover:text-primary transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{formatNombre(boostedArticles[0].commentaires)}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-muted hover:text-primary transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">{formatNombre(boostedArticles[0].partages)}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-muted hover:text-primary transition-colors ml-auto">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>

                      <Link
                        to={`/actualites/${boostedArticles[0].id}`}
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                      >
                        Voir l'offre <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              </section>
            )}

            {/* Autres articles boostés */}
            {boostedArticles.length > 1 && (
              <section className="mb-12">
                <h3 className="text-lg font-bold text-dark mb-4">Offres également boostées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {boostedArticles.slice(1).map((article) => (
                    <motion.article
                      key={article.id}
                      whileHover={{ y: -4 }}
                      className="bg-card rounded-2xl shadow-md overflow-hidden border border-secondary/30 hover:shadow-lg transition-all"
                    >
                      <div className="relative h-44">
                        <img src={article.image || 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&fit=crop'} alt={article.titre} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-secondary text-dark px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Boost
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-xs text-muted mb-2">
                          <span>{article.auteur}</span>
                          <span>•</span>
                          <span>{formatDate(article.datePublication)}</span>
                        </div>
                        <h4 className="font-bold text-dark mb-2 line-clamp-2">{article.titre}</h4>
                        <p className="text-muted text-xs mb-3 line-clamp-2">{article.contenu}</p>
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {formatNombre(article.likes)}</span>
                          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {formatNombre(article.commentaires)}</span>
                          <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {formatNombre(article.partages)}</span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            {/* Liste standard */}
            <section>
              <h2 className="text-xl font-display font-bold text-dark mb-5">
                {selectedCategorie === 'toutes' ? 'Toutes les actualités' : categories.find((c) => c.id === selectedCategorie)?.label}
                <span className="text-muted text-base font-normal ml-2">({regularArticles.length})</span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-5">
                  <AnimatePresence mode="popLayout">
                    {regularArticles.map((article) => (
                      <motion.article
                        key={article.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ y: -3 }}
                        className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 p-5">
                          {article.image && (
                            <img
                              src={article.image}
                              alt={article.titre}
                              className="w-full sm:w-40 h-28 object-cover rounded-xl"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-xs text-muted mb-2">
                              <span>{article.auteur}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {formatDate(article.datePublication)}
                              </span>
                            </div>
                            <h4 className="font-bold text-dark mb-1.5">{article.titre}</h4>
                            <p className="text-muted text-sm mb-3 line-clamp-2">{article.contenu}</p>
                            <div className="flex items-center gap-4 text-xs text-muted">
                              <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {formatNombre(article.likes)}</span>
                              <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {formatNombre(article.commentaires)}</span>
                              <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {formatNombre(article.partages)}</span>
                              <Link
                                to={`/actualites/${article.id}`}
                                className="ml-auto text-primary font-medium text-xs hover:underline"
                              >
                                Lire →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                  {/* CTA Boost */}
                  <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-5 text-white">
                    <Zap className="w-7 h-7 mb-3" />
                    <h4 className="text-lg font-bold mb-1">Boostez votre offre</h4>
                    <p className="text-white/80 text-sm mb-3">
                      Touchez +{formatNombre(FOLLOWERS)} voyageurs et transporteurs.
                    </p>
                    <p className="text-2xl font-bold mb-3">{formatFCFA(PRICES.BOOST_ARTICLE)}</p>
                    <Link
                      to="/publier/article/packs"
                      className="block w-full bg-white text-primary text-center py-2.5 rounded-full font-semibold text-sm hover:shadow-md transition-all"
                    >
                      Booster maintenant
                    </Link>
                  </div>

                  {/* Articles populaires */}
                  <div className="bg-card rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-dark mb-3 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Les plus consultées
                    </h4>
                    <div className="space-y-3">
                      {filteredArticles
                        .sort((a, b) => b.likes - a.likes)
                        .slice(0, 3)
                        .map((article, idx) => (
                          <div key={article.id} className="flex items-start gap-2">
                            <span className="text-xl font-bold text-muted/40">0{idx + 1}</span>
                            <div>
                              <p className="font-medium text-dark text-sm line-clamp-2">{article.titre}</p>
                              <p className="text-xs text-muted mt-0.5">{formatNombre(article.likes)} likes</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Visibilité */}
                  <div className="bg-success/5 rounded-2xl p-5 border border-success/20">
                    <p className="text-sm text-dark font-medium mb-1">Boostez votre visibilité</p>
                    <p className="text-xs text-muted mb-2">
                      Une offre boostée génère en moyenne 3 fois plus de contacts.
                    </p>
                    <p className="text-lg font-bold text-success">Jusqu'à 300% d'appels</p>
                    <p className="text-xs text-muted mt-1">par rapport à une annonce classique</p>
                  </div>

                  {/* Dernières lignes */}
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
                    <h4 className="font-bold text-dark mb-2 flex items-center gap-1">
                      <Bus className="w-4 h-4 text-blue-600" />
                      Dernières lignes
                    </h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Daloa → San Pedro (nouveau)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Abidjan → Korhogo promo vacances
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Bouaké → Man direct
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Actualites;