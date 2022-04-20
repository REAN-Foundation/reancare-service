/* eslint-disable @typescript-eslint/no-unused-vars */
import { BodyHeightDomainModel } from '../../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';
import { IBiometricsHeightStore } from '../../interfaces/biometrics.height.store.interface';

////////////////////////////////////////////////////////////////////////////////

export class MockBiometricsHeightStore implements IBiometricsHeightStore {

    add = async (model: BodyHeightDomainModel): Promise<any> => {
        return null;
    };

    getById = async (resourceId: string): Promise<any> => {
        return null;
    };
    
    update = async (updates: any): Promise<any> => {
        return null;
    };

    delete = async (id: string): Promise<any> => {
        return true;
    };

}
