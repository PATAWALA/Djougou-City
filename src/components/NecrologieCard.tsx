import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, Heart } from 'lucide-react';
import type { Necrologie } from '../types';

interface NecrologieCardProps {
  necrologie: Necrologie;
}

const NecrologieCard: React.FC<NecrologieCardProps> = ({ necrologie }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border"
    >
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-red-400" />
          <span className="text-sm font-semibold">Avis de Décès</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-dark mb-1">{necrologie.nomDefunt}</h3>
        <p className="text-sm text-muted mb-4">{necrologie.famille}</p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <div>
              <p className="text-muted">Décès : {necrologie.dateDeces}</p>
              <p className="font-semibold">Enterrement : {necrologie.dateEnterrement}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{necrologie.lieuEnterrement}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-primary" />
            <span>{necrologie.contact}</span>
          </div>
        </div>

        {necrologie.message && (
          <div className="mt-4 bg-background p-4 rounded-xl italic text-dark text-sm border-l-4 border-primary">
            "{necrologie.message}"
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NecrologieCard;