import { PatientDomainModel } from '../../../../domain.types/users/patient/patient/patient.domain.model';
import { PatientSearchFilters, PatientSearchResults } from '../../../../domain.types/users/patient/patient/patient.search.types';
import { PatientDetailsDto } from '../../../../domain.types/users/patient/patient/patient.dto';

export interface IPatientRepo {

    create(entity: PatientDomainModel): Promise<PatientDetailsDto>;

    getByUserId(userId: string): Promise<PatientDetailsDto>;

    getByPersonId(personId: string): Promise<PatientDetailsDto>;

    updateByUserId(userId: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto>;

    search(filters: PatientSearchFilters): Promise<PatientSearchResults>;

    deleteByUserId(userId: string): Promise<boolean>;

    getAllPatientUserIds(): Promise<any[]>;

    // searchFull(filters: PatientSearchFilters): Promise<PatientDetailsSearchResults>;
}
