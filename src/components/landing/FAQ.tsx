'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "¿Qué tipo de contenido puedo vender?",
        answer: "Puedes vender modelos 3D (.glb, .obj, .fbx), música (.mp3, .wav), texturas, scripts y arte digital. Prácticamente cualquier asset digital creativo."
    },
    {
        question: "¿Cuánto cuesta vender en Takopi?",
        answer: "Registrarse y subir productos es 100% gratis. Solo cobramos una comisión del 5% cuando realizas una venta exitosa."
    },
    {
        question: "¿Cómo funciona el servicio de impresión 3D?",
        answer: "Es simple: subes tu modelo o eliges uno del marketplace, seleccionas el material y tamaño, y nosotros lo imprimimos y enviamos a tu domicilio en cualquier parte de Chile."
    },
    {
        question: "¿Los pagos son seguros?",
        answer: "Absolutamente. Utilizamos Transbank, el estándar bancario de Chile, garantizando que todas las transacciones sean encriptadas y seguras."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-16 sm:py-20 lg:py-24 px-4 max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Preguntas Frecuentes</h2>
                <p className="text-gray-400 text-sm sm:text-base">Resolvemos tus dudas antes de empezar.</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                    >
                        <button
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors gap-4"
                        >
                            <span className="font-medium text-white text-base sm:text-lg">{faq.question}</span>
                            <span className={`transform transition-transform duration-300 text-purple-400 flex-shrink-0 ${activeIndex === index ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </button>

                        <AnimatePresence>
                            {activeIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-3 sm:pt-4 text-sm sm:text-base">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
}
