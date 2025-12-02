/**
 * Script de Seeding - Modelos 3D para Takopi
 * 
 * Ejecutar con: npx ts-node scripts/seeding/seed-models.ts
 * O con variables de entorno cargadas manualmente
 */

import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const SEED_DIR = path.join(__dirname, 'seed');
const USERS_DIR = path.join(SEED_DIR, 'user');
const PASSWORD = 'test12345';

// Inicializar Prisma
const prisma = new PrismaClient();

// ============================================================================
// DATOS DE USUARIOS
// ============================================================================

interface UserData {
  username: string;
  bio: string;
  location: string;
  role: string;
}

const USERS: UserData[] = [
  { username: 'Sk488', bio: 'Artista 3D y diseñador industrial. Creo modelos para videojuegos y visualización arquitectónica.', location: 'Santiago, Chile', role: 'Artist' },
  { username: 'Luriesse', bio: 'Modeladora freelance especializada en personajes estilizados y props para gaming.', location: 'Valparaíso, Chile', role: 'Artist' },
  { username: 'Sniper', bio: 'Ex-desarrollador de juegos, ahora me dedico a crear assets 3D de alta calidad.', location: 'Concepción, Chile', role: 'Artist' },
  { username: 'Pinkys7', bio: 'Diseñadora de personajes y fan del arte kawaii. Mis modelos tienen alma ✨', location: 'Viña del Mar, Chile', role: 'Artist' },
  { username: 'TP1mazda', bio: 'Apasionado por los autos y la impresión 3D. Modelos optimizados para FDM y resina.', location: 'Temuco, Chile', role: 'Artist' },
  { username: 'Okko', bio: 'Creo mundos en miniatura. Props, escenarios y todo lo que puedas imaginar.', location: 'Antofagasta, Chile', role: 'Artist' },
  { username: 'OnoIwakura', bio: 'Artista digital inspirada en el anime y la cultura japonesa. Let\'s all love Lain.', location: 'Santiago, Chile', role: 'Artist' },
  { username: 'Caaaaal', bio: 'Modelador orgánico y hard surface. 5 años de experiencia en la industria.', location: 'Puerto Montt, Chile', role: 'Artist' },
  { username: 'Lain', bio: 'Present day, present time. Hahaha. Artista 3D y entusiasta del cyberpunk.', location: 'Santiago, Chile', role: 'Artist' },
  { username: 'RKOIDE', bio: 'Creador de assets para Unity y Unreal. Optimización es mi segundo nombre.', location: 'Iquique, Chile', role: 'Artist' },
  { username: 'AjiloteMX', bio: 'Mexicano en Chile. Escultor digital y amante de las criaturas fantásticas.', location: 'La Serena, Chile', role: 'Artist' },
  { username: 'Papimicky2', bio: 'Diseñador de producto convertido en artista 3D. Funcionalidad + Estética.', location: 'Rancagua, Chile', role: 'Artist' },
  { username: 'Uzhuany', bio: 'Artista emergente. Cada modelo es una historia que contar.', location: 'Talca, Chile', role: 'Artist' },
  { username: 'Sushikaly', bio: 'Amante del sushi y el 3D. Mis modelos son tan buenos como un roll de salmón 🍣', location: 'Santiago, Chile', role: 'Artist' },
  { username: 'DISSampoint4', bio: 'Game dev indie. Creo los assets de mis propios juegos y los comparto aquí.', location: 'Valdivia, Chile', role: 'Artist' },
];

// ============================================================================
// DATOS DE MODELOS 3D
// ============================================================================

interface ModelData {
  baseName: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
}

