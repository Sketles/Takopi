'use client';

import React from 'react';
import Layout from '@/components/shared/Layout';
import ModelViewer3D from '@/components/ModelViewer3D';

export default function TestModelPage() {
  const src = '/uploads/content/modelos3d/shaw__hornet_-_hollow_knight_silksong.glb';

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Prueba Visor 3D</h1>
        <p className="text-gray-300 mb-4">Cargando modelo desde: <code className="text-gray-400">{src}</code></p>

        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900/80 to-purple-900/40 p-4">
          <ModelViewer3D
            src={src}
            alt="Modelo de prueba"
            width="100%"
            height="520px"
            autoRotate
            cameraControls
          />
        </div>
      </div>
    </Layout>
  );
}


