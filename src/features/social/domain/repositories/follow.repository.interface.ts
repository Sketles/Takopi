// Follow Repository Interface - Contrato para operaciones de follow
import { FollowEntity } from '../entities/follow.entity';

export interface CreateFollowDTO {
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface IFollowRepository {
  create(data: CreateFollowDTO): Promise<FollowEntity>;
  findById(id: string): Promise<FollowEntity | null>;
  findByUsers(followerId: string, followingId: string): Promise<FollowEntity | null>;
  findByFollower(followerId: string): Promise<FollowEntity[]>;
  findByFollowing(followingId: string): Promise<FollowEntity[]>;
  delete(id: string): Promise<boolean>;
  countByFollower(followerId: string): Promise<number>;
  countByFollowing(followingId: string): Promise<number>;
}
