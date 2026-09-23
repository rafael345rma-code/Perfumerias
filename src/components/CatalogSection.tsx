import React, { useState, useMemo } from 'react';
import { Perfume } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';

interface CatalogSectionProps {
  perfumes: Perfume[];
  onQuickBuy: (perfume: Perfume) => void;
  onViewDetails: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume) => void;
  initialFilter?: string; // 'ofertas', 'hombre', 'mujer', etc.
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  perfumes,
  onQuickBuy,
  onViewDetails,
  onAddToCart,
  initialFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('todos');
  const [selectedBrand, setSelectedBrand] = useState<string>('todas');
  const [selectedSpecial, setSelectedSpecial] = useState<string>(initialFilter || 'todos');
  const [sortBy, setSortBy] = useState<string>('populares');
  const [maxPrice, setMaxPrice] = useState<number>(1500);

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(perfumes.map((p) => p.brand))).filter(Boolean);
    return ['todas', ...list];
  }, [perfumes]);

  // Filter & Sort Logic
  const filteredPerfumes = useMemo(() => {
    return perfumes
      .filter((p) => {
        // Exclude hidden products
        if (p.status === 'Oculto') return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchType = p.type.toLowerCase().includes(q);
          const matchNotes = p.notes
            ? (p.notes.salida + ' ' + p.notes.corazon + ' ' + p.notes.fondo).toLowerCase().includes(q)
            : false;
          if (!matchName && !matchBrand && !matchType && !matchNotes) return false;
        }

        // Gender Filter
        if (selectedGender !== 'todos' && p.gender !== selectedGender) {
          return false;
        }

        // Brand Filter
        if (selectedBrand !== 'todas' && p.brand !== selectedBrand) {
          return false;
        }

        // Special Quick Filters (Ofertas, Más vendidos, Nuevos)
        if (selectedSpecial === 'ofertas' && !p.isOffer && !(p.originalPrice && p.originalPrice > p.price)) {
          return false;
        }
        if (selectedSpecial === 'mas_vendidos' && !p.isBestSeller) {
          return false;
        }
        if (selectedSpecial === 'nuevos' && !p.isNew) {
          return false;
        }

        // Max Price Filter
        if (p.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'precio_asc') {
          return a.price - b.price;
        }
        if (sortBy === 'precio_desc') {
          return b.price - a.price;
        }
        if (sortBy === 'recientes') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // default: populares / más vendidos first
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return 0;
      });
  }, [perfumes, searchQuery, selectedGender, selectedBrand, selectedSpecial, sortBy, maxPrice]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedGender('todos');
    setSelectedBrand('todas');
    setSelectedSpecial('todos');
    setSortBy('populares');
    setMaxPrice(1500);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedGender !== 'todos' ||
    selectedBrand !== 'todas' ||
    selectedSpecial !== 'todos' ||
    maxPrice < 1500;

  return (
    <section id="catalogo-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-zinc-200">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-500">
            Colección Exclusiva
          </span>
          <h2 className="font-brand text-3xl sm:text-4xl font-bold text-zinc-950 mt-1">
            Nuestros perfumes
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Fragancias genuinas de alta concentración, listas para entrega inmediata.
          </p>
        </div>

        {/* Results Counter */}
        <div className="text-xs text-zinc-500 tabular-nums">
          Mostrando <span className="font-semibold text-zinc-900">{filteredPerfumes.length}</span> de{' '}
          <span className="font-semibold text-zinc-900">{perfumes.length}</span> fragancias
        </div>
      </div>

      {/* Search Bar */}
      <div className="pt-6 pb-4">
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué perfume estás buscando? (Nombre, marca o notas...)"
            className="w-full pl-11 pr-10 py-3.5 text-sm bg-zinc-50 border border-zinc-200 rounded-sm focus:outline-none focus:border-zinc-950 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Controls */}
      <div className="space-y-4 py-4 border-b border-zinc-200">
        {/* Quick Collections: Todos / Ofertas / Más Vendidos / Nuevos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSpecial('todos')}
            className={`px-4 py-2 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
              selectedSpecial === 'todos'
                ? 'bg-zinc-950 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => setSelectedSpecial('ofertas')}
            className={`px-4 py-2 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedSpecial === 'ofertas'
                ? 'bg-zinc-950 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Ofertas</span>
          </button>

          <button
            onClick={() => setSelectedSpecial('mas_vendidos')}
            className={`px-4 py-2 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
              selectedSpecial === 'mas_vendidos'
                ? 'bg-zinc-950 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Más vendidos
          </button>

          <button
            onClick={() => setSelectedSpecial('nuevos')}
            className={`px-4 py-2 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
              selectedSpecial === 'nuevos'
                ? 'bg-zinc-950 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Nuevos
          </button>

          <div className="h-4 w-px bg-zinc-300 mx-1 hidden sm:block" />

          {/* Gender Buttons */}
          {(['Hombre', 'Mujer', 'Unisex'] as const).map((gender) => (
            <button
              key={gender}
              onClick={() => setSelectedGender(selectedGender === gender ? 'todos' : gender)}
              className={`px-4 py-2 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                selectedGender === gender
                  ? 'bg-zinc-950 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>

        {/* Secondary Filters Bar: Brand, Sort, Max Price */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-zinc-600">
          <div className="flex flex-wrap items-center gap-3">
            {/* Brand Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-700">Marca:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-sm text-xs font-medium focus:outline-none focus:border-zinc-950"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'todas' ? 'Todas las marcas' : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Cap */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="font-semibold text-zinc-700">Hasta:</span>
              <span className="font-bold tabular-nums text-zinc-950">S/ {maxPrice}</span>
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-zinc-900 cursor-pointer"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:text-red-700 font-semibold underline underline-offset-2 cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-700">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-sm text-xs font-medium focus:outline-none focus:border-zinc-950"
            >
              <option value="populares">Más vendidos</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
              <option value="recientes">Más recientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="pt-8">
        {filteredPerfumes.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-zinc-50 border border-zinc-200 rounded-sm">
            <p className="font-brand text-xl text-zinc-800">
              No encontramos perfumes con esos criterios
            </p>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
              Intenta buscando con otra marca o limpia los filtros activos para ver todo el catálogo disponible.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Ver todos los perfumes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPerfumes.map((perfume) => (
              <ProductCard
                key={perfume.id}
                perfume={perfume}
                onQuickBuy={onQuickBuy}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
