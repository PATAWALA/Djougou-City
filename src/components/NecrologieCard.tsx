import React from 'react';
import { motion } from 'framer-motion';
import { 
  CloudRain, 
  AlertTriangle, 
  Construction, 
  Car, 
  Fuel, 
  TrafficCone, 
  Users,
  MapPin,
  Calendar,
  Radio,
  CheckCircle,
  Clock,
  AlertOctagon
} from 'lucide-react';
import type { Alerte } from '../types';
import { formatDate } from '../utils/formatPrice';

interface AlerteCardProps {
  alerte: Alerte;
}

const AlerteCard: React.FC<AlerteCardProps> = ({ alerte }) => {
  // Configuration des types d'alertes
  const getTypeConfig = (type: string) => {
    const configs: Record<string, { icon: any; label: string; bgColor: string }> = {
      meteo: {
        icon: CloudRain,
        label: 'Météo',
        bgColor: 'from-blue-500 to-cyan-500'
      },
      accident: {
        icon: AlertTriangle,
        label: 'Accident',
        bgColor: 'from-red-500 to-orange-500'
      },
      controle: {
        icon: Construction,
        label: 'Contrôle',
        bgColor: 'from-orange-500 to-amber-500'
      },
      route: {
        icon: Car,
        label: 'Route',
        bgColor: 'from-purple-500 to-pink-500'
      },
      carburant: {
        icon: Fuel,
        label: 'Carburant',
        bgColor: 'from-green-500 to-emerald-500'
      },
      circulation: {
        icon: TrafficCone,
        label: 'Circulation',
        bgColor: 'from-yellow-500 to-orange-500'
      },
      manifestation: {
        icon: Users,
        label: 'Manifestation',
        bgColor: 'from-pink-500 to-red-500'
      }
    };
    return configs[type] || configs.accident;
  };

  // Configuration des niveaux d'alerte
  const getNiveauConfig = (niveau: string) => {
    const niveaux: Record<string, { color: string; icon: any; label: string }> = {
      vert: { 
        color: 'bg-green-100 text-green-800 border-green-300', 
        icon: CheckCircle,
        label: 'Information'
      },
      jaune: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
        icon: AlertOctagon,
        label: 'Vigilance'
      },
      orange: { 
        color: 'bg-orange-100 text-orange-800 border-orange-300', 
        icon: AlertTriangle,
        label: 'Alerte'
      },
      rouge: { 
        color: 'bg-red-100 text-red-800 border-red-300 animate-pulse', 
        icon: AlertOctagon,
        label: 'CRITIQUE'
      }
    };
    return niveaux[niveau] || niveaux.jaune;
  };

  const typeConfig = getTypeConfig(alerte.type);
  const niveauConfig = getNiveauConfig(alerte.niveau);
  const TypeIcon = typeConfig.icon;
  const NiveauIcon = niveauConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`bg-card rounded-2xl shadow-lg overflow-hidden border-2 ${alerte.estActive ? 'border-border' : 'border-gray-200 opacity-75'} hover:shadow-xl transition-all duration-300`}
    >
      {/* En-tête avec type d'alerte */}
      <div className={`bg-gradient-to-r ${typeConfig.bgColor} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TypeIcon className="w-5 h-5" />
            <span className="font-semibold">{typeConfig.label}</span>
          </div>
          {!alerte.estActive && (
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
              Terminé
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5">
        {/* Niveau d'alerte */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-3 border ${niveauConfig.color}`}>
          <NiveauIcon className="w-4 h-4" />
          {niveauConfig.label}
        </div>

        {/* Titre */}
        <h3 className="text-lg font-bold text-dark mb-2">
          {alerte.titre}
        </h3>

        {/* Description */}
        <p className="text-muted text-sm mb-4 leading-relaxed">
          {alerte.description}
        </p>

        {/* Infos détaillées */}
        <div className="space-y-2.5 mb-4">
          {/* Localisation */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="font-medium text-dark">Localisation :</span>{' '}
              <span className="text-muted">{alerte.localisation}</span>
            </div>
          </div>

          {/* Date de publication */}
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="font-medium text-dark">Publié le :</span>{' '}
              <span className="text-muted">{formatDate(alerte.datePublication)}</span>
            </div>
          </div>

          {/* Source */}
          <div className="flex items-start gap-2 text-sm">
            <Radio className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="font-medium text-dark">Source :</span>{' '}
              <span className="text-muted">{alerte.source}</span>
            </div>
          </div>

          {/* Statut */}
          <div className="flex items-start gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="font-medium text-dark">Statut :</span>{' '}
              <span className={`font-semibold ${alerte.estActive ? 'text-green-600' : 'text-gray-500'}`}>
                {alerte.estActive ? 'En cours' : 'Terminé'}
              </span>
            </div>
          </div>
        </div>

        {/* Bouton de partage */}
        <button className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary py-2.5 rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
          <AlertTriangle className="w-4 h-4" />
          Signaler une mise à jour
        </button>
      </div>
    </motion.div>
  );
};

export default AlerteCard;