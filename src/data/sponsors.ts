import type { Sponsor } from '../types';

export const sponsorsData: Sponsor[] = [
  {
    id: '1',
    nom: 'Restaurant La Terrasse',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    description: 'Meilleurs plats africains et européens. Livraison disponible.',
    contact: '97 45 23 11',
    localisation: 'Quartier Zongo, Djougou',
    montant: 25000,
    dateExpiration: '2026-05-17',
    actif: true,
    categorie: 'restaurant'
  },
  {
    id: '2',
    nom: 'Quincaillerie Moderne',
    logo: 'https://images.unsplash.com/photo-1504328345282-355778d1bf2b?w=400&h=300&fit=crop',
    description: 'Matériaux de construction, peinture, outillage. Prix grossiste.',
    contact: '95 67 89 00',
    localisation: 'Route de Natitingou, Djougou',
    montant: 25000,
    dateExpiration: '2026-05-20',
    actif: true,
    categorie: 'boutique'
  },
  {
    id: '3',
    nom: 'Garage Le Spécialiste',
    logo: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop',
    description: 'Réparation moteur, diagnostic électronique, vente pièces.',
    contact: '96 12 34 56',
    localisation: 'Sainte Rita, Djougou',
    montant: 25000,
    dateExpiration: '2026-04-30',
    actif: true,
    categorie: 'service'
  }
];