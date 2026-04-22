import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, ArrowRight, Bus, Zap, Crown } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { PRICES, CONTACT } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const PackAnnonce: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState<string>('standard');

  const packs = [
    {
      id: 'gratuit',
      nom: 'Départ Gratuit',
      prix: PRICES.ANNONCE || 0,
      description: 'Publiez votre départ sans frais',
      avantages: [
        'Publication visible 30 jours',
        '1 photo de votre véhicule',
        'Coordonnées affichées',
        'Localisation du départ',
      ],
      couleur: 'border-gray-300',
      icon: Bus,
    },
    {
      id: 'standard',
      nom: 'Départ Boosté',
      prix: PRICES.ANNONCE_STANDARD || 2500,
      description: 'Plus de visibilité pour remplir votre car',
      avantages: [
        'Tout du pack Gratuit',
        '3 photos maximum',
        'Mise en avant 7 jours',
        'Badge "Boosté"',
        'Partage sur nos réseaux sociaux',
      ],
      couleur: 'border-primary',
      populaire: true,
      icon: Zap,
    },
    {
      id: 'premium',
      nom: 'Départ Premium',
      prix: PRICES.ANNONCE_PREMIUM || 5000,
      description: 'Visibilité maximale',
      avantages: [
        'Tout du pack Boosté',
        '5 photos pour un album complet',
        'Épinglé en tête de liste 7 jours',
        'Badge "Premium" doré',
        'Partage prioritaire sur Facebook (264K abonnés)',
        'Support WhatsApp dédié',
      ],
      couleur: 'border-secondary',
      icon: Crown,
    },
  ];

  const handleContinue = () => {
    // Rediriger vers la création de compte ou connexion
    navigate(`/auth/register?redirect=/publier/annonce/form&pack=${selectedPack}`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold text-dark text-center mb-4">
          🚌 Choisissez votre pack pour un départ / annonce transport
        </h1>
        <p className="text-muted text-center mb-12">
          Sélectionnez l'offre qui correspond le mieux à vos besoins
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {packs.map((pack) => {
            const Icon = pack.icon;
            return (
              <motion.div
                key={pack.id}
                whileHover={{ y: -5 }}
                className={`bg-card rounded-2xl shadow-lg border-2 ${pack.couleur} relative overflow-hidden cursor-pointer transition-all ${
                  selectedPack === pack.id ? 'ring-4 ring-primary/20' : ''
                }`}
                onClick={() => setSelectedPack(pack.id)}
              >
                {pack.populaire && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                    Populaire
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-dark">{pack.nom}</h3>
                  </div>
                  <p className="text-sm text-muted mb-4">{pack.description}</p>

                  <div className="mb-6">
                    <span className="text-3xl font-display font-bold text-primary">
                      {pack.prix === 0 ? 'Gratuit' : formatFCFA(pack.prix)}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {pack.avantages.map((avantage, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span className="text-dark">{avantage}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-center h-8">
                    {selectedPack === pack.id && (
                      <span className="text-success text-sm font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Sélectionné
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors inline-flex items-center gap-2"
          >
            Continuer <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted mt-4">
            Vous pourrez créer un compte ou vous connecter à l'étape suivante.
          </p>
        </div>

        <div className="mt-8 p-6 bg-background rounded-2xl">
          <h4 className="font-bold text-dark mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Besoin d'aide pour choisir ?
          </h4>
          <p className="text-sm text-muted">
            Appelez-nous au <span className="font-semibold">{CONTACT.PHONE}</span> ou 
            <a href="/publier/faire-publier" className="text-primary font-semibold ml-1">faites publier pour vous</a>.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PackAnnonce;