import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  MapPin,
  Mail,
  Globe,
  Shield,
  HelpCircle,
  ChevronRight,
  Truck,
  Bus,
  AlertTriangle,
} from 'lucide-react';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { CONTACT, FOLLOWERS, PRICES } from '../utils/constants';
import { formatFCFA } from '../utils/formatPrice';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-20">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Colonne 1 : À propos de CITransports */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                CI
              </div>
              <span className="text-xl font-display font-bold">
                CI<span className="text-secondary">Transports</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              La première plateforme digitale de transport en Côte d'Ivoire qui connecte 
              les voyageurs, les transporteurs et les chargeurs. Départs de bus, annonces 
              de fret, alertes trafic et bien plus.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href={CONTACT.FACEBOOK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#1877F2]/20 p-2 rounded-full hover:bg-[#1877F2] transition-colors"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a 
                href={`https://wa.me/2250574366352`}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#25D366]/20 p-2 rounded-full hover:bg-[#25D366] transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-white/10 p-2 rounded-full hover:bg-primary transition-colors"
              >
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
                { label: 'Départs', href: '/departs' },
                { label: 'Annonces', href: '/annonces' },
                { label: 'Alertes trafic', href: '/alertes' },
                { label: 'Promos', href: '/actualites' },
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

          {/* Colonne 3 : Services pour transporteurs */}
          <div>
            <h4 className="text-lg font-bold mb-6">Services Transport</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/premium" className="text-gray-400 hover:text-white transition-colors block">
                  <span className="font-semibold text-secondary flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Devenir Sponsor
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{formatFCFA(PRICES.SPONSOR)} / mois</p>
                </Link>
              </li>
              <li>
                <Link to="/publier" className="text-gray-400 hover:text-white transition-colors block">
                  <span className="font-semibold flex items-center gap-1">
                    <Bus className="w-4 h-4" /> Publier un départ
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Gratuit</p>
                </Link>
              </li>
              <li>
                <Link to="/premium" className="text-gray-400 hover:text-white transition-colors block">
                  <span className="font-semibold flex items-center gap-1">
                    🚛 Publier une annonce fret
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{formatFCFA(PRICES.ANNONCE_STANDARD)} / annonce</p>
                </Link>
              </li>
              <li>
                <Link to="/publier" className="text-gray-400 hover:text-white transition-colors block">
                  <span className="font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Signaler une alerte
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Gratuit</p>
                </Link>
              </li>
              <li>
                <Link to="/premium" className="text-gray-400 hover:text-white transition-colors block">
                  <span className="font-semibold flex items-center gap-1">
                    ⭐ Abonnement Agence Pro
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{formatFCFA(PRICES.PREMIUM)} / mois</p>
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
                  <p className="text-xs text-gray-500">Appelez-nous (7j/7, 8h-20h)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <div>
                  <p className="text-sm">{CONTACT.ADDRESS}</p>
                  <p className="text-xs text-gray-500">Siège social</p>
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

            {/* Badge communauté Facebook */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#1877F2]/10 to-[#1877F2]/5 rounded-xl border border-[#1877F2]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1877F2]/20 rounded-full flex items-center justify-center">
                  <FaFacebookF className="w-5 h-5 text-[#1877F2]" />
                </div>
                <div>
                  <p className="font-bold text-lg">{FOLLOWERS.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">followers sur Facebook</p>
                </div>
              </div>
              <a 
                href={CONTACT.FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-xs text-[#1877F2] hover:underline"
              >
                Rejoignez notre communauté →
              </a>
            </div>
          </div>
        </div>

        {/* Section Abonnement Premium */}
        <div className="mt-12 p-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl border border-secondary/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-full">
                <Truck className="w-6 h-6 text-dark" />
              </div>
              <div>
                <h5 className="text-xl font-bold">🚛 Agence de transport ?</h5>
                <p className="text-gray-400 text-sm">
                  Boostez votre visibilité avec un compte Premium • Jusqu'à 50 annonces/mois • 
                  Statistiques détaillées • Support prioritaire
                </p>
              </div>
            </div>
            <Link
              to="/premium"
              className="bg-secondary text-dark px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-lg whitespace-nowrap"
            >
              Devenir Premium • {formatFCFA(PRICES.PREMIUM)}/mois
            </Link>
          </div>
        </div>
      </div>

      {/* Barre inférieure */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {currentYear} CITransports. Tous droits réservés.</p>
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
              Conçu pour les <span className="text-secondary font-semibold">Transporteurs Ivoiriens</span> 🇨🇮
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;