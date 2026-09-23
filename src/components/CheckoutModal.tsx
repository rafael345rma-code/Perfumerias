import React, { useState } from 'react';
import { Perfume, CartItem, Order, OrderItem } from '../types';
import { formatOrderForWhatsApp, getWhatsAppLink } from '../utils/whatsapp';
import { addOrder, getSettings } from '../services/storage';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  MessageCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directPerfume?: Perfume | null;
  directQuantity?: number;
  cartItems?: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  directPerfume,
  directQuantity = 1,
  cartItems = [],
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  // Determine items to order
  const initialItems: OrderItem[] = directPerfume
    ? [
        {
          perfumeId: directPerfume.id,
          name: `${directPerfume.name} (${directPerfume.type} ${directPerfume.sizeMl}ml)`,
          brand: directPerfume.brand,
          price: directPerfume.price,
          originalPrice: directPerfume.originalPrice,
          quantity: directQuantity,
          image: directPerfume.images?.[0] || '',
        },
      ]
    : cartItems.map((item) => ({
        perfumeId: item.perfume.id,
        name: `${item.perfume.name} (${item.perfume.type} ${item.perfume.sizeMl}ml)`,
        brand: item.perfume.brand,
        price: item.perfume.price,
        originalPrice: item.perfume.originalPrice,
        quantity: item.quantity,
        image: item.perfume.images?.[0] || '',
      }));

  const [items, setItems] = useState<OrderItem[]>(initialItems);

  // Form Fields
  const [clientName, setClientName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    // Default to tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [deliveryTime, setDeliveryTime] = useState('5:00 PM');
  const [city, setCity] = useState('Huánuco');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Post-order completed state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleUpdateQty = (index: number, delta: number) => {
    setItems((prev) => {
      const updated = [...prev];
      const newQty = Math.max(1, updated[index].quantity + delta);
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  // Image Upload handler (as base64 data url)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona una imagen válida (.jpg, .png).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('El comprobante no debe superar los 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPaymentProofUrl(reader.result as string);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 8) {
      setErrorMsg('Por favor ingresa un número de WhatsApp válido.');
      return;
    }

    if (!address.trim()) {
      setErrorMsg('Por favor ingresa tu dirección de entrega.');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('No hay productos en el pedido.');
      return;
    }

    setErrorMsg('');

    // Save order in local database
    const newOrder = addOrder({
      clientName: clientName.trim(),
      whatsapp: whatsapp.trim(),
      deliveryDate,
      deliveryTime,
      city: city.trim(),
      address: address.trim(),
      reference: reference.trim(),
      hasPaid,
      paymentProofUrl: hasPaid ? paymentProofUrl : undefined,
      items,
      total: calculateTotal(),
      notes: notes.trim(),
    });

    setCompletedOrder(newOrder);
    onOrderSuccess(newOrder);

    // Open WhatsApp automatically
    const settings = getSettings();
    const message = formatOrderForWhatsApp(newOrder);
    const link = getWhatsAppLink(settings.whatsappNumber, message);
    window.open(link, '_blank');
  };

  const handleOpenWhatsAppAgain = () => {
    if (!completedOrder) return;
    const settings = getSettings();
    const message = formatOrderForWhatsApp(completedOrder);
    const link = getWhatsAppLink(settings.whatsappNumber, message);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden my-6 border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-zinc-950 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.2em]">
              König Wert
            </span>
            <h3 className="font-brand text-xl font-bold">
              {completedOrder ? '¡Pedido Registrado con Éxito!' : 'Finalizar Pedido'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completed Screen */}
        {completedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="font-brand text-2xl font-bold text-zinc-950">
                ¡Gracias por tu compra, {completedOrder.clientName}!
              </h4>
              <p className="text-sm text-zinc-600 max-w-md mx-auto">
                Tu pedido <span className="font-bold text-zinc-950">#{completedOrder.orderNumber}</span> ha sido registrado en nuestro sistema.
              </p>
            </div>

            {/* Order Brief Box */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-sm p-4 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between border-b border-zinc-200 pb-2 font-semibold text-zinc-800">
                <span>Total a pagar:</span>
                <span className="text-sm font-bold text-zinc-950">S/ {completedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Fecha entrega:</span>
                <span>{completedOrder.deliveryDate} · {completedOrder.deliveryTime}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Destino:</span>
                <span>{completedOrder.address}, {completedOrder.city}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Estado de pago:</span>
                <span className={completedOrder.hasPaid ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                  {completedOrder.hasPaid ? 'Pago reportado' : 'Por coordinar'}
                </span>
              </div>
            </div>

            {/* Big Action Button */}
            <div className="space-y-3 max-w-md mx-auto">
              <button
                onClick={handleOpenWhatsAppAgain}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wider uppercase rounded-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>COORDINAR PEDIDO POR WHATSAPP</span>
              </button>

              <p className="text-xs text-zinc-500">
                Se abrirá WhatsApp con el resumen de tu pedido para confirmar detalles de entrega y pago.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex justify-center">
              <button
                onClick={onClose}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer uppercase tracking-wider"
              >
                Volver a la tienda
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs font-medium text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Tu Pedido */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200 pb-1">
                Tu pedido
              </h4>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 bg-zinc-50 p-3 rounded-sm border border-zinc-200">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white border border-zinc-200 rounded-sm p-1 flex items-center justify-center shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-brand">{item.brand}</span>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500">{item.brand}</span>
                        <h5 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-1">{item.name}</h5>
                        <p className="text-xs text-zinc-600 font-semibold tabular-nums">S/ {item.price.toFixed(2)} c/u</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-zinc-300 rounded-sm bg-white">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(idx, -1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-xs text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(idx, 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right font-bold text-xs sm:text-sm tabular-nums text-zinc-950 w-20">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-zinc-100 p-3 rounded-sm font-bold text-sm text-zinc-950">
                <span>Total a pagar:</span>
                <span className="text-base tabular-nums font-brand">S/ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Section 2: Datos del Pedido */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200 pb-1">
                Datos del cliente y entrega
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    Número de WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ej. 962 458 123"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>
              </div>

              {/* Delivery Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    ¿Para cuándo deseas tu pedido? (Fecha)
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    Hora aproximada de entrega
                  </label>
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm bg-white focus:outline-none focus:border-zinc-950"
                  >
                    <option value="Mañana (9:00 AM - 12:00 PM)">Mañana (9:00 AM - 12:00 PM)</option>
                    <option value="Tarde (12:00 PM - 4:00 PM)">Tarde (12:00 PM - 4:00 PM)</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="Noche (6:00 PM - 8:30 PM)">Noche (6:00 PM - 8:30 PM)</option>
                    <option value="Coordinar por WhatsApp">Coordinar por WhatsApp</option>
                  </select>
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      Ciudad / Región *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ej. Huánuco / Lima"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Dirección exacta *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Jr./Av., número, departamento o urbanización"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Referencia de entrega
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ej. Frente al parque Santo Domingo, portón negro"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: ¿Ya realizaste el pago? */}
            <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-200 rounded-sm">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-zinc-800" />
                ¿Ya realizaste el pago?
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasPaid(false)}
                  className={`py-2.5 px-3 rounded-sm border text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    !hasPaid
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400'
                  }`}
                >
                  <span>No, todavía no he pagado</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHasPaid(true)}
                  className={`py-2.5 px-3 rounded-sm border text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    hasPaid
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400'
                  }`}
                >
                  <span>Sí, ya pagué</span>
                </button>
              </div>

              {/* Payment Proof Upload */}
              {hasPaid ? (
                <div className="pt-2 space-y-2">
                  <p className="text-xs text-zinc-600">
                    Adjunta tu captura o comprobante de transferencia (Yape / Plin / BCP / Interbank):
                  </p>

                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-sm cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-4 h-4 text-zinc-700" />
                      <span>Subir Comprobante</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {paymentProofUrl ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Comprobante cargado</span>
                        <img 
                          src={paymentProofUrl} 
                          alt="Previsualización comprobante" 
                          className="w-8 h-8 object-cover rounded-xs border border-zinc-300" 
                        />
                      </div>
                    ) : (
                      <span className="text-[11px] text-zinc-400 italic">
                        (Opcional, también puedes enviarlo directo al WhatsApp)
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500">
                  Podrás pagar por Yape, Plin o Transferencia al momento de coordinar con nuestro asesor en WhatsApp.
                </p>
              )}
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                Notas adicionales (Opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Envolver para regalo, llamar antes de llegar, etc."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-950"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>COORDINAR PEDIDO POR WHATSAPP</span>
              </button>
              <p className="text-center text-[11px] text-zinc-500 mt-2">
                Tu pedido quedará guardado y se abrirá WhatsApp con el número oficial de König Wert.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
