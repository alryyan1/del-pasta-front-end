export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  }
  
  export interface Reservation {
    id: string;
    title: string;
    start: Date;
    end: Date;
    guests: number;
    customerName: string;
    customerEmail: string;
    specialRequests?: string;
  }
  
  export interface CartItem extends MenuItem {
    quantity: number;
  }