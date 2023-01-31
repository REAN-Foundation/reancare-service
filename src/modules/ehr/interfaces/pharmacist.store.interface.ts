import { PharmacistDomainModel } from '../../../domain.types/users/pharmacist/pharmacist.domain.types';

////////////////////////////////////////////////////////////////////////////////////

export interface IPharmacistStore {
    add(PharmacistDomainModel: PharmacistDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: PharmacistDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
