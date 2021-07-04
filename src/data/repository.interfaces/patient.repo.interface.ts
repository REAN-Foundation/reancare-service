import { PatientDetailsDto, PatientDto, PatientDomainModel, PatientSearchFilters } from '../domain.types/patient.domain.types';


export interface IPatientRepo {

    create(entity: PatientDomainModel): Promise<PatientDetailsDto>;

    getByUserId(userId: string): Promise<PatientDetailsDto>;

    updateByUserId(userId: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto>;

    search(filters: PatientSearchFilters): Promise<PatientDto[]>;

    searchFull(filters: PatientSearchFilters): Promise<PatientDetailsDto[]>;

}
