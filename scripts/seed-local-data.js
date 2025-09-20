#!/usr/bin/env node

/**
 * Script para poblar la base de datos local con datos de prueba
 * Incluye usuarios, modelos 3D, imágenes, música, órdenes, etc.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquemas de prueba (simplificados)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'creator', 'admin'], default: 'user' },
  avatar: { type: String },
  banner: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Model3DSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, default: 0 },
  category: { type: String, required: true },
  tags: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }],
  modelUrl: { type: String },
  downloads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model3D' },
    price: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Datos de prueba
const testUsers = [
  {
    username: 'testuser',
    email: 'test@takopi.com',
    password: 'password123',
    role: 'user',
    bio: 'Usuario de prueba para desarrollo'
  },
  {
    username: 'creator',
    email: 'creator@takopi.com',
    password: 'password123',
    role: 'creator',
    bio: 'Creador de modelos 3D profesional'
  },
  {
    username: 'admin',
    email: 'admin@takopi.com',
    password: 'password123',
    role: 'admin',
    bio: 'Administrador del sistema'
  }
];

const testModels = [
  {
    title: 'Casa Moderna 3D',
    description: 'Modelo 3D de una casa moderna con texturas realistas',
    price: 12990,
    category: 'Arquitectura',
    tags: ['casa', 'moderna', 'arquitectura'],
    images: ['https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Casa+Moderna'],
    modelUrl: 'https://example.com/models/casa-moderna.glb',
    downloads: 45,
    likes: 23
  },
  {
    title: 'Pack de Texturas Realistas',
    description: 'Colección de 50 texturas de alta calidad para modelos 3D',
    price: 20990,
    category: 'Texturas',
    tags: ['texturas', 'realistas', 'pack'],
    images: ['https://via.placeholder.com/400x300/059669/FFFFFF?text=Texturas'],
    modelUrl: 'https://example.com/textures/pack-realistas.zip',
    downloads: 78,
    likes: 34
  },
  {
    title: 'Robot Futurista',
    description: 'Modelo 3D de robot con animaciones incluidas',
    price: 28990,
    category: 'Personajes',
    tags: ['robot', 'futurista', 'animación'],
    images: ['https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Robot'],
    modelUrl: 'https://example.com/models/robot-futurista.fbx',
    downloads: 123,
    likes: 67
  },
  {
    title: 'Vehículo Deportivo',
    description: 'Modelo 3D de coche deportivo con detalles interiores',
    price: 36990,
    category: 'Vehículos',
    tags: ['coche', 'deportivo', 'vehículo'],
    images: ['https://via.placeholder.com/400x300/7C3AED/FFFFFF?text=Vehículo'],
    modelUrl: 'https://example.com/models/vehiculo-deportivo.obj',
    downloads: 89,
    likes: 45
  }
];

// Función para poblar la base de datos
async function seedDatabase() {
  try {
    // Conectar a MongoDB local
    const mongoUri = 'mongodb://localhost:27017/takopi_dev';
    console.log('🔗 Conectando a MongoDB local...');

    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB local');

    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Base de datos limpia');

    // Crear modelos
    const User = mongoose.model('User', UserSchema);
    const Model3D = mongoose.model('Model3D', Model3DSchema);
    const Order = mongoose.model('Order', OrderSchema);

    // Crear usuarios
    console.log('👥 Creando usuarios...');
    const hashedUsers = await Promise.all(
      testUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ ${createdUsers.length} usuarios creados`);

    // Crear modelos 3D
    console.log('🎨 Creando modelos 3D...');
    const modelsWithAuthors = testModels.map((model, index) => ({
      ...model,
      author: createdUsers[1]._id // Asignar al creator
    }));
    const createdModels = await Model3D.insertMany(modelsWithAuthors);
    console.log(`✅ ${createdModels.length} modelos 3D creados`);

    // Crear órdenes de ejemplo
    console.log('🛒 Creando órdenes...');
    const testOrders = [
      {
        user: createdUsers[0]._id, // testuser
        items: [
          { model: createdModels[0]._id, price: createdModels[0].price },
          { model: createdModels[1]._id, price: createdModels[1].price }
        ],
        total: createdModels[0].price + createdModels[1].price,
        status: 'completed'
      },
      {
        user: createdUsers[0]._id,
        items: [{ model: createdModels[2]._id, price: createdModels[2].price }],
        total: createdModels[2].price,
        status: 'pending'
      }
    ];
    const createdOrders = await Order.insertMany(testOrders);
    console.log(`✅ ${createdOrders.length} órdenes creadas`);

    // Mostrar resumen
    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   👥 Usuarios: ${createdUsers.length}`);
    console.log(`   🎨 Modelos 3D: ${createdModels.length}`);
    console.log(`   🛒 Órdenes: ${createdOrders.length}`);

    console.log('\n🔑 Credenciales de prueba:');
    testUsers.forEach(user => {
      console.log(`   👤 ${user.username}: ${user.email} / ${user.password}`);
    });

    console.log('\n💡 Próximos pasos:');
    console.log('   1. Ejecuta: npm run dev');
    console.log('   2. Visita: http://localhost:3000');
    console.log('   3. Inicia sesión con cualquier usuario de prueba');

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error.message);
    console.log('\n💡 Asegúrate de que MongoDB local esté ejecutándose:');
    console.log('   mongod --dbpath ./data/db');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
