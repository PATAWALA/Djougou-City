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
  categorie: 'restaurant' | 'boutique' | 'service' | 'transport';
}

export interface Annonce {
  id: string;
  titre: string;
  description: string;
  prix: number;
  categorie: 'vente' | 'location' | 'service' | 'emploi';
  contact: string;
  localisation: string;
  datePublication: string;
  estPremium: boolean;
  vues: number;
  images: string[];
}

export interface Necrologie {
  id: string;
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