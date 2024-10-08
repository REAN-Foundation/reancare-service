import { DoctorDomainModel } from "../../../domain.types/users/doctor/doctor.domain.model";
import { DoctorDetailsDto } from "../../../domain.types/users/doctor/doctor.dto";
import { DoctorSearchFilters, DoctorSearchResults } from "../../../domain.types/users/doctor/doctor.search.types";

export interface IDoctorRepo {

    create(entity: DoctorDomainModel): Promise<DoctorDetailsDto>;

    getByUserId(userId: string): Promise<DoctorDetailsDto>;

    getByPersonId(personId: string): Promise<DoctorDetailsDto>;

    updateByUserId(userId: string, updateModel: DoctorDomainModel): Promise<DoctorDetailsDto>;

    search(filters: DoctorSearchFilters): Promise<DoctorSearchResults>;

    deleteByUserId(userId: string): Promise<boolean>;

    // searchFull(filters: DoctorSearchFilters): Promise<DoctorDetailsSearchResults>;
}
