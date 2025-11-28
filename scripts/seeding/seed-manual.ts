/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🌱 SEED MANUAL CON DATOS CONTEXTUALES - TAKOPI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Script pre-configurado con 10 usuarios y 3 productos cada uno.
 * Los títulos y descripciones están basados en los archivos reales.
 * 
 * EJECUTAR:
 *   npx tsx scripts/seeding/seed-manual.ts
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { PrismaClient, ContentType, License, UserRole } from '@prisma/client';
import { put } from '@vercel/blob';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const SEEDING_DIR = path.join(__dirname);
const DEFAULT_PASSWORD = 'test12345';

// ════════════════════════════════════════════════════════════════════════════════
// MIME TYPES
// ════════════════════════════════════════════════════════════════════════════════

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json',
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
    throw new Error(`Archivo no encontrado: ${fullPath}`);
  }
  
  const fileBuffer = fs.readFileSync(fullPath);
  const filename = path.basename(fullPath);
  const mimeType = getMimeType(fullPath);
  const pathname = generatePathname(folder, filename, userId);
  
  console.log(`   📤 ${filename} (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
  
  const blob = await put(pathname, fileBuffer, {
    access: 'public',
    contentType: mimeType,
  });
  
  return blob.url;
}

// ════════════════════════════════════════════════════════════════════════════════
// DATOS DE USUARIOS Y PRODUCTOS
// ════════════════════════════════════════════════════════════════════════════════

interface UserData {
  username: string;
  bio: string;
  location: string;
  role: UserRole;
  avatar: string;
  banner: string;
  products: ProductData[];
}

interface ProductData {
  title: string;
  description: string;
  shortDescription: string;
  contentType: ContentType;
  cover: string;
  files: string[];
  gallery: string[];
  price: number;
  license: License;
  tags: string[];
}

const USERS_DATA: UserData[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // USUARIO 1: Sk488 - Modelador 3D
  // ═══════════════════════════════════════════════════════════════════════════
  {
    username: "Sk488",
    bio: "Modelador 3D especializado en props y personajes estilizados. Fan del low-poly y estilos cartoon.",
    location: "Santiago, Chile",
    role: "Artist",
    avatar: "avatars/Captura de pantalla 2024-08-11 223616.png",
    banner: "banners/Captura de pantalla (233).png",
    products: [
      {
        title: "Barril de Cuerpos - Prop Horror",
        description: `Modelo 3D de un barril lleno de cuerpos, perfecto para escenas de terror o juegos survival horror.

Características:
- Modelo optimizado para juegos (low-poly con texturas detalladas)
- Formato GLB listo para usar en Unity, Unreal o Godot
- Texturas PBR incluidas
- Escala real: aproximadamente 1.2m de altura

Ideal para:
- Juegos de terror
- Escenas de horror
- Ambientación oscura`,
        shortDescription: "Prop de terror - Barril con cuerpos para juegos horror",
        contentType: "modelos3d",
        cover: "covers/Captura de pantalla 2025-11-27 212740.png",
        files: ["models/barrildecuerpos.glb"],
        gallery: ["gallery/photomode_20082024_035211.png", "gallery/photomode_20082024_035230.png"],
        price: 5000,
        license: "commercial",
        tags: ["horror", "prop", "3d", "game-ready", "lowpoly"],
      },
      {
        title: "Dinosaurio Cartoon - Mascota 3D",
        description: `Adorable dinosaurio estilo cartoon, perfecto como mascota de videojuego o personaje secundario.

Características:
- Estilo cartoon/stylized
- Colores vibrantes
- Modelo limpio y optimizado
- Listo para rigging y animación

Perfecto para:
- Juegos casuales
- Apps infantiles
- Mascotas de marca`,
        shortDescription: "Dinosaurio estilizado estilo cartoon para juegos casuales",
        contentType: "modelos3d",
        cover: "covers/Captura de pantalla 2025-11-27 212754.png",
        files: ["models/dinosaurio.glb"],
        gallery: ["gallery/photomode_01062025_053608.png"],
        price: 3500,
        license: "commercial",
        tags: ["cartoon", "dinosaurio", "mascota", "cute", "stylized"],
      },
      {
        title: "Hollow Knight Fan Art - Figura 3D",
        description: `Modelo 3D del icónico caballero de Hollow Knight, creado con amor por fans del juego.

Detalles:
- Fiel al diseño original
- Optimizado para impresión 3D o renderizado
- Pose heroica lista para exhibir
- Fan art no oficial

Nota: Este es un trabajo de fan art. Hollow Knight pertenece a Team Cherry.`,
        shortDescription: "Fan art 3D del Knight de Hollow Knight",
        contentType: "modelos3d",
        cover: "covers/Captura de pantalla 2025-11-27 212828.png",
        files: ["models/hollowknight.glb"],
        gallery: ["gallery/photomode_01062025_054141.png", "gallery/photomode_01062025_054318.png"],
        price: 0,
        license: "personal",
        tags: ["hollowknight", "fanart", "indie", "metroidvania", "figure"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USUARIO 2: Luriesse - Artista Digital
  // ═══════════════════════════════════════════════════════════════════════════
  {
    username: "Luriesse",
    bio: "Artista digital y creadora de contenido. Amo los colores vibrantes y los diseños únicos.",
    location: "Valparaíso, Chile",
    role: "Artist",
    avatar: "avatars/Sophia.jpg",
    banner: "banners/Captura de pantalla (597).png",
    products: [
      {
        title: "Gótica Stylized - Personaje 3D",
        description: `Personaje femenino de estética gótica con diseño estilizado único.

Incluye:
- Modelo completo con ropa y accesorios
- Texturas de alta calidad
- Pose base lista para render
- Estilo semi-realista estilizado

Perfecto para:
- Renders artísticos
- Ilustraciones 3D
- Referencias de personaje`,
        shortDescription: "Personaje gótico femenino con estética dark y estilizada",
        contentType: "modelos3d",
        cover: "covers/Captura de pantalla 2025-11-27 212903.png",
        files: ["models/gotica.glb"],
        gallery: ["gallery/photomode_14062025_021124.png", "gallery/photomode_14062025_051323.png"],
        price: 8000,
        license: "commercial",
        tags: ["gotica", "personaje", "stylized", "female", "character"],
      },
      {
        title: "Isla Tropical - Diorama 3D",
        description: `Pequeña isla tropical con palmera, perfecta para dioramas o escenas de playa.

Características:
- Ambiente tropical completo
- Incluye palmera, arena, rocas y agua
- Estilo cartoon/lowpoly
- Ideal para fondos o escenarios

Usos:
- Dioramas
- Fondos de juegos
- Escenas de vacaciones`,
        shortDescription: "Diorama de isla tropical con palmera estilo cartoon",
        contentType: "modelos3d",
        cover: "covers/Captura de pantalla 2025-11-27 212928.png",
        files: ["models/islapalmera.glb"],
        gallery: ["gallery/photomode_24062025_041447.png", "gallery/photomode_24062025_041650.png"],
        price: 2500,
        license: "commercial",
        tags: ["isla", "tropical", "diorama", "lowpoly", "escenario"],
      },
      {
        title: "Personaje Café - Character Design",
        description: `Personaje original con temática de café, diseño único y encantador.

Detalles:
- Diseño original 100%
- Colores cálidos inspirados en café
- Estilo chibi/stylized
- Listo para usar como mascota

Ideal para:
- Cafeterías virtuales
- Branding de café
- Mascotas de apps`,
        shortDescription: "Personaje temático de café con diseño chibi adorable",
        contentType: "modelos3d",
        cover: "covers/Captura de pantalla 2025-11-27 212954.png",
        files: ["models/personajecafe.glb"],
        gallery: ["gallery/photomode_27062025_050340.png", "gallery/photomode_27062025_050355.png"],
        price: 4000,
        license: "commercial",
        tags: ["cafe", "personaje", "chibi", "mascota", "cute"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USUARIO 3: Sniper - Productor Musical
  // ═══════════════════════════════════════════════════════════════════════════
  {
    username: "Sniper",
    bio: "Productor de beats trap y hip-hop. Colaboro con artistas underground. DMs abiertos para collabs.",
    location: "Concepción, Chile",
    role: "Artist",
    avatar: "avatars/avatars-000318764644-qygdrt-t500x500.jpg",
    banner: "banners/Captura de pantalla (637).png",
    products: [
      {
        title: "Act a Foolie - Beat Trap",
        description: `Beat trap agresivo perfecto para flows rápidos y letras intensas.

Especificaciones:
- BPM: 140-145
- Key: Am
- Formato: MP3 320kbps
- Estilo: Trap agresivo, energético

Licencia comercial incluye:
- Uso en plataformas de streaming
- Distribución digital
- Videos musicales`,
        shortDescription: "Beat trap agresivo para flows rápidos",
        contentType: "musica",
        cover: "covers/b5c7c1ce07acc95e8bbc2285e7ca4193.jpg",
        files: ["music/01 - Act a Foolie.mp3"],
        gallery: [],
        price: 15000,
        license: "commercial",
        tags: ["trap", "beat", "hiphop", "agresivo", "produccion"],
      },
      {
        title: "Proud of You - Beat Melódico",
        description: `Beat melódico emotivo con piano y 808s suaves. Perfecto para tracks introspectivos.

Especificaciones:
- BPM: 130
- Key: Cm
- Formato: MP3 320kbps
- Estilo: Trap melódico, emotivo

Ideal para:
- Tracks emotivos
- Storytelling
- Canciones personales`,
        shortDescription: "Beat melódico emotivo con piano para tracks introspectivos",
        contentType: "musica",
        cover: "covers/descargar (1).jpg",
        files: ["music/15 - Proud of You.mp3"],
        gallery: [],
        price: 12000,
        license: "commercial",
        tags: ["melodico", "emotivo", "piano", "trap", "beat"],
      },
      {
        title: "Money n Drugs - Beat Hard",
        description: `Beat duro con bajos pesados y hi-hats rápidos. Producción de nivel profesional.

Especificaciones:
- BPM: 150
- Key: Fm
- Formato: MP3 320kbps
- Estilo: Hard trap, dark

Para:
- Artistas underground
- Videos de freestyle
- Contenido de redes`,
        shortDescription: "Beat trap duro con bajos pesados para freestyles",
        contentType: "musica",
        cover: "covers/final.png",
        files: ["music/17 - Money n Drugs.mp3"],
        gallery: [],
        price: 10000,
        license: "streaming",
        tags: ["hard", "trap", "dark", "808", "underground"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USUARIO 4: Pinkys7 - Props y Objetos
  // ═══════════════════════════════════════════════════════════════════════════
  {
    username: "Pinkys7",
    bio: "Especialista en props y objetos cotidianos para juegos y renders. Modelos limpios y optimizados.",
    location: "Viña del Mar, Chile",
    role: "Artist",
    avatar: "avatars/Captura de pantalla 2024-07-26 213643.png",
    banner: "banners/Captura de pantalla (926).png",
    products: [
      {
        title: "Vaso Starbucks - Prop Realista",
        description: `Modelo 3D detallado de un vaso de café estilo Starbucks.

Incluye:
- Modelo de alta calidad
- Texturas realistas
- Versión con y sin contenido
- Escala real

Usos:
- Product placement
- Escenas de café
- Renders de lifestyle`,
        shortDescription: "Vaso de café estilo Starbucks realista para renders",
        contentType: "modelos3d",
        cover: "covers/1000004884.jpg",
        files: ["models/basoStarbusk.glb"],
        gallery: ["gallery/photomode_06062025_050250.png"],
        price: 1500,
        license: "commercial",
        tags: ["starbucks", "cafe", "prop", "realista", "lifestyle"],
      },
      {
        title: "Calabaza Halloween - Prop Festivo",
        description: `Calabaza de Halloween tallada con cara terrorífica, perfecta para escenas de octubre.

Características:
- Diseño clásico de Jack-o-lantern
- Lista para iluminar desde dentro
- Estilo semi-realista
- Texturas de calabaza detalladas

Para:
- Escenas de Halloween
- Decoración virtual
- Juegos temáticos`,
        shortDescription: "Calabaza tallada de Halloween para escenas festivas",
        contentType: "modelos3d",
        cover: "covers/1000004888.jpg",
        files: ["models/calabaza.glb"],
        gallery: ["gallery/photomode_07052025_045838.png"],
        price: 2000,
        license: "commercial",
        tags: ["halloween", "calabaza", "festivo", "octubre", "prop"],
      },
      {
        title: "Bolsa Doritos - Snack 3D",
        description: `Modelo 3D de una bolsa de Doritos, perfecto para escenas de gaming o lifestyle.

Detalles:
- Modelo estilizado (no marca real)
- Colores vibrantes
- Ideal para escenas de gamers
- Prop de comida casual

Nota: Modelo genérico inspirado, no es producto oficial.`,
        shortDescription: "Bolsa de snacks estilizada para escenas de gaming",
        contentType: "modelos3d",
        cover: "covers/20240907_083251.jpg",
        files: ["models/doritos.glb"],
        gallery: ["gallery/photomode_08052025_025530.png"],
        price: 1000,
        license: "personal",
        tags: ["snacks", "doritos", "gaming", "prop", "comida"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USUARIO 5: TP1mazda - Vehículos y Props
  // ═══════════════════════════════════════════════════════════════════════════
  {
    username: "TP1mazda",
    bio: "Apasionado por los vehículos y máquinas. Modelos de autos, rovers y todo lo que tenga ruedas.",
    location: "Antofagasta, Chile",
    role: "Artist",
    avatar: "avatars/Captura de pantalla 2024-09-05 014054.png",
    banner: "banners/Captura de pantalla 2024-07-03 012930.png",
    products: [
      {
        title: "Rover Explorador - Vehículo Sci-Fi",
        description: `Rover de exploración espacial con diseño futurista y funcional.

Características:
- Diseño sci-fi original
- Ruedas articuladas
- Paneles solares
- Antenas y sensores

Perfecto para:
- Juegos de exploración
- Escenas de Marte
- Proyectos sci-fi`,
        shortDescription: "Rover espacial futurista para exploración planetaria",
        contentType: "modelos3d",
        cover: "covers/20250430_0440_Perfil en Blanco y Negro_remix_01jt2xk20nefds8tvt4g0dcxx2.png",
        files: ["models/rover.glb"],
        gallery: ["gallery/photomode_17072025_023402.png", "gallery/photomode_17072025_025651.png"],
        price: 7500,
        license: "commercial",
        tags: ["rover", "scifi", "espacio", "vehiculo", "exploracion"],
      },
      {
        title: "Rueda Mecánica - Componente",
        description: `Rueda mecánica detallada con neumático y rin, ideal como componente o prop.

Incluye:
- Rin metálico detallado
- Neumático con textura
- Varias resoluciones
- Listo para animar

Usos:
- Componentes de vehículos
- Props industriales
- Animaciones mecánicas`,
        shortDescription: "Rueda mecánica detallada como componente o prop",
        contentType: "modelos3d",
        cover: "covers/yddddddoruseh  on twt.jpg",
        files: ["models/rueda.glb"],
        gallery: ["gallery/photomode_17072025_042039.png"],
        price: 1500,
        license: "commercial",
        tags: ["rueda", "mecanico", "componente", "vehiculo", "industrial"],
      },
      {
        title: "Pistola DK - Arma Stylized",
        description: `Arma estilizada con diseño Donkey Kong inspirado (fan art).

Detalles:
- Diseño cartoon
- Colores vibrantes DK
- Prop de juego
- Fan art no oficial

Nota: Inspirado en la franquicia, no es producto oficial de Nintendo.`,
        shortDescription: "Arma estilizada inspirada en Donkey Kong (fan art)",
        contentType: "modelos3d",
        cover: "covers/Captura de pantalla 2025-11-27 212740.png",
        files: ["models/dkpistola.glb"],
        gallery: ["gallery/photomode_18062025_060245.png"],
        price: 0,
        license: "personal",
        tags: ["donkeykong", "fanart", "arma", "stylized", "nintendo"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USUARIO 6: Okko - Productor Cult
  // ═══════════════════════════════════════════════════════════════════════════
  {
    username: "Okko",
    bio: "Productor underground. Beats oscuros y experimentales. Opium Jai affiliated.",
    location: "Temuco, Chile",
    role: "Artist",
    avatar: "avatars/descargar.jpg",
    banner: "banners/Captura de pantalla (233).png",
    products: [
      {
        title: "BROKEN HEARTS - Beat Emotivo",
        description: `Beat emotivo de la colección CULT. Producido por Opium Jai.

Características:
- Melodías melancólicas
- 808s profundos
- Atmósfera oscura pero emotiva
- Perfecto para letras personales

Especificaciones:
- BPM: 135
- Key: Dm
- Formato: MP3 320kbps`,
        shortDescription: "Beat emotivo oscuro de la colección CULT",
        contentType: "musica",
        cover: "covers/b5c7c1ce07acc95e8bbc2285e7ca4193.jpg",
        files: ["music/album-1-Cult/BROKEN HEARTS (prod. Opium Jai).mp3"],
        gallery: [],
        price: 8000,
        license: "streaming",
        tags: ["cult", "emotivo", "opiumjai", "dark", "trap"],
      },
      {
        title: "HEAVENS GATE - Beat Celestial",
        description: `Beat atmosférico con vibes celestiales y oscuras de la colección CULT.

Incluye:
- Pads atmosféricos
- Drums únicos
- Vocales procesados de fondo
- Producción profesional

Estilo: Dark trap / Experimental`,
        shortDescription: "Beat atmosférico celestial de la colección CULT",
        contentType: "musica",
        cover: "covers/descargar (1).jpg",
        files: ["music/album-1-Cult/HEAVENS GATE (prod. Opium Jai).mp3"],
        gallery: [],
        price: 10000,
        license: "commercial",
        tags: ["celestial", "atmosferico", "cult", "experimental", "dark"],
      },
      {
        title: "VVS - Beat Luxury",
        description: `Beat de lujo con vibes de diamantes y éxito. Colaboración Opium Jai x Dynox.

Características:
- Producción premium
- Bells brillantes
- 808s limpios
- Flow perfecto para flexear

Especificaciones:
- BPM: 145
- Key: Em`,
        shortDescription: "Beat de lujo para flexear - Opium Jai x Dynox",
        contentType: "musica",
        cover: "covers/final.png",
        files: ["music/album-1-Cult/VVS (prod. Opium Jai x Dynox).mp3"],
        gallery: [],
        price: 12000,
        license: "commercial",
        tags: ["luxury", "flex", "vvs", "trap", "collab"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USUARIO 7: OnoIwakura - Texturas y Assets
  // ═══════════════════════════════════════════════════════════════════════════
  {
    username: "OnoIwakura",
    bio: "Creador de texturas y assets visuales. Screenshots de juegos convertidos en recursos útiles.",
    location: "La Serena, Chile",
    role: "Artist",
    avatar: "avatars/Captura de pantalla 2024-03-01 031618.png",
    banner: "banners/Captura de pantalla (597).png",
    products: [
      {
        title: "Pack Screenshots Cyberpunk - Texturas",
        description: `Colección de screenshots de alta calidad para usar como texturas o referencias.

Contenido:
- 5 imágenes de escenas urbanas futuristas
- Resolución nativa alta
- Estética cyberpunk/neon
- Perfectas como fondos o referencias

Usos:
- Fondos de pantalla
- Referencias artísticas
- Texturas de ambiente`,
        shortDescription: "Pack de screenshots cyberpunk para fondos y referencias",
        contentType: "texturas",
        cover: "covers/Captura de pantalla 2025-11-27 212828.png",
        files: [
          "textures/photomode_08052025_025530.png",
          "textures/photomode_14062025_051323.png",
          "textures/photomode_24062025_041650.png",
        ],
        gallery: ["gallery/photomode_24062025_041730.png", "gallery/photomode_24062025_062429.png"],
        price: 3000,
        license: "commercial",
        tags: ["cyberpunk", "screenshots", "texturas", "neon", "urban"],
      },
      {
        title: "Banners Twitch Pack - Streaming",
        description: `Pack de banners profesionales para streamers de Twitch.

Incluye:
- Múltiples diseños de paneles
- Estética gaming moderna
- Colores vibrantes
- Listos para usar

Formatos:
- PNG/JPG alta resolución
- Diseños editables conceptualmente`,
        shortDescription: "Pack de banners para Twitch con estética gaming",
        contentType: "texturas",
        cover: "covers/Captura de pantalla 2025-11-27 212903.png",
        files: [
          "textures/coleccion-banners-twitch-panel-transmision-vivo_497837-1027.avif",
          "textures/coleccion-twitch-banner-live-stream-template_1361-2550.avif",
          "textures/pngtree-cyan-twitch-banner-panels-stream-cool-png-image_2968412.jpg",
        ],
        gallery: [],
        price: 5000,
        license: "streaming",
        tags: ["twitch", "streaming", "banners", "gaming", "paneles"],
      },
      {
        title: "Pack Fotos Naturaleza - Referencias",
        description: `Screenshots de naturaleza de juegos con gráficos fotorealistas.

Contenido:
- Paisajes naturales
- Iluminación cinematográfica
- Alta resolución
- Variedad de ambientes

Ideal para:
- Referencias de pintura
- Estudios de luz
- Inspiración artística`,
        shortDescription: "Screenshots de naturaleza fotorealista como referencias",
        contentType: "texturas",
        cover: "covers/Captura de pantalla 2025-11-27 212928.png",
        files: [
          "textures/photomode_24062025_062843.png",
          "textures/VecteezyStreaming-GamingBannerAP0422Rev_1_generated.jpg",
        ],
        gallery: ["gallery/photomode_18062025_060321.png", "gallery/photomode_19072025_020532.png"],
        price: 2000,
        license: "personal",
        tags: ["naturaleza", "paisajes", "referencias", "fotorealista", "arte"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USUARIO 8: Caaaaal - Beats Leak Style
  // ═══════════════════════════════════════════════════════════════════════════
  {
    username: "Caaaaal",
    bio: "Recreaciones de beats clásicos y leaks famosos. Estilo Playboi Carti y WLR era.",
    location: "Puerto Montt, Chile",
    role: "Artist",
    avatar: "avatars/descargar (2).jpg",
    banner: "banners/Captura de pantalla (926).png",
    products: [
      {
        title: "Cancun Type Beat - Summer Vibes",
        description: `Recreación del icónico leak de Playboi Carti. Beat veraniego con energía única.

Estilo:
- WLR v1 era
- Vibes de verano
- Melodías pegajosas
- 808s bouncy

Especificaciones:
- BPM: 150
- Key: Gm
- WAV 24bit`,
        shortDescription: "Type beat estilo Cancun - Summer vibes energéticos",
        contentType: "musica",
        cover: "covers/b5c7c1ce07acc95e8bbc2285e7ca4193.jpg",
        files: ["music/LeakRock - Whole Lotta Red v1 - 03 Cancun.wav"],
        gallery: [],
        price: 10000,
        license: "streaming",
        tags: ["carti", "cancun", "typebeat", "summer", "leak"],
      },
      {
        title: "Fashion Killa Type Beat - Runway",
        description: `Beat inspirado en Fashion Killa con vibes de pasarela y moda.

Características:
- Estilo sofisticado
- Drums minimalistas
- Melodía elegante
- Perfecto para flows presumidos

WAV de alta calidad incluido.`,
        shortDescription: "Type beat Fashion Killa - Vibes de pasarela",
        contentType: "musica",
        cover: "covers/descargar (1).jpg",
        files: ["music/LeakRock - Whole Lotta Red v1 - 15 Fashion Killa.wav"],
        gallery: [],
        price: 8000,
        license: "streaming",
        tags: ["fashion", "runway", "typebeat", "carti", "elegant"],
      },
      {
        title: "Butterfly Doors Type Beat - Flex",
        description: `Beat inspirado en Butterfly Doors. Lambos, dinero, lifestyle.

Estilo:
- Flexing vibes
- 808s agresivos
- Hi-hats rápidos
- Energía de club

Para artistas que quieran flexear duro.`,
        shortDescription: "Type beat Butterfly Doors - Flexing lifestyle",
        contentType: "musica",
        cover: "covers/final.png",
        files: ["music/LeakRock - Whole Lotta Red v1 - 24 Butterfly Doors.wav"],
        gallery: [],
        price: 12000,
        license: "commercial",
        tags: ["lambo", "flex", "typebeat", "club", "aggressive"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USUARIO 9: Lain - Arte Digital Aesthetic
  // ═══════════════════════════════════════════════════════════════════════════
  {
    username: "Lain",
    bio: "Aesthetic digital art. Serial Experiments Lain enthusiast. Cyberpunk and retro vibes.",
    location: "Iquique, Chile",
    role: "Artist",
    avatar: "avatars/imagen_2024-11-26_054206283.png",
    banner: "banners/Captura de pantalla (637).png",
    products: [
      {
        title: "Whole Lotta Red Type Beat - Dark",
        description: `Beat oscuro inspirado en la era WLR. Distorsión, agresividad y caos controlado.

Características:
- Producción agresiva
- Distorsión intencional
- 808s saturados
- Vibe de punk rap

Alta calidad WAV para máxima fidelidad.`,
        shortDescription: "Beat oscuro estilo WLR con distorsión agresiva",
        contentType: "musica",
        cover: "covers/b5c7c1ce07acc95e8bbc2285e7ca4193.jpg",
        files: ["music/LeakRock - Whole Lotta Red v1 - 17 Whole Lotta Red.wav"],
        gallery: [],
        price: 15000,
        license: "commercial",
        tags: ["wlr", "dark", "agresivo", "punk", "distortion"],
      },
      {
        title: "Skeletons Type Beat - Ethereal",
        description: `Beat etéreo con melodías fantasmales y atmósfera única.

Estilo:
- Voces procesadas
- Reverb espacial
- Drums suaves
- Vibe introspectivo

Perfecto para tracks personales y profundos.`,
        shortDescription: "Beat etéreo con melodías fantasmales y espaciales",
        contentType: "musica",
        cover: "covers/descargar (1).jpg",
        files: ["music/LeakRock - Whole Lotta Red v1 - 18 Skeletons.wav"],
        gallery: [],
        price: 9000,
        license: "streaming",
        tags: ["ethereal", "ghost", "spacey", "introspective", "melodic"],
      },
      {
        title: "Pack Aesthetic Cyberpunk - Gallery",
        description: `Colección de screenshots con estética cyberpunk y anime vibes.

Contenido:
- Imágenes de alta resolución
- Estética Serial Experiments Lain
- Colores neón y oscuros
- Perfectas para edits

Para fans del cyberpunk y la estética retro-futurista.`,
        shortDescription: "Pack de imágenes aesthetic cyberpunk estilo Lain",
        contentType: "texturas",
        cover: "covers/Captura de pantalla 2025-11-27 212954.png",
        files: [
          "textures/photomode_24062025_041730.png",
        ],
        gallery: ["gallery/photomode_21082024_014420.png", "gallery/photomode_21082024_014439.png"],
        price: 2500,
        license: "personal",
        tags: ["aesthetic", "cyberpunk", "lain", "anime", "retro"],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USUARIO 10: RKOIDE - Productor Experimental
  // ═══════════════════════════════════════════════════════════════════════════
  {
    username: "RKOIDE",
    bio: "Beats experimentales y producciones únicas. Mezclo géneros sin límites.",
    location: "Rancagua, Chile",
    role: "Artist",
    avatar: "avatars/descargar (4).jpg",
    banner: "banners/Captura de pantalla 2024-07-03 012930.png",
    products: [
      {
        title: "NO LOVE - Beat Sad Trap",
        description: `Beat de sad trap con piano melancólico y drums emotivos.

Características:
- Piano triste
- 808s profundos
- Atmósfera de desamor
- Perfecto para desahogarse

De la colección CULT - prod. Opium Jai`,
        shortDescription: "Beat sad trap con piano melancólico de la colección CULT",
        contentType: "musica",
        cover: "covers/b5c7c1ce07acc95e8bbc2285e7ca4193.jpg",
        files: ["music/album-1-Cult/NO LOVE (prod. Opium Jai).mp3"],
        gallery: [],
        price: 7000,
        license: "streaming",
        tags: ["sad", "piano", "desamor", "cult", "emotivo"],
      },
      {
        title: "HOUSTON - Beat Space",
        description: `Beat con vibes espaciales y futuristas. Houston, tenemos un problema.

Estilo:
- Synths espaciales
- Drums únicos
- Atmósfera de nave espacial
- Experimental pero comercial

Producción Opium Jai.`,
        shortDescription: "Beat espacial futurista de la colección CULT",
        contentType: "musica",
        cover: "covers/descargar (1).jpg",
        files: ["music/album-1-Cult/HOUSTON (prod. Opium Jai).mp3"],
        gallery: [],
        price: 9000,
        license: "commercial",
        tags: ["space", "futurista", "houston", "experimental", "cult"],
      },
      {
        title: "RAGERS WRLD - Beat Rage",
        description: `Beat de rage para mosh pits y shows en vivo. Energía pura.

Características:
- BPM alto
- Drops agresivos
- Distorsión controlada
- Hecho para gritar

Perfecto para artistas de rage y punk rap.`,
        shortDescription: "Beat de rage agresivo para mosh pits",
        contentType: "musica",
        cover: "covers/final.png",
        files: ["music/album-1-Cult/RAGERS WRLD (prod. Opium Jai).mp3"],
        gallery: [],
        price: 11000,
        license: "commercial",
        tags: ["rage", "mosh", "agresivo", "punk", "energy"],
      },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════════
// EJECUCIÓN
// ════════════════════════════════════════════════════════════════════════════════

async function createUser(userData: UserData): Promise<string> {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`👤 Creando usuario: ${userData.username}`);
  console.log('═'.repeat(60));

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const email = `${userData.username.toLowerCase()}@takopi.com`;

  // Subir avatar
  console.log('\n📷 Subiendo avatar...');
  const avatarUrl = await uploadFile(userData.avatar, 'avatars');

  // Subir banner
  console.log('🖼️ Subiendo banner...');
  const bannerUrl = await uploadFile(userData.banner, 'banners');

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      username: userData.username,
      email: email,
      password: hashedPassword,
      role: userData.role,
      bio: userData.bio,
      location: userData.location,
      avatar: avatarUrl,
      banner: bannerUrl,
      isActive: true,
    },
  });

  console.log(`✅ Usuario creado: ${email}`);
  return user.id;
}

async function createProduct(productData: ProductData, userId: string, index: number): Promise<void> {
  console.log(`\n   📦 Producto ${index + 1}: ${productData.title}`);
  console.log('   ' + '─'.repeat(50));

  // Subir cover
  console.log('   🖼️ Cover:');
  const coverUrl = await uploadFile(productData.cover, `content/${productData.contentType}/covers`, userId);

  // Subir archivos
  console.log('   📁 Archivos:');
  const uploadedFiles = [];
  for (const filePath of productData.files) {
    const fullPath = path.join(SEEDING_DIR, filePath);
    if (fs.existsSync(fullPath)) {
      const url = await uploadFile(filePath, `content/${productData.contentType}`, userId);
      const stats = fs.statSync(fullPath);
      uploadedFiles.push({
        name: path.basename(filePath),
        originalName: path.basename(filePath),
        url: url,
        type: getMimeType(filePath),
        size: stats.size,
      });
    }
  }

  // Subir galería
  const galleryUrls: string[] = [];
  if (productData.gallery.length > 0) {
    console.log('   📸 Galería:');
    for (const imgPath of productData.gallery) {
      const fullPath = path.join(SEEDING_DIR, imgPath);
      if (fs.existsSync(fullPath)) {
        const url = await uploadFile(imgPath, `content/${productData.contentType}/gallery`, userId);
        galleryUrls.push(url);
      }
    }
  }

  // Crear producto en BD
  await prisma.content.create({
    data: {
      title: productData.title,
      description: productData.description,
      shortDescription: productData.shortDescription,
      contentType: productData.contentType,
      authorId: userId,
      coverImage: coverUrl,
      files: uploadedFiles,
      additionalImages: galleryUrls,
      price: productData.price,
      isFree: productData.price === 0,
      license: productData.license,
      tags: productData.tags,
      customTags: [],
      isPublished: true,
      isListed: true,
      publishedAt: new Date(),
      views: Math.floor(Math.random() * 500) + 50,
      downloads: Math.floor(Math.random() * 100) + 5,
    },
  });

  console.log(`   ✅ Creado: ${productData.price === 0 ? 'GRATIS' : `$${productData.price.toLocaleString()} CLP`} | ${productData.license}`);
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🌱 SEED MANUAL - 10 USUARIOS x 3 PRODUCTOS');
  console.log('═'.repeat(60));
  console.log(`\n📋 Total: ${USERS_DATA.length} usuarios, ${USERS_DATA.length * 3} productos`);
  console.log('\n⚠️ Iniciando en 5 segundos... Ctrl+C para cancelar\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    for (const userData of USERS_DATA) {
      const userId = await createUser(userData);

      for (let i = 0; i < userData.products.length; i++) {
        await createProduct(userData.products[i], userId, i);
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('✅ SEED COMPLETADO EXITOSAMENTE');
    console.log('═'.repeat(60));

    const userCount = await prisma.user.count();
    const contentCount = await prisma.content.count();
    console.log(`\n📊 Estado final de la BD:`);
    console.log(`   Usuarios: ${userCount}`);
    console.log(`   Productos: ${contentCount}`);

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
