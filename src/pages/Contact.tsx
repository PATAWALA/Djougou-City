import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Users,
  Store,
  Megaphone,
  CheckCircle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CONTACT, FOLLOWERS, PRICES } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    sujet: 'sponsor',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const sujets = [
    { value: 'sponsor', label: 'Devenir Sponsor', prix: formatFCFA(PRICES.SPONSOR) + '/mois' },
    { value: 'annonce', label: 'Publier une annonce', prix: formatFCFA(PRICES.ANNONCE) },
    { value: 'necrologie', label: 'Avis de deces', prix: formatFCFA(PRICES.NECROLOGIE) },
    { value: 'boost', label: 'Booster un article', prix: formatFCFA(PRICES.BOOST_ARTICLE) },
    { value: 'premium', label: 'Abonnement Premium', prix: formatFCFA(PRICES.PREMIUM) + '/mois' },
    { value: 'autre', label: 'Autre demande', prix: 'Sur devis' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-secondary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Contactez l'equipe DjougouCity
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Vous souhaitez devenir sponsor, publier une annonce ou simplement nous parler ? 
                Nous sommes la pour vous aider.
              </p>
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{FOLLOWERS.toLocaleString()} followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Reponse sous 2h</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact rapide */}
        <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-dark mb-1">Telephone</h3>
              <p className="text-xl font-semibold text-primary mb-2">{CONTACT.PHONE}</p>
              <p className="text-xs text-muted">Appel et WhatsApp</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-dark mb-1">Adresse</h3>
              <p className="text-sm text-muted">{CONTACT.ADDRESS}</p>
              <p className="text-xs text-muted mt-2">Lun-Sam, 8h-18h</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-dark mb-1">Email</h3>
              <p className="text-sm text-primary">{CONTACT.EMAIL}</p>
              <p className="text-xs text-muted mt-2">Reponse sous 24h</p>
            </div>
          </div>
        </section>

        {/* Formulaire de contact */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-3xl shadow-xl border border-border p-8"
              >
                <h2 className="text-2xl font-display font-bold text-dark mb-6">
                  Envoyez-nous un message
                </h2>
                
                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-success/10 border border-success/30 rounded-xl p-8 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-dark mb-2">Message envoye !</h3>
                    <p className="text-muted">
                      Nous vous repondrons dans les plus brefs delais.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Telephone
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.telephone}
                          onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="97 12 34 56"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">
                          Email (optionnel)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          placeholder="exemple@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Sujet
                      </label>
                      <select
                        value={formData.sujet}
                        onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        {sujets.map((sujet) => (
                          <option key={sujet.value} value={sujet.value}>
                            {sujet.label} {sujet.prix !== 'Sur devis' && `- ${sujet.prix}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        placeholder="Decrivez votre demande..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </button>
                    
                    <p className="text-xs text-muted text-center">
                      En envoyant ce message, vous acceptez d'etre contacte par notre equipe.
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
            
            <div className="space-y-6">
              {/* Services */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  Nos services
                </h3>
                <ul className="space-y-3">
                  {sujets.filter(s => s.value !== 'autre').map((service) => (
                    <li key={service.value} className="flex items-center justify-between">
                      <span className="text-sm">{service.label}</span>
                      <span className="font-bold text-primary text-sm">{service.prix}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Potentiel */}
              <div className="bg-gradient-to-br from-dark to-gray-900 text-white rounded-2xl p-6">
                <Megaphone className="w-8 h-8 mb-4 text-secondary" />
                <h3 className="text-xl font-bold mb-2">Pourquoi nous contacter ?</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Touchez {FOLLOWERS.toLocaleString()} personnes a Djougou</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Audience locale et qualifiee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Tarifs adaptes aux realites locales</span>
                  </li>
                </ul>
              </div>
              
              {/* WhatsApp */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <h4 className="font-bold text-dark">WhatsApp</h4>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-2">{CONTACT.PHONE}</p>
                <p className="text-sm text-muted mb-4">Reponse rapide par WhatsApp</p>
                <a
                  href={`https://wa.me/229${CONTACT.PHONE.replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-full font-bold hover:bg-green-700 transition-colors"
                >
                  Discuter sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;