import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, AlertCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { PRICES, CONTACT } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const Paiement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Récupération des paramètres d'URL
  const type = searchParams.get('type') || 'depart';
  const pack = searchParams.get('pack') || 'standard';
  const plan = searchParams.get('plan') || 'mensuel'; // pour premium
  const redirectTo = searchParams.get('redirect') || '/mon-espace';

  const [montant, setMontant] = useState<number>(0);
  const [method, setMethod] = useState<'orange' | 'mtn' | 'moov' | null>(null);
  const [step, setStep] = useState<'choice' | 'instructions' | 'confirmation'>('choice');
  const [reference, setReference] = useState('');

  // Numéros Mobile Money pour la Côte d'Ivoire
  const mobileNumbers = {
    orange: '07 09 08 07 06',   // Orange Money
    mtn: '05 06 07 08 09',      // MTN MoMo
    moov: '01 02 03 04 05'      // Moov Money
  };

  // Calcul du montant en fonction du type et du pack/plan
  useEffect(() => {
    let price = 0;

    if (type === 'depart' || type === 'annonce') {
      const packPrices: Record<string, number> = {
        gratuit: PRICES.ANNONCE || 0,
        standard: PRICES.ANNONCE_STANDARD || 2500,
        premium: PRICES.ANNONCE_PREMIUM || 5000,
      };
      price = packPrices[pack] || 0;
    } else if (type === 'promo' || type === 'article') {
      const boostPrices: Record<string, number> = {
        basic: PRICES.BOOST_COUP_DE_POUCE || 1000,
        standard: PRICES.BOOST_ARTICLE || 3000,
        premium: PRICES.BOOST_VIRAL || 5000,
      };
      price = boostPrices[pack] || 3000;
    } else if (type === 'premium') {
      const basePrice = PRICES.PREMIUM || 25000;
      const planMultiplier: Record<string, number> = {
        mensuel: 1,
        trimestriel: 3 * 0.85,
        annuel: 12 * 0.7,
      };
      price = Math.round(basePrice * (planMultiplier[plan] || 1));
    } else if (type === 'sponsor') {
      price = PRICES.SPONSOR || 15000;
    } else {
      price = 1000; // fallback
    }

    setMontant(price);
  }, [type, pack, plan]);

  const handleSelectMethod = (selected: 'orange' | 'mtn' | 'moov') => {
    setMethod(selected);
    setStep('instructions');
    setReference(`CIT-${Date.now().toString().slice(-6)}`);
  };

  const handleConfirmPayment = () => {
    setStep('confirmation');
    // Simuler un délai puis rediriger vers l'URL de retour avec les paramètres
    setTimeout(() => {
      navigate(`${redirectTo}?type=${type}&pack=${pack}&payment=success`);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    alert('Numéro copié !');
  };

  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      depart: 'Départ / Annonce',
      annonce: 'Annonce transport',
      promo: 'Promo boostée',
      article: 'Promo boostée',
      premium: 'Abonnement Agence Pro',
      sponsor: 'Sponsoring',
    };
    return labels[type] || 'Publication';
  };

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl shadow-xl border border-border p-8"
        >
          {step === 'choice' && (
            <>
              <h2 className="text-2xl font-display font-bold text-dark mb-2">Paiement</h2>
              <p className="text-muted mb-1">{getTypeLabel()}</p>
              <p className="text-muted mb-6">
                Montant à payer : <span className="text-2xl font-bold text-primary">{formatFCFA(montant)}</span>
              </p>

              <p className="font-medium text-dark mb-3">Choisissez votre opérateur Mobile Money</p>
              <div className="space-y-3">
                <button
                  onClick={() => handleSelectMethod('orange')}
                  className="w-full p-4 rounded-xl border-2 border-border hover:border-primary bg-orange-50 flex items-center gap-4 transition-all"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">OM</div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-dark">Orange Money</p>
                    <p className="text-xs text-muted">Paiement via Orange Money Côte d'Ivoire</p>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectMethod('mtn')}
                  className="w-full p-4 rounded-xl border-2 border-border hover:border-primary bg-yellow-50 flex items-center gap-4 transition-all"
                >
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold">MTN</div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-dark">MTN Mobile Money</p>
                    <p className="text-xs text-muted">Paiement via MTN MoMo</p>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectMethod('moov')}
                  className="w-full p-4 rounded-xl border-2 border-border hover:border-primary bg-blue-50 flex items-center gap-4 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">Moov</div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-dark">Moov Money</p>
                    <p className="text-xs text-muted">Paiement via Moov</p>
                  </div>
                </button>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="w-full mt-4 text-muted hover:text-dark text-sm"
              >
                Annuler
              </button>
            </>
          )}

          {step === 'instructions' && method && (
            <>
              <h3 className="text-xl font-bold text-dark mb-4">Instructions de paiement</h3>
              
              <div className="bg-background p-5 rounded-xl mb-6">
                <p className="font-medium mb-2">1. Ouvrez votre application {method === 'orange' ? 'Orange Money' : method === 'mtn' ? 'MTN MoMo' : 'Moov Money'}</p>
                <p className="font-medium mb-2">2. Envoyez <span className="font-bold text-primary">{formatFCFA(montant)}</span> au numéro :</p>
                <div className="bg-white p-4 rounded-lg flex items-center justify-between mb-2">
                  <span className="text-2xl font-mono font-bold">{mobileNumbers[method]}</span>
                  <button onClick={() => copyToClipboard(mobileNumbers[method].replace(/\s/g, ''))} className="text-primary">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-muted mt-3">Raison / Référence : <span className="font-mono bg-gray-100 px-2 py-1 rounded">{reference}</span></p>
                <p className="text-sm text-muted mt-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  Après le paiement, cliquez sur "J'ai payé". Notre équipe vérifiera et activera votre publication.
                </p>
              </div>

              <button
                onClick={handleConfirmPayment}
                className="w-full bg-primary text-white py-3 rounded-full font-bold hover:bg-dark transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" /> J'ai payé
              </button>
              <button onClick={() => setStep('choice')} className="w-full mt-3 text-muted text-sm">Changer de méthode</button>
            </>
          )}

          {step === 'confirmation' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark mb-2">Paiement en cours de vérification</h3>
              <p className="text-muted mb-4">Vous allez être redirigé vers la publication...</p>
              <p className="text-xs text-muted">
                Une question ? Contactez-nous au <span className="font-semibold">{CONTACT.PHONE}</span>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Paiement;