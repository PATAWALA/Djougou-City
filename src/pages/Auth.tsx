import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Shield,
  UserPlus,
  LogIn,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import MainLayout from '../layouts/MainLayout';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Vérification unique via la table admins
  const isUserAdmin = async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    return !error && !!data;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
    }

    setLoading(true);
    console.log('🔐 Tentative de', isLogin ? 'connexion' : 'inscription', 'avec email:', formData.email);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;

        console.log('✅ Connexion réussie, user ID:', data.user.id);
        const isAdmin = await isUserAdmin(data.user.id);
        console.log(isAdmin ? '👑 Admin détecté → /dashboard' : '👤 Utilisateur → /mon-espace');
        navigate(isAdmin ? '/dashboard' : '/mon-espace', { replace: true });
      } else {
        console.log('📝 Tentative d\'inscription avec:', formData.email);
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
            },
          },
        });
        if (error) throw error;

        console.log('✅ Inscription auth réussie, user ID:', data.user?.id);

        if (data.user) {
          const { error: updateError } = await supabase
            .from('profiles')
            .upsert(
              {
                id: data.user.id,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                role: 'user',
              },
              { onConflict: 'id' }
            );

          if (updateError) {
            console.error('❌ Erreur mise à jour profil:', updateError);
          } else {
            console.log('✅ Profil créé/mis à jour avec succès');
          }

          // Un nouvel inscrit n'est jamais admin, donc redirection vers mon-espace
          navigate('/mon-espace', { replace: true });
        }
      }
    } catch (err: any) {
      console.error('❌ Erreur:', err.message);
      if (err.message.includes('Email not confirmed')) {
        setError('Votre adresse email n\'est pas confirmée.');
      } else if (err.message.includes('rate limit')) {
        setError('Trop de tentatives. Patientez quelques minutes.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout hideHeader hideFooter>
      <div className="max-w-md mx-auto px-4 py-8 md:py-12">
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl shadow-xl border border-border p-6 md:p-8"
        >
          <div className="text-center mb-6">
            <div className="inline-flex p-3 md:p-4 bg-primary/10 rounded-full mb-3">
              {isLogin ? (
                <LogIn className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              ) : (
                <UserPlus className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-dark">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>
            <p className="text-muted text-xs md:text-sm mt-1">
              {isLogin
                ? 'Accédez à votre espace personnel'
                : 'Créez votre compte gratuitement'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl text-sm mb-4 bg-red-50 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Moussa Yaya"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="97 12 34 56"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    required={!isLogin}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-full font-bold text-base hover:bg-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-primary font-semibold text-sm hover:underline"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs text-muted text-center">
              <Shield className="inline w-3 h-3 mr-1" />
              Connexion sécurisée. Vos données sont protégées.
            </p>
          </div>
        </motion.div>

        <div className="mt-5 text-center">
          <Link
            to="/publier/faire-publier"
            className="text-primary font-semibold text-xs md:text-sm hover:underline"
          >
            Vous préférez qu'on publie pour vous ? Cliquez ici
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Auth;