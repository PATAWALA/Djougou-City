import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Camera, TrendingUp, Award, Zap } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { PRICES } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const AnnoncePacks: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState('standard');

  const packs = [
    {
      id: 'basic',
      name: 'Basic',
      price: PRICES.ANNONCE_BASIC || 500,
      icon: Camera,
      description: 'L\'essentiel pour une annonce simple et efficace.',
      features: [
        'Publication active pendant 30 jours',
        '1 photo pour illustrer votre annonce',
        'Vos coordonnées téléphoniques affichées',
        'Statistiques de vues basiques',
      ],
      additional: [
        'Parfait pour un premier test ou un petit budget',
        'Convient aux objets d\'occasion, services ponctuels',
      ],
      cible: 'Particuliers, petits budgets',
      badge: null,
      color: 'border-gray-300',
    },
    {
      id: 'standard',
      name: 'Standard',
      price: PRICES.ANNONCE_STANDARD || 1000,
      icon: TrendingUp,
      description: 'Plus de photos et une meilleure visibilité.',
      features: [
        'Tous les avantages du pack Basic',
        '3 photos pour mieux présenter votre bien ou service',
        'Remontée automatique en tête de liste après 7 jours',
        'Badge "Recommandé" pour attirer l\'attention',
        'Statistiques avancées (vues, contacts)',
      ],
      additional: [
        'Meilleur rapport qualité/prix',
        'Recommandé pour la majorité des annonces',
        'Augmente significativement vos chances de vente',
      ],
      cible: 'Vendeurs réguliers, locations, services professionnels',
      badge: { text: 'Recommandé', color: 'bg-secondary text-dark' },
      color: 'border-secondary',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: PRICES.ANNONCE_PREMIUM || 2500,
      icon: Award,
      description: 'Visibilité maximale et mise en avant exclusive.',
      features: [
        'Tous les avantages du pack Standard',
        '5 photos pour une galerie complète',
        'Mise en avant prioritaire pendant 15 jours',
        'Badge "Premium" doré pour une crédibilité renforcée',
        'Support client prioritaire (réponse sous 2h)',
      ],
      additional: [
        'Idéal pour les biens de valeur, offres d\'emploi, services haut de gamme',
        'Maximisez votre visibilité et votre taux de conversion',
        'Votre annonce est vue en premier par les visiteurs',
      ],
      cible: 'Professionnels, biens immobiliers, véhicules, offres premium',
      badge: { text: 'Premium', color: 'bg-primary text-white' },
      color: 'border-primary',
    },
  ];

  const handleContinue = () => {
    navigate(`/paiement?type=annonce&pack=${selectedPack}&redirect=/publier/annonce/form`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-3">
            Choisissez le pack pour votre annonce
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Que vous vendiez un objet, proposiez un service ou recrutiez, trouvez le niveau de visibilité adapté à votre besoin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {packs.map((pack) => {
            const Icon = pack.icon;
            const isSelected = selectedPack === pack.id;
            return (
              <motion.div
                key={pack.id}
                whileHover={{ y: -5 }}
                className={`relative bg-card rounded-2xl shadow-lg border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-4 ring-primary/20'
                    : `${pack.color} hover:border-primary/50`
                }`}
                onClick={() => setSelectedPack(pack.id)}
              >
                {pack.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${pack.badge.color} text-xs font-bold px-4 py-1 rounded-full shadow-md`}>
                    {pack.badge.text}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-dark">{pack.name}</h3>
                  </div>
                  <p className="text-sm text-muted mb-4">{pack.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-display font-bold text-primary">
                      {formatFCFA(pack.price)}
                    </span>
                    <span className="text-sm text-muted ml-1">/ annonce</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {pack.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-dark">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-border pt-3 mt-2">
                    <p className="text-xs text-muted font-medium mb-1">💡 À savoir :</p>
                    <ul className="space-y-1">
                      {pack.additional.map((tip, idx) => (
                        <li key={idx} className="text-xs text-muted flex items-start gap-1">
                          <span className="text-primary">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 text-xs text-muted italic">
                    Cible : {pack.cible}
                  </div>
                  {isSelected && (
                    <div className="mt-4 text-success text-sm font-semibold flex items-center gap-1 justify-center">
                      <Check className="w-4 h-4" /> Pack sélectionné
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors shadow-lg inline-flex items-center gap-2"
          >
            Continuer vers le paiement <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted mt-4">
            Paiement sécurisé. Votre annonce sera publiée immédiatement après confirmation.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnnoncePacks;