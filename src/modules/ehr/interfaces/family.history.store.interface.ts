import { FamilyHistoryDomainModel } from '../../../domain.types/clinical/family.history/family.history.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IFamilyHistoryStore {
    create(FamilyHistoryDomainModel: FamilyHistoryDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: FamilyHistoryDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
