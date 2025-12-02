'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '@/components/auth/AuthLayout';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Explorer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones
    if (formData.username.trim().length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const normalizedEmail = formData.email.toLowerCase().trim();
      const success = await register(formData.username, normalizedEmail, formData.password, formData.role);
      if (success) {
        router.push('/explore');
      } else {
        setError('Error al crear la cuenta. Verifica tus datos.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'email' ? value.toLowerCase() : value
    });
    if (error) setError('');
  };

  const handleRoleSelect = (role: string) => {
    setFormData({ ...formData, role });
  };

  const inputVariants = {
    focused: {
      scale: 1.02,
      borderColor: "rgba(168, 85, 247, 0.4)",
      boxShadow: "0 0 20px rgba(168, 85, 247, 0.1)",
      backgroundColor: "rgba(255, 255, 255, 0.03)"
    },
    unfocused: {
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "none",
      backgroundColor: "rgba(255, 255, 255, 0.01)"
    }
  };

  const roles = [
    { id: 'Explorer', label: 'Explorador', icon: '🔭', desc: 'Descubre contenido' },
    { id: 'Artist', label: 'Artista', icon: '🎨', desc: 'Sube tus obras' },
    { id: 'Buyer', label: 'Comprador', icon: '🛍️', desc: 'Adquiere assets' },
  ];

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Únete a la comunidad de Takopi"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm backdrop-blur-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Username Input */}
        <div className="relative group">
          <label className="block text-xs font-medium text-gray-400 mb-2 ml-1 tracking-wide">NOMBRE DE USUARIO</label>
          <motion.div
            variants={inputVariants}
            animate={focusedField === 'username' ? 'focused' : 'unfocused'}
            className="relative rounded-2xl border transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <svg className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'username' ? 'text-purple-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleChange}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              className="block w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm font-medium transition-all"
              style={{
                WebkitBoxShadow: "0 0 0 30px #131313 inset",
                WebkitTextFillColor: "white",
                caretColor: "white"
              }}
              placeholder="Tu nombre público"
            />
          </motion.div>
        </div>

        {/* Email Input */}
        <div className="relative group">
          <label className="block text-xs font-medium text-gray-400 mb-2 ml-1 tracking-wide">EMAIL</label>
          <motion.div
            variants={inputVariants}
            animate={focusedField === 'email' ? 'focused' : 'unfocused'}
            className="relative rounded-2xl border transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <svg className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-purple-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="block w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm font-medium transition-all"
              style={{
                WebkitBoxShadow: "0 0 0 30px #131313 inset",
                WebkitTextFillColor: "white",
                caretColor: "white"
              }}
              placeholder="nombre@ejemplo.com"
            />
          </motion.div>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-3 ml-1 tracking-wide">SELECCIONA TU ROL</label>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${formData.role === role.id
                    ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                  }`}
              >
                {formData.role === role.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent pointer-events-none" />
                )}
                <span className="text-2xl mb-2 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">{role.icon}</span>
                <span className="text-xs font-bold tracking-wide">{role.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Password Input */}
        <div className="relative group">
          <label className="block text-xs font-medium text-gray-400 mb-2 ml-1 tracking-wide">CONTRASEÑA</label>
          <motion.div
            variants={inputVariants}
            animate={focusedField === 'password' ? 'focused' : 'unfocused'}
            className="relative rounded-2xl border transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <svg className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-purple-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="block w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-gray-600 focus:outline-none text-sm font-medium transition-all"
              style={{
                WebkitBoxShadow: "0 0 0 30px #131313 inset",
                WebkitTextFillColor: "white",
                caretColor: "white"
              }}
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-purple-400 transition-colors focus:outline-none z-10"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.2)] text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative flex items-center gap-2">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creando cuenta...
              </>
            ) : (
              <>
                Registrarse
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </>
            )}
          </span>
        </motion.button>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" className="font-bold text-purple-400 hover:text-purple-300 transition-colors hover:underline decoration-2 underline-offset-4">
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}