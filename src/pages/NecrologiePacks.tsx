import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Flower, BookOpen, Star, Bell } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { PRICES } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const NecrologiePacks: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState('hommage');

  const packs = [
    {
      id: 'simple',
      name: 'Simple',
      price: PRICES.NECROLOGIE_SIMPLE || 1000,
      icon: Flower,
      description: 'L\'essentiel pour informer la communauté avec respect.',
      features: [
        'Publication visible pendant 30 jours',
        '1 photo du défunt',
        'Coordonnées de la famille affichées',
        'Message de condoléances court (200 caractères)',
      ],
      additional: [
        'Idéal pour une annonce sobre et efficace',
        'Convient aux familles souhaitant une communication simple',
      ],
      cible: 'Familles, annonces discrètes',
      badge: null,
      color: 'border-gray-300',
    },
    {
      id: 'hommage',
      name: 'Hommage',
      price: PRICES.NECROLOGIE_HOMMAGE || 2500,
      icon: BookOpen,
      description: 'Un hommage plus complet pour honorer la mémoire du défunt.',
      features: [
        'Tous les avantages du pack Simple',
        '3 photos pour un hommage visuel',
        'Message long personnalisé (1000 caractères)',
        'Partage automatique sur les réseaux sociaux',
        'Possibilité d\'ajouter un programme des obsèques',
      ],
      additional: [
        'Recommandé pour une cérémonie avec plusieurs étapes',
        'Permet à la communauté élargie de participer à distance',
        'L\'option la plus choisie par les familles',
      ],
      cible: 'Familles, cérémonies traditionnelles, hommages collectifs',
      badge: { text: 'Recommandé', color: 'bg-secondary text-dark' },
      color: 'border-secondary',
    },
    {
      id: 'ceremonie',
      name: 'Cérémonie',
      price: PRICES.NECROLOGIE_CEREMONIE || 5000,
      icon: Bell,
      description: 'Visibilité maximale pour une annonce importante.',
      features: [
        'Tous les avantages du pack Hommage',
        '5 photos pour un album souvenir complet',
        'Annonce épinglée en tête de page pendant 7 jours',
        'Partage prioritaire sur Facebook (28K abonnés)',
        'Support dédié pour vous accompagner',
      ],
      additional: [
        'Idéal pour les personnalités locales, grandes familles',
        'Assure une couverture maximale dans la communauté',
        'Votre annonce est vue en premier par tous les visiteurs',
      ],
      cible: 'Personnalités, grandes familles, cérémonies publiques',
      badge: { text: 'Premium', color: 'bg-primary text-white' },
      color: 'border-primary',
    },
  ];

  const handleContinue = () => {
    navigate(`/paiement?type=necrologie&pack=${selectedPack}&redirect=/publier/necrologie/form`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-3">
            Choisissez le pack pour l'avis de décès
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Honorez la mémoire de votre proche et informez la communauté avec le niveau de visibilité qui vous convient.
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
                    <span className="text-sm text-muted ml-1">/ avis</span>
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
            Paiement sécurisé. L'avis sera publié immédiatement après confirmation.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default NecrologiePacks;