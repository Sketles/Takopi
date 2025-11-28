'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
    { label: "Creadores Activos", value: "1,200+", icon: "👥" },
    { label: "Modelos Disponibles", value: "5,000+", icon: "🧊" },
    { label: "Impresiones Entregadas", value: "850+", icon: "📦" },
    { label: "Países Alcanzados", value: "12", icon: "🌎" },
];

// Placeholder avatars (colors instead of images for now)
const avatars = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
    "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
    "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
    "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
    "bg-rose-500"
];

export default function SocialProof() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch('/api/users/recent?limit=25');
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    setUsers(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        }
        fetchUsers();
    }, []);

    // Fallback placeholders if no users found
    const displayItems = users.length > 0 ? users : avatars.map((color, i) => ({ id: i, color, isPlaceholder: true }));
    // Duplicate list for seamless infinite scroll (x2 is usually enough if container is wide, x3 to be safe)
    const marqueeItems = [...displayItems, ...displayItems];

    return (
        <section className="py-24 px-4 border-t border-white/5 bg-[#0a0a0a] overflow-hidden">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    Únete a la revolución <br />
                    <span className="text-purple-500">creativa</span>
                </h2>
            </div>

            {/* Stats Grid */}
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                    >
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Infinite Avatar Scroll */}
            <div className="relative w-full max-w-6xl mx-auto overflow-hidden py-10 mask-gradient">
                {/* Gradient Masks for smooth fade out at edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

                <motion.div
                    className="flex gap-8 w-max"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 40, // Slower, smoother scroll
                        repeatType: "loop"
                    }}
                >
                    {marqueeItems.map((item, i) => (
                        <div
                            key={i}
                            className={`
                                w-16 h-16 rounded-full border-4 border-[#0a0a0a] shadow-lg flex-shrink-0 
                                flex items-center justify-center overflow-hidden
                                ${item.isPlaceholder ? item.color : 'bg-gray-800'}
                                hover:scale-110 transition-transform cursor-pointer
                            `}
                            title={item.username || "User"}
                        >
                            {item.avatar ? (
                                <img src={item.avatar} alt={item.username} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white font-bold text-xs opacity-80">
                                    {item.username ? item.username.substring(0, 2).toUpperCase() : 'User'}
                                </span>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
