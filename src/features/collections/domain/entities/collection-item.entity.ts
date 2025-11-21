// Collection Item Entity
export class CollectionItemEntity {
  constructor(
    public readonly id: string,
    public readonly collectionId: string,
    public readonly contentId: string,
    public readonly addedAt: Date
  ) {}
}
