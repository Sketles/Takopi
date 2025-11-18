// Script para actualizar contenido viejo de draft a published
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Actualizando contenido draft a published...');
  
  const result = await prisma.content.updateMany({
    where: {
      status: 'draft',
      isPublished: true
    },
    data: {
      status: 'published'
    }
  });
  
  console.log(`✅ ${result.count} contenidos actualizados a published`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
