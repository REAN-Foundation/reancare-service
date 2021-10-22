
import { DoctorDomainModel } from '../../../domain.types/doctor/doctor.domain.model';
import { DoctorSearchFilters } from '../../../domain.types/doctor/doctor.search.types';

export interface IDoctorStore {
    create(doctorDomainModel: DoctorDomainModel): Promise<any>;
    search(filter: DoctorSearchFilters): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: DoctorDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
