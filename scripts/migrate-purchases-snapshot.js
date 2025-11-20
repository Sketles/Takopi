/**
 * Script de migración para actualizar compras existentes con contentSnapshot
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migratePurchasesSnapshot() {
    console.log('🚀 Iniciando migración de compras...');

    try {
        // Obtener todas las compras
        const purchases = await prisma.purchase.findMany({
            include: {
                content: true
            }
        });

        console.log(`📦 Encontradas ${purchases.length} compras para procesar`);

        let migrated = 0;
        let skipped = 0;
        let failed = 0;

        for (const purchase of purchases) {
            try {
                // Verificar si ya tiene snapshot válido
                if (purchase.contentSnapshot &&
                    typeof purchase.contentSnapshot === 'object' &&
                    Object.keys(purchase.contentSnapshot).length > 0 &&
                    purchase.contentSnapshot.title) {
                    console.log(`⏭️  Compra ${purchase.id} ya tiene snapshot, omitiendo`);
                    skipped++;
                    continue;
                }

                if (purchase.content) {
                    // El contenido aún existe, crear snapshot
                    const contentSnapshot = {
                        title: purchase.content.title,
                        description: purchase.content.description,
                        shortDescription: purchase.content.shortDescription,
                        contentType: purchase.content.contentType,
                        category: purchase.content.category,
                        files: purchase.content.files,
                        coverImage: purchase.content.coverImage,
                        additionalImages: purchase.content.additionalImages,
                        price: purchase.content.price,
                        currency: purchase.content.currency,
                        license: purchase.content.license,
                        customLicense: purchase.content.customLicense,
                        tags: purchase.content.tags,
                        authorId: purchase.content.authorId
                    };

                    await prisma.purchase.update({
                        where: { id: purchase.id },
                        data: { contentSnapshot }
                    });

                    migrated++;
                    console.log(`✅ Migrada compra ${purchase.id} - ${purchase.content.title}`);
                } else {
                    // El contenido ya fue eliminado, crear snapshot vacío
                    const emptySnapshot = {
                        title: 'Contenido eliminado',
                        description: 'Este contenido ya no está disponible',
                        contentType: 'unknown',
                        category: 'unknown',
                        files: [],
                        price: purchase.price,
                        currency: purchase.currency
                    };

                    await prisma.purchase.update({
                        where: { id: purchase.id },
                        data: { contentSnapshot: emptySnapshot }
                    });

                    failed++;
                    console.log(`⚠️  Compra ${purchase.id} - contenido ya eliminado`);
                }
            } catch (error) {
                console.error(`❌ Error migrando compra ${purchase.id}:`, error.message);
                failed++;
            }
        }

        console.log('\n📊 Resumen de migración:');
        console.log(`   ✅ Migradas exitosamente: ${migrated}`);
        console.log(`   ⏭️  Ya tenían snapshot: ${skipped}`);
        console.log(`   ⚠️  Con contenido eliminado: ${failed}`);
        console.log(`   📦 Total procesadas: ${purchases.length}`);
        console.log('\n✨ Migración completada');

    } catch (error) {
        console.error('❌ Error en la migración:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar migración
migratePurchasesSnapshot()
    .then(() => {
        console.log('🎉 Script de migración finalizado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Error fatal:', error);
        process.exit(1);
    });
