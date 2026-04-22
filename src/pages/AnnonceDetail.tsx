import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Calendar, Eye, Crown, Truck, Package, Clock } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { annoncesData } from '../data/annonces';
import { formatFCFA, formatDate, formatNombre } from '../utils/formatPrice';

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

  const categorieColors: Record<string, string> = {
    vente: 'bg-green-100 text-green-700',
    location: 'bg-blue-100 text-blue-700',
    service: 'bg-purple-100 text-purple-700',
    emploi: 'bg-orange-100 text-orange-700',
    depart: 'bg-emerald-100 text-emerald-700',
    arrivage: 'bg-cyan-100 text-cyan-700',
    chargement: 'bg-amber-100 text-amber-700',
  };

  const getCategorieLabel = (cat: string): string => {
    const labels: Record<string, string> = {
      vente: 'Vente',
      location: 'Location',
      service: 'Service',
      emploi: 'Emploi',
      depart: 'Départ',
      arrivage: 'Arrivage',
      chargement: 'Chargement',
    };
    return labels[cat] || cat;
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
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categorieColors[annonce.categorie] || 'bg-gray-100 text-gray-700'}`}>
                {getCategorieLabel(annonce.categorie)}
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
                <Eye className="w-4 h-4" /> {formatNombre(annonce.vues)} vues
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

              {/* Informations supplémentaires selon catégorie */}
              {annonce.categorie === 'depart' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Départ prévu : consultez les horaires dans la description ou contactez l'annonceur.
                  </p>
                </div>
              )}
              {annonce.categorie === 'chargement' && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm font-medium text-amber-800 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Marchandises à transporter : volume et poids à confirmer avec l'annonceur.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-background rounded-2xl p-6 h-fit">
              <p className="text-sm text-muted mb-1">
                {annonce.categorie === 'location' ? 'Loyer / jour' : 
                 annonce.categorie === 'service' ? 'À partir de' : 
                 annonce.prix !== null ? 'Prix' : ''}
              </p>
              <p className="text-3xl font-display font-bold text-primary mb-4">
                {annonce.prix !== null ? formatFCFA(annonce.prix) : 'Gratuit'}
              </p>
              
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted shrink-0" />
                  <span className="text-dark">{annonce.localisation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted shrink-0" />
                  <a href={`tel:${annonce.contact.replace(/\s/g, '')}`} className="text-primary font-semibold">
                    {annonce.contact}
                  </a>
                </div>
                {annonce.categorie === 'depart' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-muted shrink-0" />
                    <span className="text-dark">Départ de bus / car</span>
                  </div>
                )}
              </div>

              <a
                href={`tel:${annonce.contact.replace(/\s/g, '')}`}
                className="mt-6 flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-full font-bold hover:bg-dark transition-colors"
              >
                <Phone className="w-4 h-4" />
                Contacter l'annonceur
              </a>

              {/* Bouton WhatsApp pour contact rapide */}
              <a
                href={`https://wa.me/225${annonce.contact.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 w-full border border-green-600 text-green-600 py-2.5 rounded-full font-semibold hover:bg-green-50 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </article>
    </MainLayout>
  );
};

export default AnnonceDetail;