import { DoctorDomainModel } from '../../../domain.types/users/doctor/doctor.domain.model';
import { DoctorSearchFilters } from '../../../domain.types/users/doctor/doctor.search.types';

export interface IDoctorStore {
    create(doctorDomainModel: DoctorDomainModel): Promise<any>;
    search(filter: DoctorSearchFilters): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: DoctorDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
