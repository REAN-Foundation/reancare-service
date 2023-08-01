/* eslint-disable @typescript-eslint/no-unused-vars */
import { IBloodGlucoseStore } from '../../interfaces/blood.glucose.store.interface';
import { BloodGlucoseDomainModel }  from '../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';

///////////////////////////////////////////////////////////////////

export class MockBloodGlucoseStore implements IBloodGlucoseStore{

    add = async (model: BloodGlucoseDomainModel): Promise<any> => {
        return null;
    };

    getById = async (id: string): Promise<any> => {
        return null;
    };

    search = async (filter: any): Promise<any> => {
        return null;
    };

    update = async (id: string, updates: BloodGlucoseDomainModel): Promise<any> => {
        return null;
    };

    delete = async (id: string): Promise<any> => {
        return true;
    };

}
