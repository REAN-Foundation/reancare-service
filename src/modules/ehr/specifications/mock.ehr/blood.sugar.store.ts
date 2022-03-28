import { IBloodSugarStore } from '../../interfaces/blood.sugar.store.interface';
import { BloodGlucoseDomainModel }  from '../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';

///////////////////////////////////////////////////////////////////


export class MockBloodSugarStore implements IBloodSugarStore{

    

    add = async (model: BloodGlucoseDomainModel): Promise<any> => {
        return null;
    }

    getById = async (id: string): Promise<any> => {
        return null;
    }

    search = async (filter: any): Promise<any> => {
        return null;
    }

    update = async (id: string, updates: BloodGlucoseDomainModel): Promise<any> => {
        return null;
    }

    delete = async (id: string): Promise<any> => {
        return true;
    }

}
