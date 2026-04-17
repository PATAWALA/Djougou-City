import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, User, FileText, CheckCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const FairePublier: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    type: 'annonce',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Ici on pourrait envoyer un email ou une notification à l'admin
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-4">
            Faites publier pour vous
          </h1>
          <p className="text-muted">
            Remplissez ce formulaire simple. Un de nos agents vous appellera dans les 2 heures pour confirmer votre demande et organiser le paiement.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl shadow-xl border border-border p-8"
        >
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-dark mb-2">Demande envoyée !</h3>
              <p className="text-muted">Un agent vous contactera au {formData.telephone} très bientôt.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  <User className="inline w-4 h-4 mr-1" /> Votre nom complet
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  placeholder="Ex: Moussa Yaya"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  <Phone className="inline w-4 h-4 mr-1" /> Numéro de téléphone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                  placeholder="Ex: 97 12 34 56"
                />
                <p className="text-xs text-muted mt-1">Un agent vous appellera à ce numéro</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Type de publication
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                >
                  <option value="annonce">Petite Annonce</option>
                  <option value="necrologie">Avis de Décès</option>
                  <option value="article">Article Boosté</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  <FileText className="inline w-4 h-4 mr-1" /> Décrivez brièvement ce que vous voulez publier
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none resize-none"
                  placeholder="Ex: Je vends une moto Bajaj Boxer 100cc, année 2025, état neuf, prix 450 000 F..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Envoyer ma demande
              </button>
              
              <p className="text-xs text-muted text-center">
                En envoyant ce formulaire, vous acceptez d'être contacté par un agent DjougouCity.
              </p>
            </form>
          )}
        </motion.div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            Vous préférez venir en personne ? Rendez-vous à la Mairie de Djougou, du lundi au samedi, 8h-18h.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default FairePublier;