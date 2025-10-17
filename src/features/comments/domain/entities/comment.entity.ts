// Comment Entity - Entidad de comentario con lógica de negocio
export class CommentEntity {
  constructor(
    public readonly id: string,
    public readonly contentId: string,
    public readonly userId: string,
    public readonly username: string,
    public readonly userAvatar?: string,
    public readonly text: string,
    public readonly likes: number = 0,
    public readonly likedBy: string[] = [],
    public readonly isLiked: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  // Métodos de negocio
  canBeLiked(): boolean {
    return this.likes >= 0; // Lógica de negocio para likes
  }

  canBeDeleted(): boolean {
    // Un comentario puede ser eliminado por su autor o por el dueño del contenido
    return true; // Simplificado por ahora
  }

  addLike(userId: string): CommentEntity {
    if (this.likedBy.includes(userId)) {
      return this; // Ya le dio like
    }
    return new CommentEntity(
      this.id,
      this.contentId,
      this.userId,
      this.username,
      this.userAvatar,
      this.text,
      this.likes + 1,
      [...this.likedBy, userId],
      this.likedBy.includes(userId),
      this.createdAt,
      new Date()
    );
  }

  removeLike(userId: string): CommentEntity {
    if (!this.likedBy.includes(userId)) {
      return this; // No le ha dado like
    }
    return new CommentEntity(
      this.id,
      this.contentId,
      this.userId,
      this.username,
      this.userAvatar,
      this.text,
      Math.max(0, this.likes - 1),
      this.likedBy.filter(id => id !== userId),
      false,
      this.createdAt,
      new Date()
    );
  }

  // Método para serializar a objeto
  toObject() {
    return {
      id: this.id,
      contentId: this.contentId,
      userId: this.userId,
      username: this.username,
      userAvatar: this.userAvatar,
      text: this.text,
      likes: this.likes,
      likedBy: this.likedBy,
      isLiked: this.isLiked,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}
