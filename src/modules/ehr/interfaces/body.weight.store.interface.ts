import { BodyWeightDomainModel } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
////////////////////////////////////////////////////////////////////////////////////

export interface IBodyWeightStore {
    add(bodyWeightDomainModel: BodyWeightDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: BodyWeightDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
