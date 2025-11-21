// Collection Repository Interface
import { CollectionEntity } from '../entities/collection.entity';
import { CollectionItemEntity } from '../entities/collection-item.entity';

export interface ICollectionRepository {
  // Collection CRUD
  create(userId: string, title: string, description: string | null, isPublic: boolean): Promise<CollectionEntity>;
  findById(id: string): Promise<CollectionEntity | null>;
  findByUser(userId: string): Promise<CollectionEntity[]>;
  update(id: string, data: { title?: string; description?: string | null; isPublic?: boolean }): Promise<CollectionEntity | null>;
  delete(id: string): Promise<boolean>;

  // Collection Items
  addItem(collectionId: string, contentId: string): Promise<CollectionItemEntity>;
  removeItem(collectionId: string, contentId: string): Promise<boolean>;
  getItems(collectionId: string): Promise<CollectionItemEntity[]>;
  isItemInCollection(collectionId: string, contentId: string): Promise<boolean>;
  
  // Stats
  countByUser(userId: string): Promise<number>;
}
