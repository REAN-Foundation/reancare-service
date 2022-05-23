import { CarePlanEnrollmentDomainModel } from '../../../domain.types/clinical/careplan/enrollment/careplan.enrollment.domain.model';
export interface ICarePlanStore {
    add(patientDomainModel: CarePlanEnrollmentDomainModel): Promise<any>;
    search(filter): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: CarePlanEnrollmentDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
