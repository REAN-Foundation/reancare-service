/* eslint-disable @typescript-eslint/no-unused-vars */
import { IBloodPressureStore } from '../../interfaces/blood.pressure.store.interface';
import { BloodPressureDomainModel } from '../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';

///////////////////////////////////////////////////////////////////

export class MockBloodPressureStore implements IBloodPressureStore {

    add = async (model: BloodPressureDomainModel): Promise<any> => {
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

