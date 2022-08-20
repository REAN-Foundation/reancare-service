import { CareplanActivityDomainModel } from '../../../domain.types/clinical/careplan/activity/careplan.activity.domain.model';

export interface ICarePlanStore {
    add(patientDomainModel: CareplanActivityDomainModel): Promise<any>;
    search(filter): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: CareplanActivityDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
