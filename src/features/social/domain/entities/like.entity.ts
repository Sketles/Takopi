// Like Entity - Entidad de like
export class LikeEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly contentId: string,
    public readonly createdAt?: Date
  ) {}

  // Lógica de negocio
  isByUser(userId: string): boolean {
    return this.userId === userId;
  }

  isForContent(contentId: string): boolean {
    return this.contentId === contentId;
  }
}

