import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, TrendingUp, Eye, Clock, Share2, Star } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { PRICES } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const ArticlePacks: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState('visibilite');

  const packs = [
    {
      id: 'coupdepouce',
      name: 'Coup de pouce',
      price: PRICES.BOOST_COUP_DE_POUCE || 1000,
      icon: Zap,
      description: 'Un petit boost pour donner un avant-goût de visibilité.',
      features: [
        'Votre article remonte en tête de liste des actualités',
        'Visibilité garantie pendant 24 heures',
        'Badge "Boosté" pour attirer l\'attention',
      ],
      additional: [
        'Idéal pour tester l\'impact d\'un boost',
        'Convient aux annonces ponctuelles ou événements courts',
      ],
      cible: 'Particuliers, petites annonces urgentes',
      badge: null,
      color: 'border-gray-300',
    },
    {
      id: 'visibilite',
      name: 'Visibilité',
      price: PRICES.BOOST_VISIBILITE || 3000,
      icon: TrendingUp,
      description: 'La formule équilibrée pour une exposition prolongée.',
      features: [
        'Article épinglé en haut de la page Actualités pendant 3 jours',
        'Mise en avant sur la page d\'accueil du site',
        'Badge "Boosté" bien visible',
        'Statistiques de lectures (nombre de vues, clics)',
      ],
      additional: [
        'Meilleur rapport qualité/prix',
        'Recommandé pour la majorité des besoins',
        'Touche un large public sans exploser le budget',
      ],
      cible: 'Commerçants, artisans, événements locaux',
      badge: { text: 'Recommandé', color: 'bg-secondary text-dark' },
      color: 'border-secondary',
    },
    {
      id: 'viral',
      name: 'Viral',
      price: PRICES.BOOST_VIRAL || 5000,
      icon: Share2,
      description: 'Pour une diffusion maximale et un impact fort.',
      features: [
        'Épinglé en tête de page pendant 7 jours consécutifs',
        'Partage sur la page Facebook « La Ville De Djougou » (28 000 followers)',
        'Mise en avant sur la page d\'accueil',
        'Badge "Viral" exclusif',
        'Rapport de performance détaillé (vues, interactions, portée)',
      ],
      additional: [
        'Visibilité maximale garantie',
        'Idéal pour un lancement de produit, une campagne importante',
        'Bénéficiez de la force de la communauté Facebook',
      ],
      cible: 'Entreprises, grands événements, campagnes de notoriété',
      badge: { text: 'Premium', color: 'bg-primary text-white' },
      color: 'border-primary',
    },
  ];

  const handleContinue = () => {
    navigate(`/paiement?type=article&pack=${selectedPack}&redirect=/publier/article/form`);
  };

  return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-3">
            Boostez votre article
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Donnez à votre actualité la visibilité qu'elle mérite. Choisissez le pack adapté à votre objectif et touchez des milliers de lecteurs.
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
            Paiement sécurisé. Vous pourrez publier votre article juste après.
          </p>
        </div>
      </div>
  );
};

export default ArticlePacks;