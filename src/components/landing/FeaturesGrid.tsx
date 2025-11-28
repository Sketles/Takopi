'use client';

import { motion } from 'framer-motion';

const features = [
    {
        title: "Marketplace Global",
        description: "Compra y vende assets digitales sin fronteras. Modelos 3D, texturas, scripts y más.",
        icon: "🌍",
        color: "from-purple-500 to-indigo-600",
        size: "large", // col-span-2 row-span-2
        image: "/landing/marketplace-bg.png"
    },
    {
        title: "Impresión 3D",
        description: "Del digital al físico en un click. Servicio de impresión integrado.",
        icon: "🖨️",
        color: "from-blue-500 to-cyan-500",
        size: "tall", // col-span-1 row-span-2
        image: "/landing/3dprint-bg.png"
    },
    {
        title: "Pagos Seguros",
        description: "Transacciones protegidas y encriptadas.",
        icon: "🔒",
        color: "from-green-500 to-emerald-600",
        size: "small",
        image: "/landing/security-bg.png"
    },
    {
        title: "Comunidad",
        description: "Conecta, colabora y crece con otros.",
        icon: "👥",
        color: "from-pink-500 to-rose-600",
        size: "small",
        image: "/landing/community-bg.png"
    }
];

export default function FeaturesGrid() {
    return (
        <section className="py-24 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Todo lo que necesitas <br />
                    <span className="bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">en un solo ecosistema</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Diseñado para creadores, coleccionistas y soñadores.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className={`
              relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] 
              transition-all duration-500
              ${feature.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
              ${feature.size === 'tall' ? 'md:col-span-1 md:row-span-2' : ''}
              ${feature.size === 'small' ? 'md:col-span-1 md:row-span-1' : ''}
            `}
                    >
                        {/* Background Image with Zoom Effect */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                            style={{ backgroundImage: `url('${feature.image}')` }}
                        ></div>

                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                        {/* Hover Gradient Accent */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay`}></div>

                        {/* Content */}
                        <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                            <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center text-3xl 
                bg-white/10 backdrop-blur-md border border-white/20
                shadow-lg group-hover:scale-110 transition-transform duration-300
              `}>
                                {feature.icon}
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 group-hover:text-white transition-colors drop-shadow-sm">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