const MODELS: ModelData[] = [
  { baseName: 'calabaza', title: 'Calabaza Halloween', description: 'Calabaza decorativa perfecta para escenas de Halloween. Incluye texturas PBR.', price: 1500, tags: ['halloween', 'decoracion', 'prop'] },
  { baseName: 'casanavidad', title: 'Casa Navideña', description: 'Casita de jengibre estilizada para escenas navideñas. Low poly optimizado.', price: 2500, tags: ['navidad', 'casa', 'festivo'] },
  { baseName: 'ciruelo', title: 'Árbol Ciruelo', description: 'Árbol de ciruelo japonés con flores de cerezo. Ideal para escenas zen.', price: 1800, tags: ['arbol', 'naturaleza', 'japones'] },
  { baseName: 'dinosaurio', title: 'T-Rex Estilizado', description: 'Dinosaurio T-Rex con estilo cartoon. Perfecto para juegos casuales.', price: 2200, tags: ['dinosaurio', 'animal', 'cartoon'] },
  { baseName: 'doritos', title: 'Snack Doritos', description: 'Bolsa de Doritos ultra realista. Ideal para escenas de producto.', price: 800, tags: ['comida', 'snack', 'producto'] },
  { baseName: 'gandalf', title: 'Mago Gandalf', description: 'El mago gris en todo su esplendor. Fan art de El Señor de los Anillos.', price: 3500, tags: ['personaje', 'fantasia', 'mago'] },
  { baseName: 'gotica', title: 'Chica Gótica', description: 'Personaje femenino estilo gótico. Rigged y listo para animar.', price: 3900, tags: ['personaje', 'gotico', 'femenino'] },
  { baseName: 'granada', title: 'Granada Táctica', description: 'Granada de fragmentación realista. Perfecta para juegos FPS.', price: 1200, tags: ['arma', 'militar', 'prop'] },
  { baseName: 'hollow', title: 'Hollow Knight', description: 'El caballero hueco de Hallownest. Fan art del indie hit.', price: 2800, tags: ['personaje', 'indie', 'videojuego'] },
  { baseName: 'nave', title: 'Nave Espacial', description: 'Nave de combate espacial futurista. Incluye cockpit detallado.', price: 3200, tags: ['vehiculo', 'scifi', 'nave'] },
  { baseName: 'optimus', title: 'Robot Transformer', description: 'Robot inspirado en los clásicos transformers. Altamente detallado.', price: 3800, tags: ['robot', 'transformer', 'mecha'] },
  { baseName: 'pistola1', title: 'Pistola Sci-Fi', description: 'Arma futurista con diseño cyberpunk. Texturas 4K incluidas.', price: 1600, tags: ['arma', 'scifi', 'cyberpunk'] },
  { baseName: 'pistola2', title: 'Pistola Táctica', description: 'Pistola militar moderna con accesorios. Lista para juegos.', price: 1400, tags: ['arma', 'militar', 'realista'] },
  { baseName: 'sushi', title: 'Plato de Sushi', description: 'Set de sushi con variedad de piezas. Ideal para escenas de restaurante.', price: 900, tags: ['comida', 'japones', 'sushi'] },
  { baseName: 'tigre', title: 'Tigre Salvaje', description: 'Tigre de Bengala realista. Pose dinámica lista para renderizar.', price: 2600, tags: ['animal', 'felino', 'naturaleza'] },
  { baseName: 'walkietakie', title: 'Walkie Talkie', description: 'Radio portátil retro estilo años 80. Nostálgico y detallado.', price: 700, tags: ['electronico', 'retro', 'prop'] },
  { baseName: 'zorra', title: 'Zorro Estilizado', description: 'Zorrito adorable con estilo low poly. Perfecto para juegos móviles.', price: 1100, tags: ['animal', 'zorro', 'lowpoly'] },
];

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

