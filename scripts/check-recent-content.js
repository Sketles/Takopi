const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecentContent() {
    try {
        const recentContent = await prisma.content.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                isPublished: true,
                status: true,
                isListed: true,
                visibility: true,
                createdAt: true,
                authorId: true,
                shortDescription: true
            }
        });

        console.log('📦 Recent Content (Last 5):');
        console.log(JSON.stringify(recentContent, null, 2));

        const publishedCount = await prisma.content.count({
            where: {
                isPublished: true,
                status: 'published',
                isListed: true
            }
        });

        console.log(`\n✅ Published & Listed Content: ${publishedCount}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkRecentContent();
