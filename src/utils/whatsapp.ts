import { Order } from '../types';

export const formatOrderForWhatsApp = (order: Order): string => {
  const itemsText = order.items
    .map(
      item =>
        `🧴 *Perfume:* ${item.name} (${item.brand})\n🔢 *Cantidad:* ${item.quantity}\n💰 *Precio Unit.:* S/ ${item.price.toFixed(2)}`
    )
    .join('\n---\n');

  const paymentText = order.hasPaid
    ? '✅ Ya realizado (Comprobante adjuntado en plataforma)'
    : '⏳ Pendiente por coordinar (Yape / Plin / Transferencia)';

  const addressText = `${order.address}, ${order.city}${order.reference ? ` (Ref: ${order.reference})` : ''}`;

  return `Hola, König Wert. Quiero coordinar mi pedido:

📋 *Pedido:* ${order.orderNumber}
${itemsText}

💵 *TOTAL:* S/ ${order.total.toFixed(2)}
📅 *Fecha de entrega preferida:* ${order.deliveryDate || 'Lo antes posible'}
🕐 *Hora aproximada:* ${order.deliveryTime || 'A coordinar'}
📍 *Dirección de entrega:* ${addressText}
📱 *Cliente:* ${order.clientName}
📞 *Teléfono:* ${order.whatsapp}
💳 *Estado de pago:* ${paymentText}
${order.notes ? `📝 *Nota adicional:* ${order.notes}\n` : ''}
Quedo a la espera de su confirmación para coordinar el despacho. ¡Muchas gracias!`;
};

export const getWhatsAppLink = (phone: string, text: string): string => {
  // Clean phone number: remove spaces, dashes, plus sign
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

export const formatAdminClientWhatsApp = (order: Order): string => {
  return `Hola ${order.clientName}, te saludamos de *König Wert*. Nos comunicamos respecto a tu pedido *${order.orderNumber}* de ${order.items.map(i => i.name).join(', ')}. ¿Cómo estás?`;
};
