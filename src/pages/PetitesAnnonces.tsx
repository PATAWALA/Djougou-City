import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  TrendingUp,
  CheckCircle,
  Grid,
  List,
  ShoppingBag,
  Home,
  Briefcase,
  Wrench,
  X,
  Filter,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import PetiteAnnonceCard from '../components/PetiteAnnonceCard';
import { supabase } from '../lib/supabase';
import { annoncesData as staticAnnonces } from '../data/annonces';
import { PRICES, FOLLOWERS } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';
import type { Annonce } from '../types';

const Annonces: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('toutes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [annonces, setAnnonces] = useState<Annonce[]>(staticAnnonces);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'toutes', label: 'Toutes', icon: ShoppingBag },
    { id: 'vente', label: 'Ventes', icon: Home },
    { id: 'location', label: 'Locations', icon: Home },
    { id: 'service', label: 'Services', icon: Wrench },
    { id: 'emploi', label: 'Emplois', icon: Briefcase },
  ];

  useEffect(() => {
    const fetchAnnonces = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('annonces')
          .select('*')
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setAnnonces(data as Annonce[]);
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonces();
  }, []);

  const filteredAnnonces = annonces.filter((annonce) => {
    const matchCategorie = selectedCategorie === 'toutes' || annonce.categorie === selectedCategorie;
    const matchSearch =
      annonce.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategorie && matchSearch;
  });

  const premiumAnnonces = filteredAnnonces.filter((a) => a.estPremium);
  const standardAnnonces = filteredAnnonces.filter((a) => !a.estPremium);

  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">
              Annonces à Djougou et dans le Nord‑Bénin
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6">
              Vendez, achetez, louez ou proposez vos services. Une audience locale de{' '}
              {FOLLOWERS.toLocaleString()} personnes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/publier"
                className="bg-white text-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Publier une annonce
                <span className="bg-primary/10 px-3 py-1 rounded-full text-sm">
                  {formatFCFA(PRICES.ANNONCE)}
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Barre de filtres */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Rechercher une annonce..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2 rounded-full border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategorie(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategorie === cat.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-background text-dark hover:bg-border'
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border-l border-border pl-4 ml-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted hover:bg-background'
                }`}
                title="Vue grille"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-all ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-muted hover:bg-background'
                }`}
                title="Vue liste"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 rounded-full border border-border bg-background text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="p-2 rounded-full bg-background border border-border"
              >
                <Filter className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-background'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-background'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showMobileFilters && (
              <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-border">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategorie(cat.id);
                      setShowMobileFilters(false);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs ${
                      selectedCategorie === cat.id ? 'bg-primary text-white' : 'bg-background'
                    }`}
                  >
                    <cat.icon className="w-3 h-3" />
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted">Chargement des annonces...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Annonces Premium */}
            {premiumAnnonces.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1.5 bg-secondary/20 rounded-full">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                  </div>
                  <h2 className="text-xl font-display font-bold text-dark">Mises en avant</h2>
                  <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-xs font-medium">
                    Premium
                  </span>
                </div>

                <div
                  className={`grid gap-5 ${
                    viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                  }`}
                >
                  {premiumAnnonces.map((annonce) => (
                    <PetiteAnnonceCard key={annonce.id} annonce={annonce} />
                  ))}
                </div>
              </section>
            )}

            {/* Toutes les annonces */}
            <section id="annonces-liste">
              <h2 className="text-xl font-display font-bold text-dark mb-5">
                {selectedCategorie === 'toutes'
                  ? 'Toutes les annonces'
                  : categories.find((c) => c.id === selectedCategorie)?.label}
                <span className="text-muted text-base font-normal ml-2">({filteredAnnonces.length})</span>
              </h2>

              {filteredAnnonces.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-4" />
                  <p className="text-xl text-muted">Aucune annonce trouvée</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategorie('toutes');
                    }}
                    className="mt-4 text-primary font-semibold hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-5 ${
                    viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                  }`}
                >
                  {standardAnnonces.map((annonce) => (
                    <PetiteAnnonceCard key={annonce.id} annonce={annonce} />
                  ))}
                </div>
              )}
            </section>

            {/* Section Pourquoi publier */}
            <section className="mt-16 bg-card rounded-3xl p-8 border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-display font-bold text-dark mb-4">
                    Pourquoi publier sur DjougouCity ?
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Visibilité immédiate auprès de {FOLLOWERS.toLocaleString()} personnes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Annonce active 30 jours, renouvelable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Option Premium pour être en tête des résultats</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-background rounded-2xl p-6">
                  <p className="text-dark font-medium mb-2">💰 Tarif unique</p>
                  <p className="text-3xl font-display font-bold text-primary mb-1">{formatFCFA(PRICES.ANNONCE)}</p>
                  <p className="text-sm text-muted">par annonce, paiement sécurisé</p>
                  <Link
                    to="/publier"
                    className="mt-4 inline-block bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold"
                  >
                    Publier maintenant
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Annonces;