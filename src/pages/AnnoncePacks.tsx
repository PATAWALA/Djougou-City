import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Bus, Zap, Crown } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { PRICES } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const AnnoncePacks: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState('basic');

  const packs = [
    {
      id: 'basic',
      name: 'Annonce Simple',
      price: PRICES.ANNONCE_DEPART || 500,
      icon: Bus,
      description: 'Publiez votre annonce pour 500 FCFA.',
      features: [
        'Publication visible 30 jours',
        '1 photo',
        'Coordonnées affichées',
        'Statistiques de vues basiques',
      ],
      additional: [
        'Idéal pour une annonce ponctuelle',
        'Paiement unique de 500 FCFA',
      ],
      cible: 'Particuliers, petits transporteurs',
      badge: null,
      color: 'border-gray-300',
    },
    {
      id: 'standard',
      name: 'Annonce Boostée',
      price: PRICES.ANNONCE_STANDARD || 2500,
      icon: Zap,
      description: 'Plus de visibilité pour attirer plus de contacts.',
      features: [
        'Tous les avantages du pack Simple',
        '3 photos maximum',
        'Mise en avant 7 jours',
        'Badge "Boosté"',
        'Partage sur nos réseaux sociaux',
      ],
      additional: [
        'Recommandé pour une meilleure exposition',
        'Attire plus de prospects',
      ],
      cible: 'Transporteurs réguliers, professionnels',
      badge: { text: 'Populaire', color: 'bg-secondary text-dark' },
      color: 'border-secondary',
    },
    {
      id: 'premium',
      name: 'Annonce Premium',
      price: PRICES.ANNONCE_PREMIUM || 5000,
      icon: Crown,
      description: 'Visibilité maximale et support prioritaire.',
      features: [
        'Tous les avantages du pack Boosté',
        '5 photos',
        'Épinglé en tête de liste 7 jours',
        'Badge "Premium"',
        'Partage prioritaire sur Facebook (264K)',
        'Support WhatsApp dédié',
      ],
      additional: [
        'Idéal pour les périodes de forte demande',
        'Maximisez votre visibilité',
      ],
      cible: 'Grandes compagnies, offres spéciales',
      badge: { text: 'Premium', color: 'bg-primary text-white' },
      color: 'border-primary',
    },
  ];

  const handleContinue = () => {
    navigate(`/paiement?type=depart&pack=${selectedPack}&redirect=/publier/depart/form`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-3">
            🚌 Choisissez la formule pour votre annonce
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Publiez votre annonce de transport et touchez des milliers de voyageurs et professionnels.
          </p>
        </div>

        {/* Grille des packs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {packs.map((pack) => {
            const Icon = pack.icon;
            const isSelected = selectedPack === pack.id;
            return (
              <motion.div
                key={pack.id}
                whileHover={{ y: -5 }}
                className={`relative bg-card rounded-2xl shadow-lg border-2 transition-all cursor-pointer ${
                  isSelected ? 'border-primary ring-4 ring-primary/20' : `${pack.color} hover:border-primary/50`
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
                      {pack.price === 0 ? 'Gratuit' : formatFCFA(pack.price)}
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
                  <div className="mt-4 text-xs text-muted italic">🎯 Cible : {pack.cible}</div>
                  {isSelected && (
                    <div className="mt-4 text-success text-sm font-semibold flex items-center gap-1 justify-center">
                      <Check className="w-4 h-4" /> Formule sélectionnée
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <button onClick={handleContinue} className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors shadow-lg inline-flex items-center gap-2">
            Continuer vers le paiement <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted mt-4">
            Paiement sécurisé par Mobile Money.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnnoncePacks;