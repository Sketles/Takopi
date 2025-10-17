// User Profile Entity - Entidad para perfiles públicos
export class UserProfileEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly avatar?: string,
    public readonly bio?: string,
    public readonly role: string,
    public readonly createdAt?: Date,
    public readonly stats?: {
      contentCount: number;
      purchaseCount: number;
      followersCount: number;
      followingCount: number;
    },
    public readonly content?: any[]
  ) {}

  // Lógica de negocio
  get displayName(): string {
    return this.username || 'Usuario';
  }

  get initials(): string {
    return this.username.substring(0, 2).toUpperCase();
  }

  get avatarUrl(): string {
    return this.avatar || `/api/avatar/${this.initials}`;
  }

  isCreator(): boolean {
    return this.role === 'creator' || this.role === 'Artist' || this.role === 'Maker';
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  get publicData() {
    return {
      id: this.id,
      username: this.username,
      avatar: this.avatar,
      bio: this.bio,
      role: this.role,
      stats: this.stats,
      content: this.content || [],
      createdAt: this.createdAt
    };
  }
}

