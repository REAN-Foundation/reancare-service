
import { DoctorVisitDomainModel } from '../../../domain.types/doctor.visit/doctor.visit.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IDoctorVisitStore {
    create(labVisitDomainModel: DoctorVisitDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: DoctorVisitDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
