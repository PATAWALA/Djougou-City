import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Check,
  Star,
  Zap,
  Shield,
  Gift,
  TrendingUp,
  Users,
  Eye,
  Smartphone,
  CreditCard
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FOLLOWERS } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const Premium: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'mensuel' | 'trimestriel' | 'annuel'>('mensuel');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'especes'>('mobile');

  const plans = {
    mensuel: {
      prix: 500,
      label: 'Mensuel',
      description: 'Parfait pour decouvrir',
      economie: null
    },
    trimestriel: {
      prix: 1350,
      label: 'Trimestriel',
      description: 'Le plus populaire',
      economie: 150
    },
    annuel: {
      prix: 5000,
      label: 'Annuel',
      description: 'Meilleure valeur',
      economie: 1000
    }
  };

  const avantagesPremium = [
    {
      icon: Eye,
      titre: 'Visibilite accrue',
      description: 'Vos annonces apparaissent en tete de liste et restent visibles 2 fois plus longtemps.'
    },
    {
      icon: Zap,
      titre: 'Acces anticipe',
      description: 'Recevez les actualites importantes 24h avant tout le monde.'
    },
    {
      icon: Crown,
      titre: 'Badge Premium',
      description: 'Un badge distinctif sur votre profil et vos annonces.'
    },
    {
      icon: Shield,
      titre: 'Support prioritaire',
      description: 'Assistance 24/7 par telephone et WhatsApp.'
    },
    {
      icon: Gift,
      titre: 'Invitations exclusives',
      description: 'Acces aux evenements et rencontres de la communaute.'
    },
    {
      icon: TrendingUp,
      titre: 'Statistiques avancees',
      description: 'Suivez les performances de vos annonces en temps reel.'
    }
  ];

  const temoignages = [
    {
      nom: 'Restaurant La Terrasse',
      role: 'Sponsor Premium',
      commentaire: 'Le badge Premium a augmente notre visibilite de 40%. Nos clients nous trouvent plus facilement.',
      avatar: 'R'
    },
    {
      nom: 'Garage Le Specialiste',
      role: 'Membre Premium',
      commentaire: 'Les statistiques avancees nous aident a mieux comprendre nos clients.',
      avatar: 'G'
    }
  ];

  const prixSelectionne = plans[selectedPlan].prix;
  const economie = plans[selectedPlan].economie;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-dark to-gray-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex p-4 bg-secondary/20 rounded-full mb-6">
                <Crown className="w-12 h-12 text-secondary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                Devenez Membre <span className="text-secondary">Premium</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Rejoignez le cercle privilegie de DjougouCity et profitez d'avantages exclusifs.
                Deja 8 membres nous font confiance.
              </p>
              <div className="flex items-center justify-center gap-3 text-sm">
                <Shield className="w-4 h-4" />
                <span>Sans engagement</span>
                <span className="mx-2">•</span>
                <Star className="w-4 h-4" />
                <span>Annulez a tout moment</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Avantages */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-display font-bold text-dark text-center mb-4">
            Tout ce que vous obtenez avec Premium
          </h2>
          <p className="text-xl text-muted text-center mb-12 max-w-3xl mx-auto">
            Des avantages concus pour valoriser votre presence sur DjougouCity
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {avantagesPremium.map((avantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all"
              >
                <div className="p-3 bg-secondary/10 rounded-xl inline-block mb-4">
                  <avantage.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{avantage.titre}</h3>
                <p className="text-muted text-sm leading-relaxed">{avantage.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tarifs */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-display font-bold text-dark text-center mb-4">
            Choisissez votre formule
          </h2>
          <p className="text-xl text-muted text-center mb-12">
            Des tarifs adaptes a tous les besoins
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {(Object.keys(plans) as Array<keyof typeof plans>).map((plan) => (
              <motion.button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedPlan === plan
                    ? 'border-secondary bg-secondary/5 shadow-xl'
                    : 'border-border bg-card hover:border-secondary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-dark">{plans[plan].label}</h3>
                  {plans[plan].economie && (
                    <span className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold">
                      -{formatFCFA(plans[plan].economie!)}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-display font-bold text-primary mb-2">
                  {formatFCFA(plans[plan].prix)}
                  <span className="text-sm font-normal text-muted">/{plan === 'mensuel' ? 'mois' : plan === 'trimestriel' ? '3 mois' : 'an'}</span>
                </p>
                <p className="text-sm text-muted">{plans[plan].description}</p>
                {selectedPlan === plan && (
                  <div className="mt-4 flex items-center gap-2 text-secondary">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-semibold">Selectionne</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Formulaire d'abonnement */}
        <section className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-2xl font-display font-bold text-dark mb-6 text-center">
                Finalisez votre abonnement Premium
              </h3>
              
              {/* Recapitulatif */}
              <div className="bg-background rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted">Formule selectionnee</span>
                  <span className="font-bold text-dark">{plans[selectedPlan].label}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted">Prix</span>
                  <span className="text-2xl font-bold text-primary">{formatFCFA(prixSelectionne)}</span>
                </div>
                {economie && (
                  <div className="flex justify-between items-center text-success">
                    <span>Economie realisee</span>
                    <span className="font-bold">{formatFCFA(economie)}</span>
                  </div>
                )}
              </div>

              {/* Methode de paiement */}
              <div className="mb-8">
                <h4 className="font-semibold text-dark mb-3">Methode de paiement</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === 'mobile'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-dark">Mobile Money</p>
                      <p className="text-xs text-muted">MTN, Moov</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('especes')}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === 'especes'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-dark">Especes</p>
                      <p className="text-xs text-muted">A la Mairie</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Instructions paiement */}
              {paymentMethod === 'mobile' && (
                <div className="bg-background rounded-xl p-4 mb-6">
                  <p className="text-sm text-muted mb-2">Numeros Mobile Money :</p>
                  <p className="font-mono bg-white p-2 rounded">MTN : 67 23 23 39</p>
                  <p className="font-mono bg-white p-2 rounded mt-1">Moov : 95 67 89 00</p>
                  <p className="text-xs text-muted mt-3">
                    Apres le paiement, envoyez la capture par WhatsApp au 67 23 23 39
                  </p>
                </div>
              )}

              {paymentMethod === 'especes' && (
                <div className="bg-background rounded-xl p-4 mb-6">
                  <p className="text-sm text-muted">
                    Rendez-vous a l'adresse suivante pour finaliser votre abonnement :
                  </p>
                  <p className="font-semibold text-dark mt-2">Mairie, Djougou, Benin, 125</p>
                  <p className="text-xs text-muted mt-3">
                    Horaires : Lundi au Samedi, 8h - 18h
                  </p>
                </div>
              )}

              <button className="w-full bg-gradient-to-r from-secondary to-yellow-500 text-dark py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <Crown className="w-5 h-5" />
                Confirmer mon abonnement Premium
              </button>
              
              <p className="text-center text-xs text-muted mt-4">
                En vous abonnant, vous acceptez nos conditions d'utilisation.
                Sans engagement, annulez a tout moment.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Témoignages */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h3 className="text-2xl font-display font-bold text-dark text-center mb-8">
            Ils nous font confiance
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {temoignages.map((temoin, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-lg border border-border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold">
                    {temoin.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-dark">{temoin.nom}</p>
                    <p className="text-sm text-muted">{temoin.role}</p>
                  </div>
                </div>
                <p className="text-muted italic">"{temoin.commentaire}"</p>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Potentiel de revenus pour la page */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white text-center">
            <Users className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-display font-bold mb-4">
              Potentiel de revenus avec Premium
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Avec {FOLLOWERS.toLocaleString()} followers, le programme Premium peut generer des revenus recurrents.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">50 abonnes</p>
                <p className="text-sm">{formatFCFA(50 * 500)} / mois</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">100 abonnes</p>
                <p className="text-sm">{formatFCFA(100 * 500)} / mois</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">250 abonnes</p>
                <p className="text-sm">{formatFCFA(250 * 500)} / mois</p>
              </div>
            </div>
            
            <p className="text-lg">
              Avec seulement 1% de conversion = 
              <span className="font-bold text-yellow-300"> {formatFCFA(280 * 500)} / mois</span>
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Premium;