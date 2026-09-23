import React from 'react';
import { PromoBannerConfig } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  banner: PromoBannerConfig;
  onExploreOffers: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ banner, onExploreOffers }) => {
  if (!banner.isActive) return null;

  return (
    <div 
      className="text-white py-2.5 px-4 text-xs md:text-sm border-b border-zinc-800 transition-colors"
      style={{ backgroundColor: banner.backgroundColor || '#0B0B0C' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="font-semibold tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {banner.discountText}
          </span>
          <span className="hidden sm:inline text-zinc-400">|</span>
          <span className="font-medium text-zinc-100">{banner.title}</span>
          <span className="hidden md:inline text-zinc-400">·</span>
          <span className="hidden md:inline text-zinc-300 text-xs">{banner.subtitle}</span>
        </div>

        {banner.linkToOffer && (
          <button
            onClick={onExploreOffers}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white uppercase tracking-wider hover:text-amber-200 transition-colors cursor-pointer group"
          >
            <span>{banner.buttonText || 'Ver Ofertas'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
};
