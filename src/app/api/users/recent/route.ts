import { NextRequest, NextResponse } from 'next/server';
import { GetRecentUsersUseCase } from '@/features/user/domain/usecases/get-recent-users.usecase';
import { createUserRepository } from '@/features/user/data/repositories/user.repository';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '20');

        const repository = createUserRepository();
        const usecase = new GetRecentUsersUseCase(repository);
        const users = await usecase.execute(limit);

        return NextResponse.json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('❌ Error fetching recent users:', error);
        return NextResponse.json(
            { success: false, error: 'Error fetching users' },
            { status: 500 }
        );
    }
}
