// Content Repository Interface - Contrato para acceso a datos
import { ContentEntity } from '../entities/content.entity';

export interface IContentRepository {
  // Búsquedas
  findAll(): Promise<ContentEntity[]>;
  findById(id: string): Promise<ContentEntity | null>;
  findByCategory(category: string): Promise<ContentEntity[]>;
  findByAuthor(authorId: string): Promise<ContentEntity[]>;
  findPublished(): Promise<ContentEntity[]>;
  
  // Mutaciones
  create(content: any): Promise<ContentEntity>;
  update(id: string, content: Partial<any>): Promise<ContentEntity | null>;
  delete(id: string): Promise<boolean>;
  
  // Paginación
  paginate(page: number, limit: number, filter?: any): Promise<{
    items: ContentEntity[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}

