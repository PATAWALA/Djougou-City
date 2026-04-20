import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Megaphone, ShoppingBag, Heart, Newspaper, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PetiteAnnonceCard from '../components/PetiteAnnonceCard';
import NecrologieCard from '../components/NecrologieCard';
import { supabase } from '../lib/supabase';
import { sponsorsData as staticSponsors } from '../data/sponsors';
import { annoncesData as staticAnnonces } from '../data/annonces';
import { actualitesData as staticActualites } from '../data/actualites';
import { necrologiesData as staticNecrologies } from '../data/necrologies';
import { PRICES, FOLLOWERS } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';
import type { Annonce, Actualite, Necrologie, Sponsor } from '../types';

const Home: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>(staticAnnonces);
  const [actualites, setActualites] = useState<Actualite[]>(staticActualites);
  const [necrologies, setNecrologies] = useState<Necrologie[]>(staticNecrologies);
  const [sponsors, setSponsors] = useState<Sponsor[]>(staticSponsors);
  const [loading, setLoading] = useState(true);

  const heroImages = [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&fit=crop&q=80',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: annoncesData, error: annoncesError } = await supabase
          .from('annonces')
          .select('*')
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });

        if (annoncesError) throw annoncesError;
        if (annoncesData) setAnnonces(annoncesData as Annonce[]);

        const { data: actualitesData, error: actualitesError } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (actualitesError) throw actualitesError;
        if (actualitesData) setActualites(actualitesData as Actualite[]);

        const { data: necrologiesData, error: necrologiesError } = await supabase
          .from('necrologies')
          .select('*')
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });

        if (necrologiesError) throw necrologiesError;
        if (necrologiesData) setNecrologies(necrologiesData as Necrologie[]);

        const { data: sponsorsData, error: sponsorsError } = await supabase
          .from('sponsors')
          .select('*')
          .eq('actif', true)
          .order('created_at', { ascending: false });

        if (sponsorsError) throw sponsorsError;
        if (sponsorsData) setSponsors(sponsorsData as Sponsor[]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const articlesBoostes = actualites.filter((a) => a.estBoosted).slice(0, 3);
  const annoncesTriees = [...annonces].sort((a, b) => (b.estPremium ? 1 : 0) - (a.estPremium ? 1 : 0));
  const avisDeces = necrologies.slice(0, 3);

  return (
    <MainLayout>
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Chargement des dernières publications...</p>
          </div>
        </div>
      ) : (
        <>
          <section
            className="relative bg-cover bg-center text-white overflow-hidden transition-all duration-1000"
            style={{
              backgroundImage: `url('${heroImages[currentImageIndex]}')`,
              backgroundColor: '#1A1A2E',
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-6">
                  <MapPin className="w-4 h-4" />
                  Mairie, Djougou, Benin • {FOLLOWERS.toLocaleString()} personnes connectées
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4">
                  Vendez, achetez, informez‑vous avec<br />
                  <span className="text-yellow-300">DjougouCity</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                  Publiez une annonce, partagez une actualité, annoncez un décès : touchez des milliers d'acheteurs à Djougou et partout au Bénin.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/publier"
                    className="bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                    <Megaphone className="w-5 h-5" />
                    Je publie maintenant
                  </Link>
                  <Link
                    to="/contact"
                    className="border-2 border-white/40 hover:bg-white/10 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg backdrop-blur-sm transition-all"
                  >
                    Je deviens sponsor
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H0Z"
                  fill="#FDEBD0"
                />
              </svg>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {articlesBoostes.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Newspaper className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">À la une</h2>
                    <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">Boostés</span>
                  </div>
                  <Link to="/actualites" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Voir toutes les actualités <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {articlesBoostes.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                      className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop'}
                          alt={article.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-secondary text-dark text-xs font-bold px-3 py-1 rounded-full shadow-md">Boosté</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-dark text-lg mb-2 line-clamp-2">{article.titre}</h3>
                        <p className="text-muted text-sm line-clamp-3 mb-4">{article.contenu}</p>
                        <Link
                          to={`/actualites/${article.id}`}
                          className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
                        >
                          Lire l'article <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">Petites annonces</h2>
                </div>
                <Link
                  to="/publier"
                  className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-dark transition-colors flex items-center gap-1"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Publier ({formatFCFA(PRICES.ANNONCE)})
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {annoncesTriees.slice(0, 6).map((annonce) => (
                  <PetiteAnnonceCard key={annonce.id} annonce={annonce} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/annonces" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                  Voir toutes les annonces <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            <section className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">Nécrologie</h2>
                  </div>
                  <div className="space-y-4">
                    {avisDeces.map((necrologie) => (
                      <NecrologieCard key={necrologie.id} necrologie={necrologie} />
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to="/necrologie" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                      Tous les avis de décès <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Megaphone className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">Ils nous font confiance</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {sponsors.slice(0, 4).map((sponsor) => (
                      <motion.div
                        key={sponsor.id}
                        whileHover={{ y: -3 }}
                        className="bg-card rounded-xl p-4 shadow-sm border border-border flex flex-col items-center text-center"
                      >
                        <img src={sponsor.logo} alt={sponsor.nom} className="w-20 h-20 object-cover rounded-full mb-3" />
                        <h4 className="font-bold text-dark text-sm">{sponsor.nom}</h4>
                        <p className="text-xs text-muted mt-1">{sponsor.categorie}</p>
                        <span className="mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Sponsor</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 p-5 bg-primary/5 rounded-2xl border border-primary/20">
                    <p className="text-dark font-semibold mb-2">📢 Votre entreprise ici ?</p>
                    <p className="text-sm text-muted mb-3">Touchez +{FOLLOWERS.toLocaleString()} personnes à Djougou.</p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-dark transition-colors"
                    >
                      Devenir sponsor <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">
                    Une plateforme, des opportunités pour tous
                  </h2>
                  <p className="text-muted text-lg mb-6">
                    Que vous soyez un particulier, un commerçant ou une famille, DjougouCity vous offre des outils simples pour :
                  </p>
                  <ul className="space-y-3 text-dark">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <span>Vendre ou acheter rapidement grâce aux petites annonces locales</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <span>Rester informé de l'actualité de Djougou et du Bénin</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <span>Annoncer un décès et informer toute la communauté</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <span>Promouvoir votre entreprise et gagner en visibilité</span>
                    </li>
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-background rounded-2xl p-6 border border-border shadow-inner"
                >
                  <h3 className="text-2xl font-bold text-dark mb-3">Vous gérez une page Facebook ?</h3>
                  <p className="text-muted mb-4">
                    Monétisez votre audience avec DjougouCity. La page <strong className="text-dark">« La Ville De Djougou »</strong> peut générer jusqu'à
                  </p>
                  <div className="text-4xl font-display font-bold text-primary mb-2">{formatFCFA(250000)} / mois</div>
                  <p className="text-sm text-muted mb-6">avec un taux d'engagement de seulement 2%.</p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-dark transition-all"
                  >
                    En savoir plus <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </section>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Home;