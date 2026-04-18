import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
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
      features: ['Publication 30 jours', '1 photo', 'Coordonnées famille', 'Message court'],
      recommended: false,
    },
    {
      id: 'hommage',
      name: 'Hommage',
      price: PRICES.NECROLOGIE_HOMMAGE || 2500,
      features: ['Tout du pack Simple', '3 photos', 'Message long personnalisé', 'Partage réseaux sociaux'],
      recommended: true,
    },
    {
      id: 'ceremonie',
      name: 'Cérémonie',
      price: PRICES.NECROLOGIE_CEREMONIE || 5000,
      features: ['Tout du pack Hommage', '5 photos', 'Épinglé 7 jours en haut', 'Partage Facebook prioritaire', 'Support dédié'],
      recommended: false,
    },
  ];

  const handleContinue = () => {
    navigate(`/paiement?type=necrologie&pack=${selectedPack}&redirect=/publier/necrologie/form`);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-display font-bold text-dark text-center mb-2">Choisissez votre pack</h1>
        <p className="text-muted text-center mb-8">Sélectionnez l'offre qui correspond à vos besoins pour l'avis de décès.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {packs.map((pack) => (
            <motion.div
              key={pack.id}
              whileHover={{ y: -5 }}
              className={`relative bg-card rounded-2xl shadow-lg border-2 transition-all cursor-pointer ${
                selectedPack === pack.id ? 'border-primary ring-4 ring-primary/20' : 'border-border hover:border-primary/50'
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
                <p className="text-3xl font-display font-bold text-primary my-3">{formatFCFA(pack.price)}</p>
                <ul className="space-y-2 mb-4">
                  {pack.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-dark">
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {selectedPack === pack.id && (
                  <div className="text-success text-sm font-semibold flex items-center gap-1 justify-center">
                    <Check className="w-4 h-4" /> Sélectionné
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors shadow-lg inline-flex items-center gap-2"
          >
            Continuer vers le paiement <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NecrologiePacks;