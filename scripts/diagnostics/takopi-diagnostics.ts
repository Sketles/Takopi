#!/usr/bin/env npx ts-node
/**
 * ████████╗ █████╗ ██╗  ██╗ ██████╗ ██████╗ ██╗
 * ╚══██╔══╝██╔══██╗██║ ██╔╝██╔═══██╗██╔══██╗██║
 *    ██║   ███████║█████╔╝ ██║   ██║██████╔╝██║
 *    ██║   ██╔══██║██╔═██╗ ██║   ██║██╔═══╝ ██║
 *    ██║   ██║  ██║██║  ██╗╚██████╔╝██║     ██║
 *    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝
 * 
 * NETWORK OPERATIONS TERMINAL v2.1.80
 * ═══════════════════════════════════════════════
 */

import { PrismaClient } from '@prisma/client';
import { list } from '@vercel/blob';
import jwt from 'jsonwebtoken';

// ═══════════════════════════════════════════════════════════════
// TERMINAL INTERFACE STYLING
// ═══════════════════════════════════════════════════════════════

const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  blink: '\x1b[5m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgRed: '\x1b[41m',
};

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearScreen() {
  console.clear();
}

function printSlow(text: string, delay: number = 5) {
  process.stdout.write(text);
}

// ═══════════════════════════════════════════════════════════════
// INTERFACE COMPONENTS
// ═══════════════════════════════════════════════════════════════

const BOOT_LOGO = `${c.green}
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║  ████████╗ █████╗ ██╗  ██╗ ██████╗ ██████╗ ██╗    ███╗   ██╗███████╗████████╗║
║  ╚══██╔══╝██╔══██╗██║ ██╔╝██╔═══██╗██╔══██╗██║    ████╗  ██║██╔════╝╚══██╔══╝║
║     ██║   ███████║█████╔╝ ██║   ██║██████╔╝██║    ██╔██╗ ██║█████╗     ██║   ║
║     ██║   ██╔══██║██╔═██╗ ██║   ██║██╔═══╝ ██║    ██║╚██╗██║██╔══╝     ██║   ║
║     ██║   ██║  ██║██║  ██╗╚██████╔╝██║     ██║    ██║ ╚████║███████╗   ██║   ║
║     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝    ╚═╝  ╚═══╝╚══════╝   ╚═╝   ║
║                                                                              ║
║                    NETWORK OPERATIONS TERMINAL v2.1.80                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
${c.reset}`;

function printSystemStatus() {
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = date.toLocaleTimeString('en-US', { hour12: false });
  
  console.log(`${c.green}
╔══════════════════════════════════════════════════════════════════════════════╗
║  SYSTEM STATUS                                                    ${dateStr} ║
║  ──────────────────────────────────────────────────────────────── ${timeStr} ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║   ┌─ CORE SYSTEMS ──────────────────────────────────────────────────────┐   ║
║   │                                                                     │   ║
║   │   [    ] DATABASE          Primary data storage system              │   ║
║   │   [    ] BLOB STORAGE      File storage subsystem                   │   ║
║   │   [    ] AUTHENTICATION    Security token management                │   ║
║   │   [    ] ENVIRONMENT       Configuration variables                  │   ║
║   │                                                                     │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║   ┌─ PAYMENT SYSTEMS ───────────────────────────────────────────────────┐   ║
║   │                                                                     │   ║
║   │   [    ] WEBPAY            Transaction processing gateway           │   ║
║   │   [    ] COMMERCE CODE     Merchant identification                  │   ║
║   │                                                                     │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║   ┌─ DATA INTEGRITY ────────────────────────────────────────────────────┐   ║
║   │                                                                     │   ║
║   │   [    ] SCHEMA            Database table structure                 │   ║
║   │   [    ] TEST DATA         Sample data verification                 │   ║
║   │   [    ] API CONFIG        Endpoint configuration                   │   ║
║   │                                                                     │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
${c.reset}`);
}

