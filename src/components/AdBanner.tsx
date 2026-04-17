import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { sponsorsData } from '../data/sponsors';
import { formatFCFA } from '../utils/formatPrice';
import { PRICES } from '../utils/constants';

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

  if (activeSponsors.length === 0) {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted flex items-center justify-center gap-2">
            <Megaphone className="w-4 h-4" />
            Votre publicite ici • {formatFCFA(PRICES.SPONSOR)}/mois • Contactez le 67 23 23 39
          </p>
        </div>
      </div>
    );
  }

  const currentSponsor = activeSponsors[currentIndex];

  return (
    <div className="bg-gradient-to-r from-primary to-secondary text-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto px-4 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={currentSponsor.logo} 
                alt={currentSponsor.nom}
                className="w-12 h-12 rounded-lg object-cover border-2 border-white/30"
              />
              <div>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <Megaphone className="w-3 h-3" /> Sponsorise
                </p>
                <h4 className="font-bold text-lg">{currentSponsor.nom}</h4>
                <p className="text-white/90 text-sm">{currentSponsor.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href={`tel:${currentSponsor.contact}`}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
              >
                Contacter
              </a>
              {activeSponsors.length > 1 && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + activeSponsors.length) % activeSponsors.length)}
                    className="p-1 hover:bg-white/20 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs px-2">
                    {currentIndex + 1}/{activeSponsors.length}
                  </span>
                  <button 
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSponsors.length)}
                    className="p-1 hover:bg-white/20 rounded-full transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="text-center pb-2">
        <a 
          href="/devenir-sponsor" 
          className="text-white/70 text-xs hover:text-white transition-colors inline-flex items-center gap-1"
        >
          Votre pub ici • {formatFCFA(PRICES.SPONSOR)}/mois 
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default AdBanner;