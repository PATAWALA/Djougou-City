import type{ Annonce } from '../types';

export const annoncesData: Annonce[] = [
  {
    id: '1',
    titre: 'Moto Bajaj Boxer 100cc',
    description: 'Moto en bon etat, 3 mois d usage',
    prix: 450000,
    categorie: 'vente',
    contact: '97 88 77 66',
    localisation: 'Djougou Centre',
    datePublication: '2026-04-15',
    estPremium: true,
    vues: 342,
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop']
  },
  {
    id: '2',
    titre: 'Terrain 500m2 Titre Foncier',
    description: 'Terrain viabilise, quartier residentiel',
    prix: 2500000,
    categorie: 'vente',
    contact: '96 55 44 33',
    localisation: 'Quartier Kilir',
    datePublication: '2026-04-14',
    estPremium: false,
    vues: 156,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop']
  },
  {
    id: '3',
    titre: 'Location Studio Meuble',
    description: 'Studio avec douche et cuisine',
    prix: 25000,
    categorie: 'location',
    contact: '94 33 22 11',
    localisation: 'Sokounon',
    datePublication: '2026-04-16',
    estPremium: true,
    vues: 89,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop']
  }
];