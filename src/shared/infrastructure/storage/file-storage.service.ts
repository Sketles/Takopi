// File Storage Service - Infraestructura para manejar archivos JSON
import fs from 'fs';
import path from 'path';

const STORAGE_PATH = path.join(process.cwd(), 'storage');

export class FileStorageService {
  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private getFilePath(collection: string, id?: string): string {
    const dirPath = path.join(STORAGE_PATH, collection);
    this.ensureDirectoryExists(dirPath);
    
    if (id) {
      return path.join(dirPath, `${id}.json`);
    }
    return path.join(dirPath, 'index.json');
  }

  // Generar ID único
  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Leer todos los documentos de una colección
  async findAll<T>(collection: string): Promise<T[]> {
    try {
      const indexPath = this.getFilePath(collection);
      
      if (!fs.existsSync(indexPath)) {
        return [];
      }

      const data = fs.readFileSync(indexPath, 'utf8');
      const parsed = JSON.parse(data);
      
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      return [];
    }
  }

  // Leer un documento por ID
  async findById<T>(collection: string, id: string): Promise<T | null> {
    try {
      const filePath = this.getFilePath(collection, id);
      
      if (!fs.existsSync(filePath)) {
        // Buscar en el índice
        const allDocs = await this.findAll<T>(collection);
        return allDocs.find((doc: any) => doc._id === id || doc.id === id) || null;
      }

      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${collection}/${id}:`, error);
      return null;
    }
  }

  // Buscar documentos por filtros
  async find<T>(collection: string, filter: Partial<T>): Promise<T[]> {
    try {
      const allDocs = await this.findAll<T>(collection);
      
      return allDocs.filter(doc => {
        return Object.entries(filter).every(([key, value]) => {
          return (doc as any)[key] === value;
        });
      });
    } catch (error) {
      console.error(`Error finding in ${collection}:`, error);
      return [];
    }
  }

  // Crear un nuevo documento
  async create<T>(collection: string, data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      const id = this.generateId();
      const now = new Date().toISOString();
      
      const newDoc = {
        ...data,
        _id: id,
        createdAt: now,
        updatedAt: now
      } as T;

      // Guardar documento individual
      const filePath = this.getFilePath(collection, id);
      fs.writeFileSync(filePath, JSON.stringify(newDoc, null, 2));

      // Actualizar índice
      await this.updateIndex(collection, newDoc as any, 'create');

      return newDoc;
    } catch (error) {
      console.error(`Error creating in ${collection}:`, error);
      throw error;
    }
  }

  // Actualizar un documento
  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    try {
      const existing = await this.findById<T>(collection, id);
      if (!existing) {
        return null;
      }

      const updated = {
        ...existing,
        ...data,
        _id: id,
        updatedAt: new Date().toISOString()
      } as T;

      // Guardar documento actualizado
      const filePath = this.getFilePath(collection, id);
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

      // Actualizar índice
      await this.updateIndex(collection, updated as any, 'update');

      return updated;
    } catch (error) {
      console.error(`Error updating ${collection}/${id}:`, error);
      throw error;
    }
  }

  // Eliminar un documento
  async delete(collection: string, id: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(collection, id);
      
      // Leer documento para actualizar índice
      const doc = await this.findById(collection, id);
      
      // Eliminar archivo si existe
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Actualizar índice
      if (doc) {
        await this.updateIndex(collection, doc as any, 'delete');
      }

      return true;
    } catch (error) {
      console.error(`Error deleting ${collection}/${id}:`, error);
      return false;
    }
  }

  // Actualizar el índice de la colección
  private async updateIndex<T>(collection: string, doc: T, operation: 'create' | 'update' | 'delete'): Promise<void> {
    try {
      const indexPath = this.getFilePath(collection);
      let allDocs = await this.findAll<T>(collection);

      if (operation === 'create' || operation === 'update') {
        const existingIndex = allDocs.findIndex((d: any) => d._id === (doc as any)._id);
        if (existingIndex >= 0) {
          allDocs[existingIndex] = doc;
        } else {
          allDocs.push(doc);
        }
      } else if (operation === 'delete') {
        allDocs = allDocs.filter((d: any) => d._id !== (doc as any)._id);
      }

      fs.writeFileSync(indexPath, JSON.stringify(allDocs, null, 2));
    } catch (error) {
      console.error(`Error updating index for ${collection}:`, error);
    }
  }

  // Contar documentos
  async count(collection: string, filter?: any): Promise<number> {
    try {
      if (filter) {
        const docs = await this.find(collection, filter);
        return docs.length;
      }
      const allDocs = await this.findAll(collection);
      return allDocs.length;
    } catch (error) {
      console.error(`Error counting ${collection}:`, error);
      return 0;
    }
  }

  // Paginación
  async paginate<T>(
    collection: string, 
    page: number = 1, 
    limit: number = 10,
    filter?: Partial<T>
  ): Promise<{
    data: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> {
    try {
      const allDocs = filter 
        ? await this.find<T>(collection, filter)
        : await this.findAll<T>(collection);
      
      const totalItems = allDocs.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const data = allDocs.slice(startIndex, endIndex);

      return {
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      console.error(`Error paginating ${collection}:`, error);
      return {
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit
        }
      };
    }
  }
}

// Instancia singleton
export const fileStorageService = new FileStorageService();

