// Purchase Repository Local Implementation - Usa FileStorage
import { IPurchaseRepository } from '../../domain/repositories/purchase.repository.interface';
import { PurchaseEntity } from '../../domain/entities/purchase.entity';
import { PurchaseMapper } from '../mappers/purchase.mapper';
import { fileStorageService } from '@/shared/infrastructure/storage/file-storage.service';

export class PurchaseRepositoryLocal implements IPurchaseRepository {
  private collection = 'purchases';

  async findAll(): Promise<PurchaseEntity[]> {
    console.log('📁 PurchaseRepositoryLocal: findAll');
    const models = await fileStorageService.findAll(this.collection);
    return PurchaseMapper.toDomainList(models);
  }

  async findById(id: string): Promise<PurchaseEntity | null> {
    console.log('📁 PurchaseRepositoryLocal: findById', id);
    const model = await fileStorageService.findById(this.collection, id);
    return model ? PurchaseMapper.toDomain(model) : null;
  }

  async findByUser(userId: string): Promise<PurchaseEntity[]> {
    console.log('📁 PurchaseRepositoryLocal: findByUser', userId);
    const models = await fileStorageService.find(this.collection, { userId });
    return PurchaseMapper.toDomainList(models);
  }

  async findByContent(contentId: string): Promise<PurchaseEntity[]> {
    console.log('📁 PurchaseRepositoryLocal: findByContent', contentId);
    const models = await fileStorageService.find(this.collection, { contentId });
    return PurchaseMapper.toDomainList(models);
  }

  async findByUserAndContent(userId: string, contentId: string): Promise<PurchaseEntity | null> {
    console.log('📁 PurchaseRepositoryLocal: findByUserAndContent', { userId, contentId });
    const models = await fileStorageService.find(this.collection, { userId, contentId });
    return models.length > 0 ? PurchaseMapper.toDomain(models[0]) : null;
  }

  async create(data: any): Promise<PurchaseEntity> {
    console.log('📁 PurchaseRepositoryLocal: create');
    const model = await fileStorageService.create(this.collection, data);
    return PurchaseMapper.toDomain(model);
  }

  async update(id: string, data: any): Promise<PurchaseEntity | null> {
    console.log('📁 PurchaseRepositoryLocal: update', id);
    const model = await fileStorageService.update(this.collection, id, data);
    return model ? PurchaseMapper.toDomain(model) : null;
  }

  async paginate(userId: string, page: number, limit: number) {
    console.log('📁 PurchaseRepositoryLocal: paginate', { userId, page, limit });
    const result = await fileStorageService.paginate(this.collection, page, limit, { userId });
    return {
      items: PurchaseMapper.toDomainList(result.data),
      total: result.pagination.totalItems,
      page: result.pagination.currentPage,
      totalPages: result.pagination.totalPages
    };
  }
}

