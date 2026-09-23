import React, { useState, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, Crown, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  isAdminLoggedIn?: boolean;
  isOwnerUnlocked?: boolean;
  onOpenAdminLogin: () => void;
  onSecretLogoTripleClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenSearch,
  isAdminLoggedIn,
  isOwnerUnlocked,
  onOpenAdminLogin,
  onSecretLogoTripleClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Track triple click on logo
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onSecretLogoTripleClick();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1200);
    }
    
    // Also navigate to 'inicio'
    onNavigate('inicio');
  };

  const navLinks = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'catalogo', label: 'Perfumes' },
    { id: 'ofertas', label: 'Ofertas' },
    { id: 'contacto', label: 'Contacto' },
    { id: 'faq', label: 'Preguntas Frecuentes' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (with secret triple-click for owner) */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogoClick}
            className="text-left group cursor-pointer focus:outline-none"
            title="KÖNIG WERT - Perfumería Fina"
          >
            <span className="font-brand text-2xl sm:text-3xl font-bold tracking-[0.22em] text-zinc-950 uppercase transition-opacity group-hover:opacity-80">
              KÖNIG WERT
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-zinc-950 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-950 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Search, Cart, Exclusive Owner Button if unlocked) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Buscar perfumes"
            className="p-2.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Shopping Cart button */}
          <button
            onClick={onOpenCart}
            aria-label="Ver carrito de compras"
            className="relative p-2.5 text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-zinc-950 text-white text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-sm animate-in zoom-in">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* EXCLUSIVE OWNER BUTTON: ONLY VISIBLE IF UNLOCKED ON OWNER'S DEVICE */}
          {isOwnerUnlocked && (
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  onNavigate('admin');
                } else {
                  onOpenAdminLogin();
                }
              }}
              title="Acceso exclusivo del dueño (Solo visible para ti)"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-black text-white text-xs font-bold rounded-full shadow-md border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer transform hover:scale-105"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
              <span className="hidden sm:inline">Panel Dueño</span>
              {isAdminLoggedIn ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : null}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú principal"
            className="md:hidden p-2.5 text-zinc-900 hover:bg-zinc-100 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-2 px-3 mb-2 bg-zinc-50 border border-zinc-100 rounded-lg text-xs text-zinc-500 text-center font-medium">
            KÖNIG WERT · Tu esencia, tu presencia
          </div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                currentTab === link.id
                  ? 'bg-zinc-950 text-white'
                  : 'text-zinc-800 hover:bg-zinc-100'
              }`}
            >
              <span>{link.label}</span>
              {currentTab === link.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          ))}

          {/* Exclusive Owner button in mobile menu if unlocked */}
          {isOwnerUnlocked && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminLoggedIn) {
                  onNavigate('admin');
                } else {
                  onOpenAdminLogin();
                }
              }}
              className="w-full text-left px-4 py-3 text-sm font-bold text-amber-300 bg-zinc-950 rounded-lg flex items-center justify-between border border-amber-500/40"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Panel Privado (Dueño)</span>
              </div>
              <span className="text-[10px] bg-amber-400 text-zinc-950 px-2 py-0.5 rounded font-bold uppercase">
                admin123
              </span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
