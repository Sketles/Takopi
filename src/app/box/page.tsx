'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  author: string;
  type: string;
}

export default function BoxPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de items del carrito
    // En el futuro, esto vendrá de la API
    setTimeout(() => {
      setCartItems([]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Tu Box está vacío</h1>
          <p className="text-gray-400 mb-8">Inicia sesión para ver tus items guardados</p>
          <Link
            href="/auth/login"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Mi Box</h1>
              <p className="text-gray-400">Guarda tus creaciones favoritas</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Tu Box está vacío</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Explora las increíbles creaciones de la comunidad y guarda tus favoritas aquí
            </p>
            <Link
              href="/explore"
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
            >
              Explorar Creaciones
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items del carrito */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 hover:border-orange-500/30 transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">por {item.author}</p>
                      <p className="text-orange-400 font-bold text-lg">${item.price.toLocaleString()} CLP</p>
                    </div>
                    <button className="text-red-400 hover:text-red-300 transition-colors p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 sticky top-8">
                <h3 className="text-xl font-bold text-white mb-6">Resumen</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Items ({cartItems.length})</span>
                    <span>${totalPrice.toLocaleString()} CLP</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div className="border-t border-purple-500/20 pt-4">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span>${totalPrice.toLocaleString()} CLP</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25">
                  Proceder al Pago
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
