#!/usr/bin/env node

const fs = require('fs');

const envContent = `# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://takopi_app:Suicidesurrender603@cluster99.uzpzzow.mongodb.net/Takopi_BaseDatos?retryWrites=true&w=majority&appName=Cluster99

# JWT Secret
JWT_SECRET=takopi_jwt_secret_super_secreto_2025_change_in_production

# NextAuth Secret
NEXTAUTH_SECRET=takopi_nextauth_secret_2025_change_in_production

# App Configuration
NEXTAUTH_URL=http://localhost:3000
`;

try {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
} catch (error) {
  console.error('❌ Error creando .env.local:', error.message);
}
