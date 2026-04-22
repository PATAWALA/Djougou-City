import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bus, AlertTriangle, Zap, Check, ArrowRight, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { PRICES } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

type PublicationType = 'depart' | 'alerte' | 'promo';

const PublierMoiMeme: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<PublicationType>('depart');
  const [selectedPack, setSelectedPack] = useState<string>('');

  const types = [
    { id: 'depart', label: 'Annonce transport', icon: Bus, description: 'Publiez un départ, fret, vente...' },
    { id: 'alerte', label: 'Alerte trafic', icon: AlertTriangle, description: 'Signalez un incident sur la route.' },
    { id: 'promo', label: 'Promo / Offre', icon: Zap, description: 'Boostez une promotion ou une actualité transport.' },
  ];

  const packsData: Record<Exclude<PublicationType, 'alerte'>, { title: string; packs: any[] }> = {
    depart: {
      title: 'Packs pour Annonces Transport',
      packs: [
        {
          id: 'basic',
          name: 'Annonce Simple',
          price: PRICES.ANNONCE_DEPART || 500,
          description: 'Publiez votre annonce pour 500 FCFA.',
          features: ['Publication 30 jours', '1 photo', 'Coordonnées affichées', 'Statistiques de vues basiques'],
          recommended: false,
        },
        {
          id: 'standard',
          name: 'Annonce Boostée',
          price: PRICES.ANNONCE_STANDARD || 2500,
          description: 'Plus de visibilité pour plus de contacts.',
          features: ['Tout du pack Simple', '3 photos', 'Mise en avant 7 jours', 'Badge "Boosté"', 'Statistiques avancées'],
          recommended: true,
        },
        {
          id: 'premium',
          name: 'Annonce Premium',
          price: PRICES.ANNONCE_PREMIUM || 5000,
          description: 'Visibilité maximale et support prioritaire.',
          features: ['Tout du pack Boosté', '5 photos', 'Épinglé en tête 7 jours', 'Badge "Premium"', 'Partage Facebook (264K)'],
          recommended: false,
        },
      ],
    },
    promo: {
      title: 'Packs pour Promos',
      packs: [
        {
          id: 'basic',
          name: 'Visibilité Basic',
          price: PRICES.BOOST_COUP_DE_POUCE || 1000,
          description: 'Un petit coup de pouce.',
          features: ['Remontée en tête 24h', 'Badge "Boosté"'],
          recommended: false,
        },
        {
          id: 'standard',
          name: 'Boost Standard',
          price: PRICES.BOOST_ARTICLE || 3000,
          description: 'Visibilité prolongée.',
          features: ['Épinglé 3 jours', 'Mise en avant page accueil', 'Statistiques'],
          recommended: true,
        },
        {
          id: 'premium',
          name: 'Boost Premium',
          price: PRICES.BOOST_VIRAL || 5000,
          description: 'Impact maximal.',
          features: ['Épinglé 7 jours', 'Partage Facebook (264K)', 'Badge "Premium"', 'Rapport détaillé'],
          recommended: false,
        },
      ],
    },
  };

  const handleContinue = () => {
    if (selectedType === 'alerte') {
      // Redirection directe vers les packs d'alerte
      navigate('/publier/alerte/packs');
      return;
    }

    if (!selectedPack) {
      alert('Veuillez sélectionner un pack.');
      return;
    }

    if (selectedType === 'depart') {
      navigate(`/paiement?type=depart&pack=${selectedPack}&redirect=/publier/depart/form`);
    } else if (selectedType === 'promo') {
      navigate(`/paiement?type=promo&pack=${selectedPack}&redirect=/publier/promo/form`);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-dark text-center mb-4">
          Choisissez votre pack de publication
        </h1>
        <p className="text-muted text-center mb-10">
          Sélectionnez le type de contenu puis le niveau de visibilité adapté.
        </p>

        {/* Sélecteur de type */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedType(type.id as PublicationType);
                setSelectedPack('');
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

        {selectedType === 'alerte' ? (
          /* Affichage spécifique pour les alertes */
          <div className="text-center py-12">
            <AlertTriangle className="w-20 h-20 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-dark mb-4">Signaler une alerte trafic</h3>
            <p className="text-muted max-w-2xl mx-auto mb-8">
              Informez la communauté en temps réel des accidents, contrôles, pannes ou dangers sur la route.
              Choisissez parmi nos options gratuites ou payantes selon votre besoin.
            </p>
            <button
              onClick={handleContinue}
              className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-dark transition-all shadow-lg inline-flex items-center gap-2"
            >
              Voir les packs d'alerte <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-muted mt-4">
              Gratuit ou payant, selon l'urgence de votre situation.
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-muted mb-8">
              {types.find((t) => t.id === selectedType)?.description}
            </p>

            {/* Grille de packs pour depart et promo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {packsData[selectedType as 'depart' | 'promo'].packs.map((pack) => (
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
                        {pack.price === 0 ? 'Gratuit' : formatFCFA(pack.price)}
                      </span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pack.features.map((feature: string, idx: number) => (
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

            <div className="text-center">
              <button
                onClick={handleContinue}
                className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-dark transition-all shadow-lg inline-flex items-center gap-2"
              >
                Continuer <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        <div className="mt-8 p-5 bg-background rounded-2xl border border-border text-center">
          <p className="text-sm text-muted flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Besoin d'aide pour choisir ?{' '}
            <Link to="/contact" className="text-primary font-semibold hover:underline">
              Contactez‑nous
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PublierMoiMeme;