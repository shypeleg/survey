import { Chef, ChefRole } from './types';

export const CHEFS: Chef[] = [
  {
    id: 'assaf-granit',
    name: 'Assaf Granit',
    description: 'Renowned Israeli chef known for his Jerusalem-style cuisine and restaurants like Machneyuda and The Palomar. Winner of multiple culinary awards.',
    imageUrl: '/uploads/assaf-granit.jpg'
  },
  {
    id: 'yossi-shitrit',
    name: 'Yossi Shitrit',
    description: 'Celebrated chef who combines Moroccan and Mediterranean influences. Owner of popular restaurants including Onza and Kitchen Market.',
    imageUrl: '/uploads/yossi-shitrit.jpg'
  },
  {
    id: 'moshik-roth',
    name: 'Moshik Roth',
    description: 'Michelin-starred chef known for molecular gastronomy and innovative cooking techniques. Owner of &samhoud places in Amsterdam.',
    imageUrl: '/uploads/moshik-roth.jpg'
  }
];

export const ROLES: {id: ChefRole, label: string}[] = [
  { id: 'ski', label: 'Ski/Hang With' },
  { id: 'cook', label: 'Cook Dinners' },
  { id: 'kill', label: 'Kill' }
];