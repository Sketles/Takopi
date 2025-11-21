// Collection Entity
export class CollectionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly isPublic: boolean,
    public readonly itemCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  get isPrivate(): boolean {
    return !this.isPublic;
  }

  isOwnedBy(userId: string): boolean {
    return this.userId === userId;
  }

  canBeViewedBy(userId: string | null): boolean {
    if (this.isPublic) return true;
    if (!userId) return false;
    return this.isOwnedBy(userId);
  }
}
