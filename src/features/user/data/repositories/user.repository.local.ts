// User Repository Local Implementation - Usa FileStorage
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '@/features/auth/domain/entities/user.entity';
import { UserProfileEntity } from '../../domain/entities/user-profile.entity';
import { UserMapper } from '@/features/auth/data/mappers/user.mapper';
import { fileStorageService } from '@/shared/infrastructure/storage/file-storage.service';

export class UserRepositoryLocal implements IUserRepository {
  private usersCollection = 'users';
  private contentCollection = 'content';
  private purchasesCollection = 'purchases';
  private followsCollection = 'follows';

  async findById(id: string): Promise<UserEntity | null> {
    console.log('📁 UserRepositoryLocal: findById', id);
    
    const userModel = await fileStorageService.findById(this.usersCollection, id);
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    console.log('📁 UserRepositoryLocal: findByEmail', email);
    
    const users = await fileStorageService.find(this.usersCollection, { email });
    const userModel = users[0];
    return userModel ? UserMapper.toDomain(userModel) : null;
  }

  async getPublicProfile(userId: string): Promise<UserProfileEntity | null> {
    console.log('📁 UserRepositoryLocal: getPublicProfile', userId);
    
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    // Obtener estadísticas
    const stats = await this.getUserStats(userId);
    
    // Obtener contenido del usuario
    const content = await this.getUserCreations(userId);

    return new UserProfileEntity(
      user.id,
      user.username,
      user.avatar,
      user.bio,
      user.role,
      user.createdAt,
      stats,
      content
    );
  }

  async getUserStats(userId: string) {
    console.log('📁 UserRepositoryLocal: getUserStats', userId);
    
    // Contar contenido
    const userContent = await fileStorageService.find(this.contentCollection, { author: userId });
    const contentCount = userContent.length;

    // Contar compras
    const userPurchases = await fileStorageService.find(this.purchasesCollection, { userId });
    const purchaseCount = userPurchases.length;

    // Contar seguidores (quienes siguen a este usuario)
    const followers = await fileStorageService.find(this.followsCollection, { followingId: userId });
    const followersCount = followers.length;

    // Contar seguidos (a quién sigue este usuario)
    const following = await fileStorageService.find(this.followsCollection, { followerId: userId });
    const followingCount = following.length;

    return {
      contentCount,
      purchaseCount,
      followersCount,
      followingCount
    };
  }

  async getUserCreations(userId: string) {
    console.log('📁 UserRepositoryLocal: getUserCreations', userId);
    
    const content = await fileStorageService.find(this.contentCollection, { author: userId });
    return content;
  }

  async getUserPurchases(userId: string) {
    console.log('📁 UserRepositoryLocal: getUserPurchases', userId);
    
    const purchases = await fileStorageService.find(this.purchasesCollection, { userId });
    
    // Populate content and seller data for each purchase
    const purchasesWithContent = await Promise.all(
      purchases.map(async (purchase: any) => {
        try {
          const content = await fileStorageService.findById('content', purchase.contentId);
          let seller = null;
          
          // Si el contenido existe, obtener información del vendedor/creador
          if (content && content.author) {
            try {
              seller = await fileStorageService.findById('users', content.author);
            } catch (error) {
              console.log('⚠️ Seller not found for content:', content.author);
            }
          }
          
          return {
            ...purchase,
            content: content ? {
              ...content,
              files: content.files || []
            } : null,
            seller: seller || null
          };
        } catch (error) {
          console.log('⚠️ Content not found for purchase:', purchase.contentId);
          return {
            ...purchase,
            content: null,
            seller: null
          };
        }
      })
    );
    
    return purchasesWithContent;
  }
}