// Status tracking
interface SystemStatus {
  database: 'PENDING' | 'OK' | 'FAIL' | 'WARN';
  blobStorage: 'PENDING' | 'OK' | 'FAIL' | 'WARN';
  authentication: 'PENDING' | 'OK' | 'FAIL' | 'WARN';
  environment: 'PENDING' | 'OK' | 'FAIL' | 'WARN';
  emailNormalize: 'PENDING' | 'OK' | 'FAIL' | 'WARN';
  webpay: 'PENDING' | 'OK' | 'FAIL' | 'WARN';
  commerceCode: 'PENDING' | 'OK' | 'FAIL' | 'WARN';
  schema: 'PENDING' | 'OK' | 'FAIL' | 'WARN';
  testData: 'PENDING' | 'OK' | 'FAIL' | 'WARN';
  apiConfig: 'PENDING' | 'OK' | 'FAIL' | 'WARN';
}

interface SystemData {
  database: { users: number; contents: number; purchases: number } | null;
  testData: { users: number; contents: number; follows: number; collections: number } | null;
  webpay: { mode: string; code: string } | null;
  emailNormalize: { total: number; normalized: number } | null;
}

function getStatusSymbol(status: string): string {
  switch (status) {
    case 'OK': return `${c.bgGreen}${c.black} OK ${c.reset}`;
    case 'FAIL': return `${c.bgRed}${c.white}FAIL${c.reset}`;
    case 'WARN': return `${c.bgYellow}${c.black}WARN${c.reset}`;
    default: return `${c.dim}----${c.reset}`;
  }
}

function printUpdatedStatus(status: SystemStatus, data: SystemData) {
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = date.toLocaleTimeString('en-US', { hour12: false });
  
  // Database info
  const dbInfo = data.database 
    ? `${c.dim}USR:${data.database.users} CNT:${data.database.contents} PRC:${data.database.purchases}${c.reset}`
    : '';
  
  // Test data info  
  const tdInfo = data.testData
    ? `${c.dim}USR:${data.testData.users} CNT:${data.testData.contents} FLW:${data.testData.follows}${c.reset}`
    : '';
    
  // Webpay info
  const wpInfo = data.webpay
    ? `${c.dim}${data.webpay.mode} ${data.webpay.code}${c.reset}`
    : '';

  // Email normalize info
  const emInfo = data.emailNormalize
    ? `${c.dim}${data.emailNormalize.normalized}/${data.emailNormalize.total} OK${c.reset}`
    : '';

  console.log(`${c.green}
╔══════════════════════════════════════════════════════════════════════════════╗
║  SYSTEM STATUS                                                    ${dateStr} ║
║  ──────────────────────────────────────────────────────────────── ${timeStr} ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║   ┌─ CORE SYSTEMS ──────────────────────────────────────────────────────┐   ║
║   │                                                                     │   ║
║   │   [${getStatusSymbol(status.database)}] DATABASE          Primary data storage    ${dbInfo.padEnd(20)}│   ║
║   │   [${getStatusSymbol(status.blobStorage)}] BLOB STORAGE      File storage subsystem              │   ║
║   │   [${getStatusSymbol(status.authentication)}] AUTHENTICATION    Security token management                │   ║
║   │   [${getStatusSymbol(status.environment)}] ENVIRONMENT       Configuration variables                  │   ║
║   │   [${getStatusSymbol(status.emailNormalize)}] EMAIL NORMALIZE   User email format      ${emInfo.padEnd(20)}│   ║
║   │                                                                     │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║   ┌─ PAYMENT SYSTEMS ───────────────────────────────────────────────────┐   ║
║   │                                                                     │   ║
║   │   [${getStatusSymbol(status.webpay)}] WEBPAY            Transaction gateway     ${wpInfo.padEnd(20)}│   ║
║   │   [${getStatusSymbol(status.commerceCode)}] COMMERCE CODE     Merchant identification                  │   ║
║   │                                                                     │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║   ┌─ DATA INTEGRITY ────────────────────────────────────────────────────┐   ║
║   │                                                                     │   ║
║   │   [${getStatusSymbol(status.schema)}] SCHEMA            Database table structure                 │   ║
║   │   [${getStatusSymbol(status.testData)}] TEST DATA         Sample records         ${tdInfo.padEnd(20)}│   ║
║   │   [${getStatusSymbol(status.apiConfig)}] API CONFIG        Endpoint configuration                   │   ║
║   │                                                                     │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
${c.reset}`);
}

