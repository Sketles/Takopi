/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌱 GENERADOR AUTOMÁTICO DE SEED - TAKOPI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Genera usuarios y productos automáticamente usando assets de las carpetas.
 * 
 * USO:
 *   npm run seed:generate -- --users 5 --products 3
 *   npm run seed:generate -- --users 10
 * 
 * CARPETAS REQUERIDAS (con archivos):
 *   seeding/avatars/    → Fotos de perfil
 *   seeding/banners/    → Banners
 *   seeding/covers/     → Portadas de productos
 *   seeding/models/     → Modelos 3D (.glb, .gltf)
 *   seeding/music/      → Música (.mp3, .wav)
 *   seeding/textures/   → Texturas (.jpg, .png)
 *   seeding/gallery/    → Imágenes adicionales
 *   seeding/usernames.txt → Lista de usernames
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { PrismaClient, ContentType, License, UserRole } from '@prisma/client';
import { put } from '@vercel/blob';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

// ════════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ════════════════════════════════════════════════════════════════════════════════

const prisma = new PrismaClient();
const SEEDING_DIR = path.join(__dirname, 'seeding');
const DEFAULT_PASSWORD = 'test12345';

// Extensiones válidas por carpeta
const VALID_EXTENSIONS = {
  images: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  models: ['.glb', '.gltf', '.obj', '.stl', '.fbx'],
  music: ['.mp3', '.wav', '.ogg', '.m4a', '.flac'],
  textures: ['.jpg', '.jpeg', '.png', '.webp', '.tiff'],
};

// MIME types
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.tiff': 'image/tiff',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json',
  '.obj': 'model/obj', '.stl': 'application/octet-stream',
  '.fbx': 'application/octet-stream',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
  '.m4a': 'audio/m4a', '.flac': 'audio/flac',
  '.zip': 'application/zip',
};

// ════════════════════════════════════════════════════════════════════════════════
// DATOS PARA GENERACIÓN AUTOMÁTICA
// ════════════════════════════════════════════════════════════════════════════════

const BIOS = [
  "Artista digital apasionado por crear mundos únicos y personajes memorables.",
  "Diseñador 3D con más de 5 años de experiencia en modelado para videojuegos.",
  "Compositor y productor musical especializado en bandas sonoras épicas.",
  "Creador de texturas PBR realistas para proyectos AAA y indie.",
  "Entusiasta del arte digital y la impresión 3D. Siempre experimentando.",
  "Modelador 3D freelance. Trabajo con Blender y ZBrush.",
  "Productor de música electrónica y ambiental para videojuegos.",
  "Artista de texturas procedurales. Substance Designer enthusiast.",
  "Escultor digital especializado en criaturas fantásticas y personajes.",
  "Músico y sound designer para proyectos interactivos.",
];

const LOCATIONS = [
  "Santiago, Chile", "Valparaíso, Chile", "Concepción, Chile",
  "Viña del Mar, Chile", "Antofagasta, Chile", "Temuco, Chile",
  "La Serena, Chile", "Puerto Montt, Chile", "Iquique, Chile",
  "Rancagua, Chile", "Talca, Chile", "Arica, Chile",
];

