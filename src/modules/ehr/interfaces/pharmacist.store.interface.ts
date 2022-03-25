import { PharmacistDomainModel } from '../../../domain.types/pharmacist/pharmacist.domain.types';
import { PharmacistSearchFilters } from '../../../domain.types/pharmacist/pharmacist.search.types';

////////////////////////////////////////////////////////////////////////////////////

export interface IPharmacistStore {
    add(PharmacistDomainModel: PharmacistDomainModel): Promise<any>;
    search(filter: PharmacistSearchFilters): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: PharmacistDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
