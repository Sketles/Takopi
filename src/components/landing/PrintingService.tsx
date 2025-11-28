'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrintingService() {
    const [sliderPosition, setSliderPosition] = useState(50);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    return (
        <section className="py-24 px-4 bg-[#050505]">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                {/* Interactive Comparison (Digital vs Physical) */}
                <div
                    className="relative h-[500px] rounded-3xl overflow-hidden cursor-ew-resize border border-white/10 shadow-2xl group"
                    onMouseMove={handleMouseMove}
                    onTouchMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                        const percentage = (x / rect.width) * 100;
                        setSliderPosition(percentage);
                    }}
                >
                    {/* Right Image (Physical) */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/landing/physical-print.png')" }}
                    >
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                            <p className="font-bold text-white tracking-widest text-sm">FÍSICO</p>
                        </div>
                    </div>

                    {/* Left Image (Digital) - Clipped */}
                    <div
                        className="absolute inset-0 border-r-2 border-purple-500 overflow-hidden bg-cover bg-center bg-no-repeat"
                        style={{
                            width: `${sliderPosition}%`,
                            backgroundImage: "url('/landing/digital-wireframe.png')"
                        }}
                    >
                        <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 z-10">
                            <p className="font-bold text-purple-400 tracking-widest text-sm">DIGITAL</p>
                        </div>
                        {/* Grid Pattern Overlay */}
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30 mix-blend-overlay"></div>
                    </div>

                    {/* Slider Handle */}
                    <div
                        className="absolute top-0 bottom-0 w-10 -ml-5 flex items-center justify-center pointer-events-none z-20"
                        style={{ left: `${sliderPosition}%` }}
                    >
                        <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                        <span>🖨️</span> Servicio Premium
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Del archivo digital <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            a tus manos
                        </span>
                    </h2>

                    <p className="text-gray-400 text-lg leading-relaxed">
                        No necesitas una impresora 3D para tener tus modelos favoritos.
                        Nosotros nos encargamos de todo: desde la configuración hasta el envío a tu puerta.
                        Calidad industrial, materiales premium.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { title: "Materiales", desc: "PLA, PETG, Resina" },
                            { title: "Calidad", desc: "Hasta 0.05mm" },
                            { title: "Envíos", desc: "Todo Chile" },
                            { title: "Soporte", desc: "Expertos 3D" }
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <Link href="/impresion-3d" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
                            Cotizar Impresión
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
