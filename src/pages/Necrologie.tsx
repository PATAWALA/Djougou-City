import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Phone,
  Flower,
  Plus,
  Search,
  TrendingUp
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NecrologieCard from '../components/NecrologieCard';
import { necrologiesData } from '../data/necrologies';
import { PRICES} from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const Necrologie: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('tous');

  const mois = [
    { id: 'tous', label: 'Tous les avis' },
    { id: 'avril', label: 'Avril 2026' },
    { id: 'mars', label: 'Mars 2026' }
  ];

  const filteredNecrologies = necrologiesData.filter(necrologie => {
    const matchSearch = necrologie.nomDefunt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       necrologie.famille.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const statsNecrologie = {
    total: necrologiesData.length,
    revenuPotentiel: necrologiesData.length * PRICES.NECROLOGIE,
    ceMois: necrologiesData.filter(n => n.dateDeces.includes('Avril')).length
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-red-400" />
                <span className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm">
                  Hommage et memoire
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Avis de Deces et Remerciements
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Un espace pour honorer la memoire de nos proches disparus et informer 
                la communaute des obseques.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/publier-avis-deces"
                  className="bg-red-500 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-red-600 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Publier un avis de deces
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {formatFCFA(PRICES.NECROLOGIE)}
                  </span>
                </a>
                <a
                  href="#stats"
                  className="border-2 border-white/30 hover:bg-white/10 px-6 py-3 rounded-full font-bold backdrop-blur-sm transition-all"
                >
                  Voir les informations
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section id="stats" className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
              <p className="text-2xl font-bold text-dark">{statsNecrologie.total}</p>
              <p className="text-sm text-muted">Avis publies</p>
            </div>
            <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
              <p className="text-2xl font-bold text-primary">{statsNecrologie.ceMois}</p>
              <p className="text-sm text-muted">Ce mois</p>
            </div>
            <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
              <p className="text-2xl font-bold text-success">{formatFCFA(statsNecrologie.revenuPotentiel)}</p>
              <p className="text-sm text-muted">Revenu potentiel</p>
            </div>
          </div>
        </section>

        {/* Message de compassion */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-red-50 to-gray-50 rounded-2xl p-6 border border-red-200">
            <div className="flex items-start gap-4">
              <Flower className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <p className="text-dark italic">
                  "DjougouCity presente ses sinceres condoleances a toutes les familles en deuil. 
                  Cet espace est dedie a la memoire de nos chers disparus."
                </p>
                <p className="text-sm text-muted mt-2">— L'equipe DjougouCity</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recherche et filtres */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="Rechercher un defunt ou une famille..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              {mois.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMonth(m.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedMonth === m.id
                      ? 'bg-primary text-white'
                      : 'bg-card text-dark border border-border hover:bg-background'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Liste des avis de deces */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          {filteredNecrologies.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-muted mx-auto mb-4" />
              <p className="text-xl text-muted">Aucun avis de deces trouve</p>
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
                Comment publier un avis de deces
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Contactez-nous',
                    description: 'Appelez le 67 23 23 39 ou rendez-vous a la Mairie de Djougou.'
                  },
                  {
                    step: 2,
                    title: 'Fournissez les informations',
                    description: 'Nom du defunt, dates, lieu d\'enterrement, photo et message.'
                  },
                  {
                    step: 3,
                    title: 'Effectuez le paiement',
                    description: `${formatFCFA(PRICES.NECROLOGIE)} par Mobile Money ou en especes.`
                  },
                  {
                    step: 4,
                    title: 'Publication',
                    description: 'Votre avis sera publie dans les 2 heures et reste visible 30 jours.'
                  }
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.step * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 bg-card p-4 rounded-xl border border-border"
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
              {/* Potentiel de revenus */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-6">
                <TrendingUp className="w-8 h-8 mb-4" />
                <h4 className="text-xl font-bold mb-2">Service remunerateur</h4>
                <p className="text-purple-100 text-sm mb-4">
                  Chaque avis de deces publie rapporte {formatFCFA(PRICES.NECROLOGIE)}.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span>5 avis / mois</span>
                    <span className="font-bold">{formatFCFA(5 * PRICES.NECROLOGIE)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>10 avis / mois</span>
                    <span className="font-bold">{formatFCFA(10 * PRICES.NECROLOGIE)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>20 avis / mois</span>
                    <span className="font-bold text-yellow-300">{formatFCFA(20 * PRICES.NECROLOGIE)}</span>
                  </div>
                </div>
                <p className="text-xs text-purple-200">
                  Service essentiel pour la communaute, tout en generant des revenus pour la page.
                </p>
              </div>
              
              {/* Contact urgence */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact d'urgence
                </h4>
                <p className="text-2xl font-bold text-primary mb-2">67 23 23 39</p>
                <p className="text-sm text-muted mb-4">Disponible 24h/24 pour les avis de deces urgents.</p>
                <a 
                  href="tel:67232339"
                  className="block w-full bg-primary text-white text-center py-3 rounded-full font-bold hover:bg-dark transition-colors"
                >
                  Appeler maintenant
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gray-100 rounded-3xl p-12"
          >
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-3xl font-display font-bold text-dark mb-4">
              Honorez la memoire de vos proches
            </h3>
            <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
              Publiez un avis de deces pour informer la communaute et partager votre hommage.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/publier-avis-deces"
                className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-dark transition-all"
              >
                Publier un avis ({formatFCFA(PRICES.NECROLOGIE)})
              </a>
              <a
                href="/contact"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
              >
                Nous contacter
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Necrologie;