const PRODUCT_DATA = {
  modelos3d: {
    titles: [
      "Dragón Épico - Print Ready", "Guerrero Medieval Detallado", 
      "Nave Espacial Sci-Fi", "Criatura Fantástica", "Robot Mecha",
      "Castillo Medieval", "Espada Legendaria", "Casco Vikingo",
      "Mascota Kawaii", "Vehículo Futurista", "Monstruo del Bosque",
      "Personaje Chibi", "Armadura Completa", "Trono Real",
      "Artefacto Mágico", "Estatua Antigua", "Criatura Marina",
    ],
    descriptions: [
      "Modelo 3D de alta calidad, optimizado para impresión FDM y SLA. Incluye versiones con y sin soportes pre-generados. Probado en múltiples impresoras.",
      "Diseño original con alto nivel de detalle. Perfecto para coleccionistas y pintores de miniaturas. Escala ajustable sin perder calidad.",
      "Modelo listo para renderizar o imprimir. Geometría limpia y topología optimizada. Incluye texturas base para referencia.",
      "Creación única con múltiples partes para facilitar la impresión. Instrucciones de ensamblaje incluidas. Compatible con resina y filamento.",
      "Escultura digital con detalles intrincados. Ideal para dioramas y escenas. Múltiples poses disponibles.",
    ],
    tags: [
      ["3d-print", "stl", "figurine", "collectible"],
      ["fantasy", "medieval", "character", "rpg"],
      ["sci-fi", "futuristic", "vehicle", "mecha"],
      ["creature", "monster", "detailed", "sculpt"],
      ["miniature", "tabletop", "gaming", "dnd"],
    ],
  },
  musica: {
    titles: [
      "Epic Battle Theme", "Ambient Forest Atmosphere", "Cyberpunk Beats",
      "Medieval Tavern Music", "Space Exploration OST", "Horror Tension Loop",
      "Victory Fanfare", "Sad Piano Melody", "Action Chase Music",
      "Mystical Cave Ambience", "Boss Fight Theme", "Peaceful Village",
      "Rain and Thunder Loop", "Electronic Dance Beat", "Orchestra Epic",
    ],
    descriptions: [
      "Pista musical original perfecta para videojuegos y proyectos multimedia. Loop seamless incluido. Licencia para uso en proyectos comerciales disponible.",
      "Composición atmosférica ideal para ambientación. Múltiples capas para mezcla personalizada. Alta calidad de audio 320kbps.",
      "Tema musical con instrumentación completa. Versión con y sin melodía principal. Stems separados disponibles bajo petición.",
      "Música de fondo versátil para diferentes escenas. Transiciones suaves entre secciones. Duración extendida sin repetición notable.",
      "Banda sonora original con influencias cinematográficas. Masterizada profesionalmente. Lista para implementar en tu proyecto.",
    ],
    tags: [
      ["ost", "soundtrack", "game-music", "loop"],
      ["ambient", "atmosphere", "background", "relaxing"],
      ["epic", "orchestral", "cinematic", "dramatic"],
      ["electronic", "synth", "modern", "beats"],
      ["fantasy", "medieval", "adventure", "rpg"],
    ],
  },
  texturas: {
    titles: [
      "Pack Texturas Piedra PBR", "Madera Rústica 4K", "Metal Oxidado Realista",
      "Piel de Dragón Fantasy", "Ladrillo Antiguo Seamless", "Tierra y Barro",
      "Mármol Elegante Pack", "Tela Medieval", "Corteza de Árbol",
      "Hielo y Escarcha", "Lava Volcánica", "Cristal Mágico",
      "Arena del Desierto", "Roca Volcánica", "Musgo y Vegetación",
    ],
    descriptions: [
      "Set completo de texturas PBR con mapas de Albedo, Normal, Roughness, Metallic y AO. Resolución 4K tileable. Optimizado para motores de juegos modernos.",
      "Texturas seamless de alta calidad para superficies realistas. Incluye variaciones de color y desgaste. Compatible con Unreal, Unity y Blender.",
      "Pack de materiales procedurales con parámetros ajustables. Múltiples variantes incluidas. Documentación de uso detallada.",
      "Texturas hand-painted con estilo estilizado. Perfectas para juegos con estética cartoon o fantasy. Paleta de colores coherente.",
      "Set de superficies naturales con alto nivel de detalle. Displacement maps incluidos para geometría extra. Escaneadas de referencias reales.",
    ],
    tags: [
      ["pbr", "4k", "seamless", "tileable"],
      ["material", "surface", "realistic", "game-ready"],
      ["texture-pack", "unreal", "unity", "blender"],
      ["hand-painted", "stylized", "fantasy", "cartoon"],
      ["nature", "organic", "environment", "terrain"],
    ],
  },
  avatares: {
    titles: [
      "Avatar Cyberpunk Personalizable", "Personaje Fantasy RPG",
      "Mascota Virtual Animada", "Avatar Profesional VR",
      "Chibi Character Rigged", "Avatar Furry Detallado",
    ],
    descriptions: [
      "Avatar completo con rig facial y corporal. Compatible con VRChat y plataformas similares. Incluye blendshapes para expresiones.",
      "Modelo de personaje optimizado para realidad virtual. Bajo polycount con texturas detalladas. Listo para usar.",
      "Avatar con sistema de customización. Múltiples accesorios y opciones de color. Documentación de modificación incluida.",
    ],
    tags: [
      ["avatar", "vrchat", "vr", "rigged"],
      ["character", "customizable", "animated", "social"],
      ["virtual", "metaverse", "3d-model", "ready-to-use"],
    ],
  },
  animaciones: {
    titles: [
      "Pack Animaciones de Combate", "Ciclo de Caminata Universal",
      "Animaciones de Idle Variadas", "Movimientos de Parkour",
      "Expresiones Faciales Pack", "Danzas y Emotes",
    ],
    descriptions: [
      "Set de animaciones loop-ready para personajes. Compatible con rigs humanoides estándar. Exportado en FBX y BVH.",
      "Animaciones motion-captured de alta calidad. Transiciones suaves entre clips. Listas para retargeting.",
      "Pack de movimientos fluidos optimizados para juegos. Root motion incluido. Múltiples variaciones por acción.",
    ],
    tags: [
      ["animation", "mocap", "loop", "game-ready"],
      ["character", "movement", "action", "fbx"],
      ["humanoid", "rigged", "mixamo", "compatible"],
    ],
  },
  otros: {
    titles: [
      "Pack de Assets Completo", "Kit de Desarrollo Indie",
      "Recursos para Game Jam", "Bundle de Herramientas",
      "Pack Misceláneo Pro", "Colección de Referencias",
    ],
    descriptions: [
      "Colección variada de recursos para proyectos creativos. Incluye múltiples tipos de archivos. Documentación completa.",
      "Set de herramientas y assets para desarrollo. Organizado por categorías. Actualizaciones incluidas.",
      "Bundle de recursos listos para usar. Compatibilidad multiplataforma. Licencia flexible.",
    ],
    tags: [
      ["bundle", "pack", "assets", "resources"],
      ["tools", "development", "indie", "gamedev"],
      ["mixed", "collection", "starter", "kit"],
    ],
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════════════════════

function getFilesFromFolder(folder: string, extensions: string[]): string[] {
  const folderPath = path.join(SEEDING_DIR, folder);
  if (!fs.existsSync(folderPath)) return [];
  
  return fs.readdirSync(folderPath)
    .filter(file => extensions.some(ext => file.toLowerCase().endsWith(ext)))
    .map(file => path.join(folderPath, file));
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function generatePathname(folder: string, filename: string, userId?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const sanitizedFilename = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '_');
  
  if (userId) {
    return `${folder}/${userId}/${timestamp}-${random}-${sanitizedFilename}`;
  }
  return `${folder}/${timestamp}-${random}-${sanitizedFilename}`;
}

async function uploadFile(localPath: string, folder: string, userId?: string): Promise<string> {
  const fileBuffer = fs.readFileSync(localPath);
  const filename = path.basename(localPath);
  const mimeType = getMimeType(localPath);
  const pathname = generatePathname(folder, filename, userId);
  
  const blob = await put(pathname, fileBuffer, {
    access: 'public',
    contentType: mimeType,
  });
  
  return blob.url;
}

function loadUsernames(): string[] {
  const usernamesPath = path.join(SEEDING_DIR, 'usernames.txt');
  if (!fs.existsSync(usernamesPath)) {
    console.error('❌ No se encontró usernames.txt');
    return [];
  }
  
  return fs.readFileSync(usernamesPath, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
}

function getRandomPrice(): number {
  const prices = [0, 0, 0, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000];
  return getRandomItem(prices);
}

function getRandomLicense(): License {
  const licenses: License[] = ['personal', 'personal', 'commercial', 'streaming'];
  return getRandomItem(licenses);
}

function getRandomRole(): UserRole {
  const roles: UserRole[] = ['Artist', 'Artist', 'Artist', 'Maker'];
  return getRandomItem(roles);
}

// ════════════════════════════════════════════════════════════════════════════════
// GENERADORES
// ════════════════════════════════════════════════════════════════════════════════

interface AssetPool {
  avatars: string[];
  banners: string[];
  covers: string[];
  models: string[];
  music: string[];
  textures: string[];
  gallery: string[];
  usernames: string[];
}

function loadAssetPool(): AssetPool {
  return {
    avatars: getFilesFromFolder('avatars', VALID_EXTENSIONS.images),
    banners: getFilesFromFolder('banners', VALID_EXTENSIONS.images),
    covers: getFilesFromFolder('covers', VALID_EXTENSIONS.images),
    models: getFilesFromFolder('models', VALID_EXTENSIONS.models),
    music: getFilesFromFolder('music', VALID_EXTENSIONS.music),
    textures: getFilesFromFolder('textures', VALID_EXTENSIONS.textures),
    gallery: getFilesFromFolder('gallery', VALID_EXTENSIONS.images),
    usernames: loadUsernames(),
  };
}

function validateAssetPool(pool: AssetPool, userCount: number, productsPerUser: number): boolean {
  console.log('\n📦 Assets disponibles:');
  console.log(`   Avatars: ${pool.avatars.length}`);
  console.log(`   Banners: ${pool.banners.length}`);
  console.log(`   Covers: ${pool.covers.length}`);
  console.log(`   Models: ${pool.models.length}`);
  console.log(`   Music: ${pool.music.length}`);
  console.log(`   Textures: ${pool.textures.length}`);
  console.log(`   Gallery: ${pool.gallery.length}`);
  console.log(`   Usernames: ${pool.usernames.length}`);
  
  let isValid = true;
  
  if (pool.usernames.length < userCount) {
    console.error(`\n❌ Necesitas al menos ${userCount} usernames, tienes ${pool.usernames.length}`);
    isValid = false;
  }
  
  if (pool.covers.length === 0) {
    console.error('❌ Necesitas al menos 1 imagen de cover');
    isValid = false;
  }
  
  // Necesitamos al menos un tipo de contenido
  const hasContent = pool.models.length > 0 || pool.music.length > 0 || pool.textures.length > 0;
  if (!hasContent) {
    console.error('❌ Necesitas al menos un archivo en models/, music/ o textures/');
    isValid = false;
  }
  
  return isValid;
}

function determineContentType(pool: AssetPool): { type: ContentType; file: string } | null {
  // Crear pool de tipos disponibles con sus archivos
  const available: { type: ContentType; files: string[] }[] = [];
  
  if (pool.models.length > 0) {
    available.push({ type: 'modelos3d', files: pool.models });
  }
  if (pool.music.length > 0) {
    available.push({ type: 'musica', files: pool.music });
  }
  if (pool.textures.length > 0) {
    available.push({ type: 'texturas', files: pool.textures });
  }
  
  if (available.length === 0) return null;
  
  const selected = getRandomItem(available);
  return {
    type: selected.type,
    file: getRandomItem(selected.files),
  };
}

function generateProductData(contentType: ContentType): {
  title: string;
  description: string;
  tags: string[];
} {
  const data = PRODUCT_DATA[contentType] || PRODUCT_DATA.otros;
  
  return {
    title: getRandomItem(data.titles),
    description: getRandomItem(data.descriptions),
    tags: getRandomItem(data.tags),
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// SEED PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════════

async function seedUser(
  username: string,
  pool: AssetPool,
  productsPerUser: number,
  usedTitles: Set<string>
): Promise<void> {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`👤 Creando usuario: ${username}`);
  console.log('═'.repeat(60));
  
  // Generar datos del usuario
  const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@takopi.com`;
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  
  // Subir avatar (si hay disponibles)
  let avatarUrl: string | null = null;
  if (pool.avatars.length > 0) {
    console.log('   📷 Subiendo avatar...');
    const avatarFile = getRandomItem(pool.avatars);
    avatarUrl = await uploadFile(avatarFile, 'avatars');
    console.log(`   ✅ Avatar: ${path.basename(avatarFile)}`);
  }
  
  // Subir banner (si hay disponibles)
  let bannerUrl: string | null = null;
  if (pool.banners.length > 0) {
    console.log('   🖼️ Subiendo banner...');
    const bannerFile = getRandomItem(pool.banners);
    bannerUrl = await uploadFile(bannerFile, 'banners');
    console.log(`   ✅ Banner: ${path.basename(bannerFile)}`);
  }
  
  // Crear usuario en BD
  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
      role: getRandomRole(),
      bio: getRandomItem(BIOS),
      location: getRandomItem(LOCATIONS),
      avatar: avatarUrl,
      banner: bannerUrl,
      isActive: true,
    },
  });
  
  console.log(`   ✅ Usuario creado: ${user.email}`);
  
  // Crear productos
  for (let i = 0; i < productsPerUser; i++) {
    console.log(`\n   📦 Producto ${i + 1}/${productsPerUser}`);
    console.log('   ' + '─'.repeat(40));
    
    // Determinar tipo de contenido y archivo
    const content = determineContentType(pool);
    if (!content) {
      console.warn('   ⚠️ No hay archivos de contenido disponibles');
      continue;
    }
    
    // Generar datos del producto
    let productData = generateProductData(content.type);
    
    // Evitar títulos duplicados
    let attempts = 0;
    while (usedTitles.has(productData.title) && attempts < 10) {
      productData = generateProductData(content.type);
      attempts++;
    }
    
    // Si sigue duplicado, agregar sufijo
    if (usedTitles.has(productData.title)) {
      productData.title = `${productData.title} v${Date.now() % 1000}`;
    }
    usedTitles.add(productData.title);
    
    console.log(`      Tipo: ${content.type}`);
    console.log(`      Título: ${productData.title}`);
    
    // Subir cover
    console.log('      📤 Subiendo cover...');
    const coverFile = getRandomItem(pool.covers);
    const coverUrl = await uploadFile(coverFile, `content/${content.type}/covers`, user.id);
    
    // Subir archivo principal
    console.log('      📤 Subiendo archivo principal...');
    const fileBuffer = fs.readFileSync(content.file);
    const fileName = path.basename(content.file);
    const fileUrl = await uploadFile(content.file, `content/${content.type}`, user.id);
    
    const uploadedFiles = [{
      name: fileName,
      originalName: fileName,
      url: fileUrl,
      type: getMimeType(content.file),
      size: fileBuffer.length,
    }];
    
    // Subir imágenes adicionales (1-3 random)
    const additionalImages: string[] = [];
    if (pool.gallery.length > 0) {
      const galleryCount = Math.min(Math.floor(Math.random() * 3) + 1, pool.gallery.length);
      const galleryFiles = getRandomItems(pool.gallery, galleryCount);
      
      for (const galleryFile of galleryFiles) {
        const galleryUrl = await uploadFile(galleryFile, `content/${content.type}/gallery`, user.id);
        additionalImages.push(galleryUrl);
      }
      console.log(`      📸 ${additionalImages.length} imágenes de galería`);
    }
    
    // Precio y licencia
    const price = getRandomPrice();
    const license = getRandomLicense();
    
    // Crear producto en BD
    await prisma.content.create({
      data: {
        title: productData.title,
        description: productData.description,
        shortDescription: productData.description.substring(0, 100) + '...',
        contentType: content.type,
        authorId: user.id,
        coverImage: coverUrl,
        files: uploadedFiles,
        additionalImages: additionalImages,
        price: price,
        isFree: price === 0,
        license: license,
        tags: productData.tags,
        customTags: [],
        isPublished: true,
        isListed: true,
        publishedAt: new Date(),
        views: Math.floor(Math.random() * 500),
        downloads: Math.floor(Math.random() * 50),
      },
    });
    
    console.log(`      ✅ Creado: ${price === 0 ? 'GRATIS' : `$${price.toLocaleString()} CLP`} | ${license}`);
  }
}

async function main() {
  // Parsear argumentos
  const args = process.argv.slice(2);
  let userCount = 5;
  let productsPerUser = 3;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--users' && args[i + 1]) {
      userCount = parseInt(args[i + 1], 10);
    }
    if (args[i] === '--products' && args[i + 1]) {
      productsPerUser = parseInt(args[i + 1], 10);
    }
  }
  
  console.log('═'.repeat(60));
  console.log('🌱 GENERADOR AUTOMÁTICO DE SEED - TAKOPI');
  console.log('═'.repeat(60));
  console.log(`\n📋 Configuración:`);
  console.log(`   Usuarios a crear: ${userCount}`);
  console.log(`   Productos por usuario: ${productsPerUser}`);
  console.log(`   Total productos: ${userCount * productsPerUser}`);
  
  // Cargar assets
  const pool = loadAssetPool();
  
  // Validar
  if (!validateAssetPool(pool, userCount, productsPerUser)) {
    console.log('\n⛔ Agrega los assets necesarios en scripts/seeding/');
    process.exit(1);
  }
  
  // Confirmar
  console.log('\n⚠️ Este proceso subirá archivos a Vercel Blob y creará datos en la BD.');
  console.log('   Presiona Ctrl+C para cancelar o espera 5 segundos...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('🚀 Iniciando generación...');
  
  try {
    // Tomar usernames en orden (los primeros N)
    const selectedUsernames = pool.usernames.slice(0, userCount);
    const usedTitles = new Set<string>();
    
    for (const username of selectedUsernames) {
      await seedUser(username, pool, productsPerUser, usedTitles);
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('✅ SEED COMPLETADO EXITOSAMENTE');
    console.log('═'.repeat(60));
    
    // Resumen
    const totalUsers = await prisma.user.count();
    const totalContent = await prisma.content.count();
    console.log(`\n📊 Estado de la BD:`);
    console.log(`   Total usuarios: ${totalUsers}`);
    console.log(`   Total productos: ${totalContent}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Fatal:', error);
  process.exit(1);
});
