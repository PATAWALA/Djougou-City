export interface Sponsor {
  id: string;
  nom: string;
  logo: string;
  description: string;
  contact: string;
  localisation: string;
  montant: number;
  dateExpiration: string;
  actif: boolean;
  categorie: 'restaurant' | 'boutique' | 'service' | 'transport' | 'station' | 'garage' | 'pieces';
}

export interface Annonce {
  id: string;
  titre: string;
  description: string;
  prix: number | null;
  categorie: 'vente' | 'location' | 'service' | 'emploi' | 'depart' | 'arrivage' | 'chargement';
  contact: string;
  localisation: string;
  datePublication: string;
  estPremium: boolean;
  vues: number;
  images: string[];
}

export interface Alerte {
  id: string;
  titre: string;
  description: string;
  type: 'meteo' | 'accident' | 'controle' | 'route' | 'carburant' | 'circulation' | 'manifestation';
  niveau: 'vert' | 'jaune' | 'orange' | 'rouge';
  datePublication: string;
  localisation: string;
  source: string;
  estActive: boolean;
}

export interface Actualite {
  id: string;
  titre: string;
  contenu: string;
  auteur: string;
  datePublication: string;
  estBoosted: boolean;
  montantBoost?: number;
  likes: number;
  commentaires: number;
  partages: number;
  image?: string;
  categorie?: 'transport' | 'logistique' | 'reglementation' | 'infrastructures';
}

export interface RevenueStats {
  totalMensuel: number;
  sponsorsActifs: number;
  annoncesActives: number;
  alertesActives: number;
  premiumAbonnes: number;
  objectifMensuel: number;
  revenusParSource: {
    sponsors: number;
    annonces: number;
    premium: number;
    publicites: number;
  };
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'transporteur' | 'chargeur';
  created_at: string;
  compagnie?: string;
  flotte?: number;
}

export interface DashboardStats {
  totalRevenus: number;
  utilisateurs: number;
  annoncesActives: number;
  alertesEnCours: number;
  vuesTotales: number;
  evolution: {
    revenus: number;
    utilisateurs: number;
    annonces: number;
    vues: number;
  };
}

export interface Transaction {
  id: number;
  type: 'sponsor' | 'annonce' | 'premium' | 'publicite';
  client: string;
  montant: number;
  date: string;
  statut: 'complete' | 'en_attente' | 'echoue';
}