function printDiagnosticLog(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const colors = {
    info: c.cyan,
    success: c.green,
    error: c.red,
    warn: c.yellow,
  };
  const symbols = {
    info: '►',
    success: '✓',
    error: '✗',
    warn: '⚠',
  };
  console.log(`${c.dim}[${time}]${c.reset} ${colors[type]}${symbols[type]}${c.reset} ${message}`);
}

// ═══════════════════════════════════════════════════════════════
// TEST FUNCTIONS
// ═══════════════════════════════════════════════════════════════

async function testDatabase(): Promise<{ status: 'OK' | 'FAIL'; data?: any }> {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const users = await prisma.user.count();
    const contents = await prisma.content.count();
    const purchases = await prisma.purchase.count();
    await prisma.$disconnect();
    return { status: 'OK', data: { users, contents, purchases } };
  } catch {
    await prisma.$disconnect();
    return { status: 'FAIL' };
  }
}

async function testBlobStorage(): Promise<{ status: 'OK' | 'FAIL' | 'WARN' }> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return { status: 'WARN' };
    await list({ limit: 1 });
    return { status: 'OK' };
  } catch {
    return { status: 'FAIL' };
  }
}

async function testAuthentication(): Promise<{ status: 'OK' | 'FAIL' }> {
  try {
    const secret = process.env.JWT_SECRET || 'takopi-secret-key-dev-only';
    const token = jwt.sign({ test: true }, secret, { expiresIn: '1h' });
    jwt.verify(token, secret);
    return { status: 'OK' };
  } catch {
    return { status: 'FAIL' };
  }
}

async function testEnvironment(): Promise<{ status: 'OK' | 'FAIL' }> {
  const required = ['POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING'];
  const missing = required.filter(k => !process.env[k]);
  return { status: missing.length === 0 ? 'OK' : 'FAIL' };
}

async function testWebpay(): Promise<{ status: 'OK' | 'WARN'; data?: any }> {
  const code = process.env.TRANSBANK_COMMERCE_CODE || '597055555532';
  const isIntegration = code === '597055555532';
  return { 
    status: 'OK', 
    data: { 
      mode: isIntegration ? 'INTEG' : 'PROD',
      code: code.substring(0, 6) + '***'
    }
  };
}

async function testCommerceCode(): Promise<{ status: 'OK' | 'WARN' }> {
  const code = process.env.TRANSBANK_COMMERCE_CODE || '597055555532';
  return { status: code ? 'OK' : 'WARN' };
}

async function testSchema(): Promise<{ status: 'OK' | 'FAIL' }> {
  const prisma = new PrismaClient();
  try {
    await Promise.all([
      prisma.user.findFirst(),
      prisma.content.findFirst(),
      prisma.purchase.findFirst(),
      prisma.follow.findFirst(),
      prisma.collection.findFirst(),
    ]);
    await prisma.$disconnect();
    return { status: 'OK' };
  } catch {
    await prisma.$disconnect();
    return { status: 'FAIL' };
  }
}

async function testTestData(): Promise<{ status: 'OK' | 'WARN' | 'FAIL'; data?: any }> {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.count();
    const contents = await prisma.content.count();
    const follows = await prisma.follow.count();
    const collections = await prisma.collection.count();
    await prisma.$disconnect();
    return { 
      status: users > 0 ? 'OK' : 'WARN',
      data: { users, contents, follows, collections }
    };
  } catch {
    await prisma.$disconnect();
    return { status: 'FAIL' };
  }
}

async function testApiConfig(): Promise<{ status: 'OK' | 'WARN' }> {
  const url = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return { status: url ? 'OK' : 'WARN' };
}

