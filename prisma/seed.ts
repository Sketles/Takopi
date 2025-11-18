// Prisma Seed Script - Datos iniciales para desarrollo
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Limpiar datos existentes (solo en desarrollo)
  console.log('🧹 Limpiando datos existentes...');
  await prisma.transaction.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.content.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  console.log('👤 Creando usuarios...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@takopi.dev',
      password: hashedPassword,
      role: 'Explorer',
      bio: 'Administrador de Takopi',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    }
  });

  const artist = await prisma.user.create({
    data: {
      username: 'artist_demo',
      email: 'artist@takopi.dev',
      password: hashedPassword,
      role: 'Artist',
      bio: 'Artista digital y creador de contenido 3D',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist',
      banner: 'https://picsum.photos/1200/300'
    }
  });

  const maker = await prisma.user.create({
    data: {
      username: 'maker_pro',
      email: 'maker@takopi.dev',
      password: hashedPassword,
      role: 'Maker',
      bio: 'Experto en impresión 3D y modelado',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maker'
    }
  });

  console.log(`✅ Usuarios creados: ${admin.username}, ${artist.username}, ${maker.username}`);

  // Crear contenido
  console.log('📦 Creando contenido...');

  const content1 = await prisma.content.create({
    data: {
      title: 'Modelo 3D de Dragón Épico',
      description: 'Modelo 3D detallado de un dragón para impresión 3D. Incluye textura PBR y animación básica.',
      shortDescription: 'Dragón 3D listo para imprimir',
      authorId: artist.id,
      price: 15000,
      currency: 'CLP',
      contentType: 'modelos3d',
      category: 'Fantasy',
      tags: ['dragon', '3d', 'fantasy', 'print-ready', 'stl'],
      isPublished: true,
      coverImage: 'https://picsum.photos/800/600?random=1',
      files: [
        {
          name: 'dragon.glb',
          size: 5242880,
          type: 'model/gltf-binary',
          url: 'https://example.com/dragon.glb'
        }
      ],
      views: 245,
      downloads: 12
    }
  });

  const content2 = await prisma.content.create({
    data: {
      title: 'Pack de Texturas PBR - Piedra',
      description: 'Pack completo de texturas PBR para superficies de piedra. Incluye albedo, normal, roughness y AO.',
      shortDescription: 'Texturas de piedra realistas',
      authorId: artist.id,
      price: 0,
      currency: 'CLP',
      contentType: 'texturas',
      category: 'Materials',
      tags: ['textures', 'pbr', 'stone', 'free', '4k'],
      isPublished: true,
      coverImage: 'https://picsum.photos/800/600?random=2',
      files: [
        {
          name: 'stone_albedo.png',
          size: 2097152,
          type: 'image/png',
          url: 'https://example.com/stone_albedo.png'
        }
      ],
      views: 567,
      downloads: 89
    }
  });

  const content3 = await prisma.content.create({
    data: {
      title: 'Avatar VRChat Custom',
      description: 'Avatar personalizado optimizado para VRChat. Incluye expresiones faciales y gestos.',
      shortDescription: 'Avatar VRChat optimizado',
      authorId: maker.id,
      price: 25000,
      currency: 'CLP',
      contentType: 'avatares',
      category: 'VR',
      tags: ['vrchat', 'avatar', '3d', 'vr', 'custom'],
      isPublished: true,
      coverImage: 'https://picsum.photos/800/600?random=3',
      files: [
        {
          name: 'avatar.vrm',
          size: 8388608,
          type: 'model/vrm',
          url: 'https://example.com/avatar.vrm'
        }
      ],
      views: 432,
      downloads: 34
    }
  });

  const content4 = await prisma.content.create({
    data: {
      title: 'Pack de Música Ambiental',
      description: 'Colección de 10 pistas ambientales para videojuegos y experiencias VR. Loops perfectos.',
      shortDescription: 'Música ambiental para juegos',
      authorId: artist.id,
      price: 12000,
      currency: 'CLP',
      contentType: 'musica',
      category: 'Audio',
      tags: ['music', 'ambient', 'game', 'loop', 'royalty-free'],
      isPublished: true,
      coverImage: 'https://picsum.photos/800/600?random=4',
      files: [
        {
          name: 'ambient_pack.zip',
          size: 15728640,
          type: 'application/zip',
          url: 'https://example.com/ambient_pack.zip'
        }
      ],
      views: 178,
      downloads: 23
    }
  });

  const content5 = await prisma.content.create({
    data: {
      title: 'Kit de Inicio Blender',
      description: 'Colección de assets, materiales y escenas para comenzar con Blender. Ideal para principiantes.',
      shortDescription: 'Starter pack para Blender',
      authorId: maker.id,
      price: 0,
      currency: 'CLP',
      contentType: 'colecciones',
      category: 'Tools',
      tags: ['blender', 'starter', 'free', '3d', 'tutorial'],
      isPublished: true,
      coverImage: 'https://picsum.photos/800/600?random=5',
      files: [
        {
          name: 'blender_starter.zip',
          size: 31457280,
          type: 'application/zip',
          url: 'https://example.com/blender_starter.zip'
        }
      ],
      views: 892,
      downloads: 156
    }
  });

  console.log(`✅ Contenido creado: 5 items`);

  // Crear comentarios
  console.log('💬 Creando comentarios...');

  await prisma.comment.create({
    data: {
      contentId: content1.id,
      userId: maker.id,
      text: '¡Increíble modelo! La calidad de los detalles es excepcional. Ya lo imprimí y quedó perfecto.',
      likedBy: [admin.id],
      likeCount: 1
    }
  });

  await prisma.comment.create({
    data: {
      contentId: content2.id,
      userId: admin.id,
      text: 'Excelentes texturas, justo lo que necesitaba para mi proyecto. Gracias por hacerlas gratuitas!',
      likedBy: [],
      likeCount: 0
    }
  });

  await prisma.comment.create({
    data: {
      contentId: content3.id,
      userId: artist.id,
      text: 'El avatar funciona perfecto en VRChat. Muy bien optimizado.',
      likedBy: [maker.id, admin.id],
      likeCount: 2
    }
  });

  console.log(`✅ Comentarios creados`);

  // Crear likes
  console.log('❤️ Creando likes...');

  await prisma.like.create({
    data: {
      contentId: content1.id,
      userId: admin.id
    }
  });

  await prisma.like.create({
    data: {
      contentId: content1.id,
      userId: maker.id
    }
  });

  await prisma.like.create({
    data: {
      contentId: content2.id,
      userId: admin.id
    }
  });

  await prisma.like.create({
    data: {
      contentId: content5.id,
      userId: artist.id
    }
  });

  console.log(`✅ Likes creados`);

  // Crear follows
  console.log('👥 Creando follows...');

  await prisma.follow.create({
    data: {
      followerId: admin.id,
      followingId: artist.id
    }
  });

  await prisma.follow.create({
    data: {
      followerId: admin.id,
      followingId: maker.id
    }
  });

  await prisma.follow.create({
    data: {
      followerId: maker.id,
      followingId: artist.id
    }
  });

  console.log(`✅ Follows creados`);

  // Crear compras
  console.log('🛒 Creando compras de ejemplo...');

  await prisma.purchase.create({
    data: {
      userId: admin.id,
      contentId: content1.id,
      price: content1.price,
      currency: content1.currency,
      status: 'completed',
      completedAt: new Date()
    }
  });

  await prisma.purchase.create({
    data: {
      userId: maker.id,
      contentId: content4.id,
      price: content4.price,
      currency: content4.currency,
      status: 'completed',
      completedAt: new Date()
    }
  });

  console.log(`✅ Compras creadas`);

  console.log('');
  console.log('✅ ¡Seed completado exitosamente!');
  console.log('');
  console.log('📊 Resumen:');
  console.log('   - 3 usuarios creados');
  console.log('   - 5 contenidos publicados');
  console.log('   - 3 comentarios');
  console.log('   - 4 likes');
  console.log('   - 3 follows');
  console.log('   - 2 compras');
  console.log('');
  console.log('🔑 Credenciales de acceso:');
  console.log('   Email: admin@takopi.dev | Password: password123');
  console.log('   Email: artist@takopi.dev | Password: password123');
  console.log('   Email: maker@takopi.dev | Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
