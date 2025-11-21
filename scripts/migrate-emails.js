/**
 * Script de Migración: Normalizar Emails Existentes
 * 
 * Este script normaliza todos los emails en la base de datos a lowercase
 * para mantener consistencia y evitar problemas de autenticación.
 * 
 * Uso: node scripts/migrate-emails.js
 */

const fs = require('fs');
const path = require('path');

const STORAGE_PATH = path.join(process.cwd(), 'storage', 'users');
const INDEX_PATH = path.join(STORAGE_PATH, 'index.json');

async function migrateEmails() {
  console.log('🔄 Iniciando migración de emails...\n');

  try {
    // Leer índice de usuarios
    if (!fs.existsSync(INDEX_PATH)) {
      console.log('❌ No se encontró el archivo index.json de usuarios');
      return;
    }

    const indexData = fs.readFileSync(INDEX_PATH, 'utf-8');
    const index = JSON.parse(indexData);

    let migratedCount = 0;
    let unchangedCount = 0;
    let errors = 0;

    console.log(`📊 Total de usuarios encontrados: ${index.users?.length || 0}\n`);

    // Procesar cada usuario
    for (const userId of index.users || []) {
      try {
        const userFilePath = path.join(STORAGE_PATH, `${userId}.json`);
        
        if (!fs.existsSync(userFilePath)) {
          console.log(`⚠️  Archivo no encontrado: ${userId}.json`);
          errors++;
          continue;
        }

        // Leer datos del usuario
        const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        const originalEmail = userData.email;
        const normalizedEmail = originalEmail?.toLowerCase().trim();

        // Verificar si necesita actualización
        if (originalEmail === normalizedEmail) {
          unchangedCount++;
          console.log(`✓ ${originalEmail} - Ya normalizado`);
          continue;
        }

        // Actualizar email
        userData.email = normalizedEmail;
        
        // Guardar cambios
        fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2), 'utf-8');
        
        migratedCount++;
        console.log(`✅ ${originalEmail} → ${normalizedEmail}`);

      } catch (error) {
        console.error(`❌ Error procesando ${userId}:`, error.message);
        errors++;
      }
    }

    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Emails migrados:     ${migratedCount}`);
    console.log(`✓  Ya normalizados:     ${unchangedCount}`);
    console.log(`❌ Errores:             ${errors}`);
    console.log(`📝 Total procesados:    ${migratedCount + unchangedCount + errors}`);
    console.log('='.repeat(60) + '\n');

    if (migratedCount > 0) {
      console.log('✅ Migración completada exitosamente!');
      console.log('💡 Los usuarios ahora pueden usar su email en cualquier formato (mayúsculas/minúsculas)');
    } else {
      console.log('ℹ️  No se encontraron emails que necesiten migración');
    }

  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateEmails();
