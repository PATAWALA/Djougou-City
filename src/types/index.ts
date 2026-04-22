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
  categorie: 'restaurant' | 'boutique' | 'service' | 'transport'; // ✅ "transport" existe déjà
}

export interface Annonce {
  id: string;
  titre: string;
  description: string;
  prix: number | null;
  // ✅ Ajout de la catégorie "depart" pour les trajets de bus
  categorie: 'vente' | 'location' | 'service' | 'emploi' | 'don' | 'perdu' | 'recherche' | 'depart';
  contact: string;
  localisation: string;
  datePublication: string;
  estPremium: boolean;
  vues: number;
  images: string[];
}

export interface Necrologie {
  id: string;
  // ✅ On garde le nom "nomDefunt" mais on l'utilisera pour "Titre de l'alerte"
  nomDefunt: string;
  dateDeces: string;
  dateEnterrement: string;
  lieuEnterrement: string;
  famille: string;
  contact: string;
  montantPaye: number;
  message?: string;
  photo?: string;
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
}

export interface RevenueStats {
  totalMensuel: number;
  sponsorsActifs: number;
  annoncesActives: number;
  necrologiesMois: number;
  premiumAbonnes: number;
  objectifMensuel: number;
  revenusParSource: {
    sponsors: number;
    annonces: number;
    necrologie: number;
    premium: number;
  };
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

export interface DashboardStats {
  totalRevenus: number;
  utilisateurs: number;
  annoncesActives: number;
  articlesBoostes: number;
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
  type: string;
  client: string;
  montant: number;
  date: string;
  statut: string;
}