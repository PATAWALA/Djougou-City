import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Store,
  Users,
  ShoppingBag,
  Heart,
  TrendingUp,
  Megaphone,
  Target,
  Award,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { FOLLOWERS, PRICES } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const APropos: React.FC = () => {
  const avantages = [
    {
      icon: Store,
      titre: 'Pour les Commerces',
      description:
        'Sponsorisez votre entreprise et touchez plus de 28 000 personnes à Djougou et environs.',
      prix: formatFCFA(PRICES.SPONSOR) + '/mois',
      cta: 'Devenir Sponsor',
      lien: '/contact',
    },
    {
      icon: Users,
      titre: 'Pour les Particuliers',
      description:
        'Vendez votre moto, terrain, ou proposez vos services à toute la communauté.',
      prix: formatFCFA(PRICES.ANNONCE) + '/annonce',
      cta: 'Publier une annonce',
      lien: '/publier',
    },
    {
      icon: Heart,
      titre: 'Pour les Familles',
      description:
        'Annoncez les obsèques de vos proches et informez toute la communauté.',
      prix: formatFCFA(PRICES.NECROLOGIE),
      cta: 'Publier un avis',
      lien: '/publier',
    },
    {
      icon: TrendingUp,
      titre: 'Pour les Créateurs',
      description:
        'Boostez vos articles et actualités pour plus de visibilité.',
      prix: formatFCFA(PRICES.BOOST_ARTICLE) + '/7 jours',
      cta: 'Booster un article',
      lien: '/publier',
    },
  ];

  const stats = [
    { label: 'Followers Facebook', value: FOLLOWERS.toLocaleString(), icon: Users },
    { label: 'Sponsors Actifs', value: '3', icon: Store },
    { label: 'Annonces Publiées', value: '12', icon: ShoppingBag },
    { label: 'Potentiel Mensuel', value: formatFCFA(250000), icon: Award },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              DjougouCity : La Plateforme qui{' '}
              <span className="text-secondary">Connecte et Valorise</span> Djougou
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Bien plus qu'un site d'information. Un écosystème complet pour les
              habitants, les commerces et les familles du Nord-Bénin.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/publier"
                className="bg-secondary text-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all shadow-xl"
              >
                Commencer à gagner de l'argent
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
              Donner une voix et des opportunités à Djougou
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              DjougouCity est né de la page Facebook "La Ville De Djougou" qui
              rassemble plus de 28 000 followers. Notre mission est de créer un
              espace numérique où :
            </p>
            <ul className="space-y-4">
              {[
                'Les commerces locaux gagnent en visibilité et attirent plus de clients',
                'Les particuliers vendent et achètent en toute confiance',
                'Les familles partagent les moments importants de la vie',
                "L'information locale est accessible à tous gratuitement",
                'La communauté reste unie et informée',
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
            <h3 className="text-2xl font-bold mb-4">Pourquoi DjougouCity ?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0" />
                <span>Audience qualifiée de {FOLLOWERS.toLocaleString()} personnes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0" />
                <span>Première plateforme 100% dédiée à Djougou</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0" />
                <span>Tarifs adaptés aux réalités locales</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0" />
                <span>Support personnalisé et local</span>
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
              Comment utiliser DjougouCity
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Que vous soyez un commerce, un particulier ou une famille,
              DjougouCity vous offre des solutions adaptées.
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

      {/* Potentiel de gains */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Megaphone className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Vous aussi, gagnez de l'argent avec votre audience
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              La page "La Ville De Djougou" avec ses {FOLLOWERS.toLocaleString()}{' '}
              followers peut générer des revenus significatifs chaque mois grâce à
              DjougouCity.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{formatFCFA(75000)}</p>
                <p className="text-sm">Sponsors</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{formatFCFA(25000)}</p>
                <p className="text-sm">Annonces</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{formatFCFA(20000)}</p>
                <p className="text-sm">Nécrologie</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{formatFCFA(130000)}</p>
                <p className="text-sm">Premium/Boosts</p>
              </div>
            </div>

            <p className="text-4xl md:text-6xl font-display font-bold text-yellow-300 mb-6">
              {formatFCFA(250000)} / mois
            </p>
            <p className="text-lg mb-8">Potentiel total avec 2% d'engagement</p>

            <Link
              to="/contact"
              className="inline-block bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              Contactez-nous pour démarrer
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default APropos;