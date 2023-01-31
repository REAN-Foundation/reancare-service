import { LabVisitDomainModel } from '../../../domain.types/clinical/lab.visit/lab.visit.domain.model';

export interface ILabVisitStore {
    create(labVisitDomainModel: LabVisitDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: LabVisitDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
