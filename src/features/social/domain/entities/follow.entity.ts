// Follow Entity - Entidad de seguimiento
export class FollowEntity {
  constructor(
    public readonly id: string,
    public readonly followerId: string,
    public readonly followingId: string,
    public readonly createdAt?: Date
  ) {}

  // Lógica de negocio
  isFollower(userId: string): boolean {
    return this.followerId === userId;
  }

  isFollowing(userId: string): boolean {
    return this.followingId === userId;
  }
}

