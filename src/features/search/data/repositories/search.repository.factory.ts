// Search Repository Factory - Crea instancias de repositorios según configuración
import { ISearchRepository } from '../../domain/repositories/search.repository.interface';
import { SearchRepositoryPrisma } from './search.repository.prisma';

export function createSearchRepository(): ISearchRepository {
  console.log('🏭 SearchRepositoryFactory: Creando repository');
  
  console.log('🗄️ Usando SearchRepositoryPrisma');
  return new SearchRepositoryPrisma();
}
