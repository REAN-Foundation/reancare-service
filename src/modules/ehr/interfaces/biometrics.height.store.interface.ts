import { BodyHeightDomainModel } from '../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IBiometricsHeightStore {
    add(biometricsHeightDomainModel: BodyHeightDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: BodyHeightDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
