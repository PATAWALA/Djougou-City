import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, Bookmark, User, Calendar } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { actualitesData } from '../data/actualites';
import { formatDate, formatNombre } from '../utils/formatPrice';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log('ArticleDetail - ID reçu:', id);
  console.log('Articles disponibles:', actualitesData.map(a => a.id));

  const article = actualitesData.find(a => a.id === id);

  if (!article) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Article introuvable</h2>
          <p className="text-muted mb-6">L'article avec l'ID "{id}" n'existe pas ou a été déplacé.</p>
          <Link to="/actualites" className="text-primary font-semibold hover:underline">
            Retour aux actualités
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/actualites')}
          className="inline-flex items-center gap-2 text-muted hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux actualités
        </button>

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {article.estBoosted && (
            <span className="inline-block bg-secondary text-dark text-xs font-bold px-3 py-1 rounded-full mb-4">
              ⚡ Article boosté
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">
            {article.titre}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" /> {article.auteur}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {formatDate(article.datePublication)}
            </span>
          </div>
        </motion.div>

        {/* Image */}
        {article.image && (
          <motion.img
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            src={article.image}
            alt={article.titre}
            className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none text-dark leading-relaxed mb-8"
        >
          <p className="whitespace-pre-line">{article.contenu}</p>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-6 py-6 border-t border-border">
          <button className="flex items-center gap-2 text-muted hover:text-primary transition-colors">
            <ThumbsUp className="w-5 h-5" />
            <span>{formatNombre(article.likes)}</span>
          </button>
          <button className="flex items-center gap-2 text-muted hover:text-primary transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{formatNombre(article.commentaires)}</span>
          </button>
          <button className="flex items-center gap-2 text-muted hover:text-primary transition-colors">
            <Share2 className="w-5 h-5" />
            <span>{formatNombre(article.partages)}</span>
          </button>
          <button className="flex items-center gap-2 text-muted hover:text-primary transition-colors ml-auto">
            <Bookmark className="w-5 h-5" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </article>
    </MainLayout>
  );
};

export default ArticleDetail;