import { PatientDomainModel } from '../../domain.types/patient/patient.domain.model';
import { PatientSearchFilters, PatientSearchResults } from '../../domain.types/patient/patient.search.types';
import { PatientDetailsDto } from '../../domain.types/patient/patient.dto';

export interface IPatientRepo {
    create(entity: PatientDomainModel): Promise<PatientDetailsDto>;

    getByUserId(userId: string): Promise<PatientDetailsDto>;

    updateByUserId(userId: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto>;

    search(filters: PatientSearchFilters): Promise<PatientSearchResults>;

    // searchFull(filters: PatientSearchFilters): Promise<PatientDetailsSearchResults>;
}
