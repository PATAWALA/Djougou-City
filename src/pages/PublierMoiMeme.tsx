import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Newspaper, Check, ArrowRight, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { PRICES } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const PublierMoiMeme: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'annonce' | 'necrologie' | 'article'>('annonce');
  const [selectedPack, setSelectedPack] = useState<string>('');

  // Définition des types
  const types = [
    { id: 'annonce', label: 'Petite Annonce', icon: ShoppingBag, description: 'Vendez un objet, proposez un service ou recrutez.' },
    { id: 'necrologie', label: 'Avis de Décès', icon: Heart, description: 'Annoncez un décès et les obsèques à la communauté.' },
    { id: 'article', label: 'Article Boosté', icon: Newspaper, description: 'Donnez de la visibilité à votre actualité ou communiqué.' },
  ];

  // Définition détaillée des packs pour chaque type
  const packsData = {
    annonce: {
      title: 'Packs pour Petites Annonces',
      packs: [
        {
          id: 'basic',
          name: 'Basic',
          price: PRICES.ANNONCE_BASIC || 500,
          description: 'Visibilité standard pour une annonce simple.',
          features: [
            'Publication 30 jours',
            '1 photo',
            'Coordonnées visibles',
            'Statistiques de vues basiques',
          ],
          recommended: false,
        },
        {
          id: 'standard',
          name: 'Standard',
          price: PRICES.ANNONCE_STANDARD || 1000,
          description: 'Plus de visibilité et de photos.',
          features: [
            'Tout du pack Basic',
            '3 photos',
            'Remontée automatique après 7 jours',
            'Badge "Recommandé"',
            'Statistiques avancées',
          ],
          recommended: true,
        },
        {
          id: 'premium',
          name: 'Premium',
          price: PRICES.ANNONCE_PREMIUM || 2500,
          description: 'Visibilité maximale et mise en avant.',
          features: [
            'Tout du pack Standard',
            '5 photos',
            'Mise en avant 15 jours',
            'Badge "Premium" doré',
            'Support prioritaire',
          ],
          recommended: false,
        },
      ],
    },
    necrologie: {
      title: 'Packs pour Avis de Décès',
      packs: [
        {
          id: 'simple',
          name: 'Simple',
          price: PRICES.NECROLOGIE_SIMPLE || 1000,
          description: 'Publication standard pour informer la communauté.',
          features: [
            'Publication 30 jours',
            '1 photo',
            'Coordonnées de la famille',
            'Message de condoléances court',
          ],
          recommended: false,
        },
        {
          id: 'hommage',
          name: 'Hommage',
          price: PRICES.NECROLOGIE_HOMMAGE || 2500,
          description: 'Un hommage plus complet avec plus de photos.',
          features: [
            'Tout du pack Simple',
            '3 photos',
            'Message long personnalisé',
            'Partage sur les réseaux',
          ],
          recommended: true,
        },
        {
          id: 'ceremonie',
          name: 'Cérémonie',
          price: PRICES.NECROLOGIE_CEREMONIE || 5000,
          description: 'Annonce épinglée et visibilité maximale.',
          features: [
            'Tout du pack Hommage',
            '5 photos',
            'Épinglé en haut 7 jours',
            'Partage Facebook prioritaire',
            'Support dédié',
          ],
          recommended: false,
        },
      ],
    },
    article: {
      title: 'Packs pour Articles Boostés',
      packs: [
        {
          id: 'coupdepouce',
          name: 'Coup de pouce',
          price: PRICES.BOOST_COUP_DE_POUCE || 1000,
          description: 'Un petit boost pour plus de lecteurs.',
          features: [
            'Article remonté en tête de liste',
            'Visibilité 24h',
            'Badge "Boosté"',
          ],
          recommended: false,
        },
        {
          id: 'visibilite',
          name: 'Visibilité',
          price: PRICES.BOOST_VISIBILITE || 3000,
          description: 'Visibilité prolongée pour un impact durable.',
          features: [
            'Article épinglé 3 jours',
            'Mise en avant sur la page d\'accueil',
            'Badge "Boosté"',
            'Statistiques de lectures',
          ],
          recommended: true,
        },
        {
          id: 'viral',
          name: 'Viral',
          price: PRICES.BOOST_VIRAL || 5000,
          description: 'Touchez toute la communauté et au‑delà.',
          features: [
            'Épinglé 7 jours',
            'Partage sur Facebook (28K abonnés)',
            'Mise en avant page d\'accueil',
            'Badge "Viral"',
            'Rapport de performance',
          ],
          recommended: false,
        },
      ],
    },
  };

  const currentPacks = packsData[selectedType];

  const handleContinue = () => {
    if (!selectedPack) {
      alert('Veuillez sélectionner un pack.');
      return;
    }
    // Rediriger vers la page de choix du parcours (moi-même / faire publier)
    navigate(`/publier/parcours?type=${selectedType}&pack=${selectedPack}`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-dark text-center mb-4">
          Choisissez votre pack
        </h1>
        <p className="text-muted text-center mb-10">
          Sélectionnez le type de publication puis le pack qui correspond à vos besoins.
        </p>

        {/* Sélecteur de type */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedType(type.id as any);
                setSelectedPack(''); // réinitialiser la sélection du pack
              }}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all ${
                selectedType === type.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-card text-dark border border-border hover:bg-background'
              }`}
            >
              <type.icon className="w-5 h-5" />
              {type.label}
            </button>
          ))}
        </div>

        {/* Description du type sélectionné */}
        <p className="text-center text-muted mb-8">
          {types.find((t) => t.id === selectedType)?.description}
        </p>

        {/* Grille de packs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {currentPacks.packs.map((pack) => (
            <motion.div
              key={pack.id}
              whileHover={{ y: -5 }}
              className={`relative bg-card rounded-2xl shadow-lg border-2 transition-all cursor-pointer ${
                selectedPack === pack.id
                  ? 'border-primary ring-4 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedPack(pack.id)}
            >
              {pack.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-dark text-xs font-bold px-4 py-1 rounded-full shadow-md">
                  Recommandé
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-dark mb-1">{pack.name}</h3>
                <p className="text-sm text-muted mb-4">{pack.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-display font-bold text-primary">
                    {formatFCFA(pack.price)}
                  </span>
                </div>
                <ul className="space-y-2 mb-6">
                  {pack.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-dark">
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-center h-6">
                  {selectedPack === pack.id && (
                    <span className="text-success text-sm font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Sélectionné
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bouton Continuer */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-dark transition-all shadow-lg inline-flex items-center gap-2"
          >
            Continuer <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Aide */}
        <div className="mt-8 p-5 bg-background rounded-2xl border border-border text-center">
          <p className="text-sm text-muted flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Vous ne savez pas quel pack choisir ?{' '}
            <Link to="/contact" className="text-primary font-semibold hover:underline">
              Contactez‑nous
            </Link>
            , un conseiller vous guidera.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PublierMoiMeme;