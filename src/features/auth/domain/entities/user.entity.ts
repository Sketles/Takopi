// User Entity - Entidad de usuario con lógica de negocio
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly role: string,
    public readonly avatar?: string,
    public readonly banner?: string,
    public readonly bio?: string,
    public readonly location?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isActive?: boolean
  ) {}

  // Lógica de negocio
  get displayName(): string {
    return this.username || this.email.split('@')[0];
  }

  get initials(): string {
    return this.username.substring(0, 2).toUpperCase();
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isCreator(): boolean {
    return this.role === 'creator' || this.role === 'Artist' || this.role === 'Maker';
  }

  canUploadContent(): boolean {
    return this.isCreator() || this.isAdmin();
  }

  get avatarUrl(): string {
    return this.avatar || `/api/avatar/${this.initials}`;
  }
}

