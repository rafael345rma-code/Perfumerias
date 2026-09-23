import React from 'react';
import { Perfume } from '../types';
import { Eye, ShoppingCart, Sparkles } from 'lucide-react';

interface ProductCardProps {
  perfume: Perfume;
  onQuickBuy: (perfume: Perfume) => void;
  onViewDetails: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  perfume,
  onQuickBuy,
  onViewDetails,
  onAddToCart,
}) => {
  const isOutOfStock = perfume.stock <= 0 || perfume.status === 'Agotado';
  const hasDiscount = perfume.originalPrice && perfume.originalPrice > perfume.price;
  const discountPercent = perfume.discountPercent || (hasDiscount 
    ? Math.round(((perfume.originalPrice! - perfume.price) / perfume.originalPrice!) * 100) 
    : 0);

  const mainImage = perfume.images && perfume.images.length > 0 ? perfume.images[0] : '';

  return (
    <div className="group relative bg-white border border-zinc-200/90 rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-zinc-300">
      {/* Top Visual Badges (Editorial clean tags) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {perfume.isOffer && hasDiscount && (
          <span className="bg-zinc-950 text-white text-[11px] font-bold px-2 py-0.5 tracking-wider uppercase flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-300" />
            OFERTA
          </span>
        )}
        {perfume.isBestSeller && !perfume.isOffer && (
          <span className="bg-zinc-900 text-amber-200 text-[11px] font-semibold px-2 py-0.5 tracking-wider uppercase shadow-sm">
            MÁS VENDIDO
          </span>
        )}
        {perfume.isNew && (
          <span className="bg-zinc-100 text-zinc-900 border border-zinc-200 text-[11px] font-semibold px-2 py-0.5 tracking-wider uppercase">
            NUEVO
          </span>
        )}
      </div>

      {/* Discount Percentage Badge (Top Right) */}
      {hasDiscount && discountPercent > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-red-600 text-white font-bold text-xs px-2 py-1 tracking-tight rounded-xs shadow-sm">
          -{discountPercent}%
        </div>
      )}

      {/* Product Image Area */}
      <div 
        onClick={() => onViewDetails(perfume)}
        className="relative w-full aspect-[4/3] bg-zinc-50 overflow-hidden cursor-pointer flex items-center justify-center p-4"
      >
        {mainImage ? (
          <img
            src={mainImage}
            alt={`${perfume.brand} ${perfume.name}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-400 p-4 text-center">
            <span className="font-brand text-lg">{perfume.brand}</span>
            <span className="text-xs">{perfume.name}</span>
          </div>
        )}

        {/* Quick View Overlay on hover */}
        <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(perfume);
            }}
            className="px-3 py-1.5 bg-white text-zinc-950 text-xs font-semibold uppercase tracking-wider rounded-sm shadow-md hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detalles</span>
          </button>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 border border-zinc-900 px-3 py-1 bg-white">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Type / Size */}
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 font-medium">
            <span className="uppercase tracking-wider font-semibold text-zinc-700">{perfume.brand}</span>
            <span>{perfume.type} · {perfume.sizeMl} ml</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onViewDetails(perfume)}
            className="mt-1 font-semibold text-zinc-950 text-base line-clamp-1 hover:text-zinc-700 transition-colors cursor-pointer"
            title={`${perfume.brand} ${perfume.name}`}
          >
            {perfume.name}
          </h3>

          {/* Gender */}
          <div className="text-[11px] text-zinc-400 mt-0.5">
            Para {perfume.gender}
          </div>
        </div>

        {/* Pricing Block */}
        <div className="pt-2 border-t border-zinc-100">
          <div className="flex items-baseline gap-2">
            {hasDiscount && perfume.originalPrice && (
              <span className="text-xs text-zinc-400 line-through tabular-nums font-normal">
                S/ {perfume.originalPrice.toFixed(0)}
              </span>
            )}
            <span className="text-lg font-bold text-zinc-950 tabular-nums">
              S/ {perfume.price.toFixed(0)}
            </span>
            {hasDiscount && (
              <span className="text-[11px] font-semibold text-red-600 tabular-nums">
                Ahorras S/ {(perfume.originalPrice! - perfume.price).toFixed(0)}
              </span>
            )}
          </div>
        </div>

        {/* Actions: COMPRAR & ADD TO CART */}
        <div className="pt-2 grid grid-cols-5 gap-2">
          <button
            onClick={() => onAddToCart(perfume)}
            disabled={isOutOfStock}
            title="Agregar al carrito"
            className="col-span-1 p-2.5 border border-zinc-300 hover:border-zinc-950 hover:bg-zinc-50 text-zinc-800 rounded-sm transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>

          <button
            onClick={() => onQuickBuy(perfume)}
            disabled={isOutOfStock}
            className="col-span-4 py-2.5 px-3 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <span>COMPRAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
