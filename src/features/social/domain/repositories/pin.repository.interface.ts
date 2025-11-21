// Pin Repository Interface
import { PinEntity } from '../entities/pin.entity';

export interface IPinRepository {
  findByUserAndContent(userId: string, contentId: string): Promise<PinEntity | null>;
  countByContent(contentId: string): Promise<number>;
  countByUser(userId: string, isPublicOnly?: boolean): Promise<number>;
  create(userId: string, contentId: string, isPublic: boolean): Promise<PinEntity>;
  delete(userId: string, contentId: string): Promise<boolean>;
  findByUser(userId: string, isPublicOnly?: boolean): Promise<PinEntity[]>;
}
