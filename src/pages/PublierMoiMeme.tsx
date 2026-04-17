import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Newspaper, ChevronRight } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const PublierMoiMeme: React.FC = () => {
  const options = [
    {
      type: 'annonce',
      icon: ShoppingBag,
      titre: 'Petite Annonce',
      description: 'Vendez un objet, proposez un service ou publiez une offre d\'emploi',
      packs: ['Basic (500F)', 'Standard (1000F)', 'Premium (2500F)'],
      href: '/publier/annonce/pack'
    },
    {
      type: 'necrologie',
      icon: Heart,
      titre: 'Avis de Décès',
      description: 'Annoncez un décès et les obsèques à la communauté',
      packs: ['Simple (1000F)', 'Hommage (2500F)', 'Cérémonie (5000F)'],
      href: '/publier/necrologie/pack'
    },
    {
      type: 'article',
      icon: Newspaper,
      titre: 'Article Boosté',
      description: 'Donnez de la visibilité à votre actualité ou communiqué',
      packs: ['Coup de pouce (1000F)', 'Visibilité (3000F)', 'Viral (5000F)'],
      href: '/publier/article/pack'
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold text-dark text-center mb-4">
          Que souhaitez-vous publier ?
        </h1>
        <p className="text-muted text-center mb-12">
          Choisissez le type de publication, puis sélectionnez un pack adapté à vos besoins.
        </p>

        <div className="space-y-4">
          {options.map((option) => (
            <motion.a
              key={option.type}
              href={option.href}
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-2xl p-6 shadow-lg border border-border flex items-center gap-6 hover:shadow-xl transition-all"
            >
              <div className="p-4 bg-primary/10 rounded-xl">
                <option.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-dark mb-1">{option.titre}</h3>
                <p className="text-muted text-sm mb-2">{option.description}</p>
                <div className="flex gap-2">
                  {option.packs.map((pack, idx) => (
                    <span key={idx} className="text-xs bg-background px-3 py-1 rounded-full text-dark">
                      {pack}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-muted" />
            </motion.a>
          ))}
        </div>

        <div className="mt-8 p-6 bg-background rounded-2xl border border-border">
          <p className="text-sm text-muted text-center">
            Vous ne savez pas quel pack choisir ? <a href="/contact" className="text-primary font-semibold">Contactez-nous</a>, un conseiller vous guidera.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PublierMoiMeme;