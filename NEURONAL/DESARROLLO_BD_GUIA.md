# 🗄️ Guía de Base de Datos para Desarrollo - Takopi

## 🎯 Sistema de Base de Datos Dual

Takopi ahora tiene un **sistema inteligente** que te permite desarrollar con MongoDB local y cambiar fácilmente a MongoDB Atlas para producción.

## 🚀 Configuración Rápida

### 1. Configurar Todo Automáticamente
```bash
# Configura todo de una vez (recomendado)
npm run dev:setup
```

### 2. Configuración Manual Paso a Paso

#### Paso 1: Crear archivo de configuración
```bash
npm run create:env
```

#### Paso 2: Configurar MongoDB local
```bash
npm run setup:local-db
```

#### Paso 3: Poblar con datos de prueba
```bash
npm run seed:local
```

#### Paso 4: Iniciar desarrollo
```bash
npm run dev:local
```

## 🔧 Modos de Base de Datos

### Local (Desarrollo)
```bash
npm run dev:local
# o
DB_MODE=local npm run dev
```
- **BD**: MongoDB local en `localhost:27017`
- **Base de datos**: `takopi_dev`
- **Datos**: Limpios, solo datos de prueba
- **Ventaja**: Rápido, sin límites, completamente local

### Atlas (Producción/Testing)
```bash
npm run dev:atlas
# o
DB_MODE=atlas npm run dev
```
- **BD**: MongoDB Atlas (tu cluster actual)
- **Base de datos**: `Takopi_BaseDatos`
- **Datos**: Datos reales de producción
- **Ventaja**: Datos reales, testing con usuarios reales

### Automático (Inteligente)
```bash
npm run dev:auto
# o
DB_MODE=auto npm run dev
```
- **Detecta automáticamente** qué BD está disponible
- **Prioriza**: Local → Atlas
- **Ventaja**: No necesitas cambiar configuraciones

## 📊 Datos de Prueba Incluidos

### Usuarios
- **testuser** / `test@takopi.com` / `password123` (Usuario normal)
- **creator** / `creator@takopi.com` / `password123` (Creador)
- **admin** / `admin@takopi.com` / `password123` (Administrador)

### Modelos 3D
- Casa Moderna 3D ($15.99)
- Pack de Texturas Realistas ($25.99)
- Robot Futurista ($35.99)
- Vehículo Deportivo ($45.99)

### Órdenes
- Órdenes de ejemplo con diferentes estados
- Historial de compras de usuarios

## 🔄 Comandos Útiles

```bash
# Cambiar entre modos
npm run dev:local    # MongoDB local
npm run dev:atlas    # MongoDB Atlas
npm run dev:auto     # Auto-detección

# Gestionar datos
npm run seed:local   # Poblar BD local
npm run db:reset     # Resetear datos de prueba

# Configuración
npm run create:env   # Crear .env.local
npm run setup:local-db # Configurar MongoDB local
```

## 🛠️ Instalación de MongoDB Local

### Windows
1. Descargar desde: https://www.mongodb.com/try/download/community
2. Instalar con configuración por defecto
3. MongoDB se iniciará automáticamente como servicio

### macOS
```bash
# Con Homebrew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
# Instalar
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar servicio
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 🔍 Verificar Configuración

### Verificar MongoDB Local
```bash
# Verificar que MongoDB está corriendo
mongod --version

# Conectar manualmente
mongosh mongodb://localhost:27017/takopi_dev
```

### Verificar Configuración
```bash
# Ver qué modo está usando
echo $DB_MODE

# Ver archivo de configuración
cat .env.local
```

## 🚨 Solución de Problemas

### Error: "MongoDB local no disponible"
```bash
# Iniciar MongoDB local
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Error: "No se puede conectar a Atlas"
- Verificar conexión a internet
- Verificar credenciales en `.env.local`
- Verificar que el cluster esté activo en MongoDB Atlas

### Error: "Base de datos no encontrada"
```bash
# Resetear datos de prueba
npm run db:reset
```

## 💡 Mejores Prácticas

### Para Desarrollo Diario
1. **Usa BD local**: `npm run dev:local`
2. **Datos limpios**: Cada vez que necesites datos frescos, ejecuta `npm run seed:local`
3. **Testing**: Para probar con datos reales, usa `npm run dev:atlas` ocasionalmente

### Para Producción
1. **Siempre usa Atlas**: `DB_MODE=atlas` en producción
2. **Variables de entorno**: Nunca hardcodees credenciales
3. **Backup**: Configura backups automáticos en Atlas

## 🎉 ¡Listo!

Ahora tienes un sistema profesional de base de datos que:
- ✅ Te permite desarrollar localmente sin afectar producción
- ✅ Tiene datos de prueba listos para usar
- ✅ Cambia fácilmente entre local y Atlas
- ✅ Es el estándar de la industria para Next.js

**¡Empieza a desarrollar con: `npm run dev:local`!**
