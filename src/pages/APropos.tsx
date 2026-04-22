import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Truck,
  Users,
  Bus,
  AlertTriangle,
  TrendingUp,
  Megaphone,
  Target,
  Award,
  CheckCircle,
  ArrowRight,
  Package,
  MapPin,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { FOLLOWERS, PRICES, CONTACT } from '../utils/constants';
import { formatFCFA, formatNombre } from '../utils/formatPrice';

const APropos: React.FC = () => {
  const avantages = [
    {
      icon: Truck,
      titre: 'Transporteurs',
      description:
        'Publiez vos départs de bus gratuitement et remplissez vos cars plus rapidement.',
      prix: 'Gratuit',
      cta: 'Publier un départ',
      lien: '/publier',
    },
    {
      icon: Package,
      titre: 'Chargeurs / Fret',
      description:
        'Trouvez des camions disponibles pour vos marchandises sur les principaux axes du pays.',
      prix: formatFCFA(PRICES.ANNONCE_STANDARD) + '/annonce',
      cta: 'Publier une annonce',
      lien: '/publier',
    },
    {
      icon: AlertTriangle,
      titre: 'Alertes Trafic',
      description:
        'Recevez et signalez gratuitement les accidents, contrôles et perturbations.',
      prix: 'Gratuit',
      cta: 'Voir les alertes',
      lien: '/alertes',
    },
    {
      icon: TrendingUp,
      titre: 'Agences & Sponsors',
      description:
        'Boostez votre visibilité et attirez plus de clients avec nos offres sponsorisées.',
      prix: formatFCFA(PRICES.SPONSOR) + '/mois',
      cta: 'Devenir Sponsor',
      lien: '/premium',
    },
  ];

  const stats = [
    { label: 'Followers Facebook', value: formatNombre(FOLLOWERS), icon: Users },
    { label: 'Transporteurs actifs', value: '150+', icon: Truck },
    { label: 'Départs publiés/jour', value: '45+', icon: Bus },
    { label: 'Transactions mensuelles', value: formatFCFA(2500000), icon: Award },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              CITransports : La Plateforme qui{' '}
              <span className="text-yellow-300">Connecte les Transporteurs</span> Ivoiriens
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Départs de bus, fret, alertes trafic, offres d'emploi : tout pour les professionnels 
              du transport routier en Côte d'Ivoire.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/publier"
                className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
              >
                Commencer à publier
              </Link>
              <a
                href="#comment-ca-marche"
                className="border-2 border-white/30 hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg backdrop-blur-sm transition-all"
              >
                Comment ça marche
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-xl border border-border"
            >
              <stat.icon className="w-8 h-8 text-primary mb-3" />
              <p className="text-2xl md:text-3xl font-display font-bold text-dark">
                {stat.value}
              </p>
              <p className="text-sm text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Notre Mission */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Notre Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mt-2 mb-6">
              Simplifier et sécuriser le transport routier en Côte d'Ivoire
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              CITransports est né de la communauté Facebook "Côte d'Ivoire Transports" 
              qui rassemble plus de {formatNombre(FOLLOWERS)} membres. Notre mission est de créer 
              un espace numérique où :
            </p>
            <ul className="space-y-4">
              {[
                'Les transporteurs remplissent leurs cars et camions plus facilement',
                'Les chargeurs trouvent rapidement du fret disponible',
                'Les voyageurs réservent leurs billets en quelques clics',
                'Les alertes trafic sont partagées en temps réel par la communauté',
                'Les agences et garages gagnent en visibilité',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white"
          >
            <Target className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Pourquoi CITransports ?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0" />
                <span>Communauté de {formatNombre(FOLLOWERS)} transporteurs et voyageurs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0" />
                <span>Première plateforme 100% dédiée au transport routier ivoirien</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0" />
                <span>Publication de départs gratuite pour tous</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0" />
                <span>Support local disponible 7j/7 par WhatsApp</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="bg-card py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">
              Comment utiliser CITransports
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Que vous soyez transporteur, chargeur ou simple voyageur, 
              CITransports vous offre des solutions adaptées.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {avantages.map((avantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-background rounded-2xl p-6 shadow-lg border border-border"
              >
                <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
                  <avantage.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{avantage.titre}</h3>
                <p className="text-muted text-sm mb-4">{avantage.description}</p>
                <p className="text-2xl font-bold text-primary mb-4">{avantage.prix}</p>
                <Link
                  to={avantage.lien}
                  className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all"
                >
                  {avantage.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Potentiel de gains / Visibilité */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Megaphone className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Boostez votre activité avec CITransports
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Avec plus de {formatNombre(FOLLOWERS)} membres sur notre communauté Facebook, 
              votre annonce ou votre entreprise bénéficie d'une visibilité inégalée.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">+300%</p>
                <p className="text-sm">de contacts pour les annonces boostées</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{formatNombre(150)}</p>
                <p className="text-sm">transporteurs actifs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm">départs publiés par jour</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{formatFCFA(2500000)}</p>
                <p className="text-sm">de transactions/mois</p>
              </div>
            </div>

            <p className="text-lg mb-8">
              Rejoignez la plus grande communauté de transport routier en Côte d'Ivoire.
            </p>

            <Link
              to="/publier"
              className="inline-block bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              Publier votre premier départ
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact local */}
      <section className="max-w-7xl mx-auto px-4 pb-20 text-center">
        <div className="bg-card rounded-3xl p-8 border border-border">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-bold text-dark mb-2">Une question ?</h3>
          <p className="text-muted mb-4">
            Notre équipe est basée à Abidjan et disponible pour vous accompagner.
          </p>
          <p className="text-lg font-semibold text-primary mb-4">{CONTACT.PHONE}</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all"
          >
            Contactez-nous <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default APropos;