import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Eye,
  Smartphone,
  CreditCard,
  ArrowLeft,
  Bus,
  Package,
  BarChart3,
  Headphones,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { FOLLOWERS, PRICES, CONTACT } from '../utils/constants';
import { formatFCFA, formatNombre } from '../utils/formatPrice';

const Premium: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'mensuel' | 'trimestriel' | 'annuel'>('mensuel');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'especes'>('mobile');

  const basePrice = PRICES.PREMIUM || 25000;

  const plans = {
    mensuel: {
      prix: basePrice,
      label: 'Mensuel',
      description: 'Idéal pour tester les avantages Pro',
      economie: null,
    },
    trimestriel: {
      prix: Math.round(basePrice * 3 * 0.85),
      label: 'Trimestriel',
      description: 'Le plus populaire chez les agences',
      economie: Math.round(basePrice * 3 * 0.15),
    },
    annuel: {
      prix: Math.round(basePrice * 12 * 0.70),
      label: 'Annuel',
      description: 'Meilleur rapport qualité/prix',
      economie: Math.round(basePrice * 12 * 0.30),
    },
  };

  const avantagesPremium = [
    {
      icon: Bus,
      titre: 'Départs illimités',
      description: 'Publiez autant de départs que vous voulez, sans limite.',
    },
    {
      icon: Eye,
      titre: 'Visibilité prioritaire',
      description: 'Vos annonces apparaissent en tête des résultats de recherche.',
    },
    {
      icon: Zap,
      titre: 'Badge "Agence Pro"',
      description: 'Un badge doré qui inspire confiance aux voyageurs.',
    },
    {
      icon: TrendingUp,
      titre: 'Statistiques avancées',
      description: 'Suivez vos vues, contacts et taux de remplissage.',
    },
    {
      icon: Package,
      titre: 'Fret prioritaire',
      description: 'Vos annonces de chargement sont mises en avant.',
    },
    {
      icon: Headphones,
      titre: 'Support prioritaire 7j/7',
      description: 'Assistance WhatsApp et téléphonique sous 1h.',
    },
  ];

  const temoignages = [
    {
      nom: 'CITransports',
      role: 'Agence de voyage',
      commentaire: 'Avec l\'abonnement Pro, nous avons augmenté notre taux de remplissage de 35%.',
      avatar: 'CI',
    },
    {
      nom: 'Garage du Plateau',
      role: 'Mécanique poids lourds',
      commentaire: 'La visibilité prioritaire nous apporte des clients chaque jour.',
      avatar: 'GP',
    },
  ];

  const prixSelectionne = plans[selectedPlan].prix;
  const economie = plans[selectedPlan].economie;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Fil d'Ariane */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6">
            <Crown className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-dark mb-4">
            Passez à l'offre <span className="text-primary">Agence Pro</span>
          </h1>
          <p className="text-lg text-muted mb-6">
            Boostez votre activité de transport avec des outils exclusifs et une visibilité maximale.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" /> Sans engagement
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" /> Annulez à tout moment
            </span>
          </div>
        </motion.div>

        {/* Avantages */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-dark text-center mb-12">
            Tout ce que vous obtenez avec Agence Pro
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {avantagesPremium.map((avantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-all"
              >
                <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
                  <avantage.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{avantage.titre}</h3>
                <p className="text-sm text-muted leading-relaxed">{avantage.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tarifs */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-dark text-center mb-4">
            Choisissez votre formule
          </h2>
          <p className="text-muted text-center mb-10">
            Des tarifs adaptés à toutes les agences de transport
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {(Object.keys(plans) as Array<keyof typeof plans>).map((plan) => (
              <motion.button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                whileHover={{ y: -3 }}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedPlan === plan
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-dark">{plans[plan].label}</h3>
                  {plans[plan].economie && (
                    <span className="bg-success/10 text-success text-xs font-bold px-2 py-1 rounded-full">
                      -{formatFCFA(plans[plan].economie!)}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-display font-bold text-primary mb-1">
                  {formatFCFA(plans[plan].prix)}
                </p>
                <p className="text-sm text-muted mb-4">{plans[plan].description}</p>
                {selectedPlan === plan && (
                  <div className="flex items-center gap-1 text-primary text-sm font-medium">
                    <Check className="w-4 h-4" /> Sélectionné
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Finalisation */}
        <section className="max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl border border-border p-6 md:p-8"
          >
            <h3 className="text-xl font-display font-bold text-dark mb-6 text-center">
              Finalisez votre abonnement
            </h3>

            <div className="bg-background rounded-xl p-5 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-muted">Formule</span>
                <span className="font-bold text-dark">{plans[selectedPlan].label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Total</span>
                <span className="text-2xl font-bold text-primary">{formatFCFA(prixSelectionne)}</span>
              </div>
              {economie && (
                <div className="flex justify-between items-center mt-2 text-success text-sm">
                  <span>Économie réalisée</span>
                  <span className="font-bold">{formatFCFA(economie)}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-dark mb-3">Mode de paiement</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('mobile')}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    paymentMethod === 'mobile'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-dark text-sm">Mobile Money</p>
                    <p className="text-xs text-muted">Orange, MTN, Moov</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('especes')}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    paymentMethod === 'especes'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-dark text-sm">Espèces</p>
                    <p className="text-xs text-muted">Au bureau</p>
                  </div>
                </button>
              </div>
            </div>

            {paymentMethod === 'mobile' && (
              <div className="bg-background rounded-xl p-4 mb-6">
                <p className="text-sm text-muted mb-2">Numéros Mobile Money :</p>
                <p className="font-mono bg-white p-2 rounded text-sm">Orange : 07 09 08 07 06</p>
                <p className="font-mono bg-white p-2 rounded mt-1 text-sm">MTN : 05 06 07 08 09</p>
                <p className="font-mono bg-white p-2 rounded mt-1 text-sm">Moov : 01 02 03 04 05</p>
                <p className="text-xs text-muted mt-3">
                  Après paiement, envoyez la capture WhatsApp au {CONTACT.PHONE}
                </p>
              </div>
            )}

            {paymentMethod === 'especes' && (
              <div className="bg-background rounded-xl p-4 mb-6">
                <p className="text-sm text-muted">
                  Rendez-vous à notre bureau pour finaliser votre abonnement :
                </p>
                <p className="font-semibold text-dark mt-2">{CONTACT.ADDRESS}</p>
                <p className="text-xs text-muted mt-3">Lundi au Samedi, 8h - 18h</p>
              </div>
            )}

            <button className="w-full bg-primary text-white py-3 rounded-full font-bold text-lg hover:bg-dark transition-colors flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              Confirmer mon abonnement
            </button>

            <p className="text-center text-xs text-muted mt-4">
              En vous abonnant, vous acceptez nos conditions d'utilisation.
            </p>
          </motion.div>
        </section>

        {/* Témoignages */}
        <section className="mb-20">
          <h3 className="text-xl font-display font-bold text-dark text-center mb-8">
            Ils nous font confiance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {temoignages.map((temoin, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {temoin.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-dark">{temoin.nom}</p>
                    <p className="text-sm text-muted">{temoin.role}</p>
                  </div>
                </div>
                <p className="text-muted italic text-sm">"{temoin.commentaire}"</p>
                <div className="flex items-center gap-0.5 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Communauté */}
        <section className="bg-card rounded-3xl p-8 border border-border">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-display font-bold text-dark mb-4">
              Rejoignez la communauté Pro
            </h3>
            <p className="text-muted mb-8 max-w-2xl mx-auto">
              Plus de {formatNombre(FOLLOWERS)} transporteurs et voyageurs utilisent CITransports chaque mois.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
              <div className="bg-background rounded-xl p-4">
                <p className="text-xl font-bold text-dark">{formatNombre(150)}</p>
                <p className="text-xs text-muted">agences Pro</p>
                <p className="text-sm font-semibold text-primary mt-1">actives</p>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-xl font-bold text-dark">{formatNombre(45)}</p>
                <p className="text-xs text-muted">départs/jour</p>
                <p className="text-sm font-semibold text-primary mt-1">en moyenne</p>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-xl font-bold text-dark">+300%</p>
                <p className="text-xs text-muted">de contacts</p>
                <p className="text-sm font-semibold text-primary mt-1">pour les Pro</p>
              </div>
            </div>
            <Link
              to="/auth"
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-dark transition-colors"
            >
              Devenir Agence Pro
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Premium;