// Content Repository MongoDB Implementation - Usa Mongoose
import { IContentRepository } from '../../domain/repositories/content.repository.interface';
import { ContentEntity } from '../../domain/entities/content.entity';
import { ContentMapper } from '../mappers/content.mapper';
import { mongoDBService } from '@/shared/infrastructure/database/mongodb.service';

export class ContentRepositoryMongo implements IContentRepository {
  async findAll(): Promise<ContentEntity[]> {
    console.log('🗄️  ContentRepositoryMongo: findAll');
    await mongoDBService.connect();
    const models = await Content.find().lean();
    return ContentMapper.toDomainList(models as any[]);
  }

  async findById(id: string): Promise<ContentEntity | null> {
    console.log('🗄️  ContentRepositoryMongo: findById', id);
    await mongoDBService.connect();
    const model = await Content.findById(id).lean();
    return model ? ContentMapper.toDomain(model as any) : null;
  }

  async findByCategory(category: string): Promise<ContentEntity[]> {
    console.log('🗄️  ContentRepositoryMongo: findByCategory', category);
    await mongoDBService.connect();
    const models = await Content.find({ 
      category,
      status: 'published'
    }).lean();
    return ContentMapper.toDomainList(models as any[]);
  }

  async findByAuthor(authorId: string): Promise<ContentEntity[]> {
    console.log('🗄️  ContentRepositoryMongo: findByAuthor', authorId);
    await mongoDBService.connect();
    const models = await Content.find({ author: authorId }).lean();
    return ContentMapper.toDomainList(models as any[]);
  }

  async findPublished(): Promise<ContentEntity[]> {
    console.log('🗄️  ContentRepositoryMongo: findPublished');
    await mongoDBService.connect();
    const models = await Content.find({ status: 'published' }).lean();
    return ContentMapper.toDomainList(models as any[]);
  }

  async create(data: any): Promise<ContentEntity> {
    console.log('🗄️  ContentRepositoryMongo: create');
    await mongoDBService.connect();
    const model = await Content.create(data);
    return ContentMapper.toDomain(model.toObject());
  }

  async update(id: string, data: any): Promise<ContentEntity | null> {
    console.log('🗄️  ContentRepositoryMongo: update', id);
    await mongoDBService.connect();
    const model = await Content.findByIdAndUpdate(id, data, { new: true }).lean();
    return model ? ContentMapper.toDomain(model as any) : null;
  }

  async delete(id: string): Promise<boolean> {
    console.log('🗄️  ContentRepositoryMongo: delete', id);
    await mongoDBService.connect();
    const result = await Content.findByIdAndDelete(id);
    return result !== null;
  }

  async paginate(page: number, limit: number, filter?: any) {
    console.log('🗄️  ContentRepositoryMongo: paginate', { page, limit, filter });
    await mongoDBService.connect();
    
    const skip = (page - 1) * limit;
    const models = await Content.find(filter || {})
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Content.countDocuments(filter || {});
    const totalPages = Math.ceil(total / limit);

    return {
      items: ContentMapper.toDomainList(models as any[]),
      total,
      page,
      totalPages
    };
  }
}

