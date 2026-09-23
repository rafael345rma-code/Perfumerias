import React, { useState, useEffect } from 'react';
import { 
  Perfume, 
  CartItem, 
  Order, 
  StoreSettings, 
  PromoBannerConfig 
} from './types';
import { 
  getPerfumes, 
  getOrders, 
  getSettings, 
  getPromoBanner, 
  isAdminAuthenticated,
  isOwnerModeUnlocked,
  setOwnerModeUnlocked
} from './services/storage';
import { PromoBanner } from './components/PromoBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { OwnerFloatingButton } from './components/OwnerFloatingButton';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { Sparkles, ShieldCheck, Award, HeartHandshake, Crown, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Application Data State
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(getSettings());
  const [promoBanner, setPromoBanner] = useState<PromoBannerConfig>(getPromoBanner());
  
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<string>('inicio');
  const [isInAdminMode, setIsInAdminMode] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Exclusive Owner Mode (Only visible to the owner)
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState<boolean>(() => {
    // If first time loading on the owner's workspace environment, initialize as unlocked
    const initialized = localStorage.getItem('konig_wert_owner_initialized');
    if (!initialized) {
      localStorage.setItem('konig_wert_owner_initialized', 'true');
      setOwnerModeUnlocked(true);
      return true;
    }
    return isOwnerModeUnlocked();
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart State (stored in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('konig_wert_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [selectedPerfumeForDetail, setSelectedPerfumeForDetail] = useState<Perfume | null>(null);
  const [checkoutDirectPerfume, setCheckoutDirectPerfume] = useState<Perfume | null>(null);
  const [checkoutDirectQuantity, setCheckoutDirectQuantity] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Catalog initial filter (e.g. when clicking 'Ofertas' from nav or hero)
  const [catalogFilter, setCatalogFilter] = useState<string>('todos');

  // Trigger brief luxury notification
  const triggerNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Toggle secret owner mode
  const handleToggleOwnerMode = () => {
    const nextState = !isOwnerUnlocked;
    setOwnerModeUnlocked(nextState);
    setIsOwnerUnlocked(nextState);
    if (nextState) {
      triggerNotification('👑 ¡Modo Dueño Activado! Tu botón exclusivo ahora está visible. Contraseña: admin123');
    } else {
      triggerNotification('🔒 Botón de Dueño ocultado. Para volver a mostrarlo: 3 clics en el logo KÖNIG WERT o presiona Alt + A.');
    }
  };

  // Load and subscribe to storage changes
  const reloadData = () => {
    setPerfumes(getPerfumes());
    setOrders(getOrders());
    setSettings(getSettings());
    setPromoBanner(getPromoBanner());
    setIsAdminLoggedIn(isAdminAuthenticated());
    setIsOwnerUnlocked(isOwnerModeUnlocked());
  };

  useEffect(() => {
    reloadData();

    // Listen to custom storage events
    const handleStorageUpdate = () => {
      reloadData();
    };

    window.addEventListener('kw_storage_perfumes', handleStorageUpdate);
    window.addEventListener('kw_storage_orders', handleStorageUpdate);
    window.addEventListener('kw_storage_settings', handleStorageUpdate);
    window.addEventListener('kw_storage_banner', handleStorageUpdate);
    window.addEventListener('kw_storage_auth', handleStorageUpdate);
    window.addEventListener('kw_storage_owner_mode', handleStorageUpdate);
    window.addEventListener('kw_storage_all', handleStorageUpdate);

    // Keyboard shortcut for owner: Alt + A or Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) || (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        handleToggleOwnerMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('kw_storage_perfumes', handleStorageUpdate);
      window.removeEventListener('kw_storage_orders', handleStorageUpdate);
      window.removeEventListener('kw_storage_settings', handleStorageUpdate);
      window.removeEventListener('kw_storage_banner', handleStorageUpdate);
      window.removeEventListener('kw_storage_auth', handleStorageUpdate);
      window.removeEventListener('kw_storage_owner_mode', handleStorageUpdate);
      window.removeEventListener('kw_storage_all', handleStorageUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOwnerUnlocked]);

  // Save cart changes
  useEffect(() => {
    localStorage.setItem('konig_wert_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Cart Operations
  const handleAddToCart = (perfume: Perfume, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.perfume.id === perfume.id);
      if (existing) {
        return prev.map((item) =>
          item.perfume.id === perfume.id
            ? { ...item, quantity: Math.min(perfume.stock, item.quantity + quantity) }
            : item
        );
      } else {
        return [...prev, { perfume, quantity: Math.min(perfume.stock, quantity) }];
      }
    });
  };

  const handleUpdateCartQuantity = (perfumeId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.perfume.id === perfumeId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (perfumeId: string) => {
    setCartItems((prev) => prev.filter((item) => item.perfume.id !== perfumeId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Quick Buy (Opens checkout directly with 1 product)
  const handleQuickBuy = (perfume: Perfume, quantity = 1) => {
    setCheckoutDirectPerfume(perfume);
    setCheckoutDirectQuantity(quantity);
    setIsCheckoutOpen(true);
  };

  // Proceed to Checkout from Cart
  const handleProceedFromCart = () => {
    setCheckoutDirectPerfume(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Clear cart after successful order creation
  const handleOrderSuccess = () => {
    if (!checkoutDirectPerfume) {
      setCartItems([]);
    }
  };

  // Smooth Navigation handler
  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'admin') {
      if (isAdminLoggedIn) {
        setIsInAdminMode(true);
      } else {
        setIsAdminLoginOpen(true);
      }
      return;
    }

    if (isInAdminMode) {
      setIsInAdminMode(false);
    }

    if (tab === 'catalogo') {
      setCatalogFilter('todos');
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'ofertas') {
      setCatalogFilter('ofertas');
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'contacto') {
      const el = document.getElementById('contacto');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'faq') {
      const el = document.getElementById('faq');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // If currently in Admin Mode view, render the Admin Panel
  if (isInAdminMode) {
    return (
      <AdminPanel
        perfumes={perfumes}
        orders={orders}
        settings={settings}
        promoBanner={promoBanner}
        onExitAdmin={() => setIsInAdminMode(false)}
      />
    );
  }

  // Calculate cart counts
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Discreet Toast Notification for Owner Mode */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 max-w-sm bg-zinc-950 text-white px-4 py-3 rounded-md shadow-2xl border border-amber-500/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Crown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-amber-300 mb-0.5">König Wert · Aviso del Sistema</p>
            <p className="text-zinc-200">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* 1. Promotional Top Banner (managed by Admin) */}
      <PromoBanner 
        banner={promoBanner} 
        onExploreOffers={() => handleNavigate('ofertas')}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {
          const searchInput = document.getElementById('catalog-search-input');
          if (searchInput) {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            handleNavigate('catalogo');
          }
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        isOwnerUnlocked={isOwnerUnlocked}
        onOpenAdminLogin={() => {
          if (isAdminLoggedIn) {
            setIsInAdminMode(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onSecretLogoTripleClick={handleToggleOwnerMode}
      />

      {/* 3. Main Content Views */}
      <main className="grow">
        {/* Hero Section */}
        {currentTab === 'inicio' && (
          <Hero
            onExploreCatalog={() => handleNavigate('catalogo')}
            onExploreOffers={() => handleNavigate('ofertas')}
          />
        )}

        {/* Value Proposition Strip */}
        {currentTab === 'inicio' && (
          <section className="border-y border-zinc-200 bg-zinc-50/80 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="flex flex-col items-center space-y-2 p-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-2xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">100% Originales</h4>
                  <p className="text-[11px] text-zinc-500">Fragancias legítimas selladas</p>
                </div>

                <div className="flex flex-col items-center space-y-2 p-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-2xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Precios Competitivos</h4>
                  <p className="text-[11px] text-zinc-500">Gama alta al mejor valor</p>
                </div>

                <div className="flex flex-col items-center space-y-2 p-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-2xs">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Atención WhatsApp</h4>
                  <p className="text-[11px] text-zinc-500">Asesoría directa y personalizada</p>
                </div>

                <div className="flex flex-col items-center space-y-2 p-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Envíos Seguros</h4>
                  <p className="text-[11px] text-zinc-500">{settings.deliveryZones || 'Despachos a todo el país'}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Catalog Section */}
        <CatalogSection
          perfumes={perfumes}
          onQuickBuy={(p) => handleQuickBuy(p, 1)}
          onViewDetails={(p) => setSelectedPerfumeForDetail(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          initialFilter={catalogFilter}
        />

        {/* Contact Section */}
        <ContactSection settings={settings} />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* 4. Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        isOwnerUnlocked={isOwnerUnlocked}
        onSecretTrigger={handleToggleOwnerMode}
        onOpenAdminLogin={() => {
          if (isAdminLoggedIn) {
            setIsInAdminMode(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      {/* 5. Floating WhatsApp Button (For general customers) */}
      <WhatsAppFloatingButton phone={settings.whatsappNumber} />

      {/* 6. EXCLUSIVE OWNER FLOATING BUTTON (Only appears to the owner) */}
      {isOwnerUnlocked && (
        <OwnerFloatingButton
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdmin={() => {
            if (isAdminLoggedIn) {
              setIsInAdminMode(true);
            } else {
              setIsAdminLoginOpen(true);
            }
          }}
        />
      )}

      {/* 7. Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedFromCart}
        onClearCart={handleClearCart}
      />

      {/* 8. Product Detail Modal */}
      <ProductDetailModal
        perfume={selectedPerfumeForDetail}
        onClose={() => setSelectedPerfumeForDetail(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
        onBuyNow={(p, qty) => handleQuickBuy(p, qty)}
      />

      {/* 9. Purchase & WhatsApp Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        directPerfume={checkoutDirectPerfume}
        directQuantity={checkoutDirectQuantity}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 10. Private Admin Login Modal (password: admin123) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsInAdminMode(true);
        }}
      />
    </div>
  );
}
