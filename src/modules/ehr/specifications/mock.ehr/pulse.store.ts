/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPulseStore } from '../../interfaces/pulse.store.interface';
import { PulseDomainModel } from '../../../../domain.types/clinical/biometrics/pulse/pulse.domain.model';

///////////////////////////////////////////////////////////////////

export class MockPulse implements IPulseStore {

    add = async (model: PulseDomainModel): Promise<any> => {
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
