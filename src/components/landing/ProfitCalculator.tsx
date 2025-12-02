'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function ProfitCalculator() {
    const [productsSold, setProductsSold] = useState(10);
    const [avgPrice, setAvgPrice] = useState(15000);

    const commissionRate = 0.05;
    const grossIncome = productsSold * avgPrice;
    const commission = grossIncome * commissionRate;
    const netIncome = grossIncome - commission;

    const controls = useAnimation();

    useEffect(() => {
        controls.start({
            scale: [1, 1.05, 1],
            transition: { duration: 0.3 }
        });
    }, [netIncome, controls]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    return (
        <section className="py-16 sm:py-20 lg:py-24 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0a0a0a] to-[#111] -z-10"></div>
            <div className="absolute top-1/4 right-0 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-green-500/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">

                {/* Text Content */}
                <div className="space-y-5 sm:space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                        <span>💰</span> Monetiza tu talento
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                        Calcula tu potencial <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            de ganancias
                        </span>
                    </h2>
                    <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                        Takopi te da las herramientas para vivir de tu arte. Sin costos ocultos, solo una comisión justa cuando vendes.
                        Juega con los números y visualiza tu futuro.
                    </p>

                    <ul className="space-y-3 sm:space-y-4 pt-4 text-left max-w-md mx-auto lg:mx-0">
                        {[
                            "Pagos seguros vía Transbank",
                            "Retiros directos a tu cuenta bancaria",
                            "Panel de control de ventas en tiempo real"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-300 text-sm sm:text-base">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs flex-shrink-0">✓</div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Interactive Calculator Card */}
                <div className="relative order-first lg:order-last">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl sm:rounded-3xl blur-xl opacity-20"></div>
                    <div className="relative bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl">

                        {/* Sliders */}
                        <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10">
                            <style jsx>{`
                                input[type=range] {
                                    -webkit-appearance: none;
                                    width: 100%;
                                    background: transparent;
                                }
                                input[type=range]::-webkit-slider-thumb {
                                    -webkit-appearance: none;
                                    height: 24px;
                                    width: 24px;
                                    border-radius: 50%;
                                    background: #4ade80;
                                    cursor: pointer;
                                    margin-top: -10px;
                                    box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
                                    border: 2px solid #fff;
                                }
                                input[type=range]::-webkit-slider-runnable-track {
                                    width: 100%;
                                    height: 4px;
                                    cursor: pointer;
                                    background: #374151;
                                    border-radius: 2px;
                                }
                                input[type=range]:focus::-webkit-slider-thumb {
                                    box-shadow: 0 0 20px rgba(74, 222, 128, 0.8);
                                    transform: scale(1.1);
                                }
                            `}</style>

                            {/* Products Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-400">Ventas por mes</span>
                                    <span className="text-white">{productsSold} productos</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={productsSold}
                                    onChange={(e) => setProductsSold(parseInt(e.target.value))}
                                    className="w-full transition-all"
                                />
                            </div>

                            {/* Price Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-400">Precio promedio</span>
                                    <span className="text-white">{formatCurrency(avgPrice)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1000"
                                    max="100000"
                                    step="1000"
                                    value={avgPrice}
                                    onChange={(e) => setAvgPrice(parseInt(e.target.value))}
                                    className="w-full transition-all"
                                />
                            </div>
                        </div>

                        {/* Results */}
                        <div className="bg-black/40 rounded-2xl p-6 space-y-4 border border-white/5">
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <span>Ingreso Bruto</span>
                                <span>{formatCurrency(grossIncome)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <span>Comisión Takopi (5%)</span>
                                <span>- {formatCurrency(commission)}</span>
                            </div>
                            <div className="h-px bg-white/10 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Tu Ganancia Neta</span>
                                <motion.span
                                    animate={controls}
                                    className="text-2xl md:text-3xl font-black text-green-400"
                                >
                                    {formatCurrency(netIncome)}
                                </motion.span>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <button className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-colors shadow-lg shadow-green-900/20">
                                Empezar a Ganar Dinero
                            </button>
                            <p className="text-xs text-gray-500 mt-3">Estimación basada en ventas mensuales promedio.</p>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
