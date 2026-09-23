import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { INITIAL_HERO_IMAGE } from '../data/initialData';

interface HeroProps {
  onExploreCatalog: () => void;
  onExploreOffers: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onExploreOffers }) => {
  return (
    <section className="relative bg-zinc-950 text-white overflow-hidden">
      {/* Background Image with Measured Scrim for WCAG AA Contrast */}
      <div className="absolute inset-0">
        <img
          src={INITIAL_HERO_IMAGE}
          alt="Colección exclusiva de perfumes König Wert"
          className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl space-y-8">
          {/* Subtle Top Kicker */}
          <div className="flex items-center gap-3 text-xs sm:text-sm tracking-[0.25em] text-zinc-400 uppercase font-medium">
            <span>KÖNIG WERT</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-200">Tu esencia, tu presencia</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="font-brand text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
              Perfumes que dejan huella.
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-xl text-balance">
              Descubre fragancias de diseñador y nicho seleccionadas por su fijación incomparable,
              proyección magnética y elegancia atemporal.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onExploreCatalog}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-100 text-sm font-bold tracking-wider uppercase transition-all duration-200 rounded-sm shadow-xl hover:shadow-2xl cursor-pointer group"
            >
              <span>VER PERFUMES</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreOffers}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-zinc-900/80 hover:bg-zinc-900 text-white border border-zinc-700/80 text-sm font-medium tracking-wider uppercase transition-colors rounded-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>OFERTAS DE TEMPORADA</span>
            </button>
          </div>

          {/* Trust Markers - Clean unboxed text with typographic separators */}
          <div className="pt-8 border-t border-zinc-800/80 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-zinc-100" />
              <span>100% Originales & Sellados</span>
            </div>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <div className="flex items-center gap-2 text-zinc-300">
              <Truck className="w-4 h-4 text-zinc-100" />
              <span>Despachos a todo el Perú</span>
            </div>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-zinc-100" />
              <span>Coordinación ágil por WhatsApp</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
