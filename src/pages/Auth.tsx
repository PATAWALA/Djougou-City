import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, ArrowRight, Shield, Smartphone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MainLayout from '../layouts/MainLayout';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formatPhone = (value: string) => {
    // Formatage simple pour le Bénin : 97 12 34 56
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 8) {
      return cleaned.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    }
    return cleaned.slice(0, 8).replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const rawPhone = phone.replace(/\s/g, '');
    if (rawPhone.length !== 8) {
      setError('Numéro de téléphone invalide (8 chiffres attendus)');
      setLoading(false);
      return;
    }

    // Format international Bénin (+229)
    const intlPhone = `+229${rawPhone}`;

    const { error } = await supabase.auth.signInWithOtp({
      phone: intlPhone,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(`Un code de vérification a été envoyé par SMS au ${phone}`);
      setMode('otp');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const rawPhone = phone.replace(/\s/g, '');
    const intlPhone = `+229${rawPhone}`;

    const { error } = await supabase.auth.verifyOtp({
      phone: intlPhone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      setError(error.message);
    } else {
      // Connexion réussie
      navigate('/mon-espace');
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl shadow-xl border border-border p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              {mode === 'phone' ? (
                <Smartphone className="w-8 h-8 text-primary" />
              ) : (
                <Lock className="w-8 h-8 text-primary" />
              )}
            </div>
            <h2 className="text-2xl font-display font-bold text-dark">
              {mode === 'phone' ? 'Connexion / Inscription' : 'Vérification'}
            </h2>
            <p className="text-muted text-sm mt-2">
              {mode === 'phone'
                ? 'Entrez votre numéro de téléphone pour continuer'
                : `Code envoyé au ${phone}`}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm mb-4">
              {success}
            </div>
          )}

          {mode === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="97 12 34 56"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>
                <p className="text-xs text-muted mt-1">
                  Format: 8 chiffres (ex: 97 12 34 56)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Envoi en cours...' : 'Recevoir un code SMS'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Code de vérification (6 chiffres)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-center text-2xl tracking-widest"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:bg-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Vérification...' : 'Vérifier et se connecter'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('phone');
                  setOtp('');
                  setError('');
                }}
                className="w-full text-primary text-sm font-semibold hover:underline"
              >
                Modifier le numéro
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted text-center">
              <Shield className="inline w-3 h-3 mr-1" />
              Vos informations sont sécurisées. Pas de mot de passe à retenir.
            </p>
          </div>
        </motion.div>

        <div className="mt-6 text-center">
          <a href="/publier/faire-publier" className="text-primary font-semibold text-sm hover:underline">
            Vous préférez qu'on publie pour vous ? Cliquez ici
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default Auth;