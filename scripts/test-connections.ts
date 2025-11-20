#!/usr/bin/env -S npx tsx
import 'dotenv/config';
import prisma from '../src/lib/prisma';
import { listFiles } from '../src/lib/blob';

/* --------------------------------------------------
  Estilo: Terminal de los 80
  Salidas en español y formato retro (ANSI colors)
-------------------------------------------------- */

const ESC = '\x1b[';
const RESET = `${ESC}0m`;
const BRIGHT = `${ESC}1m`;
const DIM = `${ESC}2m`;
const FG_GREEN = `${ESC}32m`;
const FG_RED = `${ESC}31m`;
const FG_YELLOW = `${ESC}33m`;
const FG_CYAN = `${ESC}36m`;
const FG_MAGENTA = `${ESC}35m`;

function hr(width = 60) {
  return '─'.repeat(width);
}

function center(text: string, width = 60) {
  if (text.length >= width) return text;
  const left = Math.floor((width - text.length) / 2);
  const right = width - text.length - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
}

function printHeader(title: string) {
  console.log(`${FG_CYAN}${BRIGHT}+${hr()}+${RESET}`);
  console.log(`${FG_CYAN}${BRIGHT}|${center(title)}|${RESET}`);
  console.log(`${FG_CYAN}${BRIGHT}+${hr()}+${RESET}`);
}

function printLine(message: string) {
  console.log(`${DIM}› ${RESET}${message}`);
}

function printOk(subject: string) {
  console.log(`${FG_GREEN}${BRIGHT}[OK]${RESET} ${subject}`);
}

function printFail(subject: string) {
  console.log(`${FG_RED}${BRIGHT}[FALLO]${RESET} ${FG_RED}${subject}${RESET}`);
}

async function testPostgres() {
  printLine('Iniciando prueba: Conexión a la base de datos (Postgres / Prisma)');
  try {
    await prisma.$connect();
    const res: any = await prisma.$queryRaw`SELECT 1 as result`;
    printOk(`Base de datos OK — SELECT 1 -> ${JSON.stringify(res)}`);
  } catch (error) {
    printFail('No fue posible conectar a la base de datos. Revisa POSTGRES_PRISMA_URL y credenciales.');
    console.error(error);
    throw error;
  } finally {
    try { await prisma.$disconnect(); } catch (e) {}
  }
}

async function testVercelBlob() {
  printLine('Iniciando prueba: Vercel Blob (listar archivos)');
  try {
    const listRes = await listFiles();

    if (!listRes) {
      printLine('BLOB: La función devolvió contenido vacío. Puede que no haya archivos o el token sea inválido.');
      printOk('Conexión a BLOB OK (respuesta vacía)');
      return;
    }

    if (Array.isArray(listRes)) {
      printOk(`BLOB OK — listado con ${listRes.length} elementos`);
      return;
    }

    if (listRes && typeof listRes === 'object' && Array.isArray((listRes as any).blobs)) {
      printOk(`BLOB OK — listado con ${((listRes as any).blobs ?? []).length} elementos`);
      return;
    }

    printOk(`BLOB OK — respuesta: ${JSON.stringify(listRes)}`);
  } catch (error) {
    printFail('Conexión a Vercel Blob fallida. Revisa BLOB_READ_WRITE_TOKEN.');
    console.error(error);
    throw error;
  }
}

async function main() {
  printHeader('TAKOPI - Verificación de Conexiones');
  let failure = false;

  try { await testPostgres(); } catch { failure = true; }
  try { await testVercelBlob(); } catch { failure = true; }

  console.log(`${FG_MAGENTA}${BRIGHT}${hr(60)}${RESET}`);
  if (failure) {
    printFail('Una o más comprobaciones fallaron. Revisa variables de entorno y credenciales.');
    console.log(`${FG_RED}Detalles: POSTGRES_PRISMA_URL, BLOB_READ_WRITE_TOKEN${RESET}`);
    process.exitCode = 1;
  } else {
    printOk('¡Todas las comprobaciones pasaron con éxito!');
  }
}

main();
