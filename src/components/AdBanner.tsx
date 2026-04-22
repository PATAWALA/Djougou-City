import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, ExternalLink, ChevronLeft, ChevronRight, Truck, Bus, Wrench } from 'lucide-react';
import { sponsorsData } from '../data/sponsors';
import { formatFCFA } from '../utils/formatPrice';
import { PRICES, CONTACT } from '../utils/constants';

const AdBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeSponsors = sponsorsData.filter(s => s.actif);

  useEffect(() => {
    if (activeSponsors.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSponsors.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeSponsors.length]);

  // Icône selon la catégorie du sponsor
  const getCategoryIcon = (categorie: string) => {
    const icons: Record<string, any> = {
      transport: Bus,
      station: Truck,
      garage: Wrench,
      pieces: Truck,
      service: Megaphone,
    };
    const IconComponent = icons[categorie] || Megaphone;
    return <IconComponent className="w-4 h-4" />;
  };

  if (activeSponsors.length === 0) {
    return (
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-3 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted flex items-center justify-center gap-2 flex-wrap">
            <Megaphone className="w-4 h-4 text-primary" />
            <span>🚛 Votre publicité ici • {formatFCFA(PRICES.SPONSOR)}/mois</span>
            <span className="hidden sm:inline">•</span>
            <a 
              href={`tel:${CONTACT.PHONE.replace(/\s/g, '')}`}
              className="text-primary font-medium hover:underline"
            >
              📞 {CONTACT.PHONE}
            </a>
            <span className="hidden sm:inline">•</span>
            <a 
              href={`https://wa.me/2250574366352`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-medium hover:underline"
            >
              💬 WhatsApp
            </a>
          </p>
        </div>
      </div>
    );
  }

  const currentSponsor = activeSponsors[currentIndex];

  return (
    <div className="bg-gradient-to-r from-primary to-secondary text-white relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto px-4 py-4 relative z-10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <img 
                  src={currentSponsor.logo} 
                  alt={currentSponsor.nom}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white/30 shadow-lg"
                />
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-dark rounded-full p-0.5">
                  {getCategoryIcon(currentSponsor.categorie)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white/80 text-xs flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                    <Megaphone className="w-3 h-3" /> Sponsor {currentSponsor.categorie}
                  </p>
                  <p className="text-white/60 text-xs">
                    ⏱️ Jusqu'au {new Date(currentSponsor.dateExpiration).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <h4 className="font-bold text-lg mt-1">{currentSponsor.nom}</h4>
                <p className="text-white/90 text-sm line-clamp-1">{currentSponsor.description}</p>
                <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                  📍 {currentSponsor.localisation}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <a 
                href={`tel:${currentSponsor.contact.replace(/\s/g, '')}`}
                className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/30 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                📞 Contacter
              </a>
              {activeSponsors.length > 1 && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
                  <button 
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + activeSponsors.length) % activeSponsors.length)}
                    className="p-1 hover:bg-white/20 rounded-full transition-all"
                    aria-label="Sponsor précédent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs px-2 font-medium min-w-[40px] text-center">
                    {currentIndex + 1}/{activeSponsors.length}
                  </span>
                  <button 
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSponsors.length)}
                    className="p-1 hover:bg-white/20 rounded-full transition-all"
                    aria-label="Sponsor suivant"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Lien pour devenir sponsor */}
      <div className="text-center pb-2 relative z-10">
        <a 
          href="/premium" 
          className="text-white/70 text-xs hover:text-white transition-colors inline-flex items-center gap-1 bg-white/5 px-4 py-1 rounded-full backdrop-blur-sm"
        >
          <Megaphone className="w-3 h-3" />
          🚛 Votre entreprise de transport ici • {formatFCFA(PRICES.SPONSOR)}/mois 
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default AdBanner;