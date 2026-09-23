import React, { useState } from 'react';
import { Crown, Lock, ShieldCheck, EyeOff } from 'lucide-react';
import { setOwnerModeUnlocked } from '../services/storage';

interface OwnerFloatingButtonProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const OwnerFloatingButton: React.FC<OwnerFloatingButtonProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleHideFromDevice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Deseas ocultar este botón de este dispositivo? Podrás volver a mostrarlo haciendo 3 clics en el logo KÖNIG WERT o con la tecla Alt + A.')) {
      setOwnerModeUnlocked(false);
    }
  };

  return (
    <div 
      className="fixed bottom-6 left-6 z-40 flex items-center group animate-in fade-in slide-in-from-bottom-4 duration-300"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="relative flex items-center">
        {/* Main Exclusive Button */}
        <button
          onClick={onOpenAdmin}
          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-950/95 hover:bg-black text-white rounded-full shadow-2xl border border-amber-500/40 hover:border-amber-400 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md ring-2 ring-amber-500/20"
          title="Acceso exclusivo del dueño (Solo visible en tu dispositivo)"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-zinc-950 shadow-xs">
            <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-amber-400 leading-none">
              Solo para ti
            </span>
            <span className="text-xs font-bold tracking-wide text-zinc-100 flex items-center gap-1">
              <span>{isAdminLoggedIn ? 'Panel Activo' : 'Panel Dueño'}</span>
              {isAdminLoggedIn ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Lock className="w-3 h-3 text-zinc-400" />
              )}
            </span>
          </div>
        </button>

        {/* Small Discreet Hide button for the owner */}
        <button
          onClick={handleHideFromDevice}
          title="Ocultar botón de este dispositivo (Para reactivar: 3 clics en el logo)"
          className="ml-1.5 p-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-red-300 rounded-full border border-zinc-700/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <EyeOff className="w-3 h-3" />
        </button>
      </div>

      {/* Explanatory Tooltip on Hover */}
      {showTooltip && (
        <div className="absolute left-0 bottom-full mb-2 bg-zinc-950 text-white text-[11px] p-2.5 rounded-sm shadow-xl border border-zinc-800 pointer-events-none w-56 leading-snug">
          <p className="font-semibold text-amber-400 flex items-center gap-1 mb-0.5">
            <Crown className="w-3 h-3" /> Botón Exclusivo de Dueño
          </p>
          <p className="text-zinc-300">
            A los clientes NO les aparece. Haz clic para ingresar con tu contraseña <code className="text-white font-mono bg-zinc-800 px-1 py-0.5 rounded">admin123</code>.
          </p>
        </div>
      )}
    </div>
  );
};
