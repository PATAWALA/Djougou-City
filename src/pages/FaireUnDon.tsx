import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Coffee,
  Shield,
  Smartphone,
  CreditCard,
  Users,
  Globe,
  Award
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FOLLOWERS } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const FaireUnDon: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'especes'>('mobile');

  const montantsPredefinis = [
    { value: 1000, label: '1 000 F', description: 'Un petit coup de pouce' },
    { value: 2000, label: '2 000 F', description: 'Soutien regulier' },
    { value: 5000, label: '5 000 F', description: 'Don genereux' },
    { value: 10000, label: '10 000 F', description: 'Grand soutien' }
  ];

  const impactDons = [
    { montant: 1000, impact: 'Aide a maintenir le site en ligne pendant 1 jour' },
    { montant: 5000, impact: 'Couvre les frais d hebergement pour une semaine' },
    { montant: 10000, impact: 'Permet d ameliorer les fonctionnalites du site' },
    { montant: 25000, impact: 'Finance le developpement de nouvelles sections' }
  ];

  const montantFinal = selectedAmount === 'custom' 
    ? parseInt(customAmount) || 0 
    : selectedAmount;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex p-4 bg-white/20 rounded-full mb-6">
                <Heart className="w-12 h-12" />
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Soutenez DjougouCity
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Votre don nous aide a maintenir cette plateforme gratuite et independante 
                pour toute la communaute de Djougou.
              </p>
              <div className="flex items-center justify-center gap-3 text-sm">
                <Shield className="w-4 h-4" />
                <span>Paiement 100% securise</span>
                <span className="mx-2">•</span>
                <Globe className="w-4 h-4" />
                <span>Transparence totale</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pourquoi donner */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-display font-bold text-dark mb-8">
                Pourquoi votre don est important
              </h2>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-6 shadow-lg border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark mb-2">
                        Une communaute de {FOLLOWERS.toLocaleString()} personnes
                      </h3>
                      <p className="text-muted leading-relaxed">
                        DjougouCity est la plateforme de reference pour les habitants de Djougou 
                        et du Nord-Benin. Nous fournissons des informations gratuites, des petites 
                        annonces abordables et un espace pour les familles.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-6 shadow-lg border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-success/10 rounded-xl">
                      <Award className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark mb-2">
                        Independant et local
                      </h3>
                      <p className="text-muted leading-relaxed">
                        Contrairement aux grandes plateformes internationales, DjougouCity est 
                        gere localement par des personnes qui comprennent les realites de Djougou. 
                        Votre don nous permet de rester independants.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-dark to-gray-900 text-white rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6">Impact de votre don</h3>
              <div className="space-y-4">
                {impactDons.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <p className="text-secondary font-bold text-lg mb-1">
                      {formatFCFA(item.montant)}
                    </p>
                    <p className="text-gray-300 text-sm">{item.impact}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-secondary/10 rounded-xl border border-secondary/30">
                <p className="text-sm text-gray-300">
                  Chaque don, meme modeste, fait une difference pour maintenir 
                  DjougouCity accessible a tous.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Formulaire de don */}
        <section className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-display font-bold text-dark mb-6 text-center">
                Choisissez le montant de votre don
              </h2>
              
              {/* Montants predefinis */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {montantsPredefinis.map((montant) => (
                  <button
                    key={montant.value}
                    onClick={() => setSelectedAmount(montant.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAmount === montant.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="text-xl font-bold text-dark">{montant.label}</p>
                    <p className="text-xs text-muted mt-1">{montant.description}</p>
                  </button>
                ))}
              </div>

              {/* Montant personnalise */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedAmount('custom')}
                  className={`w-full p-4 rounded-xl border-2 transition-all mb-3 ${
                    selectedAmount === 'custom'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-semibold text-dark">Montant personnalise</span>
                </button>
                
                {selectedAmount === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="relative"
                  >
                    <input
                      type="number"
                      placeholder="Entrez le montant en FCFA"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg"
                      min="500"
                      step="500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                      FCFA
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Methode de paiement */}
              <div className="mb-8">
                <h3 className="font-semibold text-dark mb-3">Methode de paiement</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === 'mobile'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-dark">Mobile Money</p>
                      <p className="text-xs text-muted">MTN, Moov</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('especes')}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === 'especes'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-dark">Especes</p>
                      <p className="text-xs text-muted">A la Mairie</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recapitulatif */}
              <div className="bg-background rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted">Montant de votre don</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatFCFA(montantFinal)}
                  </span>
                </div>
                {paymentMethod === 'mobile' && (
                  <div className="text-sm text-muted">
                    <p className="mb-2">Numeros Mobile Money :</p>
                    <p className="font-mono bg-white p-2 rounded">MTN : 67 23 23 39</p>
                    <p className="font-mono bg-white p-2 rounded mt-1">Moov : 95 67 89 00</p>
                  </div>
                )}
                {paymentMethod === 'especes' && (
                  <div className="text-sm text-muted">
                    <p>Vous pouvez deposer votre don a l'adresse :</p>
                    <p className="font-semibold text-dark mt-2">Mairie, Djougou, Benin, 125</p>
                  </div>
                )}
              </div>

              {/* Bouton de confirmation */}
              <button
                className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Confirmer mon don de {formatFCFA(montantFinal)}
              </button>
              
              <p className="text-center text-xs text-muted mt-4">
                En faisant un don, vous acceptez nos conditions d'utilisation.
                Aucun remboursement possible.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Temoignages / Confiance */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-bold text-dark">
              Ils nous soutiennent
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { nom: 'Restaurant La Terrasse', role: 'Sponsor' },
              { nom: 'Quincaillerie Moderne', role: 'Sponsor' },
              { nom: 'Garage Le Specialiste', role: 'Sponsor' }
            ].map((temoin, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-sm border border-border text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold text-dark">{temoin.nom}</p>
                <p className="text-sm text-muted">{temoin.role}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FaireUnDon;