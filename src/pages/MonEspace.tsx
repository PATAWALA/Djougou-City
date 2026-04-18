import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Newspaper, Plus } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const MonEspace: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold text-dark mb-2">Mon Espace</h1>
        <p className="text-muted mb-8">Que souhaitez-vous faire aujourd'hui ?</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Publier une annonce */}
          <Link
            to="/publier/annonce/packs"
            className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group"
          >
            <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">Publier une annonce</h3>
            <p className="text-muted text-sm mb-4">Vendez un objet, proposez un service ou recrutez.</p>
            <span className="text-primary font-semibold flex items-center gap-1 group-hover:gap-2">
              Commencer <Plus className="w-4 h-4" />
            </span>
          </Link>

          {/* Publier un avis de décès */}
          <Link
            to="/publier/necrologie/packs"
            className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group"
          >
            <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">Avis de décès</h3>
            <p className="text-muted text-sm mb-4">Annoncez un décès et les obsèques à la communauté.</p>
            <span className="text-primary font-semibold flex items-center gap-1 group-hover:gap-2">
              Commencer <Plus className="w-4 h-4" />
            </span>
          </Link>

          {/* Booster un article */}
          <Link
            to="/publier/article/packs"
            className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group"
          >
            <div className="p-3 bg-primary/10 rounded-xl inline-block mb-4">
              <Newspaper className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">Booster un article</h3>
            <p className="text-muted text-sm mb-4">Donnez de la visibilité à votre actualité.</p>
            <span className="text-primary font-semibold flex items-center gap-1 group-hover:gap-2">
              Commencer <Plus className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default MonEspace;