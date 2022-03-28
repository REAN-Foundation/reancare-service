import { IBiometricsWeightStore } from '../../interfaces/biometrics.weight.store.interface';
import { BodyWeightDomainModel } from '../../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';


///////////////////////////////////////////////////////////////////


export class MockBiometricsWeightStore implements IBiometricsWeightStore {

    

    add = async (model: BodyWeightDomainModel): Promise<any> => {
        return null;
    }

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
