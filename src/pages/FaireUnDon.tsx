import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Shield,
  TrendingUp,
  Users,
  Megaphone,
  Bus,
  Package,
  ArrowRight,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { FOLLOWERS, PRICES } from '../utils/constants';
import { formatFCFA, formatNombre } from '../utils/formatPrice';

const Premium: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'mensuel' | 'trimestriel' | 'annuel'>('mensuel');

  const plans = {
    mensuel: {
      prix: PRICES.PREMIUM || 25000,
      label: 'Mensuel',
      economie: '',
    },
    trimestriel: {
      prix: (PRICES.PREMIUM || 25000) * 3 * 0.85,
      label: 'Trimestriel',
      economie: '-15%',
    },
    annuel: {
      prix: (PRICES.PREMIUM || 25000) * 12 * 0.7,
      label: 'Annuel',
      economie: '-30%',
    },
  };

  const avantagesPremium = [
    {
      icon: Bus,
      titre: 'Départs illimités',
      description: 'Publiez autant de départs que vous voulez, sans limite.',
    },
    {
      icon: Package,
      titre: 'Annonces fret prioritaires',
      description: 'Vos annonces de chargement apparaissent en tête de liste.',
    },
    {
      icon: TrendingUp,
      titre: 'Statistiques avancées',
      description: 'Suivez vos vues, contacts et performances.',
    },
    {
      icon: Megaphone,
      titre: 'Visibilité boostée',
      description: 'Badge "Agence Pro" et mise en avant sur la page d\'accueil.',
    },
    {
      icon: Shield,
      titre: 'Support prioritaire',
      description: 'Réponse sous 1h par WhatsApp et téléphone.',
    },
    {
      icon: Star,
      titre: 'Accès anticipé',
      description: 'Nouvelles fonctionnalités en avant-première.',
    },
  ];

  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex p-4 bg-white/20 rounded-full mb-6">
              <Crown className="w-12 h-12 text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Passez à l'offre <span className="text-yellow-300">Agence Pro</span>
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Boostez votre activité de transport avec des outils exclusifs et une visibilité maximale.
            </p>
            <div className="flex items-center justify-center gap-3 text-sm">
              <Users className="w-4 h-4" />
              <span>Rejoignez les {formatNombre(FOLLOWERS)} professionnels</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Avantages */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-dark mb-3">
            Tout ce dont vous avez besoin pour développer votre activité
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            L'abonnement Agence Pro vous donne accès à des fonctionnalités exclusives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avantagesPremium.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all"
            >
              <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">{item.titre}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plans tarifaires */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-card rounded-3xl shadow-xl border border-border p-8">
          <h2 className="text-2xl font-display font-bold text-dark mb-6 text-center">
            Choisissez votre formule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Object.entries(plans).map(([key, plan]) => (
              <button
                key={key}
                onClick={() => setSelectedPlan(key as any)}
                className={`p-5 rounded-2xl border-2 transition-all text-left relative ${
                  selectedPlan === key
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {plan.economie && (
                  <span className="absolute -top-3 right-4 bg-secondary text-dark text-xs font-bold px-3 py-1 rounded-full">
                    {plan.economie}
                  </span>
                )}
                <p className="text-lg font-bold text-dark">{plan.label}</p>
                <p className="text-3xl font-display font-bold text-primary mt-2">
                  {formatFCFA(plan.prix)}
                </p>
                <p className="text-xs text-muted mt-1">
                  {key === 'mensuel' ? '/mois' : key === 'trimestriel' ? '/3 mois' : '/an'}
                </p>
              </button>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="bg-background rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-muted">Total à payer</span>
              <span className="text-2xl font-bold text-primary">
                {formatFCFA(plans[selectedPlan].prix)}
              </span>
            </div>
            <p className="text-xs text-muted mt-2">
              Paiement unique. Renouvellement automatique, annulation à tout moment.
            </p>
          </div>

          <Link
            to={`/paiement?type=premium&plan=${selectedPlan}`}
            className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Devenir Agence Pro
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-center text-xs text-muted mt-4">
            Paiement sécurisé par Mobile Money. Accès immédiat après confirmation.
          </p>
        </div>
      </section>

      {/* Témoignages */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-display font-bold text-dark">
            Ils nous font confiance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { nom: 'CITransports', role: 'Agence de voyage' },
            { nom: 'Garage du Plateau', role: 'Mécanique poids lourds' },
            { nom: 'Station Total Marcory', role: 'Carburant' }
          ].map((temoin, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-6 shadow-sm border border-border text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="w-8 h-8 text-primary" />
              </div>
              <p className="font-semibold text-dark">{temoin.nom}</p>
              <p className="text-sm text-muted">{temoin.role}</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default Premium;