import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Phone,
  CloudRain,
  Plus,
  Search,
  X,
  MapPin,
  Radio,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import AlerteCard from '../components/NecrologieCard';
import { supabase } from '../lib/supabase';
import { alertesData as staticAlertes } from '../data/necrologies';
import {  CONTACT } from '../utils/constants';
import type { Alerte } from '../types';

const AlertesTrafic: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [alertes, setAlertes] = useState<Alerte[]>(staticAlertes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlertes = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('alertes')
          .select('*')
          .eq('estActive', true)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) setAlertes(data as Alerte[]);
      } catch (error) {
        console.error('Erreur lors du chargement des alertes trafic:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertes();
  }, []);

  const filteredAlertes = alertes.filter(
    (alerte) =>
      alerte.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alerte.localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alerte.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques des alertes actives
  const alertesActives = alertes.filter(a => a.estActive);
  const alertesCritiques = alertesActives.filter(a => a.niveau === 'rouge' || a.niveau === 'orange');

  return (
    <MainLayout>
      {/* Indicateur de chargement discret */}
      {loading && (
        <div className="fixed bottom-4 right-4 z-50 bg-card shadow-lg rounded-full px-4 py-2 text-sm text-muted border border-border">
          Mise à jour des alertes trafic...
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-900 to-orange-800 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
              <span className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm">
                Info trafic en temps réel
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Alertes routières et perturbations
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Accidents, contrôles, météo, état des routes : restez informé pour mieux planifier vos trajets.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/publier"
                className="bg-yellow-500 text-dark px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all"
              >
                <Plus className="w-5 h-5" />
                Signaler une alerte
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  Gratuit
                </span>
              </Link>
              {alertesCritiques.length > 0 && (
                <span className="bg-red-600/80 backdrop-blur-sm px-4 py-3 rounded-full text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {alertesCritiques.length} alerte(s) critique(s) en cours
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Message d'information */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <Radio className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <p className="text-dark">
                "CITransports relaie les informations trafic de sources officielles (OSER, SODEXAM, Police) 
                et de la communauté des transporteurs. Vérifiez toujours les conditions avant de prendre la route."
              </p>
              <p className="text-sm text-muted mt-2">— L'équipe CITransports</p>
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
            placeholder="Rechercher par localisation, type d'alerte..."
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

      {/* Liste des alertes */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {filteredAlertes.length === 0 ? (
          <div className="text-center py-20">
            <CloudRain className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-xl text-muted">Aucune alerte trouvée</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted">
                {filteredAlertes.length} alerte(s) {searchTerm && 'trouvée(s)'}
              </p>
              <div className="flex gap-2">
                <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">Critique</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">Alerte</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Vigilance</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlertes.map((alerte) => (
                <AlerteCard key={alerte.id} alerte={alerte} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Informations pratiques */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-display font-bold text-dark mb-6">
              Comment signaler une alerte
            </h3>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Appelez ou utilisez WhatsApp',
                  description: `Contactez-nous au ${CONTACT.PHONE} ou via WhatsApp pour signaler un incident.`,
                },
                {
                  step: 2,
                  title: 'Donnez les détails',
                  description: "Type d'alerte (accident, pluie, contrôle...), localisation précise, gravité.",
                },
                {
                  step: 3,
                  title: 'Photo (optionnel)',
                  description: 'Envoyez une photo pour aider les autres conducteurs.',
                },
                {
                  step: 4,
                  title: 'Publication immédiate',
                  description: 'Votre alerte est publiée en temps réel et reste active selon la situation.',
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
            {/* Gratuité */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h4 className="font-bold text-dark mb-3">Service 100% gratuit</h4>
              <p className="text-3xl font-display font-bold text-green-600 mb-2">
                Gratuit
              </p>
              <p className="text-sm text-muted">
                Le signalement d'alertes trafic est gratuit pour tous les utilisateurs.
              </p>
              <p className="text-xs text-muted mt-3">
                Contribuez à la sécurité de tous les usagers de la route.
              </p>
            </div>

            {/* Contact urgence */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Signalement urgent
              </h4>
              <p className="text-2xl font-bold text-primary mb-2">{CONTACT.PHONE}</p>
              <p className="text-sm text-muted mb-4">
                WhatsApp disponible 7j/7 pour les signalements urgents.
              </p>
              <a
                href={`tel:${CONTACT.PHONE.replace(/\s/g, '')}`}
                className="block w-full bg-primary text-white text-center py-3 rounded-full font-bold hover:bg-dark transition-colors"
              >
                Appeler maintenant
              </a>
            </div>

            {/* Sources */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-bold text-dark mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Sources officielles
              </h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• OSER (Office de Sécurité Routière)</li>
                <li>• SODEXAM (Météo)</li>
                <li>• Police Routière</li>
                <li>• Communauté des transporteurs</li>
              </ul>
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
          className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-10 border border-yellow-200"
        >
          <AlertTriangle className="w-14 h-14 text-orange-500 mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-display font-bold text-dark mb-3">
            Vous avez vu un incident sur la route ?
          </h3>
          <p className="text-muted mb-6 max-w-2xl mx-auto">
            Signalez-le gratuitement pour aider les autres transporteurs à éviter les difficultés.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/publier/alerte/packs"
              className="bg-primary text-white px-7 py-3 rounded-full font-bold hover:bg-dark transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Signaler une alerte (gratuit)
            </Link>
            <a
              href={`https://wa.me/${CONTACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-7 py-3 rounded-full font-bold transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default AlertesTrafic;