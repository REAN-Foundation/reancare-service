import { CarePlanDomainModel } from '../../../domain.types/clinical/careplan/careplandomain.model';
export interface ICarePlanStore {
    add(patientDomainModel: CarePlanDomainModel): Promise<any>;
    search(filter): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: CarePlanDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
