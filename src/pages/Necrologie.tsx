import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart,
  Phone,
  Flower,
  Plus,
  Search,
  X,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import NecrologieCard from '../components/NecrologieCard';
import { necrologiesData } from '../data/necrologies';
import { PRICES, CONTACT } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const Necrologie: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNecrologies = necrologiesData.filter(
    (necrologie) =>
      necrologie.nomDefunt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      necrologie.famille.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-red-400" />
              <span className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm">
                Hommage et mémoire
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Avis de décès et remerciements
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Un espace pour honorer la mémoire de nos proches disparus et informer la communauté des obsèques.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/publier/parcours"
                className="bg-red-500 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-red-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                Publier un avis de décès
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {formatFCFA(PRICES.NECROLOGIE)}
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Message de compassion */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-red-50 to-gray-50 rounded-2xl p-6 border border-red-200">
          <div className="flex items-start gap-4">
            <Flower className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="text-dark italic">
                "DjougouCity présente ses sincères condoléances à toutes les familles en deuil.
                Cet espace est dédié à la mémoire de nos chers disparus."
              </p>
              <p className="text-sm text-muted mt-2">— L'équipe DjougouCity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recherche */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Rechercher un défunt ou une famille..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-full border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </section>

      {/* Liste des avis de décès */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {filteredNecrologies.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-xl text-muted">Aucun avis de décès trouvé</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNecrologies.map((necrologie) => (
              <NecrologieCard key={necrologie.id} necrologie={necrologie} />
            ))}
          </div>
        )}
      </section>

      {/* Informations pratiques */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-display font-bold text-dark mb-6">
              Comment publier un avis de décès
            </h3>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Contactez-nous',
                  description: `Appelez le ${CONTACT.PHONE} ou rendez-vous à la Mairie de Djougou.`,
                },
                {
                  step: 2,
                  title: 'Fournissez les informations',
                  description: "Nom du défunt, dates, lieu d'enterrement, photo et message.",
                },
                {
                  step: 3,
                  title: 'Effectuez le paiement',
                  description: `${formatFCFA(PRICES.NECROLOGIE)} par Mobile Money ou en espèces.`,
                },
                {
                  step: 4,
                  title: 'Publication',
                  description: 'Votre avis sera publié dans les 2 heures et reste visible 30 jours.',
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.step * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 bg-card p-5 rounded-xl border border-border"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-dark">{item.title}</h4>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Tarif */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h4 className="font-bold text-dark mb-3">Tarif</h4>
              <p className="text-3xl font-display font-bold text-primary mb-2">
                {formatFCFA(PRICES.NECROLOGIE)}
              </p>
              <p className="text-sm text-muted">par avis publié, paiement sécurisé</p>
              <p className="text-xs text-muted mt-3">
                Ce service contribue au maintien de la plateforme.
              </p>
            </div>

            {/* Contact urgence */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Contact d'urgence
              </h4>
              <p className="text-2xl font-bold text-primary mb-2">{CONTACT.PHONE}</p>
              <p className="text-sm text-muted mb-4">
                Disponible 24h/24 pour les avis de décès urgents.
              </p>
              <a
                href={`tel:${CONTACT.PHONE.replace(/\s/g, '')}`}
                className="block w-full bg-primary text-white text-center py-3 rounded-full font-bold hover:bg-dark transition-colors"
              >
                Appeler maintenant
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 pb-16 text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gray-100 rounded-3xl p-10"
        >
          <Heart className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-display font-bold text-dark mb-3">
            Honorez la mémoire de vos proches
          </h3>
          <p className="text-muted mb-6 max-w-2xl mx-auto">
            Publiez un avis de décès pour informer la communauté et partager votre hommage.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/publier"
              className="bg-primary text-white px-7 py-3 rounded-full font-bold hover:bg-dark transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Publier un avis ({formatFCFA(PRICES.NECROLOGIE)})
            </Link>
            <Link
              to="/contact"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-7 py-3 rounded-full font-bold transition-all"
            >
              Nous contacter
            </Link>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default Necrologie;