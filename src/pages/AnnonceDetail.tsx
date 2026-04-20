import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Calendar, Eye, Crown } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { annoncesData } from '../data/annonces';
import { formatFCFA, formatDate } from '../utils/formatPrice';

const AnnonceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const annonce = annoncesData.find(a => a.id === id);

  if (!annonce) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Annonce introuvable</h2>
          <p className="text-muted mb-6">Cette annonce n'existe pas ou a été supprimée.</p>
          <Link to="/annonces" className="text-primary font-semibold hover:underline">
            Retour aux annonces
          </Link>
        </div>
      </MainLayout>
    );
  }

  const categorieColors = {
  vente: 'bg-success/10 text-success',
  location: 'bg-blue-100 text-blue-700',
  service: 'bg-purple-100 text-purple-700',
  emploi: 'bg-orange-100 text-orange-700',
  don: 'bg-pink-100 text-pink-700',
  perdu: 'bg-yellow-100 text-yellow-700',
  recherche: 'bg-cyan-100 text-cyan-700'
  };

  return (
    <MainLayout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/annonces')}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-5 md:mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux annonces
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* En-tête */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categorieColors[annonce.categorie]}`}>
                {annonce.categorie}
              </span>
              {annonce.estPremium && (
                <span className="flex items-center gap-1 bg-secondary text-dark px-3 py-1 rounded-full text-xs font-bold">
                  <Crown className="w-3 h-3" /> Premium
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-dark mb-4">
              {annonce.titre}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Publié le {formatDate(annonce.datePublication)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {annonce.vues} vues
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {annonce.localisation}
              </span>
            </div>
          </div>

          {/* Images */}
          {annonce.images.length > 0 && (
            <div className="mb-8">
              <img
                src={annonce.images[0]}
                alt={annonce.titre}
                className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-xl md:rounded-2xl"
              />
              {annonce.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {annonce.images.slice(1).map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-full h-20 object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Détails */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-dark mb-4">Description</h2>
              <p className="text-muted leading-relaxed whitespace-pre-line">
                {annonce.description}
              </p>
            </div>
            <div className="bg-background rounded-2xl p-6 h-fit">
              <p className="text-sm text-muted mb-1">Prix</p>
              <p className="text-3xl font-display font-bold text-primary mb-4">
                {annonce.prix ? formatFCFA(annonce.prix) : 'Gratuit / Don'}
              </p>
              
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted" />
                  <span className="text-dark">{annonce.localisation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted" />
                  <a href={`tel:${annonce.contact.replace(/\s/g, '')}`} className="text-primary font-semibold">
                    {annonce.contact}
                  </a>
                </div>
              </div>

              <a
                href={`tel:${annonce.contact.replace(/\s/g, '')}`}
                className="mt-6 flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-full font-bold hover:bg-dark transition-colors"
              >
                <Phone className="w-4 h-4" />
                Contacter l'auteur
              </a>
            </div>
          </div>
        </motion.div>
      </article>
    </MainLayout>
  );
};

export default AnnonceDetail;