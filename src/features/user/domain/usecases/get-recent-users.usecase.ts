import { UserEntity } from '@/features/auth/domain/entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';

export class GetRecentUsersUseCase {
    constructor(private repository: IUserRepository) { }

    async execute(limit: number = 20): Promise<UserEntity[]> {
        if (limit < 1) limit = 1;
        if (limit > 50) limit = 50;

        return await this.repository.getRecentUsers(limit);
    }
}
