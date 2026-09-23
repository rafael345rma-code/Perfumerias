import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: '¿Los perfumes son 100% originales?',
      answer:
        'Absolutamente. En König Wert comercializamos únicamente fragancias legítimas en sus envases y cajas originales con número de lote (batch code) verificable. No vendemos réplicas ni imitaciones.',
    },
    {
      question: '¿Cómo coordino mi pedido por WhatsApp?',
      answer:
        'Al seleccionar tu perfume y presionar "COMPRAR", completas tus datos de entrega y al pulsar "COORDINAR PEDIDO POR WHATSAPP" se abrirá automáticamente una conversación oficial con todos los detalles de tu compra para coordinar pago y despacho en minutos.',
    },
    {
      question: '¿Qué métodos de pago tienen disponibles?',
      answer:
        'Aceptamos Yape, Plin, transferencias bancarias directas (BCP, Interbank, BBVA, Banco de la Nación) y pago contra entrega en zonas de entrega inmediata como Huánuco. También puedes adjuntar tu comprobante directamente en la web.',
    },
    {
      question: '¿Cuánto tiempo tarda en llegar mi pedido?',
      answer:
        'Para entregas locales (Huánuco) el despacho se realiza el mismo día o en la fecha y hora seleccionada en tu pedido. Para envíos a nivel nacional a través de Shalom u Olva Courier, el tiempo habitual es de 24 a 48 horas hábiles.',
    },
    {
      question: '¿Puedo solicitar presentación de regalo?',
      answer:
        'Sí. Todos nuestros envíos se entregan con la presentación premium distintiva de König Wert. Si deseas una nota personalizada o dedicatoria, puedes indicarlo en el campo de notas al finalizar tu pedido.',
    },
    {
      question: '¿Qué número de WhatsApp es el oficial de la empresa?',
      answer:
        'Nuestro único canal oficial de atención y coordinación de pedidos es el 901 697 759 (+51 901 697 759). Nunca te contactaremos desde números no oficiales para solicitar pagos.',
    },
  ];

  return (
    <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-500">
          Respuestas Claras
        </span>
        <h2 className="font-brand text-3xl sm:text-4xl font-bold text-zinc-950">
          Preguntas Frecuentes
        </h2>
        <p className="text-sm text-zinc-600 font-light">
          Todo lo que necesitas saber antes de realizar tu compra en König Wert.
        </p>
      </div>

      <div className="space-y-3 divide-y divide-zinc-200">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="pt-4 first:pt-0">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full py-4 text-left flex items-center justify-between gap-4 font-semibold text-zinc-950 hover:text-zinc-700 transition-colors cursor-pointer text-base sm:text-lg"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-zinc-950' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pb-4 text-zinc-600 text-sm leading-relaxed font-light animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
