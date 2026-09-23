import React from 'react';
import { StoreSettings } from '../types';
import { Shield, Instagram, MessageCircle, ArrowUp } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  onNavigate: (tab: string) => void;
  onOpenAdminLogin: () => void;
  isOwnerUnlocked?: boolean;
  onSecretTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenAdminLogin,
  isOwnerUnlocked,
  onSecretTrigger,
}) => {
  const [clickCount, setClickCount] = React.useState(0);

  const handleSecretClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 3) {
      setClickCount(0);
      onSecretTrigger?.();
    }
    setTimeout(() => setClickCount(0), 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-brand text-2xl sm:text-3xl font-bold tracking-[0.22em] text-white uppercase">
              KÖNIG WERT
            </span>
            <p className="text-zinc-400 text-sm max-w-sm font-light leading-relaxed">
              "Tu esencia, tu presencia." Perfumería exclusiva dedicada a quienes buscan fragancias genuinas con carácter y distinción.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de König Wert"
                className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-white hover:text-zinc-950 text-zinc-300 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de König Wert"
                className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-white hover:text-zinc-950 text-zinc-300 flex items-center justify-center transition-colors font-bold text-xs"
              >
                ♪
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de König Wert"
                className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-emerald-600 hover:text-white text-zinc-300 flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-200">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogo')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Catálogo de Perfumes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ofertas')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ofertas Especiales
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contacto')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contacto & Ubicación
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Preguntas Frecuentes
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3 text-xs text-zinc-400">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-200">
              Atención al Cliente
            </h4>
            <p>
              <span className="text-zinc-200 font-semibold block">WhatsApp Oficial:</span>
              +51 {settings.whatsappDisplay || settings.whatsappNumber}
            </p>
            <p>
              <span className="text-zinc-200 font-semibold block">Horario:</span>
              {settings.businessHours}
            </p>
            <p>
              <span className="text-zinc-200 font-semibold block">Despachos:</span>
              {settings.deliveryZones}
            </p>
          </div>
        </div>

        {/* Bottom Bar: Clean for visitors */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            <span
              onClick={handleSecretClick}
              className="cursor-default select-none hover:text-zinc-400 transition-colors"
              title=""
            >
              ©
            </span>{' '}
            {new Date().getFullYear()} König Wert. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="hover:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Subir</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            {/* If owner is already unlocked on their device, show discreet access */}
            {isOwnerUnlocked && (
              <button
                onClick={onOpenAdminLogin}
                className="text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
                title="Acceso exclusivo de dueño"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Panel Dueño</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
