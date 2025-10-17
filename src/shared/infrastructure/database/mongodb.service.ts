// MongoDB Service - Infraestructura para conexión a MongoDB
import { connectToDatabase } from '@/lib/mongodb';

export class MongoDBService {
  private static instance: MongoDBService;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await connectToDatabase();
      this.isConnected = true;
      console.log('✅ MongoDB connected via MongoDBService');
    }
  }

  async disconnect(): Promise<void> {
    // Implementar lógica de desconexión si es necesaria
    this.isConnected = false;
  }

  isConnectionActive(): boolean {
    return this.isConnected;
  }
}

// Instancia singleton
export const mongoDBService = MongoDBService.getInstance();

