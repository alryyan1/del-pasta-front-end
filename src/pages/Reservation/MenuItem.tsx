import { MenuItem as MenuItemType } from './types'; 
import { Plus } from 'lucide-react';

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType) => void;
}

export default function MenuItem({ item, onAddToCart }: MenuItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
          <span className="text-lg font-semibold text-gray-900">${item.price}</span>
        </div>
        <button
          onClick={() => onAddToCart(item)}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}