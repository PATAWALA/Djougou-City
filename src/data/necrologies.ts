import type { Alerte } from '../types';

export const alertesData: Alerte[] = [
  {
    id: '1',
    titre: '🌧️ Forte pluie sur Abidjan',
    description: 'Pluie torrentielle en cours sur tout le district d\'Abidjan. Ralentissements importants signalés sur le Boulevard Valéry Giscard d\'Estaing, le Boulevard de Marseille et la zone du carrefour Solibra. Visibilité réduite, soyez prudents.',
    type: 'meteo',
    niveau: 'orange',
    datePublication: '2026-04-22',
    localisation: 'Abidjan',
    source: 'SODEXAM',
    estActive: true
  },
  {
    id: '2',
    titre: '🚧 Accident sur Autoroute du Nord',
    description: 'Un accident impliquant un camion et un minicar s\'est produit au PK 24 sur l\'Autoroute du Nord en direction de Yamoussoukro. La voie de droite est neutralisée. Ralentissement sur 5 km. Déviation possible par l\'ancienne route.',
    type: 'accident',
    niveau: 'rouge',
    datePublication: '2026-04-22',
    localisation: 'PK 24, Autoroute du Nord',
    source: 'OSER',
    estActive: true
  },
  {
    id: '3',
    titre: '🚛 Contrôle routier intempestif',
    description: 'Contrôle routier en cours au corridor de Yopougon en direction de Dabou. Fort ralentissement signalé. Prévoyez 30-45 minutes de retard.',
    type: 'controle',
    niveau: 'jaune',
    datePublication: '2026-04-22',
    localisation: 'Yopougon, corridor de Dabou',
    source: 'Communauté des transporteurs',
    estActive: true
  },
  {
    id: '4',
    titre: '🛣️ Route dégradée - Axe Abidjan-Bassam',
    description: 'Nids de poule importants signalés entre le Carrefour Akwaba et le PK 18 sur la route de Bassam. Plusieurs crevaisons rapportées ce matin. Roulez au pas sur cette portion.',
    type: 'route',
    niveau: 'orange',
    datePublication: '2026-04-21',
    localisation: 'Route Abidjan-Bassam, PK 12-18',
    source: 'OSER',
    estActive: true
  },
  {
    id: '5',
    titre: '🌫️ Brouillard matinal - Axe Abidjan-Yamoussoukro',
    description: 'Brouillard dense signalé sur la section Tiébissou-Yamoussoukro. Visibilité inférieure à 100 mètres. Allumez vos feux de croisement et réduisez votre vitesse.',
    type: 'meteo',
    niveau: 'jaune',
    datePublication: '2026-04-22',
    localisation: 'Tiébissou - Yamoussoukro',
    source: 'SODEXAM',
    estActive: true
  },
  {
    id: '6',
    titre: '⛽ Pénurie de carburant - Station Total Marcory',
    description: 'Rupture de gasoil signalée à la station Total de Marcory Zone 4. Les stations Shell et Oilibya du secteur ont encore du carburant.',
    type: 'carburant',
    niveau: 'jaune',
    datePublication: '2026-04-22',
    localisation: 'Marcory Zone 4, Abidjan',
    source: 'Transporteurs',
    estActive: true
  },
  {
    id: '7',
    titre: '🚦 Embouteillage monstre - Carrefour Solibra',
    description: 'Embouteillage exceptionnel au carrefour Solibra dû à une panne de feux tricolores. Circulation très difficile dans tous les sens. Évitez le secteur si possible.',
    type: 'circulation',
    niveau: 'rouge',
    datePublication: '2026-04-22',
    localisation: 'Carrefour Solibra, Abidjan',
    source: 'Police Routière',
    estActive: true
  },
  {
    id: '8',
    titre: '⚠️ Manifestation de transporteurs à Adjamé',
    description: 'Rassemblement de transporteurs signalé devant la mairie d\'Adjamé. Circulation perturbée sur le Boulevard Nangui Abrogoua. Forces de l\'ordre sur place.',
    type: 'manifestation',
    niveau: 'orange',
    datePublication: '2026-04-22',
    localisation: 'Adjamé, Abidjan',
    source: 'Préfecture de Police',
    estActive: true
  },
  {
    id: '9',
    titre: '🌉 Pont Félix Houphouët-Boigny - Trafic dense',
    description: 'Trafic très dense sur le pont Félix Houphouët-Boigny dans les deux sens. Temps de traversée estimé à 45 minutes au lieu de 10. Privilégiez le pont Henri Konan Bédié.',
    type: 'circulation',
    niveau: 'orange',
    datePublication: '2026-04-22',
    localisation: 'Pont FHB, Abidjan',
    source: 'OSER',
    estActive: true
  },
  {
    id: '10',
    titre: '✅ Accident dégagé - Autoroute du Nord PK 24',
    description: 'L\'accident précédemment signalé au PK 24 a été dégagé. La circulation reprend progressivement. Ralentissements résiduels sur 2 km.',
    type: 'accident',
    niveau: 'vert',
    datePublication: '2026-04-21',
    localisation: 'PK 24, Autoroute du Nord',
    source: 'OSER',
    estActive: false
  }
];