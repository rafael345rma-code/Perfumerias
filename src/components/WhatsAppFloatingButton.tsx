import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

interface WhatsAppFloatingButtonProps {
  phone: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ phone }) => {
  const handleClick = () => {
    const text = 'Hola König Wert, deseo recibir asesoría para elegir mi perfume ideal.';
    const link = getWhatsAppLink(phone, text);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
      <div className="hidden sm:block bg-zinc-950 text-white text-xs px-3 py-1.5 rounded-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        ¿Deseas asesoría? Escríbenos al WhatsApp
      </div>

      <button
        onClick={handleClick}
        aria-label="Contactar por WhatsApp"
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-emerald-600/20"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </button>
    </div>
  );
};
