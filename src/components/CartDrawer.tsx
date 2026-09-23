import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (perfumeId: string, delta: number) => void;
  onRemoveItem: (perfumeId: string) => void;
  onProceedToCheckout: () => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = cartItems.reduce((acc, item) => {
    const original = item.perfume.originalPrice || item.perfume.price;
    return acc + original * item.quantity;
  }, 0);

  const total = cartItems.reduce((acc, item) => acc + item.perfume.price * item.quantity, 0);
  const totalSavings = Math.max(0, subtotal - total);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-zinc-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-zinc-950" />
            <h3 className="font-brand text-lg font-bold text-zinc-950">
              Tu Bolsa de Compras
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-full tabular-nums">
              {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-950 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-zinc-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-zinc-900 text-base">Tu bolsa está vacía</p>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Explora nuestra selección exclusiva de perfumes de lujo y añade tus favoritos.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <>
              {cartItems.map(({ perfume, quantity }) => {
                const img = perfume.images && perfume.images[0] ? perfume.images[0] : '';
                const hasDiscount = perfume.originalPrice && perfume.originalPrice > perfume.price;

                return (
                  <div key={perfume.id} className="pt-4 first:pt-0 flex gap-3">
                    <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-sm p-1.5 flex items-center justify-center flex-shrink-0">
                      {img ? (
                        <img src={img} alt={perfume.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-brand">{perfume.brand}</span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                              {perfume.brand}
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold text-zinc-950 line-clamp-1">
                              {perfume.name}
                            </h4>
                            <p className="text-[11px] text-zinc-400">
                              {perfume.type} · {perfume.sizeMl} ml
                            </p>
                          </div>

                          <button
                            onClick={() => onRemoveItem(perfume.id)}
                            className="text-zinc-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-zinc-200 rounded-sm">
                          <button
                            onClick={() => onUpdateQuantity(perfume.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 cursor-pointer text-xs"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold tabular-nums">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(perfume.id, 1)}
                            disabled={quantity >= perfume.stock}
                            className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer text-xs"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          {hasDiscount && (
                            <div className="text-[10px] text-zinc-400 line-through tabular-nums">
                              S/ {(perfume.originalPrice! * quantity).toFixed(2)}
                            </div>
                          )}
                          <div className="text-sm font-bold text-zinc-950 tabular-nums">
                            S/ {(perfume.price * quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 flex justify-end">
                <button
                  onClick={onClearCart}
                  className="text-xs text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Vaciar bolsa
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-4">
            <div className="space-y-1.5 text-xs text-zinc-600">
              {totalSavings > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Precio original:</span>
                    <span className="tabular-nums line-through text-zinc-400">
                      S/ {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Descuento aplicado:</span>
                    <span className="tabular-nums">- S/ {totalSavings.toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-sm sm:text-base font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>TOTAL A PAGAR:</span>
                <span className="tabular-nums font-brand text-lg">
                  S/ {total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>FINALIZAR PEDIDO</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
              <span>Coordinación directa vía WhatsApp oficial</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
