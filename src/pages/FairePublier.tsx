import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, User, FileText, CheckCircle, ArrowLeft, Bus, Package, AlertTriangle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { CONTACT } from '../utils/constants';

const FairePublier: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    type: 'depart',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const typesPublication = [
    { value: 'depart', label: 'Départ de bus / car', icon: Bus },
    { value: 'fret', label: 'Annonce de fret / chargement', icon: Package },
    { value: 'promo', label: 'Promotion ou offre spéciale', icon: Zap },
    { value: 'alerte', label: 'Alerte trafic (accident, météo...)', icon: AlertTriangle },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 md:py-12">
        <div className="max-w-3xl w-full">
          {/* Lien retour accueil */}
          <div className="mb-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-dark mb-4">
              Faites publier pour vous
            </h1>
            <p className="text-muted">
              Remplissez ce formulaire simple. Un agent CITransports vous rappellera dans les 2 heures pour confirmer votre demande et organiser le paiement.
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
                <p className="text-muted">
                  Un agent vous contactera au <strong>{formData.telephone}</strong> très bientôt.
                </p>
                <p className="text-sm text-muted mt-4">
                  Vous pouvez également nous joindre directement au {CONTACT.PHONE}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    <User className="inline w-4 h-4 mr-1" /> Votre nom complet ou compagnie
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none"
                    placeholder="Ex: CITransports ou M. Koné"
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
                    placeholder="Ex: 05 74 36 63 52"
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
                    {typesPublication.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
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
                    placeholder="Ex: Départ Abidjan → Bouaké ce vendredi 8h, car de 30 places, tarif 3000 F..."
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
                  En envoyant ce formulaire, vous acceptez d'être contacté par un agent CITransports.
                </p>
              </form>
            )}
          </motion.div>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-muted">
              Vous préférez venir en personne ? Rendez-vous à notre bureau au Plateau, Abidjan, du lundi au samedi, 8h-18h.
            </p>
            <Link
              to="/auth"
              className="inline-block text-primary font-semibold text-sm hover:underline"
            >
              Vous êtes à l'aise avec le numérique ? Publiez vous-même en créant un compte
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FairePublier;