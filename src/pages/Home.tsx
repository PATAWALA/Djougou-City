import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Megaphone, Package, AlertTriangle, Newspaper, MapPin, Truck, Bus, TrendingUp, Users, CreditCard, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PetiteAnnonceCard from '../components/PetiteAnnonceCard';
import AlerteCard from '../components/NecrologieCard';
import { supabase } from '../lib/supabase';
import { sponsorsData as staticSponsors } from '../data/sponsors';
import { annoncesData as staticAnnonces } from '../data/annonces';
import { actualitesData as staticActualites } from '../data/actualites';
import { alertesData as staticAlertes } from '../data/necrologies';
import { PRICES, FOLLOWERS } from '../utils/constants';
import { formatFCFA, formatNombre } from '../utils/formatPrice';
import type { Annonce, Actualite, Alerte, Sponsor } from '../types';

const Home: React.FC = () => {
  const [annonces, setAnnonces] = useState<Annonce[]>(staticAnnonces);
  const [actualites, setActualites] = useState<Actualite[]>(staticActualites);
  const [alertes, setAlertes] = useState<Alerte[]>(staticAlertes);
  const [sponsors, setSponsors] = useState<Sponsor[]>(staticSponsors);
  const [loading, setLoading] = useState(false);

  const heroImages = [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&fit=crop&q=80', // Camion
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&fit=crop&q=80', // Bus
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&fit=crop&q=80', // Camion plateau
    'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1200&fit=crop&q=80', // Semi-remorque
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: annoncesData } = await supabase
          .from('annonces')
          .select('*')
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });
        if (annoncesData && annoncesData.length > 0) setAnnonces(annoncesData as Annonce[]);

        const { data: actualitesData } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });
        if (actualitesData && actualitesData.length > 0) setActualites(actualitesData as Actualite[]);

        const { data: alertesData } = await supabase
          .from('alertes')
          .select('*')
          .eq('estActive', true)
          .order('created_at', { ascending: false });
        if (alertesData && alertesData.length > 0) setAlertes(alertesData as Alerte[]);

        const { data: sponsorsData } = await supabase
          .from('sponsors')
          .select('*')
          .eq('actif', true)
          .order('created_at', { ascending: false });
        if (sponsorsData && sponsorsData.length > 0) setSponsors(sponsorsData as Sponsor[]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const promosBoostees = actualites.filter((a) => a.estBoosted).slice(0, 3);
  const annoncesTriees = [...annonces]
    .filter(a => a.categorie === 'depart' || a.categorie === 'vente' || a.categorie === 'location')
    .sort((a, b) => (b.estPremium ? 1 : 0) - (a.estPremium ? 1 : 0))
    .slice(0, 6);
  const alertesActives = alertes.filter(a => a.estActive).slice(0, 3);

  return (
    <MainLayout>
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section - Transport */}
          <section
            className="relative bg-cover bg-center text-white overflow-hidden transition-all duration-1000"
            style={{
              backgroundImage: `url('${heroImages[currentImageIndex]}')`,
              backgroundColor: '#1A1A2E',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                <span className="inline-flex items-center gap-2 bg-primary/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-6">
                  <MapPin className="w-4 h-4" />
                  🇨🇮 Plateau, Abidjan • {formatNombre(FOLLOWERS)} transporteurs connectés
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4">
                  La plateforme N°1 des<br />
                  <span className="text-secondary">transporteurs ivoiriens</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                  Publiez vos départs, trouvez du fret, recevez des alertes trafic en temps réel. 
                  Rejoignez la plus grande communauté de transport routier en Côte d'Ivoire.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/publier"
                    className="bg-secondary text-dark px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                    <Bus className="w-5 h-5" />
                    Je publie une annonce
                  </Link>
                  <Link
                    to="/premium"
                    className="border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all"
                  >
                    Devenir Sponsor
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H0Z"
                  fill="#F8FAFC"
                />
              </svg>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Section : Comment gagner avec CITransports */}
            <section className="mb-16 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12 border border-primary/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-3">
                  💰 Comment gagner de l'argent avec CITransports ?
                </h2>
                <p className="text-muted text-lg max-w-3xl mx-auto">
                  Que vous soyez transporteur, chargeur, mécanicien ou simple particulier, 
                  notre plateforme vous offre plusieurs façons de générer des revenus.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Bus,
                    title: 'Transporteurs',
                    description: 'Publiez vos départs GRATUITEMENT et remplissez vos cars. Gagnez jusqu\'à 150 000 F/jour en moyenne.',
                    gain: '150 000 F/jour',
                    color: 'bg-blue-100 text-blue-700',
                    link: '/publier',
                    linkText: 'Publier un départ'
                  },
                  {
                    icon: Package,
                    title: 'Propriétaires de camions',
                    description: 'Trouvez du fret rapidement. Location de camions avec ou sans chauffeur. Jusqu\'à 75 000 F/jour.',
                    gain: '75 000 F/jour',
                    color: 'bg-green-100 text-green-700',
                    link: '/annonces',
                    linkText: 'Voir le fret'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Sponsors / Agences',
                    description: 'Boostez votre visibilité. Apparaissez en tête des recherches. +300% de contacts en moyenne.',
                    gain: '+300% visibilité',
                    color: 'bg-purple-100 text-purple-700',
                    link: '/premium',
                    linkText: 'Devenir Sponsor'
                  },
                  {
                    icon: Users,
                    title: 'Partenaires',
                    description: 'Garages, stations, vendeurs de pièces. Référencez votre activité et attirez des clients qualifiés.',
                    gain: 'Clients ciblés',
                    color: 'bg-orange-100 text-orange-700',
                    link: '/contact',
                    linkText: 'Devenir partenaire'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all"
                  >
                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">{item.title}</h3>
                    <p className="text-muted text-sm mb-3">{item.description}</p>
                    <p className="text-primary font-bold text-lg mb-4">{item.gain}</p>
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                    >
                      {item.linkText} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Section Promos Boostées */}
            {promosBoostees.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/20 rounded-full">
                      <Newspaper className="w-6 h-6 text-secondary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">🎉 Promos et Offres</h2>
                    <span className="bg-secondary/20 text-dark text-sm font-semibold px-3 py-1 rounded-full">Boostés</span>
                  </div>
                  <Link to="/actualites" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Toutes les promos <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {promosBoostees.map((article, index) => (
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
                          src={article.image || 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&fit=crop'}
                          alt={article.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-secondary text-dark text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            🚀 Boosté • {formatFCFA(article.montantBoost || 0)}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-dark text-lg mb-2 line-clamp-2">{article.titre}</h3>
                        <p className="text-muted text-sm line-clamp-3 mb-4">{article.contenu}</p>
                        <Link
                          to={`/actualites/${article.id}`}
                          className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
                        >
                          Voir l'offre <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            {/* Section Départs et Annonces */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Bus className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">🚌 Départs & Annonces</h2>
                </div>
                <Link
                  to="/publier"
                  className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-dark transition-colors flex items-center gap-1"
                >
                  <Bus className="w-4 h-4" />
                  Publier ({formatFCFA(PRICES.ANNONCE)})
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {annoncesTriees.map((annonce) => (
                  <PetiteAnnonceCard key={annonce.id} annonce={annonce} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/annonces" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                  Voir tous les départs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            {/* Section Alertes et Sponsors */}
            <section className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">⚠️ Alertes Trafic</h2>
                  </div>
                  <div className="space-y-4">
                    {alertesActives.map((alerte) => (
                      <AlerteCard key={alerte.id} alerte={alerte} />
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to="/alertes" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                      Toutes les alertes <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Megaphone className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">⭐ Sponsors Transport</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {sponsors
  .filter(s => s.actif) // On garde tous les sponsors actifs, quelle que soit leur catégorie
  .slice(0, 4)
  .map((sponsor) => (
    <motion.div
      key={sponsor.id}
      whileHover={{ y: -3 }}
      className="bg-card rounded-xl p-4 shadow-sm border border-border flex flex-col items-center text-center"
    >
      <img src={sponsor.logo} alt={sponsor.nom} className="w-20 h-20 object-cover rounded-full mb-3 border-2 border-primary/20" />
      <h4 className="font-bold text-dark text-sm">{sponsor.nom}</h4>
      <p className="text-xs text-muted mt-1">{sponsor.categorie}</p>
      <p className="text-xs text-primary mt-1">📍 {sponsor.localisation}</p>
      <span className="mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Sponsor</span>
    </motion.div>
  ))}
                  </div>
                  <div className="mt-6 p-5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/30">
                    <p className="text-dark font-semibold mb-2 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Votre entreprise ici ?
                    </p>
                    <p className="text-sm text-muted mb-3">
                      Touchez +{formatNombre(FOLLOWERS)} transporteurs et voyageurs en Côte d'Ivoire.
                    </p>
                    <Link
                      to="/premium"
                      className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-dark transition-colors"
                    >
                      Devenir Sponsor • {formatFCFA(PRICES.SPONSOR)}/mois <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Pourquoi choisir CITransports */}
            <section className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">
                    Pourquoi choisir CITransports ?
                  </h2>
                  <p className="text-muted text-lg mb-6">
                    La plateforme 100% ivoirienne conçue par et pour les professionnels du transport routier.
                  </p>
                  <ul className="space-y-3 text-dark">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                      <span><strong>Gratuit</strong> pour publier vos départs de bus</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                      <span><strong>Alertes trafic</strong> en temps réel (accidents, pluie, contrôles)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                      <span><strong>+{formatNombre(FOLLOWERS)}</strong> utilisateurs actifs chaque mois</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                      <span><strong>Paiement sécurisé</strong> Mobile Money (Orange, MTN, Moov)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                      <span><strong>Support 7j/7</strong> par téléphone et WhatsApp</span>
                    </li>
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white"
                >
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Rejoignez la communauté
                  </h3>
                  <p className="text-white/90 mb-6">
                    Plus de <strong className="text-2xl">{formatNombre(FOLLOWERS)}</strong> transporteurs, 
                    chargeurs et voyageurs utilisent déjà CITransports.
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{formatNombre(156)}</p>
                      <p className="text-sm text-white/80">départs publiés aujourd'hui</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white/20 p-3 rounded-full">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{formatFCFA(2500000)}</p>
                      <p className="text-sm text-white/80">de transactions ce mois</p>
                    </div>
                  </div>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-secondary transition-all w-full justify-center"
                  >
                    Créer un compte gratuit <ArrowRight className="w-4 h-4" />
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