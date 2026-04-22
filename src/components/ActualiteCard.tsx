import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageCircle, Share2, Zap, Calendar, User } from 'lucide-react';
import type { Actualite } from '../types';
import { formatFCFA, formatDate, formatNombre } from '../utils/formatPrice';

interface ActualiteCardProps {
  actualite: Actualite;
  variant?: 'default' | 'compact' | 'featured';
}

const ActualiteCard: React.FC<ActualiteCardProps> = ({ actualite, variant = 'default' }) => {
  // Couleurs par catégorie pour le contexte transport
  const categorieColors: Record<string, string> = {
    transport: 'bg-blue-100 text-blue-700',
    logistique: 'bg-green-100 text-green-700',
    reglementation: 'bg-orange-100 text-orange-700',
    infrastructures: 'bg-purple-100 text-purple-700',
  };

  if (variant === 'compact') {
    return (
      <motion.article
        whileHover={{ y: -3 }}
        className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-all"
      >
        <div className="flex gap-3">
          {actualite.image && (
            <img src={actualite.image} alt={actualite.titre} className="w-16 h-16 rounded-lg object-cover" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {actualite.categorie && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categorieColors[actualite.categorie] || 'bg-gray-100 text-gray-700'}`}>
                  {actualite.categorie}
                </span>
              )}
              {actualite.estBoosted && (
                <span className="bg-secondary/20 text-secondary text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Boost
                </span>
              )}
            </div>
            <h4 className="font-semibold text-dark text-sm line-clamp-2">{actualite.titre}</h4>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(actualite.datePublication)}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> {formatNombre(actualite.likes)}
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card rounded-2xl shadow-xl overflow-hidden border-2 border-secondary"
      >
        <div className="relative h-64">
          <img src={actualite.image} alt={actualite.titre} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 flex gap-2">
            {actualite.categorie && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categorieColors[actualite.categorie] || 'bg-gray-100 text-gray-700'}`}>
                {actualite.categorie}
              </span>
            )}
            {actualite.estBoosted && (
              <div className="bg-secondary text-dark px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Boosté • {formatFCFA(actualite.montantBoost || 0)}
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-muted mb-3">
            <User className="w-4 h-4" />
            <span>{actualite.auteur}</span>
            <span>•</span>
            <Calendar className="w-4 h-4" />
            <span>{formatDate(actualite.datePublication)}</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-dark mb-3">{actualite.titre}</h3>
          <p className="text-muted mb-4">{actualite.contenu}</p>
          <div className="flex items-center gap-6 text-muted">
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" /> {formatNombre(actualite.likes)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> {formatNombre(actualite.commentaires)}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-4 h-4" /> {formatNombre(actualite.partages)}
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-all"
    >
      {actualite.image && (
        <div className="relative h-48">
          <img src={actualite.image} alt={actualite.titre} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 flex gap-2">
            {actualite.categorie && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${categorieColors[actualite.categorie] || 'bg-gray-100 text-gray-700'}`}>
                {actualite.categorie}
              </span>
            )}
            {actualite.estBoosted && (
              <div className="bg-secondary text-dark px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Boost
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted mb-2">
          <User className="w-3 h-3" />
          <span>{actualite.auteur}</span>
          <span>•</span>
          <Calendar className="w-3 h-3" />
          <span>{formatDate(actualite.datePublication)}</span>
        </div>
        <h4 className="text-lg font-bold text-dark mb-2 line-clamp-2">{actualite.titre}</h4>
        <p className="text-muted text-sm mb-3 line-clamp-2">{actualite.contenu}</p>
        <div className="flex items-center gap-4 text-muted text-sm">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" /> {formatNombre(actualite.likes)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" /> {formatNombre(actualite.commentaires)}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-4 h-4" /> {formatNombre(actualite.partages)}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default ActualiteCard;