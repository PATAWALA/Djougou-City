import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Megaphone, Menu, X, User, LogOut } from 'lucide-react';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { CONTACT } from '../utils/constants';

export const FOLLOWERS = 64000; // 64 K followers

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, role, compagnie')
      .eq('id', userId)
      .single();
    setUserProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Annonces', path: '/annonces' },
    { label: 'Alertes', path: '/alertes' },
    { label: 'Offres', path: '/actualites' },
    { label: 'Premium', path: '/premium' },
    { label: 'Publier', path: '/publier' },
  ];

  return (
    <header className="bg-card shadow-lg sticky top-0 z-50">
      {/* Barre supérieure */}
      <div className="bg-dark text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {CONTACT.ADDRESS}
            </span>
            <a 
              href={`tel:${CONTACT.PHONE}`}
              className="flex items-center gap-1 hover:text-secondary transition-colors"
            >
              <Phone className="w-4 h-4" /> {CONTACT.PHONE}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={CONTACT.FACEBOOK_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#1877F2] hover:opacity-80 transition-opacity p-1"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a 
              href={`https://wa.me/2250574366352`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#25D366] hover:opacity-80 transition-opacity p-1"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            CI
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-dark">
              CI<span className="text-primary">Transports</span>
            </h1>
            <p className="text-xs text-muted">Votre partenaire mobilité en Côte d'Ivoire</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-dark hover:text-primary font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          {!session ? (
            <Link
              to="/auth"
              className="flex items-center gap-2 text-dark hover:text-primary font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              Connexion
            </Link>
          ) : (
            <div className="relative group">
              <Link
                to={userProfile?.role === 'admin' ? '/dashboard' : '/mon-espace'}
                className="flex items-center gap-2 text-dark hover:text-primary font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                {userProfile?.compagnie || userProfile?.full_name?.split(' ')[0] || 'Mon espace'}
              </Link>
              <button
                onClick={handleLogout}
                className="absolute top-full left-0 mt-2 hidden group-hover:flex items-center gap-2 bg-card shadow-lg rounded-lg px-4 py-2 text-sm text-primary hover:bg-red-50 whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/premium"
            className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all"
          >
            <Megaphone className="w-4 h-4" />
            Devenir Sponsor
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-background"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden px-4 pb-4 space-y-2 bg-card border-t border-border">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-dark hover:text-primary font-medium"
            >
              {item.label}
            </Link>
          ))}
          {!session ? (
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-dark hover:text-primary font-medium"
            >
              Connexion
            </Link>
          ) : (
            <>
              <Link
                to={userProfile?.role === 'admin' ? '/dashboard' : '/mon-espace'}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-dark hover:text-primary font-medium"
              >
                Mon espace ({userProfile?.compagnie || userProfile?.full_name?.split(' ')[0] || 'Profil'})
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-primary hover:text-red-600 font-medium"
              >
                Déconnexion
              </button>
            </>
          )}
          <Link
            to="/premium"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-primary font-semibold"
          >
            Devenir Sponsor
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;