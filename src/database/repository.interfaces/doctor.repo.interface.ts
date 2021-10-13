import { DoctorDomainModel } from "../../domain.types/doctor/doctor.domain.model";
import { DoctorDetailsDto } from "../../domain.types/doctor/doctor.dto";
import { DoctorSearchFilters, DoctorSearchResults } from "../../domain.types/doctor/doctor.search.types";

export interface IDoctorRepo {
    
    create(entity: DoctorDomainModel): Promise<DoctorDetailsDto>;

    getByUserId(userId: string): Promise<DoctorDetailsDto>;

    updateByUserId(userId: string, updateModel: DoctorDomainModel): Promise<DoctorDetailsDto>;

    search(filters: DoctorSearchFilters): Promise<DoctorSearchResults>;

    // searchFull(filters: DoctorSearchFilters): Promise<DoctorDetailsSearchResults>;
}
