import React from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useTranslation } from 'react-i18next';

// Shadcn UI & Icons
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface CartSummaryProps {
  onCheckout: () => void; // A function to trigger the checkout dialog
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const { t } = useTranslation(['cart', 'menu']);
  
  // Get all state and actions from the cart store
  const { 
    items, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    updateItemNotes,
    removeItem, 
    clearCart 
  } = useCartStore();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <ShoppingCart className="mr-3 h-6 w-6" style={{ color: "#FF1493" }} />
          {t('title', 'Your Order')}
        </h2>
        {items.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={clearCart}>
                {t('clearCart', 'Clear All')}
            </Button>
        )}
      </div>

      {/* Cart Body */}
      {items.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
          <ShoppingCart className="h-16 w-16 mb-4" />
          <p>{t('emptyMessage', 'Your cart is empty.')}</p>
          <p className="text-sm">{t('emptyHint', 'Add items from the menu to get started.')}</p>
        </div>
      ) : (
        <ScrollArea className="flex-grow">
          <div className="p-4 divide-y dark:divide-slate-800">
            {items.map(item => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="flex-grow">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-sm font-medium" style={{ color: "#FF1493" }}>
                      {Number(item.price).toFixed(3)} {t('currency_OMR', 'OMR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={t('quantity.decrease', 'Decrease quantity')}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value, 10);
                        if (!isNaN(newQuantity)) updateQuantity(item.id, newQuantity);
                      }}
                      className="h-7 w-12 text-center"
                      aria-label={t('quantity.current', 'Current quantity')}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={t('quantity.increase', 'Increase quantity')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive" 
                    onClick={() => removeItem(item.id)}
                    aria-label={t('quantity.remove', 'Remove item')}
                  >
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
                {/* <Textarea 
                    placeholder={t('itemNotesPlaceholder', 'Add notes for this item...')}
                    className="mt-2 text-xs h-16"
                    value={item.itemNotes}
                    onChange={(e) => updateItemNotes(item.id, e.target.value)}
                /> */}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Cart Footer */}
      {items.length > 0 && (
        <div className="p-4 border-t dark:border-slate-800 mt-auto bg-slate-50 dark:bg-slate-900/50 rounded-b-lg">
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('subtotal', 'Subtotal')} ({totalItems} {t('items', 'items')})</span>
              <span className="font-medium">{totalPrice.toFixed(3)} {t('currency_OMR', 'OMR')}</span>
            </div>
            {/* Delivery fees or taxes can be added here */}
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg mt-2 mb-4">
            <span>{t('total', 'Total')}</span>
            <span>{totalPrice.toFixed(3)} {t('currency_OMR', 'OMR')}</span>
          </div>
          <Button className="w-full text-base" size="lg" onClick={onCheckout}>
            {t('checkout', 'Proceed to Checkout')}
          </Button>
        </div>
      )}
    </div>
  );
};