import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';
import { MessageCircle, Instagram, Clock, MapPin, Send, ShieldCheck } from 'lucide-react';

interface ContactSectionProps {
  settings: StoreSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) return;

    const fullText = `Hola König Wert, soy ${inquiryName || 'un cliente'}. Tengo una consulta sobre sus perfumes: ${inquiryMessage}`;
    const link = getWhatsAppLink(settings.whatsappNumber, fullText);
    window.open(link, '_blank');
  };

  const handleDirectWhatsApp = () => {
    const defaultMsg = 'Hola König Wert, deseo recibir asesoría para elegir mi perfume ideal.';
    const link = getWhatsAppLink(settings.whatsappNumber, defaultMsg);
    window.open(link, '_blank');
  };

  return (
    <section id="contacto-section" className="bg-zinc-50 border-t border-b border-zinc-200 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-500">
            Atención Personalizada
          </span>
          <h2 className="font-brand text-3xl sm:text-4xl font-bold text-zinc-950">
            Contacto König Wert
          </h2>
          <p className="text-sm text-zinc-600 font-light leading-relaxed">
            Estamos a tu disposición para asesorarte sobre notas aromáticas, disponibilidad inmediata, 
            y coordinar entregas directas a domicilio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Direct Info & Social Buttons */}
          <div className="bg-white p-8 border border-zinc-200 rounded-sm shadow-sm space-y-8">
            <div>
              <h3 className="font-brand text-xl font-bold text-zinc-950 mb-2">
                Canales Oficiales
              </h3>
              <p className="text-xs text-zinc-500">
                Comunícate directamente con nuestros especialistas en perfumería:
              </p>
            </div>

            {/* Main Action Buttons: WhatsApp, Instagram, TikTok */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleDirectWhatsApp}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WHATSAPP</span>
              </button>

              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                <span>INSTAGRAM</span>
              </a>

              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span className="font-bold">♪</span>
                <span>TIKTOK</span>
              </a>
            </div>

            {/* Info Items */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 text-xs sm:text-sm">
              <div className="flex items-start gap-3 text-zinc-700">
                <div className="p-2 bg-zinc-100 rounded-sm text-zinc-900 shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-zinc-950">WhatsApp de Pedidos:</span>
                  <span className="text-zinc-600 tabular-nums font-medium">
                    +51 {settings.whatsappDisplay || settings.whatsappNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-zinc-700">
                <div className="p-2 bg-zinc-100 rounded-sm text-zinc-900 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-zinc-950">Horario de atención:</span>
                  <span className="text-zinc-600">{settings.businessHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-zinc-700">
                <div className="p-2 bg-zinc-100 rounded-sm text-zinc-900 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-zinc-950">Zona de entrega:</span>
                  <span className="text-zinc-600">{settings.deliveryZones}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-zinc-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-700" />
              <span>Garantía de originalidad con sello König Wert en cada despacho.</span>
            </div>
          </div>

          {/* Right Column: Fast Inquiry Form */}
          <div className="bg-white p-8 border border-zinc-200 rounded-sm shadow-sm space-y-6">
            <div>
              <h3 className="font-brand text-xl font-bold text-zinc-950 mb-1">
                Escríbenos tu Consulta
              </h3>
              <p className="text-xs text-zinc-500">
                Escribe tu mensaje y te responderemos inmediatamente a través de WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSendInquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Tu Nombre
                </label>
                <input
                  type="text"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="Ej. Martín Rojas"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  ¿Qué perfume buscas o qué duda tienes? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Ej. Hola, estoy buscando Dior Sauvage en presentación de 100ml o una fragancia amaderada para uso nocturno..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ENVIAR CONSULTA POR WHATSAPP</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
