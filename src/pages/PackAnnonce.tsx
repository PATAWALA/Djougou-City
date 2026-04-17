import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, ArrowRight } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';

const PackAnnonce: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState<string>('standard');

  const packs = [
    {
      id: 'basic',
      nom: 'Basic',
      prix: 500,
      description: 'Pour une annonce simple',
      avantages: [
        'Publication visible 30 jours',
        '1 photo',
        'Coordonnées affichées'
      ],
      couleur: 'border-gray-300'
    },
    {
      id: 'standard',
      nom: 'Standard',
      prix: 1000,
      description: 'Plus de visibilité',
      avantages: [
        'Tout du pack Basic',
        '2 photos supplémentaires',
        'Remontée automatique après 7 jours',
        'Badge "Recommandé"'
      ],
      couleur: 'border-primary',
      populaire: true
    },
    {
      id: 'premium',
      nom: 'Premium',
      prix: 2500,
      description: 'Visibilité maximale',
      avantages: [
        'Tout du pack Standard',
        'Badge "Premium" doré',
        '3 photos supplémentaires',
        'Mise en avant 15 jours',
        'Statistiques de vues'
      ],
      couleur: 'border-secondary'
    }
  ];

  const handleContinue = () => {
    // Rediriger vers la création de compte ou connexion
    navigate('/auth/register?redirect=/publier/annonce/form&pack=' + selectedPack);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold text-dark text-center mb-4">
          Choisissez votre pack pour une Petite Annonce
        </h1>
        <p className="text-muted text-center mb-12">
          Sélectionnez l'offre qui correspond le mieux à vos besoins
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {packs.map((pack) => (
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
                <h3 className="text-xl font-bold text-dark mb-1">{pack.nom}</h3>
                <p className="text-sm text-muted mb-4">{pack.description}</p>
                
                <div className="mb-6">
                  <span className="text-3xl font-display font-bold text-primary">{pack.prix}</span>
                  <span className="text-muted"> FCFA</span>
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
          ))}
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
            Appelez-nous au <span className="font-semibold">67 23 23 39</span> ou 
            <a href="/publier/faire-publier" className="text-primary font-semibold ml-1">faites publier pour vous</a>.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PackAnnonce;