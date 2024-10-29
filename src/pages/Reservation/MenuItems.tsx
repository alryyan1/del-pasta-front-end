import { MenuItem } from "./types"; 

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle Burrata',
    description: 'Fresh burrata cheese with truffle honey, roasted pine nuts, and micro greens',
    price: 18,
    image: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?auto=format&fit=crop&q=80&w=800',
    category: 'appetizer'
  },
  {
    id: '2',
    name: 'Pan-Seared Salmon',
    description: 'Wild-caught salmon with quinoa risotto and lemon butter sauce',
    price: 32,
    image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800',
    category: 'main'
  },
  {
    id: '3',
    name: 'Chocolate Soufflé',
    description: 'Warm chocolate soufflé with vanilla bean ice cream',
    price: 14,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=800',
    category: 'dessert'
  }
];