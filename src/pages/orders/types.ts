export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface OrderDetails {
    orderNumber: string;
    date: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
  }