'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ParticleBackground from '@/components/shared/ParticleBackground';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-purple-500/30">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-[#0a0a0a] to-[#0a0a0a] z-0"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000"></div>

            <ParticleBackground />

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            className="text-5xl font-black tracking-tighter mb-2"
                        >
                            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                                TAKOPI
                            </span>
                        </motion.h1>
                    </Link>
                    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-gray-400 text-sm">{subtitle}</p>
                </div>

                {/* Glass Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Top Shine Effect */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    {children}
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Takopi. Todos los derechos reservados.</p>
                </div>
            </motion.div>
        </div>
    );
}
