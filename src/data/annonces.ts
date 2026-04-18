import type { Annonce } from '../types';

export const annoncesData: Annonce[] = [
  {
    id: '1',
    titre: 'Moto Bajaj Boxer 100cc – État impeccable, faible kilométrage',
    description: 'Moto achetée neuve il y a 3 mois chez un concessionnaire agréé. Aucune rayure, moteur parfaitement rodé. Carte grise et facture d\'achat disponibles. Parfaite pour taxi-moto ou usage personnel. Livraison possible sur Djougou.',
    prix: 450000,
    categorie: 'vente',
    contact: '97 88 77 66',
    localisation: 'Djougou Centre, derrière la mairie',
    datePublication: '2026-04-15',
    estPremium: true,
    vues: 342,
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop']
  },
  {
    id: '2',
    titre: 'Terrain 500m² avec Titre Foncier – Quartier résidentiel Kilir',
    description: 'Terrain viabilisé dans un quartier calme et sécurisé de Kilir, à 5 minutes de la route principale. Idéal pour construction d\'une maison familiale ou investissement locatif. Bornes déjà posées. Accès facile aux motos et voitures.',
    prix: 2500000,
    categorie: 'vente',
    contact: '96 55 44 33',
    localisation: 'Quartier Kilir, près de l\'école primaire',
    datePublication: '2026-04-14',
    estPremium: false,
    vues: 156,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop']
  },
  {
    id: '3',
    titre: 'Location Studio Meublé – 25 000 FCFA / mois',
    description: 'Studio indépendant avec douche interne, cuisine équipée (gazinière, réfrigérateur). Eau et électricité incluses. Sécurisé avec portail et clôture. Quartier calme, proche des commodités (marché Sokounon à 5 min à pied).',
    prix: 25000,
    categorie: 'location',
    contact: '94 33 22 11',
    localisation: 'Sokounon, Djougou',
    datePublication: '2026-04-16',
    estPremium: true,
    vues: 89,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop']
  },
  {
    id: '4',
    titre: 'Vends smartphone Android – Samsung Galaxy A14, comme neuf',
    description: 'Téléphone acheté il y a 4 mois, jamais tombé, toujours sous protection. Écran impeccable, batterie longue durée. Vendu avec chargeur d\'origine et coque. Idéal pour WhatsApp, Facebook et Mobile Money.',
    prix: 75000,
    categorie: 'vente',
    contact: '97 01 02 03',
    localisation: 'Quartier Zongo, Djougou',
    datePublication: '2026-04-17',
    estPremium: false,
    vues: 67,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=400&fit=crop']
  },
  {
    id: '5',
    titre: 'Service de couture à domicile – tenues sur mesure',
    description: 'Couturier expérimenté (15 ans de métier) se déplace à votre domicile pour vos tenues traditionnelles (boubous, complets, robes de cérémonie). Travail soigné et délais respectés. Devis gratuit.',
    prix: 0,
    categorie: 'service',
    contact: '95 12 34 56',
    localisation: 'Djougou et environs',
    datePublication: '2026-04-13',
    estPremium: true,
    vues: 128,
    images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=400&fit=crop']
  },
  {
    id: '6',
    titre: 'Recrutement Serveuse – Restaurant La Bonne Table',
    description: 'Restaurant situé au centre-ville recherche une serveuse dynamique et présentable. Expérience souhaitée mais débutante acceptée si motivée. Salaire : 40 000 FCFA + pourboires. Présentez-vous directement au restaurant entre 14h et 17h.',
    prix: 0,
    categorie: 'emploi',
    contact: '96 77 88 99',
    localisation: 'Djougou Centre, rue du marché',
    datePublication: '2026-04-12',
    estPremium: true,
    vues: 215,
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop']
  },
  {
    id: '7',
    titre: 'Vente de pneus moto neufs – toutes dimensions',
    description: 'Lot de pneus moto (marques Dunlop, Michelin, Cheng Shin) arrivage direct. Toutes tailles disponibles pour zemidjan et motos personnelles. Prix attractifs à partir de 12 000 FCFA l\'unité. Montage gratuit.',
    prix: 12000,
    categorie: 'vente',
    contact: '97 45 67 89',
    localisation: 'Atelier en face de la station Total, Djougou',
    datePublication: '2026-04-11',
    estPremium: false,
    vues: 94,
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop']
  },
  {
    id: '8',
    titre: 'Location boutique commerciale – 30m², idéal pour commerce',
    description: 'Local commercial en bordure de route, très passant. Convient pour boutique de vêtements, coiffure, ou point de vente Mobile Money. Loyer mensuel 35 000 FCFA, avec une caution de 2 mois. Disponible immédiatement.',
    prix: 35000,
    categorie: 'location',
    contact: '96 33 44 55',
    localisation: 'Route de Natitingou, Djougou',
    datePublication: '2026-04-10',
    estPremium: false,
    vues: 78,
    images: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop']
  }
];