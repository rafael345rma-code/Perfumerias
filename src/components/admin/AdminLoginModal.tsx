import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Shield, AlertCircle, Eye, EyeOff, Crown, CheckCircle2 } from 'lucide-react';
import { getAdminPassword, setAdminAuthenticated, setOwnerModeUnlocked } from '../../services/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus password input automatically when modal opens
    const timer = setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = getAdminPassword();

    // Verify username and password (accepts saved password or default 'admin123' / 'konigwert2026')
    const passTrim = password.trim();
    if (
      username.trim().toLowerCase() === 'admin' &&
      (passTrim === correctPass || passTrim === 'admin123' || passTrim === 'konigwert2026')
    ) {
      setAdminAuthenticated(true);
      setErrorMsg('');
      onLoginSuccess();
      onClose();
    } else {
      setErrorMsg('Contraseña incorrecta. Usa admin123 para ingresar.');
    }
  };

  const handleHideButton = () => {
    if (confirm('¿Deseas ocultar el botón de este dispositivo? Podrás volver a activarlo haciendo 3 clics seguidos en el logo "KÖNIG WERT" o con Alt + A.')) {
      setOwnerModeUnlocked(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-zinc-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 rounded-sm">
              <Crown className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
                Acceso Exclusivo del Dueño
              </span>
              <h3 className="font-brand text-lg font-bold text-white">
                KÖNIG WERT · Panel Privado
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-sm text-xs text-zinc-600 leading-relaxed">
            <p className="font-semibold text-zinc-900 mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              Solo tú tienes acceso a este panel
            </p>
            Ingresa tu contraseña para administrar tus productos, actualizar precios, stock y revisar pedidos.
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950 bg-zinc-50 font-mono text-zinc-800"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-zinc-700">
                Contraseña de Administrador
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">
                Por defecto: admin123
              </span>
            </div>
            
            <div className="relative">
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Ingresa admin123"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>INGRESAR AL PANEL ADMINISTRATIVO</span>
            </button>
          </div>

          {/* Discreet options for the owner */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <button
              type="button"
              onClick={handleHideButton}
              className="hover:text-red-600 transition-colors cursor-pointer"
              title="Oculta el botón si estás compartiendo pantalla"
            >
              Ocultar botón de este dispositivo
            </button>

            <span className="text-zinc-400">
              König Wert Admin
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
