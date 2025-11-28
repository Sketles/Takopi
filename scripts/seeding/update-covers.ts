/**
 * Script para actualizar covers duplicados con imágenes únicas de Unsplash
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// URLs de Unsplash relacionadas al contenido (libres de derechos)
const COVER_UPDATES: Record<string, string> = {
  // Beats/Música - Diferentes covers para cada uno
  "Act a Foolie - Beat Trap": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80", // Studio mic
  "Proud of You - Beat Melódico": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80", // Piano keys
  "Money n Drugs - Beat Hard": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80", // Dark studio
  
  "BROKEN HEARTS - Beat Emotivo": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80", // Concert lights
  "HEAVENS GATE - Beat Celestial": "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80", // Purple sky
  "VVS - Beat Luxury": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80", // Diamonds/luxury
  
  "Cancun Type Beat - Summer Vibes": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // Beach sunset
  "Fashion Killa Type Beat - Runway": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", // Fashion runway
  "Butterfly Doors Type Beat - Flex": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80", // Lambo doors
  
  "Whole Lotta Red Type Beat - Dark": "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80", // Red abstract
  "Skeletons Type Beat - Ethereal": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80", // Ethereal clouds
  
  "NO LOVE - Beat Sad Trap": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80", // Sad mood rain
  "HOUSTON - Beat Space": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80", // Space/NASA
  "RAGERS WRLD - Beat Rage": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80", // Concert mosh
  
  // Texturas - Diferentes covers
  "Pack Screenshots Cyberpunk - Texturas": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80", // Cyberpunk city
  "Banners Twitch Pack - Streaming": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80", // Gaming setup
  "Pack Fotos Naturaleza - Referencias": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80", // Nature landscape
  "Pack Aesthetic Cyberpunk - Gallery": "https://images.unsplash.com/photo-1515630278258-407f66498911?w=800&q=80", // Neon aesthetic
  
  // Modelos 3D que comparten cover (Pistola DK usa el mismo que Barril)
  "Pistola DK - Arma Stylized": "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=800&q=80", // Colorful abstract (DK style)
};

async function updateCovers() {
  console.log('═'.repeat(60));
  console.log('🖼️  ACTUALIZANDO COVERS DUPLICADOS');
  console.log('═'.repeat(60));
  
  let updated = 0;
  let notFound = 0;
  
  for (const [title, newCoverUrl] of Object.entries(COVER_UPDATES)) {
    try {
      const content = await prisma.content.findFirst({
        where: { title },
        select: { id: true, title: true, coverImage: true }
      });
      
      if (!content) {
        console.log(`⚠️  No encontrado: "${title}"`);
        notFound++;
        continue;
      }
      
      await prisma.content.update({
        where: { id: content.id },
        data: { coverImage: newCoverUrl }
      });
      
      console.log(`✅ ${title}`);
      console.log(`   → ${newCoverUrl.substring(0, 60)}...`);
      updated++;
      
    } catch (error) {
      console.error(`❌ Error en "${title}":`, error);
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log(`📊 Resumen: ${updated} actualizados, ${notFound} no encontrados`);
  console.log('═'.repeat(60));
}

async function main() {
  try {
    await updateCovers();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
