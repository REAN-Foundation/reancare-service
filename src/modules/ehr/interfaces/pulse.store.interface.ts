import { PulseDomainModel } from '../../../domain.types/clinical/biometrics/pulse/pulse.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IPulseStore {
    add(pulseDomainModel: PulseDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: PulseDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