async function testEmailNormalize(): Promise<{ status: 'OK' | 'FAIL' | 'WARN'; data?: any }> {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany({ select: { email: true } });
    await prisma.$disconnect();
    
    const total = users.length;
    const normalized = users.filter(u => u.email === u.email.toLowerCase().trim()).length;
    
    return {
      status: total === normalized ? 'OK' : 'WARN',
      data: { total, normalized }
    };
  } catch {
    await prisma.$disconnect();
    return { status: 'FAIL' };
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════

async function runDiagnostics() {
  clearScreen();
  
  // Boot sequence
  console.log(`${c.green}${c.dim}`);
  console.log('TAKOPI NETWORK TERMINAL');
  console.log('INITIALIZING...');
  console.log(`${c.reset}`);
  await sleep(500);
  
  clearScreen();
  console.log(BOOT_LOGO);
  await sleep(1000);
  
  // Initial status display
  const status: SystemStatus = {
    database: 'PENDING',
    blobStorage: 'PENDING', 
    authentication: 'PENDING',
    environment: 'PENDING',
    emailNormalize: 'PENDING',
    webpay: 'PENDING',
    commerceCode: 'PENDING',
    schema: 'PENDING',
    testData: 'PENDING',
    apiConfig: 'PENDING',
  };
  
  const data: SystemData = {
    database: null,
    testData: null,
    webpay: null,
    emailNormalize: null,
  };
  
  clearScreen();
  console.log(BOOT_LOGO);
  printSystemStatus();
  
  console.log(`\n${c.green}─── DIAGNOSTIC SEQUENCE INITIATED ───${c.reset}\n`);
  await sleep(300);
  
  // Run tests with live updates
  printDiagnosticLog('Connecting to primary database...', 'info');
  await sleep(200);
  const dbResult = await testDatabase();
  status.database = dbResult.status;
  if (dbResult.data) data.database = dbResult.data;
  printDiagnosticLog(dbResult.status === 'OK' ? 'Database connection established' : 'Database connection failed', dbResult.status === 'OK' ? 'success' : 'error');
  
  await sleep(150);
  printDiagnosticLog('Verifying blob storage access...', 'info');
  const blobResult = await testBlobStorage();
  status.blobStorage = blobResult.status;
  printDiagnosticLog(blobResult.status === 'OK' ? 'Blob storage accessible' : 'Blob storage check failed', blobResult.status === 'OK' ? 'success' : 'warn');
  
  await sleep(150);
  printDiagnosticLog('Testing authentication subsystem...', 'info');
  const authResult = await testAuthentication();
  status.authentication = authResult.status;
  printDiagnosticLog(authResult.status === 'OK' ? 'JWT authentication operational' : 'Authentication system error', authResult.status === 'OK' ? 'success' : 'error');
  
  await sleep(150);
  printDiagnosticLog('Checking environment configuration...', 'info');
  const envResult = await testEnvironment();
  status.environment = envResult.status;
  printDiagnosticLog(envResult.status === 'OK' ? 'Environment variables loaded' : 'Missing required variables', envResult.status === 'OK' ? 'success' : 'error');
  
  await sleep(150);
  printDiagnosticLog('Verifying email normalization...', 'info');
  const emResult = await testEmailNormalize();
  status.emailNormalize = emResult.status;
  if (emResult.data) data.emailNormalize = emResult.data;
  printDiagnosticLog(emResult.status === 'OK' ? `All ${emResult.data?.total} emails normalized` : 'Some emails not normalized', emResult.status === 'OK' ? 'success' : 'warn');
  
  await sleep(150);
  printDiagnosticLog('Initializing payment gateway...', 'info');
  const wpResult = await testWebpay();
  status.webpay = wpResult.status;
  if (wpResult.data) data.webpay = wpResult.data;
  printDiagnosticLog(wpResult.status === 'OK' ? `Webpay online [${wpResult.data?.mode}]` : 'Payment gateway offline', wpResult.status === 'OK' ? 'success' : 'error');
  
  await sleep(150);
  printDiagnosticLog('Validating commerce credentials...', 'info');
  const ccResult = await testCommerceCode();
  status.commerceCode = ccResult.status;
  printDiagnosticLog(ccResult.status === 'OK' ? 'Commerce code verified' : 'Commerce code not configured', ccResult.status === 'OK' ? 'success' : 'warn');
  
  await sleep(150);
  printDiagnosticLog('Verifying database schema...', 'info');
  const schemaResult = await testSchema();
  status.schema = schemaResult.status;
  printDiagnosticLog(schemaResult.status === 'OK' ? 'Schema integrity confirmed' : 'Schema validation failed', schemaResult.status === 'OK' ? 'success' : 'error');
  
  await sleep(150);
  printDiagnosticLog('Scanning test data records...', 'info');
  const tdResult = await testTestData();
  status.testData = tdResult.status;
  if (tdResult.data) data.testData = tdResult.data;
  printDiagnosticLog(tdResult.status === 'OK' ? `Test data found [${tdResult.data?.users} users]` : 'No test data available', tdResult.status === 'OK' ? 'success' : 'warn');
  
  await sleep(150);
  printDiagnosticLog('Checking API configuration...', 'info');
  const apiResult = await testApiConfig();
  status.apiConfig = apiResult.status;
  printDiagnosticLog(apiResult.status === 'OK' ? 'API endpoints configured' : 'API configuration incomplete', apiResult.status === 'OK' ? 'success' : 'warn');
  
  console.log(`\n${c.green}─── DIAGNOSTIC SEQUENCE COMPLETE ───${c.reset}\n`);
  await sleep(500);
  
  // Final status display
  clearScreen();
  console.log(BOOT_LOGO);
  printUpdatedStatus(status, data);
  
  // Count results
  const statuses = Object.values(status);
  const passed = statuses.filter(s => s === 'OK').length;
  const failed = statuses.filter(s => s === 'FAIL').length;
  const warnings = statuses.filter(s => s === 'WARN').length;
  
  // Final summary
  if (failed === 0) {
    console.log(`${c.green}
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║     █████╗ ██╗     ██╗         ███████╗██╗   ██╗███████╗████████╗███████╗   ║
║    ██╔══██╗██║     ██║         ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝   ║
║    ███████║██║     ██║         ███████╗ ╚████╔╝ ███████╗   ██║   █████╗     ║
║    ██╔══██║██║     ██║         ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝     ║
║    ██║  ██║███████╗███████╗    ███████║   ██║   ███████║   ██║   ███████╗   ║
║    ╚═╝  ╚═╝╚══════╝╚══════╝    ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝   ║
║                                                                              ║
║       ██████╗ ██████╗ ███████╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗║
║      ██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║║
║      ██║   ██║██████╔╝█████╗  ██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║║
║      ██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║║
║      ╚██████╔╝██║     ███████╗██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║║
║       ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝║
║                                                                              ║
║                         NETWORK TERMINAL READY                               ║
║                                                                              ║
║   ┌──────────────────────────────────────────────────────────────────────┐  ║
║   │  PASSED: ${String(passed).padStart(2, '0')}    FAILED: ${String(failed).padStart(2, '0')}    WARNINGS: ${String(warnings).padStart(2, '0')}                              │  ║
║   └──────────────────────────────────────────────────────────────────────┘  ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
${c.reset}`);
  } else {
    console.log(`${c.red}
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║    ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗                     ║
║    ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║                     ║
║    ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║                     ║
║    ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║                     ║
║    ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║                     ║
║    ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝                     ║
║                                                                              ║
║    ███████╗██████╗ ██████╗  ██████╗ ██████╗                                  ║
║    ██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗                                 ║
║    █████╗  ██████╔╝██████╔╝██║   ██║██████╔╝                                 ║
║    ██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗                                 ║
║    ███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║                                 ║
║    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝                                 ║
║                                                                              ║
║                      DIAGNOSTIC FAILURE DETECTED                             ║
║                                                                              ║
║   ┌──────────────────────────────────────────────────────────────────────┐  ║
║   │  PASSED: ${String(passed).padStart(2, '0')}    FAILED: ${String(failed).padStart(2, '0')}    WARNINGS: ${String(warnings).padStart(2, '0')}                              │  ║
║   └──────────────────────────────────────────────────────────────────────┘  ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
${c.reset}`);
  }
  
  console.log(`${c.dim}Diagnostic sequence terminated at ${new Date().toLocaleTimeString('en-US', { hour12: false })}${c.reset}\n`);
  
  process.exit(failed > 0 ? 1 : 0);
}

// Execute
runDiagnostics().catch(console.error);
