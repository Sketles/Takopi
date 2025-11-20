#!/usr/bin/env -S npx tsx
import 'dotenv/config';
import prisma from '../src/lib/prisma';
import { listFiles } from '../src/lib/blob';

async function testPostgres() {
  console.log('🗄️  Test DB: connecting to Postgres (Prisma)');
  try {
    await prisma.$connect();
    // SELECT 1
    const res: any = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('✅ DB OK — SELECT 1 ->', res);
  } catch (error) {
    console.error('❌ DB connection or query failed:', error);
    throw error;
  } finally {
    try { await prisma.$disconnect(); } catch {}
  }
}

async function testVercelBlob() {
  console.log('🧰 Test BLOB: listing files using @vercel/blob (listFiles)');
  try {
    const listRes = await listFiles();
    // listFiles returns array or object with blobs depending on implementation
    if (!listRes) {
      console.log('⚠️  BLOB: list returned no contents');
    } else if (Array.isArray(listRes)) {
      console.log(`✅ BLOB OK — list returned ${listRes.length} items`);
    } else if (listRes && typeof listRes === 'object' && Array.isArray((listRes as any).blobs)) {
      // Guard to avoid TypeError when `listRes` is primitive or null
      console.log(`✅ BLOB OK — list returned ${((listRes as any).blobs ?? []).length} items`);
    } else {
      console.log('✅ BLOB OK — list returned:', listRes);
    }
  } catch (error) {
    console.error('❌ BLOB connection failed:', error);
    throw error;
  }
}

async function main() {
  console.log('--- Test connections: DB and Blob ---');
  let failed = false;
  try {
    await testPostgres();
  } catch (err) {
    failed = true;
  }

  try {
    await testVercelBlob();
  } catch (err) {
    failed = true;
  }

  if (failed) {
    console.error('\nOne or more checks failed — check environment variables and credentials (POSTGRES_PRISMA_URL, BLOB_READ_WRITE_TOKEN).');
    process.exitCode = 1;
  } else {
    console.log('\nAll checks passed.');
  }
}

main();
