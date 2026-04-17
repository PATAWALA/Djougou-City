import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  MapPin,
  Mail,
  Globe,
  Heart,
  Shield,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { FaFacebookF } from 'react-icons/fa';
import { CONTACT, FOLLOWERS } from '../utils/constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-20">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Colonne 1 : À propos de DjougouCity */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                D
              </div>
              <span className="text-xl font-display font-bold">DjougouCity</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              La première plateforme digitale du Nord-Bénin qui connecte les habitants, les
              commerces et les services de Djougou. Information, petites annonces, nécrologie et
              bien plus.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Navigation rapide */}
          <div>
            <h4 className="text-lg font-bold mb-6">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', href: '/' },
                { label: 'Actualités', href: '/actualites' },
                { label: 'Petites Annonces', href: '/annonces' },
                { label: 'Nécrologie', href: '/necrologie' },
                { label: 'Premium', href: '/premium' },
                { label: 'À propos', href: '/a-propos' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Services pour professionnels */}
          <div>
            <h4 className="text-lg font-bold mb-6">Pour les professionnels</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors block">
                  <span className="font-semibold text-secondary">Devenir Sponsor</span>
                  <p className="text-xs text-gray-500 mt-1">25 000 FCFA / mois</p>
                </Link>
              </li>
              <li>
                <Link to="/publier" className="text-gray-400 hover:text-white transition-colors block">
                  <span className="font-semibold">Publier une annonce</span>
                  <p className="text-xs text-gray-500 mt-1">500 FCFA / annonce</p>
                </Link>
              </li>
              <li>
                <Link to="/publier" className="text-gray-400 hover:text-white transition-colors block">
                  <span className="font-semibold">Publier un avis de décès</span>
                  <p className="text-xs text-gray-500 mt-1">1 000 FCFA</p>
                </Link>
              </li>
              <li>
                <Link to="/publier" className="text-gray-400 hover:text-white transition-colors block">
                  <span className="font-semibold">Booster un article</span>
                  <p className="text-xs text-gray-500 mt-1">3 000 FCFA / 7 jours</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contact et Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact & Support</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="font-semibold">{CONTACT.PHONE}</p>
                  <p className="text-xs text-gray-500">Appelez-nous</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="text-sm">{CONTACT.ADDRESS}</p>
                  <p className="text-xs text-gray-500">Notre adresse</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="text-sm">{CONTACT.EMAIL}</p>
                  <p className="text-xs text-gray-500">Email support</p>
                </div>
              </li>
            </ul>

            {/* Badge communauté */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <FaFacebookF className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-lg">{FOLLOWERS.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">followers sur Facebook</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Faire un don */}
        <div className="mt-12 p-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl border border-secondary/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-full">
                <Heart className="w-6 h-6 text-dark" />
              </div>
              <div>
                <h5 className="text-xl font-bold">Soutenez DjougouCity</h5>
                <p className="text-gray-400 text-sm">
                  Votre don nous aide à maintenir cette plateforme gratuite pour la communauté
                </p>
              </div>
            </div>
            <Link
              to="/faire-un-don"
              className="bg-secondary text-dark px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-lg whitespace-nowrap"
            >
              Faire un don
            </Link>
          </div>
        </div>
      </div>

      {/* Barre inférieure */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {currentYear} DjougouCity. Tous droits réservés.</p>
            <div className="flex items-center gap-6">
              <Link to="/confidentialite" className="hover:text-white transition-colors flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Confidentialité
              </Link>
              <Link to="/conditions" className="hover:text-white transition-colors flex items-center gap-1">
                <HelpCircle className="w-4 h-4" />
                Conditions d'utilisation
              </Link>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-gray-500 text-xs">
              Conçu pour <span className="text-secondary font-semibold">La Ville De Djougou</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;