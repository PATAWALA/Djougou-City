import React, { useState, useMemo } from 'react';
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
  Eye,
  ArrowRight,
  Zap,
  Award,
  Filter,
  X,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { actualitesData } from '../data/actualites';
import { PRICES, FOLLOWERS } from '../utils/constants';
import { formatFCFA, formatDate, formatNombre } from '../utils/formatPrice';

type CategorieId = 'toutes' | 'politique' | 'sante' | 'economie' | 'societe' | 'culture';

const Actualites: React.FC = () => {
  const [selectedCategorie, setSelectedCategorie] = useState<CategorieId>('toutes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = [
    { id: 'toutes', label: 'Toutes' },
    { id: 'politique', label: 'Politique' },
    { id: 'sante', label: 'Santé' },
    { id: 'economie', label: 'Économie' },
    { id: 'societe', label: 'Société' },
    { id: 'culture', label: 'Culture' },
  ] as const;

  // Simulation de catégorie basée sur le titre
  const getArticleCategorie = (article: typeof actualitesData[0]): string => {
    const titre = article.titre.toLowerCase();
    if (titre.includes('santé') || titre.includes('hopital')) return 'sante';
    if (titre.includes('élection') || titre.includes('politique')) return 'politique';
    if (titre.includes('marché') || titre.includes('économie')) return 'economie';
    if (titre.includes('culture')) return 'culture';
    return 'societe';
  };

  const filteredArticles = useMemo(() => {
    return actualitesData.filter((article) => {
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
  }, [selectedCategorie, searchTerm]);

  const boostedArticles = filteredArticles.filter((a) => a.estBoosted);
  const regularArticles = filteredArticles.filter((a) => !a.estBoosted);

  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark to-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-secondary" />
              <span className="bg-secondary/20 text-secondary px-4 py-1 rounded-full text-sm font-bold">
                {actualitesData.length} articles ce mois
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Actualités de Djougou et du Nord‑Bénin
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Toute l'information locale, en temps réel. Boostez vos articles pour toucher plus de{' '}
              {FOLLOWERS.toLocaleString()} lecteurs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/publier/parcours"
                className="bg-secondary text-dark px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all"
              >
                <Zap className="w-5 h-5" />
                Booster un article
                <span className="bg-dark/10 px-3 py-1 rounded-full text-sm">
                  {formatFCFA(PRICES.BOOST_ARTICLE)}
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Barre de recherche et filtres – non sticky, responsive */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Rechercher une actualité..."
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
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
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
        {filteredArticles.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Newspaper className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">Aucun article trouvé</h3>
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
            {/* Article à la une (boosté le plus récent) */}
            {boostedArticles.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 bg-secondary/20 rounded-full">
                    <Award className="w-4 h-4 text-secondary" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-dark">À la une</h2>
                  <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-xs font-medium">
                    Boosté
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
                        src={boostedArticles[0].image}
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
                        Lire l'article complet <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              </section>
            )}

            {/* Articles boostés supplémentaires */}
            {boostedArticles.length > 1 && (
              <section className="mb-12">
                <h3 className="text-lg font-bold text-dark mb-4">Également boostés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {boostedArticles.slice(1).map((article) => (
                    <motion.article
                      key={article.id}
                      whileHover={{ y: -4 }}
                      className="bg-card rounded-2xl shadow-md overflow-hidden border border-secondary/30 hover:shadow-lg transition-all"
                    >
                      <div className="relative h-44">
                        <img src={article.image} alt={article.titre} className="w-full h-full object-cover" />
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
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatNombre(article.partages * 10)}</span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            {/* Liste des articles standards */}
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
                    <h4 className="text-lg font-bold mb-1">Boostez votre article</h4>
                    <p className="text-white/80 text-sm mb-3">
                      Touchez {FOLLOWERS.toLocaleString()} lecteurs.
                    </p>
                    <p className="text-2xl font-bold mb-3">{formatFCFA(PRICES.BOOST_ARTICLE)}</p>
                    <Link
                      to="/publier?type=article"
                      className="block w-full bg-white text-primary text-center py-2.5 rounded-full font-semibold text-sm hover:shadow-md transition-all"
                    >
                      Booster maintenant
                    </Link>
                  </div>

                  {/* Articles populaires */}
                  <div className="bg-card rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-dark mb-3 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Les plus lus
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

                  {/* Potentiel revenus (optionnel mais sobre) */}
                  <div className="bg-success/5 rounded-2xl p-5 border border-success/20">
                    <p className="text-sm text-dark font-medium mb-1">💰 Potentiel de revenus</p>
                    <p className="text-xs text-muted mb-2">
                      Avec {FOLLOWERS.toLocaleString()} followers, les boosts génèrent :
                    </p>
                    <p className="text-lg font-bold text-success">{formatFCFA(10 * PRICES.BOOST_ARTICLE)} / mois</p>
                    <p className="text-xs text-muted mt-1">sur la base de 10 boosts</p>
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