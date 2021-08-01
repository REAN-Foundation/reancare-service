import {
    PatientDetailsDto,
    PatientDto,
    PatientDomainModel,
    PatientSearchFilters,
    PatientSearchResults,
    PatientDetailsSearchResults,
} from '../domain.types/patient.domain.types';

export interface IPatientRepo {
    create(entity: PatientDomainModel): Promise<PatientDetailsDto>;

    getByUserId(userId: string): Promise<PatientDetailsDto>;

    updateByUserId(userId: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto>;

    search(filters: PatientSearchFilters): Promise<PatientSearchResults>;

    searchFull(filters: PatientSearchFilters): Promise<PatientDetailsSearchResults>;
}
