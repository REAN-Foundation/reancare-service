
import { DoctorDomainModel, DoctorSearchFilters } from '../../../data/domain.types/doctor.domain.types';

export interface IDoctorStore {
    create(doctorDomainModel: DoctorDomainModel): Promise<any>;
    search(filter: DoctorSearchFilters): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: DoctorDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
