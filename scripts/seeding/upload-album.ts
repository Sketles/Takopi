/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🎵 UPLOAD ALBUM - CULT EP by Opium Jai
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sube un álbum de música (5 canciones) a un usuario existente.
 * Usa archivos del directorio seeding/music/album-1-Cult
 * 
 * EJECUTAR:
 *   npx tsx scripts/seeding/upload-album.ts
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { PrismaClient, ContentType, License } from '@prisma/client';
import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const SEEDING_DIR = path.join(__dirname);

// ════════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DEL ÁLBUM
// ════════════════════════════════════════════════════════════════════════════════

const ALBUM_CONFIG = {
  // Usuario al que se le asignará el álbum (buscará por username)
  username: "Pinkys7", // Productor musical existente
  
  // Datos del álbum
  title: "CULT EP - Opium Jai (Type Beat Pack)",
  shortDescription: "Pack de 5 type beats estilo trap/rage producidos por Opium Jai",
  description: `🔥 CULT EP - Type Beat Pack by Opium Jai

Un pack exclusivo de 5 type beats con el sonido característico del trap moderno y rage beats.

📦 CONTENIDO DEL PACK:
• BROKEN HEARTS - Beat melancólico con 808s pesados
• CALLING MY EX - Vibes nostálgicas perfectas para hooks emotivos
• HARDY BOYS - Energía alta, perfecto para flows agresivos
• HEAVENS GATE - Ambient pads con bass profundo
• HOUSTON - Southern trap con bounce adictivo

🎛️ ESPECIFICACIONES:
- Formato: MP3 320kbps
- BPM: Variado (130-160)
- Key: Variadas
- Stems: No incluidos (contactar para stems)

📜 LICENCIA:
Licencia de uso comercial incluida. Puedes usar estos beats en tus proyectos comerciales con crédito al productor.

💡 IDEAL PARA:
- Artistas de trap/hip-hop
- Creadores de contenido
- Proyectos audiovisuales
- Demos y mixtapes

Produced by Opium Jai 🖤`,
  
  price: 12000, // CLP
  license: "commercial" as License,
  contentType: "musica" as ContentType,
  tags: ["typebeat", "trap", "beat", "hiphop", "producer", "opiumjai", "rage", "808"],
  
  // Cover del álbum (imagen existente)
  cover: "covers/b5c7c1ce07acc95e8bbc2285e7ca4193.jpg",
  
  // Canciones del álbum (5 tracks)
  tracks: [
    "music/album-1-Cult/BROKEN HEARTS (prod. Opium Jai).mp3",
    "music/album-1-Cult/CALLING MY EX (prod. Opium Jai).mp3",
    "music/album-1-Cult/HARDY BOYS (prod. Opium Jai).mp3",
    "music/album-1-Cult/HEAVENS GATE (prod. Opium Jai).mp3",
    "music/album-1-Cult/HOUSTON (prod. Opium Jai).mp3",
  ],
  
  // Galería (imágenes adicionales del álbum)
  gallery: [
    "gallery/photomode_20082024_035211.png",
    "gallery/photomode_20082024_035230.png",
  ],
};

// ════════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════════════════════

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
};

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function generatePathname(folder: string, filename: string, userId?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const sanitizedFilename = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '_');
  return userId 
    ? `${folder}/${userId}/${timestamp}-${random}-${sanitizedFilename}`
    : `${folder}/${timestamp}-${random}-${sanitizedFilename}`;
}

async function uploadFile(localPath: string, folder: string, userId?: string): Promise<string> {
  const fullPath = path.join(SEEDING_DIR, localPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`❌ Archivo no encontrado: ${fullPath}`);
  }
  
  const fileBuffer = fs.readFileSync(fullPath);
  const filename = path.basename(fullPath);
  const mimeType = getMimeType(fullPath);
  const pathname = generatePathname(folder, filename, userId);
  
  const sizeMB = (fileBuffer.length / 1024 / 1024).toFixed(2);
  console.log(`   📤 Subiendo: ${filename} (${sizeMB} MB)`);
  
  const blob = await put(pathname, fileBuffer, {
    access: 'public',
    contentType: mimeType,
  });
  
  console.log(`   ✅ Subido: ${blob.url.substring(0, 60)}...`);
  return blob.url;
}

// ════════════════════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════════

async function uploadAlbum() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║  🎵 UPLOAD ALBUM - TAKOPI                                                    ║
║  Subiendo: ${ALBUM_CONFIG.title.padEnd(52)}       ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

  try {
    // 1. Buscar usuario existente
    console.log(`\n🔍 Buscando usuario: ${ALBUM_CONFIG.username}...`);
    const user = await prisma.user.findFirst({
      where: { 
        username: { 
          equals: ALBUM_CONFIG.username, 
          mode: 'insensitive' 
        } 
      },
    });

    if (!user) {
      throw new Error(`❌ Usuario "${ALBUM_CONFIG.username}" no encontrado en la base de datos`);
    }
    
    console.log(`   ✅ Usuario encontrado: ${user.username} (${user.email})`);

    // 2. Subir cover del álbum
    console.log(`\n🖼️ Subiendo cover del álbum...`);
    const coverUrl = await uploadFile(ALBUM_CONFIG.cover, 'covers', user.id);

    // 3. Subir tracks (archivos de música)
    console.log(`\n🎵 Subiendo tracks (${ALBUM_CONFIG.tracks.length} canciones)...`);
    const trackUrls: string[] = [];
    for (const track of ALBUM_CONFIG.tracks) {
      const trackUrl = await uploadFile(track, 'music', user.id);
      trackUrls.push(trackUrl);
    }

    // 4. Subir galería
    console.log(`\n🖼️ Subiendo galería (${ALBUM_CONFIG.gallery.length} imágenes)...`);
    const galleryUrls: string[] = [];
    for (const img of ALBUM_CONFIG.gallery) {
      const imgUrl = await uploadFile(img, 'gallery', user.id);
      galleryUrls.push(imgUrl);
    }

    // 5. Crear el contenido en la base de datos
    console.log(`\n💾 Creando registro en base de datos...`);
    
    const content = await prisma.content.create({
      data: {
        title: ALBUM_CONFIG.title,
        description: ALBUM_CONFIG.description,
        shortDescription: ALBUM_CONFIG.shortDescription,
        contentType: ALBUM_CONFIG.contentType,
        coverImage: coverUrl,
        files: trackUrls,
        additionalImages: galleryUrls,
        price: ALBUM_CONFIG.price,
        license: ALBUM_CONFIG.license,
        tags: ALBUM_CONFIG.tags,
        authorId: user.id,
        isPublished: true,
      },
    });

    console.log(`   ✅ Contenido creado con ID: ${content.id}`);

    // 6. Resumen final
    console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║  ✅ ÁLBUM SUBIDO EXITOSAMENTE                                                ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  📝 Título: ${ALBUM_CONFIG.title.padEnd(52)}       ║
║  👤 Autor: ${user.username.padEnd(53)}        ║
║  🎵 Tracks: ${String(trackUrls.length).padEnd(53)}       ║
║  💰 Precio: $${String(ALBUM_CONFIG.price).padEnd(51)} CLP   ║
║  🏷️ Tags: ${ALBUM_CONFIG.tags.slice(0, 5).join(', ').padEnd(54)}       ║
╚══════════════════════════════════════════════════════════════════════════════╝

🔗 Ver en: http://localhost:3000/user/${user.id}
    `);

  } catch (error) {
    console.error(`\n❌ ERROR:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
uploadAlbum()
  .then(() => {
    console.log('🎉 Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
