import type { Sponsor } from '../types';

export const sponsorsData: Sponsor[] = [
  {
    id: '1',
    nom: 'TOTAL Energies',
    logo: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop',
    description: 'Carburant de qualité premium pour poids lourds et flottes de transport. Stations-service sur tous les grands axes ivoiriens. Cartes carburant professionnelles disponibles.',
    contact: '27 20 30 40 50',
    localisation: 'Zone Industrielle, Abidjan',
    montant: 50000,
    dateExpiration: '2026-12-31',
    actif: true,
    categorie: 'service'
  },
  {
    id: '2',
    nom: 'PNEUS MARTIN',
    logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop',
    description: 'Importateur exclusif de pneus poids lourds Michelin, Bridgestone et Goodyear. Service de montage et équilibrage sur place. Remises pour les compagnies de transport.',
    contact: '07 09 08 07 06',
    localisation: 'Zone 4, Marcory, Abidjan',
    montant: 35000,
    dateExpiration: '2026-09-15',
    actif: true,
    categorie: 'boutique'
  },
  {
    id: '3',
    nom: 'ASSURANCES ATLANTIQUE',
    logo: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
    description: 'Assurance automobile tous risques pour flottes de transport. Assistance 24h/24 sur tout le territoire ivoirien et sous-régional. Devis gratuit en ligne.',
    contact: '27 21 30 40 50',
    localisation: 'Plateau, Abidjan',
    montant: 45000,
    dateExpiration: '2026-08-20',
    actif: true,
    categorie: 'service'
  },
  {
    id: '4',
    nom: 'GARAGE DU PORT',
    logo: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop',
    description: 'Entretien et réparation toutes marques de poids lourds (Renault, Mercedes, MAN, DAF). Diagnostic électronique, mécanique générale, carrosserie. Parking sécurisé.',
    contact: '05 06 07 08 09',
    localisation: 'Zone Portuaire, Treichville',
    montant: 30000,
    dateExpiration: '2026-10-10',
    actif: true,
    categorie: 'service'
  },
  {
    id: '5',
    nom: 'AFRICA PIÈCES AUTO',
    logo: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=300&fit=crop',
    description: 'Pièces détachées d\'origine et adaptables pour camions et cars. Moteurs, boîtes de vitesses, ponts, suspensions. Stock permanent. Expédition dans toute l\'Afrique de l\'Ouest.',
    contact: '01 02 03 04 05',
    localisation: 'Abobo, Abidjan',
    montant: 40000,
    dateExpiration: '2026-11-05',
    actif: true,
    categorie: 'boutique'
  },
  {
    id: '6',
    nom: 'RESTAURANT LE RELAIS',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    description: 'Spécialités ivoiriennes et africaines. Service rapide, idéal pour les chauffeurs en transit. Parking poids lourds accessible. Ouvert 24h/24.',
    contact: '09 08 07 06 05',
    localisation: 'Sortie Autoroute, Yamoussoukro',
    montant: 20000,
    dateExpiration: '2026-07-30',
    actif: true,
    categorie: 'restaurant'
  }
];