// Content Entity - Lógica de negocio pura
export class ContentEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly author: string,
    public readonly authorUsername: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly contentType: string,
    public readonly category: string,
    public readonly tags: string[],
    public readonly isPublished: boolean,
    public readonly coverImage?: string,
    public readonly files?: string[],
    public readonly likes?: number,
    public readonly views?: number,
    public readonly downloads?: number,
    public readonly pins?: number,
    public readonly authorAvatar?: string,
    public readonly authorId?: string,
    public readonly shortDescription?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  // Lógica de negocio
  get isFree(): boolean {
    return this.price === 0;
  }

  get displayPrice(): string {
    if (this.isFree) return 'GRATIS';
    return `${this.currency} ${this.price.toLocaleString()}`;
  }

  isOwnedBy(userId: string): boolean {
    return this.author === userId || this.authorId === userId;
  }

  canBeDownloaded(): boolean {
    return this.isPublished && this.files !== undefined && this.files.length > 0;
  }

  get typeDisplay(): string {
    const typeMap: { [key: string]: string } = {
      'avatares': 'Avatar',
      'modelos3d': 'Modelo 3D',
      'musica': 'Música',
      'texturas': 'Textura',
      'animaciones': 'Animación',
      'OBS': 'OBS Widget',
      'colecciones': 'Colección'
    };
    return typeMap[this.contentType] || this.contentType;
  }

  get categoryDisplay(): string {
    const categoryMap: { [key: string]: string } = {
      'arquitectura': 'Arquitectura',
      'texturas': 'Texturas',
      'audio': 'Audio',
      'animacion': 'Animación'
    };
    return categoryMap[this.category] || this.category;
  }
}

