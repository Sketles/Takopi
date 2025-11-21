// Pin Entity
export class PinEntity {
  constructor(
    public readonly id: string,
    public readonly contentId: string,
    public readonly userId: string,
    public readonly isPublic: boolean,
    public readonly createdAt: Date
  ) {}
}
