import React from 'react';
import { motion } from 'framer-motion';
import { User, PhoneCall, ArrowRight, Shield, Clock, ThumbsUp } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const Publier: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold text-dark mb-4">
            Publier sur DjougouCity
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Choisissez comment vous souhaitez publier votre annonce, avis de décès ou article.
            Deux méthodes simples et adaptées à tous.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Option 1 : Je publie moi-même */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-card rounded-3xl shadow-xl border-2 border-primary/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <User className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-display font-bold mb-2">Je publie moi-même</h2>
              <p className="text-white/90">Pour les personnes à l'aise avec le téléphone</p>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Créez un compte gratuit en 1 minute</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Choisissez votre pack et payez en ligne ou par Mobile Money</span>
                </li>
                <li className="flex items-start gap-3">
                  <ThumbsUp className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Publiez immédiatement et gérez vos annonces</span>
                </li>
              </ul>
              
              <a
                href="/publier/moi-meme"
                className="block w-full bg-primary text-white text-center py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors"
              >
                Commencer <ArrowRight className="inline w-5 h-5 ml-2" />
              </a>
              <p className="text-xs text-muted text-center mt-3">
                Création de compte gratuite • Paiement sécurisé
              </p>
            </div>
          </motion.div>

          {/* Option 2 : Faites publier pour moi */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-card rounded-3xl shadow-xl border-2 border-secondary/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-dark to-gray-800 p-6 text-white">
              <PhoneCall className="w-12 h-12 mb-4" />
              <h2 className="text-2xl font-display font-bold mb-2">Faites publier pour moi</h2>
              <p className="text-white/90">Un agent s'occupe de tout pour vous</p>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Remplissez un simple formulaire</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Un agent vous appelle sous 2h pour confirmer</span>
                </li>
                <li className="flex items-start gap-3">
                  <ThumbsUp className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Payez en espèces ou Mobile Money, on publie pour vous</span>
                </li>
              </ul>
              
              <a
                href="/publier/faire-publier"
                className="block w-full bg-secondary text-dark text-center py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors"
              >
                Demander de l'aide <ArrowRight className="inline w-5 h-5 ml-2" />
              </a>
              <p className="text-xs text-muted text-center mt-3">
                Service accompagné • Paiement simple
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Publier;