/**
 * Script de Verificación: Emails Normalizados
 * 
 * Verifica que todos los emails en la BD están en lowercase
 * 
 * Uso: node scripts/verify-email-normalization.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyEmails() {
  console.log('🔍 Verificando normalización de emails...\n');

  try {
    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Total de usuarios: ${users.length}\n`);

    let allNormalized = true;

    // Verificar cada email
    for (const user of users) {
      const normalizedEmail = user.email.toLowerCase().trim();
      const isNormalized = user.email === normalizedEmail;

      const status = isNormalized ? '✅' : '❌';
      console.log(`${status} ${user.username.padEnd(20)} | ${user.email}`);

      if (!isNormalized) {
        allNormalized = false;
        console.log(`   ⚠️  Debería ser: ${normalizedEmail}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    if (allNormalized) {
      console.log('✅ TODOS LOS EMAILS ESTÁN NORMALIZADOS');
      console.log('💡 Los usuarios pueden iniciar sesión con cualquier formato de mayúsculas');
    } else {
      console.log('❌ ALGUNOS EMAILS NO ESTÁN NORMALIZADOS');
      console.log('💡 Ejecuta la migración SQL: npx prisma db execute --file prisma/migrations/normalize_emails.sql');
    }
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyEmails();
