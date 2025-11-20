const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkContent() {
    try {
        console.log('🔍 Verificando contenido en la base de datos...\n');

        // Contar todos los contenidos
        const totalContent = await prisma.content.count();
        console.log(`📊 Total de contenidos: ${totalContent}`);

        // Contar contenidos publicados
        const publishedContent = await prisma.content.count({
            where: {
                isPublished: true,
                status: 'published'
            }
        });
        console.log(`✅ Contenidos publicados: ${publishedContent}`);

        // Contar contenidos listados
        const listedContent = await prisma.content.count({
            where: {
                isListed: true
            }
        });
        console.log(`📋 Contenidos listados (isListed=true): ${listedContent}`);

        // Contar contenidos que cumplen todos los criterios
        const visibleContent = await prisma.content.count({
            where: {
                isPublished: true,
                status: 'published',
                isListed: true
            }
        });
        console.log(`👁️ Contenidos visibles (publicados + listados): ${visibleContent}`);

        // Mostrar algunos ejemplos
        console.log('\n📝 Primeros 5 contenidos:');
        const samples = await prisma.content.findMany({
            take: 5,
            select: {
                id: true,
                title: true,
                isPublished: true,
                status: true,
                isListed: true
            }
        });

        samples.forEach((content, idx) => {
            console.log(`\n${idx + 1}. ${content.title}`);
            console.log(`   ID: ${content.id}`);
            console.log(`   isPublished: ${content.isPublished}`);
            console.log(`   status: ${content.status}`);
            console.log(`   isListed: ${content.isListed}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkContent();