async function uploadToBlob(filePath: string, folder: string): Promise<string> {
  const fileName = path.basename(filePath);
  const fileBuffer = fs.readFileSync(filePath);
  const blob = await put(`${folder}/${Date.now()}-${fileName}`, fileBuffer, {
    access: 'public',
    addRandomSuffix: false,
  });
  return blob.url;
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

// ============================================================================
// SCRIPT PRINCIPAL
// ============================================================================

async function main() {
  console.log('🚀 Iniciando seeding de Takopi...\n');

  // 1. Obtener archivos de perfil disponibles
  const profilePicsDir = path.join(USERS_DIR, 'profilepicture');
  const bannersDir = path.join(USERS_DIR, 'banner');
  
  const profilePics = fs.readdirSync(profilePicsDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  const banners = fs.readdirSync(bannersDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  
  console.log(`📸 Encontradas ${profilePics.length} fotos de perfil`);
  console.log(`🖼️ Encontrados ${banners.length} banners\n`);

  // 2. Crear usuarios
  console.log('👥 Creando usuarios...');
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  const createdUsers: { id: string; username: string }[] = [];

  for (let i = 0; i < USERS.length; i++) {
    const userData = USERS[i];
    const email = `${userData.username.toLowerCase()}@takopi.com`;
    
    // Subir avatar
    const avatarFile = profilePics[i % profilePics.length];
    const avatarPath = path.join(profilePicsDir, avatarFile);
    const avatarUrl = await uploadToBlob(avatarPath, 'avatars');
    
    // Subir banner
    const bannerFile = banners[i % banners.length];
    const bannerPath = path.join(bannersDir, bannerFile);
    const bannerUrl = await uploadToBlob(bannerPath, 'banners');

    const user = await prisma.user.create({
      data: {
        email,
        username: userData.username,
        password: hashedPassword,
        role: userData.role as 'Explorer' | 'Artist' | 'Maker' | 'Admin',
        bio: userData.bio,
        location: userData.location,
        avatar: avatarUrl,
        banner: bannerUrl,
      },
    });

    createdUsers.push({ id: user.id, username: user.username });
    console.log(`  ✅ ${userData.username} (${email})`);
  }

  console.log(`\n✅ ${createdUsers.length} usuarios creados\n`);

  // 3. Crear contenido (modelos 3D)
  console.log('🎨 Subiendo modelos 3D...');
  let modelsCreated = 0;

  for (const model of MODELS) {
    // Buscar archivos del modelo
    const glbPath = path.join(SEED_DIR, `${model.baseName}.glb`);
    let pngPath = path.join(SEED_DIR, `${model.baseName}.png`);
    
    // Manejar caso especial de walkietokie vs walkietakie
    if (model.baseName === 'walkietakie') {
      pngPath = path.join(SEED_DIR, 'walkietokie.png');
    }
    
    // Manejar caso especial casanavida vs casanavidad
    if (model.baseName === 'casanavidad') {
      const altPngPath = path.join(SEED_DIR, 'casanavida.png');
      if (fileExists(altPngPath) && !fileExists(pngPath)) {
        pngPath = altPngPath;
      }
    }

    if (!fileExists(glbPath)) {
      console.log(`  ⚠️ Saltando ${model.baseName} - GLB no encontrado`);
      continue;
    }

    if (!fileExists(pngPath)) {
      console.log(`  ⚠️ Saltando ${model.baseName} - Preview no encontrado`);
      continue;
    }

    // Elegir usuario aleatorio
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];

    // Subir archivos
    const coverUrl = await uploadToBlob(pngPath, 'covers');
    const modelUrl = await uploadToBlob(glbPath, 'models');
    const fileSize = fs.statSync(glbPath).size;

    // Crear contenido con estructura de files correcta (JSON)
    // IMPORTANTE: El componente ProductMediaTabs espera "name" y "type", no "filename" y "mimeType"
    const filesData = [{
      url: modelUrl,
      name: `${model.baseName}.glb`,
      size: fileSize,
      type: 'model/gltf-binary',
    }];

    const content = await prisma.content.create({
      data: {
        title: model.title,
        description: model.description,
        price: model.price,
        coverImage: coverUrl,
        contentType: 'modelos3d',
        tags: model.tags,
        authorId: randomUser.id,
        files: filesData,
        isPublished: true,
      },
    });

    modelsCreated++;
    console.log(`  ✅ "${model.title}" por @${randomUser.username} - $${model.price}`);
  }

  console.log(`\n✅ ${modelsCreated} modelos 3D subidos\n`);

  // 4. Resumen final
  console.log('═══════════════════════════════════════════');
  console.log('📊 RESUMEN DEL SEEDING');
  console.log('═══════════════════════════════════════════');
  console.log(`👥 Usuarios creados: ${createdUsers.length}`);
  console.log(`🎨 Modelos 3D subidos: ${modelsCreated}`);
  console.log(`🔑 Contraseña para todos: ${PASSWORD}`);
  console.log(`📧 Formato email: username@takopi.com`);
  console.log('═══════════════════════════════════════════');
  console.log('\n🎉 ¡Seeding completado con éxito!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
