import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, AlertTriangle, Wrench, Ambulance } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { PRICES } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const AlertePacks: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState('gratuit');

  const packs = [
    {
      id: 'gratuit',
      name: 'Alerte Simple',
      price: 0,
      icon: AlertTriangle,
      description: 'Signalez un incident sur la route gratuitement.',
      features: [
        'Publication immédiate',
        'Visible par tous les usagers',
        '1 photo possible',
        'Alerte active 7 jours',
      ],
      additional: [
        'Idéal pour signaler un accident, un bouchon, une route dégradée',
        'Aucun frais, service communautaire',
      ],
      cible: 'Tous les usagers de la route',
      badge: null,
      color: 'border-gray-300',
    },
    {
      id: 'assistance',
      name: 'Alerte + Assistance',
      price: PRICES.ALERTE_ASSISTANCE || 2000,
      icon: Wrench,
      description: 'Besoin d\'un dépanneur ou d\'un mécanicien ?',
      features: [
        'Tous les avantages de l\'Alerte Simple',
        'Mise en relation prioritaire avec des garages partenaires',
        'Badge "Assistance demandée"',
        'Contact direct avec les dépanneurs disponibles',
      ],
      additional: [
        'Recommandé en cas de panne ou de crevaison',
        'Intervention rapide sur les grands axes',
        'Paiement unique de 2000 FCFA',
      ],
      cible: 'Conducteurs en panne, crevaison, besoin de mécano',
      badge: { text: 'Populaire', color: 'bg-secondary text-dark' },
      color: 'border-secondary',
    },
    {
      id: 'urgence',
      name: 'Alerte Urgence',
      price: PRICES.ALERTE_URGENCE || 5000,
      icon: Ambulance,
      description: 'Situation critique nécessitant une intervention rapide.',
      features: [
        'Tous les avantages de l\'Alerte Assistance',
        'Alerte épinglée en tête de liste pendant 48h',
        'Partage prioritaire sur les groupes WhatsApp transporteurs',
        'Contact avec les services de secours si nécessaire',
        'Badge "URGENCE" clignotant',
      ],
      additional: [
        'Pour les accidents graves, incendies, détresses',
        'Visibilité maximale auprès de la communauté',
        'Support dédié 24h/24',
      ],
      cible: 'Situations d\'urgence, accidents graves, détresse',
      badge: { text: 'Urgence', color: 'bg-red-600 text-white' },
      color: 'border-red-500',
    },
  ];

  const handleContinue = () => {
    if (selectedPack === 'gratuit') {
      navigate(`/publier/alerte/form?pack=gratuit`);
    } else {
      navigate(`/paiement?type=alerte&pack=${selectedPack}&redirect=/publier/alerte/form`);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-3">
            🚨 Choisissez le type d'alerte à signaler
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Informez la communauté des incidents sur la route. Des options gratuites et payantes selon votre besoin.
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
                      {pack.price === 0 ? 'Gratuit' : formatFCFA(pack.price)}
                    </span>
                    <span className="text-sm text-muted ml-1">/ alerte</span>
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
            Continuer <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted mt-4">
            {selectedPack === 'gratuit' ? 'Aucun paiement requis' : 'Paiement sécurisé par Mobile Money'}
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AlertePacks;