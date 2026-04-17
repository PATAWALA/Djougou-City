import type { Actualite } from '../types';

export const actualitesData: Actualite[] = [
  {
    id: '1',
    titre: 'Cri de cœur pour la santé à Djougou',
    contenu: 'Je veux poser une question simple aux autorités de Djougou... Nous demandons l\'intervention urgente de l\'État. La santé de la population doit être une priorité.',
    auteur: 'La Ville De Djougou',
    datePublication: '2026-04-16',
    estBoosted: true,
    montantBoost: 5000,
    likes: 1247,
    commentaires: 89,
    partages: 456,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop'
  },
  {
    id: '2',
    titre: 'Élections 2026 : La stabilité retrouvée au Bénin',
    contenu: 'Aujourd\'hui, je veux rappeler une réalité que nous avons tous vécue... La paix n\'a pas de prix.',
    auteur: 'La Ville De Djougou',
    datePublication: '2026-04-15',
    estBoosted: false,
    likes: 2356,
    commentaires: 167,
    partages: 892,
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=400&fit=crop'
  }
];