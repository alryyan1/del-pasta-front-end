import { CartItem as CartItemType } from './types'; 
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <ShoppingCart size={48} className="mb-4" />
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Order</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1 hover:bg-gray-100 rounded text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold">{total.toFixed(2)}</span>
        </div>
        <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}