'use client';

import { useState, useRef, useEffect } from 'react';

interface RoleSelectorProps {
  currentRole: string;
  onSave: (newRole: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const roles = [
  { id: 'Explorer', label: 'Explorador', icon: '🔍', description: 'Explora y descubre contenido creativo' },
  { id: 'Artist', label: 'Artista', icon: '🎨', description: 'Crea y comparte arte digital' },
  { id: 'Buyer', label: 'Comprador', icon: '🛒', description: 'Adquiere contenido premium' },
  { id: 'Maker', label: 'Creador', icon: '🛠️', description: 'Desarrolla herramientas y soluciones' },
];

export default function RoleSelector({ currentRole, onSave, onCancel, isOpen }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(currentRole);
    }
  }, [isOpen, currentRole]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onCancel]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    onSave(role);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={selectorRef}
      className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-purple-500/20 rounded-xl shadow-2xl z-50 p-2"
    >
      <div className="text-sm text-gray-400 px-3 py-2 border-b border-purple-500/20 mb-2">
        Seleccionar rol
      </div>
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => handleRoleSelect(role.id)}
          className={`w-full px-3 py-3 text-left hover:bg-purple-500/20 transition-colors rounded-lg ${selectedRole === role.id ? 'bg-purple-600/20' : ''
            }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{role.icon}</span>
            <div>
              <div className="text-white font-medium">{role.label}</div>
              <div className="text-xs text-gray-400">{role.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
