// Search Repository Factory - Crea instancias de repositorios según configuración
import { ISearchRepository } from '../../domain/repositories/search.repository.interface';
import { SearchRepositoryLocalSimple } from './search.repository.local.simple';
// import { config } from '@/config/env';

export function createSearchRepository(): ISearchRepository {
  console.log('🏭 SearchRepositoryFactory: Creando repository');
  
  console.log('📁 Usando SearchRepositoryLocalSimple');
  return new SearchRepositoryLocalSimple();
}
