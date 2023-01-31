/* eslint-disable @typescript-eslint/no-unused-vars */
import { FamilyHistoryDomainModel } from '../../../../domain.types/clinical/family.history/family.history.domain.model';
import { IFamilyHistoryStore } from '../../interfaces/family.history.store.interface';

////////////////////////////////////////////////////////////////////////////////

export class MockFamilyHistoryStore implements IFamilyHistoryStore {

    create = async (model: FamilyHistoryDomainModel): Promise<any> => {
        return null;
    };

    getById = async (resourceId: string): Promise<any> => {
        return null;
    };

    search = async (filter: any): Promise<any> => {
        return null;
    };

    update = async (updates: any): Promise<any> => {
        return null;
    };

    delete = async (id: string): Promise<any> => {
        return true;
    };

}
