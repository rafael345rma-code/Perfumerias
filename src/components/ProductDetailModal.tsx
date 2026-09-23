import React, { useState } from 'react';
import { Perfume } from '../types';
import { X, Check, ShoppingCart, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, quantity: number) => void;
  onBuyNow: (perfume: Perfume, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!perfume) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const images = perfume.images && perfume.images.length > 0 ? perfume.images : [''];
  const activeImage = images[selectedImageIndex] || images[0];

  const hasDiscount = perfume.originalPrice && perfume.originalPrice > perfume.price;
  const discountPercent = perfume.discountPercent || (hasDiscount 
    ? Math.round(((perfume.originalPrice! - perfume.price) / perfume.originalPrice!) * 100) 
    : 0);

  const isOutOfStock = perfume.stock <= 0 || perfume.status === 'Agotado';

  const handleAdd = () => {
    onAddToCart(perfume, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuy = () => {
    onBuyNow(perfume, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden my-8 border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 rounded-full transition-colors cursor-pointer border border-zinc-200"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Gallery */}
          <div className="p-6 bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col justify-between">
            <div className="relative aspect-square w-full bg-white rounded-sm border border-zinc-200/80 overflow-hidden flex items-center justify-center p-6 shadow-inner">
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {perfume.isOffer && (
                  <span className="bg-zinc-950 text-white text-[11px] font-bold px-2 py-0.5 tracking-wider uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    OFERTA
                  </span>
                )}
                {perfume.isBestSeller && (
                  <span className="bg-amber-100 text-amber-950 text-[11px] font-semibold px-2 py-0.5 tracking-wider uppercase">
                    MÁS VENDIDO
                  </span>
                )}
              </div>

              {hasDiscount && discountPercent > 0 && (
                <div className="absolute top-3 right-3 z-10 bg-red-600 text-white font-bold text-xs px-2.5 py-1 tracking-tight rounded-xs shadow-sm">
                  -{discountPercent}%
                </div>
              )}

              {activeImage ? (
                <img
                  src={activeImage}
                  alt={`${perfume.brand} ${perfume.name}`}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-zinc-400 font-brand text-xl">{perfume.brand}</div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-sm border-2 overflow-hidden bg-white p-1 transition-all cursor-pointer flex-shrink-0 ${
                      selectedImageIndex === idx ? 'border-zinc-950' : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust highlights */}
            <div className="mt-6 pt-4 border-t border-zinc-200 grid grid-cols-2 gap-3 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Original garantizado</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Envío seguro y rápido</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Purchase Form */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">
                  {perfume.brand}
                </span>
                <h2 className="font-brand text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">
                  {perfume.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1 font-medium">
                  <span>{perfume.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{perfume.sizeMl} ml</span>
                  <span aria-hidden="true">·</span>
                  <span>Para {perfume.gender}</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-3.5 bg-zinc-50 rounded-sm border border-zinc-200/80">
                <div className="flex items-baseline gap-3">
                  {hasDiscount && perfume.originalPrice && (
                    <span className="text-sm text-zinc-400 line-through tabular-nums font-normal">
                      S/ {perfume.originalPrice.toFixed(0)}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-bold text-zinc-950 tabular-nums">
                    S/ {perfume.price.toFixed(0)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs font-semibold text-red-600">
                      Ahorras S/ {(perfume.originalPrice! - perfume.price).toFixed(0)} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-zinc-600">
                  <span>Disponibilidad:</span>
                  <span className={perfume.stock > 0 ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'}>
                    {perfume.stock > 0 ? `En Stock (${perfume.stock} unidades)` : 'Agotado temporalmente'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-800">
                  Descripción
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  {perfume.description}
                </p>
              </div>

              {/* Olfactory Notes */}
              {perfume.notes && (
                <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-sm space-y-2 text-xs">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-900 flex items-center gap-1.5">
                    Pirámide Olfativa
                  </h4>
                  {perfume.notes.salida && (
                    <div className="grid grid-cols-4 gap-1">
                      <span className="text-zinc-500 font-medium">Salida:</span>
                      <span className="col-span-3 text-zinc-800">{perfume.notes.salida}</span>
                    </div>
                  )}
                  {perfume.notes.corazon && (
                    <div className="grid grid-cols-4 gap-1">
                      <span className="text-zinc-500 font-medium">Corazón:</span>
                      <span className="col-span-3 text-zinc-800">{perfume.notes.corazon}</span>
                    </div>
                  )}
                  {perfume.notes.fondo && (
                    <div className="grid grid-cols-4 gap-1">
                      <span className="text-zinc-500 font-medium">Fondo:</span>
                      <span className="col-span-3 text-zinc-800">{perfume.notes.fondo}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Cantidad:
                </span>
                <div className="flex items-center border border-zinc-300 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(perfume.stock, quantity + 1))}
                    disabled={quantity >= perfume.stock || isOutOfStock}
                    className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total calculation */}
              <div className="flex justify-between items-center text-sm font-semibold text-zinc-900">
                <span>Subtotal ({quantity} {quantity === 1 ? 'unidad' : 'unidades'}):</span>
                <span className="text-base font-bold tabular-nums">S/ {(perfume.price * quantity).toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className="py-3 px-4 border border-zinc-950 text-zinc-950 hover:bg-zinc-100 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{addedToast ? '¡Agregado!' : 'AGREGAR AL CARRITO'}</span>
                </button>

                <button
                  onClick={handleBuy}
                  disabled={isOutOfStock}
                  className="py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>COMPRAR AHORA</span>
                </button>
              </div>

              {addedToast && (
                <div className="text-center text-xs font-semibold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded flex items-center justify-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4" />
                  <span>Producto añadido a tu bolsa de compras</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
