import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Model3D from '@/models/Model3D';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await connectDB();

    // Limpiar datos existentes
    await User.deleteMany({});
    await Model3D.deleteMany({});

    // Crear usuarios de ejemplo
    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = await User.insertMany([
      {
        username: 'TechArtist',
        email: 'tech@artist.com',
        password: hashedPassword,
        role: 'Artist',
        bio: 'Artista especializado en modelos futuristas y tecnología'
      },
      {
        username: 'ArchDesigner',
        email: 'arch@designer.com',
        password: hashedPassword,
        role: 'Artist',
        bio: 'Diseñador arquitectónico con experiencia en modelos 3D'
      },
      {
        username: 'GameDevStudio',
        email: 'game@dev.com',
        password: hashedPassword,
        role: 'Maker',
        bio: 'Estudio de desarrollo de juegos indie'
      },
      {
        username: 'TextureMaster',
        email: 'texture@master.com',
        password: hashedPassword,
        role: 'Artist',
        bio: 'Especialista en texturas y materiales 3D'
      },
      {
        username: 'AnimeCreator',
        email: 'anime@creator.com',
        password: hashedPassword,
        role: 'Artist',
        bio: 'Creador de personajes anime y manga'
      },
      {
        username: 'AutoMech',
        email: 'auto@mech.com',
        password: hashedPassword,
        role: 'Artist',
        bio: 'Especialista en vehículos y mecánica'
      },
      {
        username: 'Nature3D',
        email: 'nature@3d.com',
        password: hashedPassword,
        role: 'Artist',
        bio: 'Modelos de naturaleza y paisajes'
      },
      {
        username: 'HorrorDev',
        email: 'horror@dev.com',
        password: hashedPassword,
        role: 'Maker',
        bio: 'Desarrollador de juegos de terror'
      }
    ]);

    // Crear modelos 3D de ejemplo
    const models = await Model3D.insertMany([
      {
        title: 'Robot Futurista Pro',
        description: 'Modelo 3D de robot futurista con detalles avanzados, perfecto para proyectos de ciencia ficción y gaming.',
        author: users[0]._id,
        category: 'Personajes',
        price: 15.99,
        license: 'Personal',
        files: {
          model: '/models/robot_futurista.fbx',
          preview: '/images/robot_preview.jpg',
          thumbnail: '/images/robot_thumb.jpg',
          formats: ['fbx', 'obj', 'gltf']
        },
        tags: ['robot', 'futurista', 'sci-fi', 'gaming'],
        downloads: 234,
        views: 1250,
        polyCount: 15000,
        textureCount: 8
      },
      {
        title: 'Pack Texturas Metal',
        description: 'Colección de 20 texturas metálicas de alta calidad, incluye diferentes tipos de metal y acabados.',
        author: users[3]._id,
        category: 'Arte',
        price: 8.99,
        license: 'Indie',
        files: {
          model: '/textures/metal_pack.zip',
          preview: '/images/metal_preview.jpg',
          thumbnail: '/images/metal_thumb.jpg'
        },
        tags: ['texturas', 'metal', 'materiales', 'PBR'],
        downloads: 156,
        views: 890,
        textureCount: 20
      },
      {
        title: 'Cyberpunk City Builder',
        description: 'Juego indie de construcción de ciudades cyberpunk con mecánicas únicas y arte pixelado.',
        author: users[2]._id,
        category: 'Gaming',
        price: 24.99,
        license: 'Pro',
        files: {
          model: '/games/cyberpunk_city.exe',
          preview: '/images/game_preview.jpg',
          thumbnail: '/images/game_thumb.jpg'
        },
        tags: ['juego', 'cyberpunk', 'construcción', 'indie'],
        downloads: 89,
        views: 567,
        isFeatured: true
      },
      {
        title: 'Colección Anime Chars',
        description: 'Pack de 5 personajes anime completamente riggeados, listos para animación y gaming.',
        author: users[4]._id,
        category: 'Personajes',
        price: 45.99,
        license: 'Personal',
        files: {
          model: '/models/anime_chars.fbx',
          preview: '/images/anime_preview.jpg',
          thumbnail: '/images/anime_thumb.jpg',
          formats: ['fbx', 'blend', 'obj']
        },
        tags: ['anime', 'personajes', 'rigged', 'gaming'],
        downloads: 445,
        views: 2100,
        polyCount: 25000,
        textureCount: 15
      },
      {
        title: 'V8 Engine Kit',
        description: 'Motor V8 detallado con todas las piezas separadas, perfecto para renders automotrices.',
        author: users[5]._id,
        category: 'Vehículos',
        price: 35.99,
        license: 'Pro',
        files: {
          model: '/models/v8_engine.fbx',
          preview: '/images/engine_preview.jpg',
          thumbnail: '/images/engine_thumb.jpg',
          formats: ['fbx', 'obj', '3ds']
        },
        tags: ['motor', 'automóvil', 'mecánica', 'detallado'],
        downloads: 123,
        views: 678,
        polyCount: 50000,
        textureCount: 12
      },
      {
        title: 'Pack Texturas Naturaleza',
        description: '30 texturas de naturaleza incluyendo madera, piedra, hojas y materiales orgánicos.',
        author: users[6]._id,
        category: 'Naturaleza',
        price: 12.99,
        license: 'Indie',
        files: {
          model: '/textures/nature_pack.zip',
          preview: '/images/nature_preview.jpg',
          thumbnail: '/images/nature_thumb.jpg'
        },
        tags: ['texturas', 'naturaleza', 'madera', 'piedra'],
        downloads: 298,
        views: 1450,
        textureCount: 30
      },
      {
        title: 'Indie Horror Game',
        description: 'Juego de terror indie con mecánicas de supervivencia y puzzles, arte estilo retro.',
        author: users[7]._id,
        category: 'Gaming',
        price: 19.99,
        license: 'Personal',
        files: {
          model: '/games/horror_game.exe',
          preview: '/images/horror_preview.jpg',
          thumbnail: '/images/horror_thumb.jpg'
        },
        tags: ['juego', 'terror', 'indie', 'survival'],
        downloads: 567,
        views: 3200,
        isFeatured: true
      },
      {
        title: 'Arquitectura Moderna',
        description: 'Modelo de casa moderna con diseño minimalista, incluye planos y renders.',
        author: users[1]._id,
        category: 'Arquitectura',
        price: 28.99,
        license: 'Indie',
        files: {
          model: '/models/casa_moderna.fbx',
          preview: '/images/casa_preview.jpg',
          thumbnail: '/images/casa_thumb.jpg',
          formats: ['fbx', 'obj', 'dae']
        },
        tags: ['casa', 'moderna', 'arquitectura', 'minimalista'],
        downloads: 234,
        views: 1100,
        polyCount: 30000,
        textureCount: 10
      }
    ]);

    return NextResponse.json({
      message: 'Base de datos poblada exitosamente',
      usersCreated: users.length,
      modelsCreated: models.length,
      data: {
        users: users.map(u => ({ id: u._id, username: u.username, email: u.email, role: u.role })),
        models: models.map(m => ({ id: m._id, title: m.title, author: m.author, price: m.price }))
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      message: 'Error al poblar la base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
