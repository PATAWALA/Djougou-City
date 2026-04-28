import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Megaphone,
  Package,
  AlertTriangle,
  Newspaper,
  MapPin,
  Truck,
  Bus,
  TrendingUp,
  Users,
  CreditCard,
  Shield,
} from 'lucide-react';
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

  const [filtreAnnonces, setFiltreAnnonces] = useState<'tous' | 'departs' | 'annonces'>('tous');

  const heroImages = [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1200&fit=crop&q=80',
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

  useEffect(() => {
    if (loading) return;
    const header = document.querySelector('header');
    if (header) {
      header.style.position = 'sticky';
      header.style.top = '0';
      header.style.zIndex = '9999';
    }
    return () => {
      if (header) {
        header.style.position = '';
        header.style.top = '';
        header.style.zIndex = '';
      }
    };
  }, [loading]);

  const promosBoostees = actualites.filter((a) => a.estBoosted).slice(0, 3);

  const annoncesFiltrees = annonces.filter((a) => {
    if (filtreAnnonces === 'departs')
      return a.categorie === 'depart' || a.categorie === 'chargement';
    if (filtreAnnonces === 'annonces')
      return a.categorie === 'vente' || a.categorie === 'location' || a.categorie === 'emploi' || a.categorie === 'service';
    return true;
  });

  const annoncesTriees = [...annoncesFiltrees]
    .sort((a, b) => (b.estPremium ? 1 : 0) - (a.estPremium ? 1 : 0))
    .slice(0, 6);

  const alertesActives = alertes.filter((a) => a.estActive).slice(0, 3);

  return (
    <MainLayout>
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Chargement des annonces...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative bg-cover bg-center text-white transition-all duration-1000 isolate">
            <div
              className="absolute inset-0 bg-cover bg-center -z-10"
              style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')`, backgroundColor: '#1A1A2E' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 -z-10"></div>
            <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
                <span className="inline-flex items-center gap-2 bg-primary/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-6">
                  <MapPin className="w-4 h-4" />
                  Plateau, Abidjan • {formatNombre(FOLLOWERS)} transporteurs connectés
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4">
                  La plateforme n°1 des<br />
                  <span className="text-secondary">transporteurs ivoiriens</span>
                </h1>
                <p className="text-base md:text-xl text-white/90 mb-8 max-w-2xl">
                  Que vous soyez compagnie de bus, propriétaire de camion ou simple voyageur, publiez vos trajets, trouvez du fret et restez informé des conditions de route en temps réel.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/publier" className="bg-secondary text-dark px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center gap-2">
                    <Bus className="w-5 h-5" /> Publier une annonce
                  </Link>
                  <Link to="/premium" className="border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all">
                    Devenir Sponsor
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H0Z" fill="#F8FAFC" />
              </svg>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Section : Comment ça marche ? */}
            <section className="mb-16 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-3">
                  Développez votre activité avec CITransports
                </h2>
                <p className="text-muted text-base md:text-lg max-w-3xl mx-auto">
                  Chaque jour, des milliers de personnes cherchent un bus pour voyager, un camion pour leurs marchandises, ou un mécanicien fiable. Notre plateforme vous connecte directement avec eux.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Bus,
                    title: 'Transporteurs',
                    subtitle: 'Compagnies de bus et cars',
                    description: 'Publiez vos départs quotidiens. Les voyageurs réservent directement auprès de vous. Remplissez vos cars sans effort.',
                    gain: '150 000 F/jour',
                    color: 'bg-blue-100 text-blue-700',
                    link: '/publier',
                    linkText: 'Publier un départ',
                  },
                  {
                    icon: Package,
                    title: 'Propriétaires',
                    subtitle: 'Camions et fret',
                    description: 'Proposez votre camion pour le transport de marchandises ou trouvez des chargements disponibles sur tous les axes du pays.',
                    gain: '75 000 F/jour',
                    color: 'bg-green-100 text-green-700',
                    link: '/annonces',
                    linkText: 'Voir le fret',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Sponsors',
                    subtitle: 'Agences et commerces',
                    description: 'Mettez votre entreprise en avant. Apparaissez en tête des recherches et touchez des clients qualifiés chaque jour.',
                    gain: '+300% de contacts',
                    color: 'bg-purple-100 text-purple-700',
                    link: '/premium',
                    linkText: 'Devenir Sponsor',
                  },
                  {
                    icon: Users,
                    title: 'Partenaires',
                    subtitle: 'Garages, stations, pièces',
                    description: 'Référencez vos services : mécanique, vente de pneus, carburant. Les transporteurs vous trouvent directement.',
                    gain: 'Clients ciblés',
                    color: 'bg-orange-100 text-orange-700',
                    link: '/contact',
                    linkText: 'Devenir partenaire',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all flex flex-col"
                  >
                    <h3 className="text-xl font-bold text-dark mb-1">{item.title}</h3>
                    <p className="text-xs text-primary font-medium mb-3">{item.subtitle}</p>
                    <p className="text-muted text-sm mb-4 flex-1">{item.description}</p>
                    <p className="text-primary font-bold text-lg mb-4">{item.gain}</p>
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all mb-4"
                    >
                      {item.linkText} <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="w-full flex justify-center mt-auto pt-4 border-t border-border">
                      <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center`}>
                        <item.icon className="w-9 h-9" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Promos boostées */}
            {promosBoostees.length > 0 && (
              <section className="mb-16">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/20 rounded-full"><Newspaper className="w-6 h-6 text-secondary" /></div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-dark">Offres et promotions</h2>
                      <p className="text-xs md:text-sm text-muted">Les meilleures offres de transport mises en avant</p>
                    </div>
                    <span className="bg-secondary/20 text-dark text-sm font-semibold px-3 py-1 rounded-full hidden sm:inline">Boostés</span>
                  </div>
                  <Link to="/actualites" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap text-sm">Toutes les offres <ArrowRight className="w-4 h-4" /></Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {promosBoostees.map((article, index) => (
                    <motion.article key={article.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} whileHover={{ y: -5 }} className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <img src={article.image || 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&fit=crop'} alt={article.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 left-3"><span className="bg-secondary text-dark text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">Boosté • {formatFCFA(article.montantBoost || 0)}</span></div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-dark text-lg mb-2 line-clamp-2">{article.titre}</h3>
                        <p className="text-muted text-sm line-clamp-3 mb-4">{article.contenu}</p>
                        <Link to={`/actualites/${article.id}`} className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">Voir l'offre <ArrowRight className="w-4 h-4" /></Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            {/* Section Annonces avec filtres */}
            <section className="mb-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full"><Bus className="w-6 h-6 text-primary" /></div>
                  <div>
                    <h2 className="text-xl md:text-3xl font-display font-bold text-dark">Annonces récentes</h2>
                    <p className="text-xs md:text-sm text-muted">Derniers départs, fret et services publiés</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex bg-background rounded-full p-1 border border-border self-start overflow-x-auto">
                    <button onClick={() => setFiltreAnnonces('tous')} className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${filtreAnnonces === 'tous' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'}`}>Tous</button>
                    <button onClick={() => setFiltreAnnonces('departs')} className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${filtreAnnonces === 'departs' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'}`}>Départs / Fret</button>
                    <button onClick={() => setFiltreAnnonces('annonces')} className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${filtreAnnonces === 'annonces' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-dark'}`}>Ventes / Services</button>
                  </div>

                  <Link to="/publier" className="bg-primary text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-dark transition-colors flex items-center justify-center gap-1 whitespace-nowrap">
                    <Bus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Publier ({formatFCFA(PRICES.ANNONCE_DEPART || 500)})
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {annoncesTriees.map((annonce) => (
                  <PetiteAnnonceCard key={annonce.id} annonce={annonce} />
                ))}
              </div>
              {annoncesTriees.length === 0 && (
                <div className="text-center py-10 text-muted text-sm">Aucune annonce ne correspond à ce filtre.</div>
              )}
              <div className="text-center mt-8">
                <Link to="/annonces" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all text-sm">Voir toutes les annonces <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>

            {/* Alertes et Sponsors */}
            <section className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Alertes */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-100 rounded-full"><AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" /></div>
                    <div>
                      <h2 className="text-xl md:text-3xl font-display font-bold text-dark">Alertes trafic</h2>
                      <p className="text-xs md:text-sm text-muted">Incidents signalés par la communauté</p>
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4 mt-4">
                    {alertesActives.map((alerte) => (
                      <AlerteCard key={alerte.id} alerte={alerte} />
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link to="/alertes" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">Toutes les alertes <ArrowRight className="w-4 h-4" /></Link>
                  </div>
                </div>

                {/* Sponsors */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-full"><Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /></div>
                    <div>
                      <h2 className="text-xl md:text-3xl font-display font-bold text-dark">Sponsors</h2>
                      <p className="text-xs md:text-sm text-muted">Entreprises qui nous font confiance</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
                    {sponsors.filter((s) => s.actif).slice(0, 4).map((sponsor) => (
                      <motion.div key={sponsor.id} whileHover={{ y: -3 }} className="bg-card rounded-xl p-3 sm:p-4 shadow-sm border border-border flex flex-col items-center text-center">
                        <img src={sponsor.logo} alt={sponsor.nom} className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-full mb-2 sm:mb-3 border-2 border-primary/20" />
                        <h4 className="font-bold text-dark text-xs sm:text-sm">{sponsor.nom}</h4>
                        <p className="text-[10px] sm:text-xs text-muted mt-0.5 sm:mt-1">{sponsor.categorie}</p>
                        <p className="text-[10px] sm:text-xs text-primary mt-0.5 sm:mt-1">📍 {sponsor.localisation}</p>
                        <span className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs bg-primary/10 text-primary px-2 py-0.5 sm:py-1 rounded-full">Sponsor</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/30">
                    <p className="text-dark font-semibold mb-2 flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Votre entreprise ici ?
                    </p>
                    <p className="text-xs sm:text-sm text-muted mb-3">Touchez +{formatNombre(FOLLOWERS)} transporteurs et voyageurs en Côte d'Ivoire.</p>
                    <Link to="/premium" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-dark transition-colors">Devenir Sponsor • {formatFCFA(PRICES.SPONSOR)}/mois <ArrowRight className="w-3 h-3" /></Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Pourquoi choisir CITransports */}
            <section className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">Pourquoi choisir CITransports ?</h2>
                  <p className="text-muted text-base md:text-lg mb-6">La plateforme 100% ivoirienne conçue par et pour les professionnels du transport routier.</p>
                  <ul className="space-y-3 text-dark">
                    <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" /><span><strong>Publication simple :</strong> votre annonce en ligne en moins de 2 minutes</span></li>
                    <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" /><span><strong>Alertes trafic</strong> en temps réel (accidents, pluie, contrôles)</span></li>
                    <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" /><span><strong>+{formatNombre(FOLLOWERS)}</strong> utilisateurs actifs chaque mois</span></li>
                    <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" /><span><strong>Paiement sécurisé</strong> par Mobile Money (Orange, MTN, Moov)</span></li>
                    <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" /><span><strong>Support 7j/7</strong> par téléphone et WhatsApp</span></li>
                  </ul>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Shield className="w-6 h-6" />Rejoignez la communauté</h3>
                  <p className="text-white/90 mb-6 text-sm md:text-base">Plus de <strong className="text-2xl">{formatNombre(FOLLOWERS)}</strong> transporteurs, chargeurs et voyageurs utilisent déjà CITransports.</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white/20 p-3 rounded-full"><Users className="w-6 h-6" /></div>
                    <div><p className="text-3xl font-bold">{formatNombre(156)}</p><p className="text-sm text-white/80">départs publiés aujourd'hui</p></div>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white/20 p-3 rounded-full"><CreditCard className="w-6 h-6" /></div>
                    <div><p className="text-3xl font-bold">{formatFCFA(2500000)}</p><p className="text-sm text-white/80">de transactions ce mois</p></div>
                  </div>
                  <Link to="/auth" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-secondary transition-all w-full justify-center">Créer un compte gratuit <ArrowRight className="w-4 h-4" /></Link>
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