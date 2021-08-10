import {
    DoctorDetailsDto,
    DoctorDomainModel,
    DoctorSearchFilters,
    DoctorSearchResults,
} from '../domain.types/doctor.domain.types';

export interface IDoctorRepo {
    
    create(entity: DoctorDomainModel): Promise<DoctorDetailsDto>;

    getByUserId(userId: string): Promise<DoctorDetailsDto>;

    updateByUserId(userId: string, updateModel: DoctorDomainModel): Promise<DoctorDetailsDto>;

    search(filters: DoctorSearchFilters): Promise<DoctorSearchResults>;

    // searchFull(filters: DoctorSearchFilters): Promise<DoctorDetailsSearchResults>;
}
