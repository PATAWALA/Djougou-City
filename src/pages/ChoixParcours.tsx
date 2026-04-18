import React from 'react';
import { motion } from 'framer-motion';
import { User, PhoneCall, ArrowRight, Shield, Clock, ThumbsUp } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const ChoixParcours: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'annonce';
  const pack = searchParams.get('pack') || 'standard';

  return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark mb-3">
            Comment souhaitez-vous publier ?
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Vous avez choisi le pack <span className="font-semibold text-primary capitalize">{pack}</span> pour une {type === 'annonce' ? 'petite annonce' : type === 'necrologie' ? 'avis de décès' : 'article boosté'}.<br />
            Sélectionnez la méthode qui vous convient le mieux.
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
              <h2 className="text-2xl font-display font-bold mb-2">Je publie moi‑même</h2>
              <p className="text-white/90">Pour les personnes à l'aise avec le numérique</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Créez un compte gratuit en 1 minute</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Complétez votre annonce en quelques étapes</span>
                </li>
                <li className="flex items-start gap-3">
                  <ThumbsUp className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Publiez immédiatement et suivez vos performances</span>
                </li>
              </ul>
              <Link
                to={`/auth?redirect=/publier/${type}/form?pack=${pack}`}
                className="block w-full bg-primary text-white text-center py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors"
              >
                Continuer <ArrowRight className="inline w-5 h-5 ml-2" />
              </Link>
              <p className="text-xs text-muted text-center mt-3">
                Connexion ou inscription rapide
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
              <p className="text-white/90">Un agent s'occupe de tout à votre place</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Remplissez un simple formulaire</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Un agent vous rappelle sous 2h pour confirmer</span>
                </li>
                <li className="flex items-start gap-3">
                  <ThumbsUp className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-dark">Payez en espèces ou Mobile Money, on publie pour vous</span>
                </li>
              </ul>
              <Link
                to={`/publier/faire-publier?type=${type}&pack=${pack}`}
                className="block w-full bg-secondary text-dark text-center py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors"
              >
                Demander de l'aide <ArrowRight className="inline w-5 h-5 ml-2" />
              </Link>
              <p className="text-xs text-muted text-center mt-3">
                Service accompagné • Paiement simplifié
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/publier" className="text-primary font-semibold hover:underline">
            ← Revenir au choix du pack
          </Link>
        </div>
      </div>
  );
};

export default ChoixParcours;