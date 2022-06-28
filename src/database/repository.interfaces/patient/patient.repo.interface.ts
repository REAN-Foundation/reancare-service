import { PatientDomainModel } from '../../../domain.types/patient/patient/patient.domain.model';
import { PatientSearchFilters, PatientSearchResults } from '../../../domain.types/patient/patient/patient.search.types';
import { PatientDetailsDto } from '../../../domain.types/patient/patient/patient.dto';

export interface IPatientRepo {
    
    create(entity: PatientDomainModel): Promise<PatientDetailsDto>;

    getByUserId(userId: string): Promise<PatientDetailsDto>;

    getByPersonId(personId: string): Promise<PatientDetailsDto>;

    updateByUserId(userId: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto>;

    search(filters: PatientSearchFilters): Promise<PatientSearchResults>;

    deleteByUserId(userId: string): Promise<boolean>;

    // searchFull(filters: PatientSearchFilters): Promise<PatientDetailsSearchResults>;
}
