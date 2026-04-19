import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Crown, Eye, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Annonce } from '../types';
import { formatFCFA } from '../utils/formatPrice';

interface PetiteAnnonceCardProps {
  annonce: Annonce;
}

const PetiteAnnonceCard: React.FC<PetiteAnnonceCardProps> = ({ annonce }) => {
  const categorieColors = {
    vente: 'bg-success/10 text-success',
    location: 'bg-blue-100 text-blue-700',
    service: 'bg-purple-100 text-purple-700',
    emploi: 'bg-orange-100 text-orange-700'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-2xl transition-all flex flex-col h-full"
    >
      {/* Image (non cliquable) */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={annonce.images[0]} 
          alt={annonce.titre}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {annonce.estPremium && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-secondary to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Crown className="w-3 h-3" /> Premium
          </div>
        )}
        <div className="absolute top-3 right-3 bg-dark/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Eye className="w-3 h-3" /> {annonce.vues}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categorieColors[annonce.categorie]}`}>
            {annonce.categorie}
          </span>
        </div>

        <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2">{annonce.titre}</h3>
        <p className="text-muted text-sm mb-3 line-clamp-2 flex-1">{annonce.description}</p>

        <div className="flex items-center gap-2 text-sm text-muted mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{annonce.localisation}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted">Prix</p>
            <p className="text-2xl font-display font-bold text-primary">
              {formatFCFA(annonce.prix)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions : Contacter + Voir détails */}
      <div className="px-5 pb-5 flex gap-2">
        <a 
          href={`tel:${annonce.contact.replace(/\s/g, '')}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-primary/10 text-primary py-2 rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
        >
          <Phone className="w-4 h-4" />
          Contacter
        </a>
        <Link
          to={`/annonces/${annonce.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-background text-dark py-2 rounded-full text-sm font-semibold border border-border hover:bg-border transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Voir détails
        </Link>
      </div>
    </motion.div>
  );
};

export default PetiteAnnonceCard;