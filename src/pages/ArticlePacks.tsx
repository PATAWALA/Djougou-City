import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, TrendingUp, Share2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { PRICES, FOLLOWERS } from '../utils/constants';
import { formatFCFA, formatNombre } from '../utils/formatPrice';

const PromoPacks: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState('standard');

  const packs = [
    {
      id: 'basic',
      name: 'Visibilité Basic',
      price: PRICES.BOOST_COUP_DE_POUCE || 1000,
      icon: Zap,
      description: 'Un petit coup de pouce pour mettre en avant votre promo ou offre de transport.',
      features: [
        'Remontée en tête de liste des promos pendant 24h',
        'Badge "Boosté" sur votre annonce',
        'Idéal pour une offre flash ou un départ urgent',
      ],
      additional: [
        'Convient aux petites compagnies ou départs ponctuels',
        'Testez l\'impact du boost à moindre coût',
      ],
      cible: 'Petits transporteurs, offres limitées',
      badge: null,
      color: 'border-gray-300',
    },
    {
      id: 'standard',
      name: 'Boost Standard',
      price: PRICES.BOOST_ARTICLE || 3000,
      icon: TrendingUp,
      description: 'La formule équilibrée pour une visibilité prolongée et plus de réservations.',
      features: [
        'Épinglé en haut des promos pendant 3 jours',
        'Mise en avant sur la page d\'accueil CITransports',
        'Badge "Boosté" bien visible',
        'Statistiques de vues et contacts',
      ],
      additional: [
        'Recommandé pour les promotions de mi-saison',
        'Attirez plus de voyageurs sans vous ruiner',
        'L\'option la plus populaire',
      ],
      cible: 'Agences de voyage, lignes régulières',
      badge: { text: 'Recommandé', color: 'bg-secondary text-dark' },
      color: 'border-secondary',
    },
    {
      id: 'premium',
      name: 'Boost Premium',
      price: PRICES.BOOST_VIRAL || 5000,
      icon: Share2,
      description: 'Visibilité maximale : touchez des milliers de voyageurs et transporteurs.',
      features: [
        'Épinglé en tête pendant 7 jours',
        'Partage sur la page Facebook « Côte d\'Ivoire Transports »',
        `Visibilité auprès de ${formatNombre(FOLLOWERS)} followers`,
        'Badge "Premium" exclusif',
        'Rapport de performance détaillé',
      ],
      additional: [
        'Idéal pour le lancement d\'une nouvelle ligne',
        'Maximisez le remplissage de vos cars',
        'Profitez de la force de notre communauté',
      ],
      cible: 'Grandes compagnies, nouvelles destinations, périodes de fêtes',
      badge: { text: 'Premium', color: 'bg-primary text-white' },
      color: 'border-primary',
    },
  ];

  const handleContinue = () => {
    navigate(`/paiement?type=promo&pack=${selectedPack}&redirect=/publier/promo/form`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-3">
            🚀 Boostez votre promo transport
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Donnez un maximum de visibilité à vos offres, départs spéciaux ou nouvelles lignes. 
            Choisissez la formule adaptée et attirez plus de voyageurs.
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
                    <span className="text-sm text-muted ml-1">/ une fois</span>
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
                    🎯 Cible : {pack.cible}
                  </div>
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
          <button
            onClick={handleContinue}
            className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors shadow-lg inline-flex items-center gap-2"
          >
            Continuer vers le paiement <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted mt-4">
            Paiement sécurisé par Mobile Money. Votre promo sera publiée immédiatement après confirmation.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PromoPacks;