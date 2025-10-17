// Like Repository Interface - Contrato para likes
import { LikeEntity } from '../entities/like.entity';

export interface ILikeRepository {
  findAll(): Promise<LikeEntity[]>;
  findById(id: string): Promise<LikeEntity | null>;
  findByUser(userId: string): Promise<LikeEntity[]>;
  findByContent(contentId: string): Promise<LikeEntity[]>;
  findByUserAndContent(userId: string, contentId: string): Promise<LikeEntity | null>;
  create(like: { userId: string; contentId: string }): Promise<LikeEntity>;
  delete(id: string): Promise<boolean>;
  countByContent(contentId: string): Promise<number>;
}

